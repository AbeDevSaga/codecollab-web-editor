import { Socket } from "socket.io-client";
import store from "../redux/store";

class FileSyncService {
  private socket: Socket;
  
  constructor(socket: Socket) {
    this.socket = socket;
  }

  joinFile(filePath: string) {
    this.socket.emit('JOIN_SHARED_FILE', { filePath });
  }

  sendUpdate(filePath: string, content: string) {
    this.socket.emit('FILE_UPDATE', {
      filePath,
      content,
      timestamp: Date.now()
    });
  }
}