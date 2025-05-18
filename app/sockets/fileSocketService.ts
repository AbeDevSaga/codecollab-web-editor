import { io, Socket } from "socket.io-client";
import { setCurrentFile } from "../redux/slices/fileSlice";
import store from "../redux/store";
import { updateFileContent } from "../redux/slices/editorSlice";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public async connect(token: string): Promise<void> {
    if (this.socket?.connected) return;

    return new Promise((resolve) => {
      this.socket = io(SOCKET_URL, {
        path: "/files/socket.io",
        transports: ["websocket"],
        upgrade: false,
        auth: { token },
      });

      this.socket.on("connect", () => {
        console.log(`✅ Connected (ID: ${this.socket?.id})`);
        resolve();
      });

      this.socket.on(
        "FILE_UPDATED",
        (data: { filePath: string; content: string; userId: string }) => {
          console.log("FILE_UPDATED: ", data);
          store.dispatch(
            updateFileContent({
              workspaceId: data.userId,
              filePath: data.filePath,
              content: data.content,
            })
          );
        }
      );
      this.socket?.on(
        "FILE_CONTENT",
        (data: { filePath: string; content: string; userId: string }) => {
          store.dispatch(
            updateFileContent({
              workspaceId: data.userId,
              filePath: data.filePath,
              content: data.content,
              isDirty: false,
            })
          );
        }
      );

      this.socket.on("FILE_JOINED", (data) => {
        store.dispatch(setCurrentFile(data));
      });
    });
  }

  public joinFile(fileId: string): void {
    this.socket?.emit("JOIN_FILE", { fileId });
  }

  public updateFileContent(
    filePath: string,
    userId: string,
    content: string
  ): void {
    console.log("emiting update file:  ", {
      filePath,
      userId,
      content,
    });
    this.socket?.emit("UPDATE_FILE", {
      filePath,
      userId,
      content,
      timestamp: Date.now(),
    });
  }

  public getFileContent(filePath: string, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject("Socket not connected");

      this.socket.emit(
        "FILE_CONTENT",
        { filePath, userId },
        (response: { content?: string; error?: string }) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.content || "");
          }
        }
      );
    });
  }
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const fileSocketService = SocketService.getInstance();
