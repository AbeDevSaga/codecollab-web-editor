// const activeCollaborations = new Map(); // filePath -> Set(userIds)

// module.exports = (io, socket) => {
//   // Share file/folder with group
//   socket.on('SHARE_RESOURCE', async ({ resourcePath, groupId, permission }) => {
//     const groupMembers = await GroupModel.findById(groupId).select('members');
//     const file = await FileModel.findOne({ path: resourcePath });
    
//     // Add all group members to sharedWith
//     file.sharedWith.push(...groupMembers.members.map(member => ({
//       user: member,
//       role: permission
//     })));
    
//     await file.save();
    
//     // Notify recipients
//     groupMembers.members.forEach(memberId => {
//       io.to(`user-${memberId}`).emit('RESOURCE_SHARED', {
//         resourcePath,
//         owner: socket.userId,
//         permission
//       });
//     });
//   });

//   // Handle joining a shared file
//   socket.on('JOIN_SHARED_FILE', ({ filePath }) => {
//     if (!activeCollaborations.has(filePath)) {
//       activeCollaborations.set(filePath, new Set());
//     }
//     activeCollaborations.get(filePath).add(socket.userId);
    
//     socket.join(`file-${filePath}`);
//     io.to(`file-${filePath}`).emit('COLLABORATORS_UPDATE', 
//       Array.from(activeCollaborations.get(filePath))
//   });
// };