// module.exports = (io, socket) => {
//   const pendingUpdates = new Map(); // filePath -> lastUpdate
  
//   socket.on('FILE_UPDATE', async ({ filePath, content, timestamp }) => {
//     // Conflict resolution
//     if (!pendingUpdates.has(filePath) || timestamp > pendingUpdates.get(filePath)) {
//       pendingUpdates.set(filePath, timestamp);
      
//       // Save to DB
//       await FileModel.updateOne(
//         { path: filePath },
//         { content, updatedAt: new Date() }
//       );
      
//       // Broadcast to collaborators
//       socket.to(`file-${filePath}`).emit('FILE_UPDATED', {
//         filePath,
//         content,
//         userId: socket.userId,
//         timestamp
//       });
//     }
//   });
// };