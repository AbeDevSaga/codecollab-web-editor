// // Initialize the service
// await videoSocketService.connect("your-auth-token", "https://your-server.com");

// // Set up UI callbacks
// videoSocketService.setRemoteStreamCallbacks(
//     (userId, stream) => {
//         // Add video element for new remote stream
//         console.log(`New stream from ${userId}`);
//     },
//     (userId) => {
//         // Remove video element for disconnected user
//         console.log(`Stream removed from ${userId}`);
//     }
// );

// // Join a video room
// await videoSocketService.joinRoom("room123");

// // Start broadcasting (after getting user media)
// const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
// await videoSocketService.startBroadcasting(stream);

// // When done:
// await videoSocketService.leaveRoom();
// videoSocketService.stopBroadcasting();
// videoSocketService.disconnect();