import { io, Socket } from "socket.io-client";
// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_WS_VIDEO;

interface PeerConnection {
  [key: string]: RTCPeerConnection;
}

interface RemoteStreams {
  [key: string]: MediaStream;
}

class VideoSocketService {
  private isConnected = false;
  private static instance: VideoSocketService;
  private socket: Socket | null = null;
  private peerConnections: PeerConnection = {};
  private localStream: MediaStream | null = null;
  private remoteStreams: RemoteStreams = {};
  private currentRoom: string | null = null;
  private onRemoteStreamAdded?: (userId: string, stream: MediaStream) => void;
  private onRemoteStreamRemoved?: (userId: string) => void;
  private connectionPromise: Promise<void> | null = null;
  private roomJoinPromise: Map<string, Promise<void>> = new Map();

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
      this.socket = io(SOCKET_URL, {
        path: "/socket.io",
        transports: ["websocket"],
        auth: { token: token },
        extraHeaders: {
          Authorization: `Bearer ${token}`, // Fallback for header-based auth
        },
      });

      this.socket.on("connect", () => {
        console.log(`✅ Video service connected (ID: ${this.socket?.id})`);
        this.setupSocketEvents();
        this.isConnected = true;
        resolve();
      });

      this.socket.on("connect_error", (err) => {
        console.error("Video connection error:", err);
        reject(err);
      });
    });
  }

  private setupSocketEvents(): void {
    if (!this.socket) return;

    this.socket.onAny((event, ...args) => {
      console.log(`[Socket Event] ${event}`, args);
    });
    // Room events
    this.socket.on("ROOM_JOINED", (roomId: string) => {
      this.currentRoom = roomId;
      console.log(`Joined video room: ${roomId}`);
    });

    this.socket.on("ROOM_USERS", (users: string[]) => {
      users.forEach((userId) => {
        if (userId !== this.socket?.id && !this.peerConnections[userId]) {
          this.createPeerConnection(userId);
        }
      });
    });

    this.socket.on("USER_JOINED", (userId: string) => {
      if (this.localStream && userId !== this.socket?.id) {
        this.createPeerConnection(userId);
      }
    });

    this.socket.on("USER_LEFT", (userId: string) => {
      this.closePeerConnection(userId);
      delete this.remoteStreams[userId];
      if (this.onRemoteStreamRemoved) {
        this.onRemoteStreamRemoved(userId);
      }
    });

    // WebRTC signaling events
    this.socket.on(
      "OFFER",
      async (data: { userId: string; offer: RTCSessionDescriptionInit }) => {
        await this.handleOffer(data.userId, data.offer);
      }
    );

    this.socket.on(
      "ANSWER",
      async (data: { userId: string; answer: RTCSessionDescriptionInit }) => {
        await this.handleAnswer(data.userId, data.answer);
      }
    );

    this.socket.on(
      "ICE_CANDIDATE",
      (data: { userId: string; candidate: RTCIceCandidate }) => {
        this.handleIceCandidate(data.userId, data.candidate);
      }
    );
  }

  public get connected(): boolean {
    return this.isConnected;
  }
  public async waitForConnection(timeout = 5000): Promise<void> {
    if (this.isConnected) return;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, timeout);
      const check = () => {
        if (this.isConnected) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  public async waitForRoomJoin(): Promise<void> {
    if (!this.currentRoom) return;
    return new Promise((resolve) => {
      const handler = (roomId: string) => {
        if (roomId === this.currentRoom) {
          this.socket?.off("ROOM_JOINED", handler);
          resolve();
        }
      };
      this.socket?.on("ROOM_JOINED", handler);
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
          console.log("Join room response:", response); // Debug log
          if (response.success) {
            this.currentRoom = response.roomId || chatGroupId;

            // Store participants if needed
            if (response.participants) {
              // Handle existing participants
              response.participants.forEach((participant) => {
                if (participant.userId !== response.yourId) {
                  this.createPeerConnection(participant.userId);
                }
              });
            }

            resolve({
              roomId: this.currentRoom,
              participants: response.participants || [],
              yourId: response.yourId || "",
            });
          } else {
            reject(response.error || "Failed to join room");
          }
        }
      );
    });
  }
  private setupRoomEvents() {
    if (!this.socket) return;

    // Handle notification of new streams
    this.socket.on("NEW_STREAM_AVAILABLE", (userId: string) => {
      if (userId !== this.socket?.id && this.localStream) {
        this.createPeerConnection(userId);
      }
    });

    // Handle request for room users
    this.socket.on("ROOM_USERS_RESPONSE", (users: string[]) => {
      users.forEach((userId) => {
        if (userId !== this.socket?.id && this.localStream) {
          this.createPeerConnection(userId);
        }
      });
    });
  }
  // public async joinRoom(chatGroupId: string): Promise<void> {
  //   if (!this.socket) throw new Error("Not connected to video server");

  //   return new Promise((resolve, reject) => {
  //     this.socket?.emit(
  //       "JOIN_ROOM",
  //       { chatGroupId },
  //       (response: {
  //         success?: boolean;
  //         error?: string;
  //         roomId?: string;
  //         participants?: any[];
  //         yourId?: string;
  //       }) => {
  //         if (response.success) {
  //           this.currentRoom = response.roomId || chatGroupId;
  //           // Handle any additional room data if needed
  //           resolve();
  //         } else {
  //           reject(response.error || "Failed to join room");
  //         }
  //       }
  //     );
  //   });
  // }

  public async leaveRoom(): Promise<void> {
    if (!this.socket || !this.currentRoom) return;

    // Close all peer connections
    Object.keys(this.peerConnections).forEach((userId) => {
      this.closePeerConnection(userId);
    });

    this.socket.emit("LEAVE_ROOM", { roomId: this.currentRoom });
    this.currentRoom = null;
    this.peerConnections = {};
    this.remoteStreams = {};
  }

  public async ensureReadyForBroadcast(roomId: string): Promise<void> {
    try {
      console.log("[Socket] Ensuring ready for broadcast...");
      // 1. Ensure we're connected
      if (!this.isConnected) {
        const token = localStorage.getItem("token");
        await this.connect(token || "");
        console.log("[Socket] Connection established");
      }

      // 2. Ensure we've joined the room
      if (this.currentRoom !== roomId) {
        console.log("[Socket] Joining room...", this.currentRoom, roomId);
        await this.joinRoom(roomId);
        await new Promise<void>((resolve) => {
          const handler = (joinedRoomId: string) => {
            if (joinedRoomId === roomId) {
              console.log("[Socket] Room joined successfully");
              this.socket?.off("ROOM_JOINED", handler);
              resolve();
            }
          };
          this.socket?.on("ROOM_JOINED", handler);
        });
      }
    } catch (error) {
      console.error("Error ensuring ready for broadcast:", error);
      throw error;
    }
  }
  // Stream management
  public async startBroadcasting(stream: MediaStream): Promise<void> {
    console.log("[Broadcast] Starting broadcast...");
    if (!this.socket || !this.currentRoom) {
      console.error(
        "[Broadcast] Not ready - socket:",
        this.socket?.connected,
        "room:",
        this.currentRoom
      );
      throw new Error("Not connected or not in a room");
    }

    this.localStream = stream;
    console.log("[Broadcast] Local stream set");

    console.log("[Broadcast] Requesting room users...");
    // Request current users in room to establish connections
    this.socket.emit("REQUEST_ROOM_USERS", { roomId: this.currentRoom });

    // Then notify others about our presence
    console.log("[Broadcast] Notifying others of our stream");
    this.socket.emit("NEW_STREAM_AVAILABLE", {
      roomId: this.currentRoom,
      userId: this.socket.id, // or your user ID if available
    });
    console.log("[Broadcast] Broadcast started");
  }

  public stopBroadcasting(): void {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
  }

  public getRemoteStreams(): RemoteStreams {
    return this.remoteStreams;
  }

  // Callbacks for UI updates
  public setRemoteStreamCallbacks(
    onAdded: (userId: string, stream: MediaStream) => void,
    onRemoved: (userId: string) => void
  ): void {
    this.onRemoteStreamAdded = onAdded;
    this.onRemoteStreamRemoved = onRemoved;
  }

  // WebRTC connection management
  private async createPeerConnection(userId: string): Promise<void> {
    console.log(`[WebRTC] Creating peer connection for ${userId}`);
    if (!this.localStream || this.peerConnections[userId]) return;
    if (this.peerConnections[userId]) {
      console.log(`[WebRTC] Connection already exists for ${userId}`);
      return;
    }

    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add your TURN servers here if needed
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);
    this.peerConnections[userId] = peerConnection;

    // Add local stream tracks
    this.localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream!);
    });

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.currentRoom) {
        this.socket?.emit("ICE_CANDIDATE", {
          userId,
          candidate: event.candidate,
          roomId: this.currentRoom,
        });
      }
    };

    // Remote stream handling
    peerConnection.ontrack = (event) => {
      console.log(`[WebRTC] Received track event from ${userId}`, event);
      if (!event.streams || event.streams.length === 0) {
        console.error("[WebRTC] No streams in track event");
        return;
      }
      const remoteStream = event.streams[0];
      console.log(`[WebRTC] Remote stream received from ${userId}`, {
        id: remoteStream.id,
        active: remoteStream.active,
        tracks: remoteStream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState,
        })),
      });
      this.remoteStreams[userId] = remoteStream;

      if (this.onRemoteStreamAdded) {
        this.onRemoteStreamAdded(userId, remoteStream);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "disconnected") {
        this.closePeerConnection(userId);
      }
    };

    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      this.socket?.emit("OFFER", {
        userId,
        offer,
        roomId: this.currentRoom,
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
    if (!this.localStream || this.peerConnections[userId]) return;

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    this.peerConnections[userId] = peerConnection;

    // Add local stream tracks
    this.localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream!);
    });

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.currentRoom) {
        this.socket?.emit("ICE_CANDIDATE", {
          userId,
          candidate: event.candidate,
          roomId: this.currentRoom,
        });
      }
    };

    // Remote stream handling
    peerConnection.ontrack = (event) => {
      console.log(
        `[WebRTC] Received remote stream from ${userId}`,
        event.streams
      );
      const remoteStream = event.streams[0];
      this.remoteStreams[userId] = remoteStream;

      if (this.onRemoteStreamAdded) {
        this.onRemoteStreamAdded(userId, remoteStream);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "disconnected") {
        this.closePeerConnection(userId);
      }
    };

    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      this.socket?.emit("ANSWER", {
        userId,
        answer,
        roomId: this.currentRoom,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
      this.closePeerConnection(userId);
    }
  }

  private async handleAnswer(
    userId: string,
    answer: RTCSessionDescriptionInit
  ): Promise<void> {
    const peerConnection = this.peerConnections[userId];
    if (!peerConnection) return;

    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Error handling answer:", error);
      this.closePeerConnection(userId);
    }
  }

  private handleIceCandidate(userId: string, candidate: RTCIceCandidate): void {
    console.log(`[WebRTC] Handling ICE candidate for ${userId}`, candidate);
    const peerConnection = this.peerConnections[userId];
    if (!peerConnection) {
      console.error(`[WebRTC] No peer connection for ${userId}`);
      return;
    }

    peerConnection
      .addIceCandidate(new RTCIceCandidate(candidate))
      .then(() =>
        console.log(`[WebRTC] Successfully added ICE candidate for ${userId}`)
      )
      .catch((error) => console.error("Error adding ICE candidate:", error));
  }

  private closePeerConnection(userId: string): void {
    const peerConnection = this.peerConnections[userId];
    if (peerConnection) {
      peerConnection.close();
      delete this.peerConnections[userId];

      if (this.remoteStreams[userId]) {
        delete this.remoteStreams[userId];
        if (this.onRemoteStreamRemoved) {
          this.onRemoteStreamRemoved(userId);
        }
      }
    }
  }

  public disconnect(): void {
    if (this.socket) {
      if (this.currentRoom) {
        this.leaveRoom();
      }
      this.socket.disconnect();
      this.socket = null;
    }

    // Clean up all resources
    Object.keys(this.peerConnections).forEach((userId) => {
      this.closePeerConnection(userId);
    });

    this.stopBroadcasting();
  }
}

export const videoSocketService = VideoSocketService.getInstance();
