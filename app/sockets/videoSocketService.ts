import { io, Socket } from "socket.io-client";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
interface PeerConnection {
    [key: string]: RTCPeerConnection;
}

interface RemoteStreams {
    [key: string]: MediaStream;
}

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
            this.socket = io(SOCKET_URL, {
                path: "/video/socket.io",
                transports: ["websocket"],
                auth: { token },
            });

            this.socket.on("connect", () => {
                console.log(`✅ Video service connected (ID: ${this.socket?.id})`);
                this.setupSocketEvents();
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

        // Room events
        this.socket.on("ROOM_JOINED", (roomId: string) => {
            this.currentRoom = roomId;
            console.log(`Joined video room: ${roomId}`);
        });

        this.socket.on("ROOM_USERS", (users: string[]) => {
            users.forEach(userId => {
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
        this.socket.on("OFFER", async (data: { userId: string; offer: RTCSessionDescriptionInit }) => {
            await this.handleOffer(data.userId, data.offer);
        });

        this.socket.on("ANSWER", async (data: { userId: string; answer: RTCSessionDescriptionInit }) => {
            await this.handleAnswer(data.userId, data.answer);
        });

        this.socket.on("ICE_CANDIDATE", (data: { userId: string; candidate: RTCIceCandidate }) => {
            this.handleIceCandidate(data.userId, data.candidate);
        });
    }

    // Room management
    public async joinRoom(roomId: string): Promise<void> {
        if (!this.socket) throw new Error("Not connected to video server");
        this.socket.emit("JOIN_ROOM", { roomId });
    }

    public async leaveRoom(): Promise<void> {
        if (!this.socket || !this.currentRoom) return;
        
        // Close all peer connections
        Object.keys(this.peerConnections).forEach(userId => {
            this.closePeerConnection(userId);
        });
        
        this.socket.emit("LEAVE_ROOM", { roomId: this.currentRoom });
        this.currentRoom = null;
        this.peerConnections = {};
        this.remoteStreams = {};
    }

    // Stream management
    public async startBroadcasting(stream: MediaStream): Promise<void> {
        if (!this.socket || !this.currentRoom) throw new Error("Not connected or not in a room");
        
        this.localStream = stream;
        
        // Request current users in room to establish connections
        this.socket.emit("REQUEST_ROOM_USERS", { roomId: this.currentRoom });
    }

    public stopBroadcasting(): void {
        this.localStream?.getTracks().forEach(track => track.stop());
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
        if (!this.localStream || this.peerConnections[userId]) return;

        const configuration: RTCConfiguration = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                // Add your TURN servers here if needed
            ],
        };

        const peerConnection = new RTCPeerConnection(configuration);
        this.peerConnections[userId] = peerConnection;

        // Add local stream tracks
        this.localStream.getTracks().forEach(track => {
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

    private async handleOffer(userId: string, offer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.localStream || this.peerConnections[userId]) return;

        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        this.peerConnections[userId] = peerConnection;

        // Add local stream tracks
        this.localStream.getTracks().forEach(track => {
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
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
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

    private async handleAnswer(userId: string, answer: RTCSessionDescriptionInit): Promise<void> {
        const peerConnection = this.peerConnections[userId];
        if (!peerConnection) return;

        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error("Error handling answer:", error);
            this.closePeerConnection(userId);
        }
    }

    private handleIceCandidate(userId: string, candidate: RTCIceCandidate): void {
        const peerConnection = this.peerConnections[userId];
        if (!peerConnection) return;

        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            .catch(error => console.error("Error adding ICE candidate:", error));
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
        Object.keys(this.peerConnections).forEach(userId => {
            this.closePeerConnection(userId);
        });
        
        this.stopBroadcasting();
    }
}

export const videoSocketService = VideoSocketService.getInstance();