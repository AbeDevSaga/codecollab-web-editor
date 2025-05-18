// import { Socket } from "socket.io-client";
// import store from "../redux/store";

// class CollaborationService {
//   private socket: Socket;
  
//   constructor(socket: Socket) {
//     this.socket = socket;
//   }

//   shareResource(resourcePath: string, groupId: string, permission: 'view'|'edit') {
//     this.socket.emit('SHARE_RESOURCE', { resourcePath, groupId, permission });
//   }

//   onSharedResource(callback: (data: SharedResource) => void) {
//     this.socket.on('RESOURCE_SHARED', callback);
//   }
// }
