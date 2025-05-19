import { io, Socket } from "socket.io-client";

interface PeerConnection {
  [key: string]: RTCPeerConnection;
}

interface RemoteStreams {
  [key: string]: MediaStream;
}
type SocketCallback<T = any> = (response: {
  success?: boolean;
  error?: string;
  data?: T;
}) => void;

class VideoSocketService {
  private static instance: VideoSocketService;
  private socket: Socket | null = null;
  private peerConnections: PeerConnection = {};
  private localStream: MediaStream | null = null;
  private remoteStreams: RemoteStreams = {};
  private currentRoom: string | null = null;
  private onRemoteStreamAdded?: (userId: string, stream: MediaStream) => void;
  private onRemoteStreamRemoved?: (userId: string) => void;

  private constructor() {}

  public static getInstance(): VideoSocketService {
    if (!VideoSocketService.instance) {
      VideoSocketService.instance = new VideoSocketService();
    }
    return VideoSocketService.instance;
  }

  public async connect(token: string): Promise<void> {
    if (this.socket?.connected) return;

    return new Promise((resolve, reject) => {
      this.socket = io(process.env.NEXT_PUBLIC_WS_VIDEO!, {
        path: "/socket.io",
        transports: ["websocket"],
        auth: { token },
        extraHeaders: { Authorization: `Bearer ${token}` },
      });

      // Success handler
      const connectHandler = () => {
        this.setupSocketEvents();
        console.log(`✅ Video service connected (ID: ${this.socket?.id})`);
        this.socket?.off("connect_error", errorHandler);
        resolve();
      };

      // Error handler
      const errorHandler = (err: Error) => {
        console.error("Video connection error:", err);
        this.socket?.off("connect", connectHandler);
        reject(err);
      };

      this.socket.once("connect", connectHandler);
      this.socket.once("connect_error", errorHandler);
    });
  }

  private setupSocketEvents(): void {
    if (!this.socket) return;

    // Debug all events
    this.socket.onAny((event, ...args) => {
      console.log(`[Socket Event] ${event}`, args);
    });

    // Room events
    this.socket.on("ROOM_JOINED", (roomId: string) => {
      this.currentRoom = roomId;
      console.log(`Joined video room: ${roomId}`);
    });

    this.socket.on("ROOM_USERS", (users: string[]) => {
      console.log("Room users received:", users);
      users.forEach((userId) => {
        if (
          this.localStream &&
          userId !== this.socket?.id &&
          !this.peerConnections[userId]
        ) {
          this.createPeerConnection(userId);
        }
      });
    });

    this.socket.on("USER_JOINED", (userId: string) => {
      console.log(`New user joined: ${userId}`);
      if (this.localStream && userId !== this.socket?.id) {
        this.createPeerConnection(userId);
      }
    });

    this.socket.on("ROOM_USERS", (users: string[]) => {
      console.log(`Room users: ${users}`);
      users.forEach((userId) => {
        if (userId !== this.socket?.id && !this.peerConnections[userId]) {
          this.createPeerConnection(userId);
        }
      });
    });

    this.socket.on("USER_LEFT", (userId: string) => {
      console.log(`User left: ${userId}`);
      this.closePeerConnection(userId);
    });

    // WebRTC signaling events
    this.socket.on(
      "OFFER",
      async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
        console.log("Received OFFER from:", data.from);
        await this.handleOffer(data.from, data.offer);
      }
    );

    this.socket.on(
      "ANSWER",
      async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
        console.log("Received ANSWER from:", data.from);
        await this.handleAnswer(data.from, data.answer);
      }
    );

    this.socket.on(
      "ICE_CANDIDATE",
      (data: { from: string; candidate: RTCIceCandidate }) => {
        console.log("Received ICE from:", data.from);
        this.handleIceCandidate(data.from, data.candidate);
      }
    );

    // New stream notification
    this.socket.on("NEW_STREAM_AVAILABLE", (userId: string) => {
      console.log(`New stream available from: ${userId}`);
      if (
        userId !== this.socket?.id &&
        this.localStream &&
        !this.peerConnections[userId]
      ) {
        this.createPeerConnection(userId);
      }
    });
  }

  // Room management
  public async joinRoom(chatGroupId: string): Promise<{
    roomId: string;
    participants: any[];
    yourId: string;
  }> {
    if (!this.socket) throw new Error("Not connected to video server");

    return new Promise((resolve, reject) => {
      this.socket?.emit(
        "JOIN_ROOM",
        { chatGroupId },
        (response: {
          success?: boolean;
          error?: string;
          roomId?: string;
          participants?: any[];
          yourId?: string;
        }) => {
          if (response.success) {
            this.currentRoom = response.roomId || chatGroupId;

            // Request current room users
            this.socket?.emit("REQUEST_ROOM_USERS", {
              roomId: this.currentRoom,
            });

            resolve({
              roomId: this.currentRoom,
              participants: response.participants || [],
              yourId: response.yourId || this.socket?.id || "",
            });
          } else {
            reject(response.error || "Failed to join room");
          }
        }
      );
    });
  }

  public async leaveRoom(): Promise<void> {
    if (!this.socket || !this.currentRoom) return;

    // Close all peer connections
    Object.keys(this.peerConnections).forEach((userId) => {
      this.closePeerConnection(userId);
    });

    await new Promise<void>((resolve) => {
      this.socket?.emit(
        "LEAVE_VIDEO_ROOM",
        { chatGroupId: this.currentRoom },
        () => {
          this.currentRoom = null;
          this.peerConnections = {};
          this.remoteStreams = {};
          resolve();
        }
      );
    });
  }
  

  // Stream management
  public async startBroadcasting(stream: MediaStream): Promise<void> {
    if (!this.socket || !this.currentRoom) {
      throw new Error("Not connected or not in a room");
    }

    this.localStream = stream;

    // Notify others and get current users
    this.socket.emit("NEW_STREAM_AVAILABLE", {
      roomId: this.currentRoom,
      userId: this.socket.id,
    });

    this.socket.emit("REQUEST_ROOM_USERS", { roomId: this.currentRoom });
  }

  public stopBroadcasting(): void {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
  }

  // WebRTC connection management
  private async createPeerConnection(userId: string): Promise<void> {
    if (this.peerConnections[userId] || !this.localStream) return;

    console.log(`Creating peer connection with ${userId}`);

    const config: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add TURN servers if needed
      ],
    };

    const pc = new RTCPeerConnection(config);
    this.peerConnections[userId] = pc;

    // Add local tracks
    this.localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream!);
    });

    // ICE Candidate handling
    pc.onicecandidate = (event) => {
      if (event.candidate && this.currentRoom) {
        this.socket?.emit("ICE_CANDIDATE", {
          to: userId,
          candidate: event.candidate,
          chatGroupId: this.currentRoom,
        }, ()=> {
          console.log('ICE candidate sent to user', userId);
        });
      }
    };

    // Track handling - THIS IS CRUCIAL FOR REMOTE STREAMS
    pc.ontrack = (event) => {
      console.log(`Received tracks from ${userId}`, event.streams);
      if (event.streams && event.streams.length > 0) {
        const remoteStream = event.streams[0];
        this.remoteStreams[userId] = remoteStream;

        // Notify UI about new stream
        if (this.onRemoteStreamAdded) {
          this.onRemoteStreamAdded(userId, remoteStream);
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected") {
        this.closePeerConnection(userId);
      }
    };

    // Create and send offer
    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);

      this.socket?.emit("OFFER", {
        to: userId,
        offer,
        chatGroupId: this.currentRoom,
      }, ()=>{
        console.log('Offer sent to user', userId);
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      this.closePeerConnection(userId);
    }
  }

  private async handleOffer(
    userId: string,
    offer: RTCSessionDescriptionInit
  ): Promise<void> {
    if (!this.localStream) return;

    console.log(`Handling offer from ${userId}`);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    this.peerConnections[userId] = pc;

    // Add local tracks
    this.localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream!);
    });

    // Set up event handlers
    pc.onicecandidate = (event) => {
      if (event.candidate && this.currentRoom) {
        this.socket?.emit("ICE_CANDIDATE", {
          to: userId,
          candidate: event.candidate,
          chatGroupId: this.currentRoom,
        }, ()=>{
          console.log('ICE candidate sent to user', userId);
        });
      }
    };

    pc.ontrack = (event) => {
      console.log(`Received tracks from ${userId}`, event.streams);
      if (event.streams && event.streams.length > 0) {
        const remoteStream = event.streams[0];
        this.remoteStreams[userId] = remoteStream;

        if (this.onRemoteStreamAdded) {
          this.onRemoteStreamAdded(userId, remoteStream);
        }
      }
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const answerCallback: SocketCallback = (response) => {
        if (!response?.success) {
          console.error("Answer failed for", userId);
          this.closePeerConnection(userId);
        }
      };

      this.socket?.emit("ANSWER", {
        to: userId,
        answer,
        chatGroupId: this.currentRoom,
      }, answerCallback);

    } catch (error) {
      console.error("Error handling offer:", error);
      this.closePeerConnection(userId);
    }
  }

  private async handleAnswer(
    userId: string,
    answer: RTCSessionDescriptionInit
  ): Promise<void> {
    const pc = this.peerConnections[userId];
    if (!pc) return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log(`Answer from ${userId} processed successfully`);
    } catch (error) {
      console.error("Error handling answer:", error);
      this.closePeerConnection(userId);
    }
  }

  private handleIceCandidate(userId: string, candidate: RTCIceCandidate): void {
    const pc = this.peerConnections[userId];
    if (!pc) return;

    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
      console.error("Error adding ICE candidate:", err)
    );
  }

  private closePeerConnection(userId: string): void {
    const pc = this.peerConnections[userId];
    if (pc) {
      pc.close();
      delete this.peerConnections[userId];

      if (this.remoteStreams[userId]) {
        delete this.remoteStreams[userId];
        if (this.onRemoteStreamRemoved) {
          this.onRemoteStreamRemoved(userId);
        }
      }
    }
  }

  // Public methods
  public getRemoteStreams(): RemoteStreams {
    return this.remoteStreams;
  }

  public setRemoteStreamCallbacks(
    onAdded: (userId: string, stream: MediaStream) => void,
    onRemoved: (userId: string) => void
  ): void {
    this.onRemoteStreamAdded = onAdded;
    this.onRemoteStreamRemoved = onRemoved;
  }

  public disconnect(): void {
    if (this.socket) {
      this.leaveRoom();
      this.socket.disconnect();
      this.socket = null;
    }
    this.stopBroadcasting();
  }
}

export const videoSocketService = VideoSocketService.getInstance();
