import Peer, { MediaConnection } from "peerjs";

class VideoSocketService {
  private peer: Peer | null = null;
  private localStream: MediaStream | null = null;
  private connections: { [userId: string]: MediaConnection } = {};
  private currentRoomId: string | null = null;
  private onStreamAdded:
    | ((userId: string, stream: MediaStream) => void)
    | null = null;
  private onStreamRemoved: ((userId: string) => void) | null = null;
  private currentUserId: string | null = null;

  constructor() {
    this.peer = null;
  }

  async initialize(userId: string) {
    this.currentUserId = userId;

    return new Promise<void>((resolve, reject) => {
      // Create new Peer instance with proper configuration
      this.peer = new Peer(userId, {
        host: window.location.hostname,
        port: window.location.port === "" ? 80 : Number(window.location.port),
        path: "/codecollab",
        secure: window.location.protocol === "https:",
        debug: 3,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });

      this.peer.on("open", (id) => {
        console.log("PeerJS connected with ID:", id);
        resolve();
      });

      this.peer.on("error", (error) => {
        console.error("PeerJS error:", error);
        reject(error);
      });

      this.peer.on("call", (call) => {
        console.log("Incoming call from:", call.peer);
        if (this.localStream) {
          call.answer(this.localStream);
          this.handleCall(call);
        } else {
          console.warn("No local stream available to answer call");
        }
      });

      // Handle connection events
      this.peer.on("connection", (conn) => {
        conn.on("open", () => {
          console.log("Connected to:", conn.peer);
        });
      });
    });
  }

  private handleCall(call: MediaConnection) {
    call.on("stream", (remoteStream) => {
      if (this.onStreamAdded) {
        this.onStreamAdded(call.peer, remoteStream);
      }
    });

    call.on("close", () => {
      if (this.onStreamRemoved) {
        this.onStreamRemoved(call.peer);
      }
      delete this.connections[call.peer];
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
    });

    this.connections[call.peer] = call;
  }

  // ... rest of your existing methods .

  setRemoteStreamCallbacks(
    onStreamAdded: (userId: string, stream: MediaStream) => void,
    onStreamRemoved: (userId: string) => void
  ) {
    this.onStreamAdded = onStreamAdded;
    this.onStreamRemoved = onStreamRemoved;
  }

  async joinRoom(roomId: string): Promise<boolean> {
    if (!this.peer) {
      throw new Error("Peer not initialized");
    }

    this.currentRoomId = roomId;
    return true;
  }

  async startBroadcasting(stream: MediaStream): Promise<void> {
    if (!this.peer || !this.currentRoomId) {
      throw new Error("Peer or room not initialized");
    }

    this.localStream = stream;

    // In a real app, you would use a signaling server to get other participants
    // For this example, we'll assume participants join via the same room ID
    // and discover each other through the signaling server
  }

  async callUser(userId: string): Promise<void> {
    if (!this.peer || !this.localStream) {
      throw new Error("Peer or stream not initialized");
    }

    const call = this.peer.call(userId, this.localStream);

    call.on("stream", (remoteStream) => {
      if (this.onStreamAdded) {
        this.onStreamAdded(userId, remoteStream);
      }
    });

    call.on("close", () => {
      if (this.onStreamRemoved) {
        this.onStreamRemoved(userId);
      }
      delete this.connections[userId];
    });

    this.connections[userId] = call;
  }

  async leaveRoom(): Promise<void> {
    Object.values(this.connections).forEach((connection) => {
      connection.close();
    });
    this.connections = {};
    this.currentRoomId = null;
  }

  stopBroadcasting(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }

  disconnect(): void {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export const videoSocketService = new VideoSocketService();
