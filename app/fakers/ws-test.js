// socketio-docker-debug.js
const io = require("socket.io-client");
const axios = require("axios");

// Configuration
const HOST = "10.230.29.218";
const TEST_PATHS = ["/files/socket.io", "/socket.io", "/files", "/"];
const TEST_OPTIONS = [
  { transports: ["websocket"], upgrade: false },
  { transports: ["polling"] },
  { reconnection: false, timeout: 5000 },
];
const TEST_PROTOCOLS = ["http", "https"];

// Test runner
async function runTests() {
  console.log("Starting Socket.IO client connection tests...\n");

  // Test HTTP server first
  await testHttpServer();

  // Test all combinations
  for (const protocol of TEST_PROTOCOLS) {
    for (const path of TEST_PATHS) {
      for (const options of TEST_OPTIONS) {
        await testSocketIO(protocol, path, options);
      }
    }
  }

  console.log("\nAll Socket.IO test combinations completed");
}

async function testHttpServer() {
  try {
    const response = await axios.get(`${TEST_PROTOCOLS[0]}://${HOST}`, {
      timeout: 3000,
    });
    console.log(`✅ HTTP server is responding (Status: ${response.status})`);
    return true;
  } catch (error) {
    console.error("❌ HTTP server test failed:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
    } else {
      console.error(error.message);
    }
    return false;
  }
}

async function testSocketIO(protocol, path, options) {
  const url = `${protocol}://${HOST}`;
  const fullOptions = {
    ...options,
    path: path.endsWith("socket.io") ? path : path + "socket.io",
    query: { test: Date.now() },
  };

  console.log(`\nTesting: ${url}`);
  console.log(`Path: ${fullOptions.path}`);
  console.log(`Options: ${JSON.stringify(options)}`);

  return new Promise((resolve) => {
    const socket = io(url, fullOptions);

    const timeout = setTimeout(() => {
      console.log("⏱️  Connection timeout");
      socket.disconnect();
      resolve();
    }, 10000);

    // Connection events
    socket.on("connect", () => {
      clearTimeout(timeout);
      console.log(`✅ Connected (ID: ${socket.id})`);

      // Test basic emit
      socket.emit("test", { type: "TEST", timestamp: Date.now() });

      // Wait for response
      socket.on("test-reply", (data) => {
        console.log("📩 Received test-reply:", data);
        socket.disconnect();
      });
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timeout);
      console.error(`❌ Connection failed: ${err.message}`);
      socket.disconnect();
    });

    socket.on("disconnect", (reason) => {
      clearTimeout(timeout);
      console.log(`♻️ Disconnected: ${reason}`);
      resolve();
    });
  });
}

// Run tests
runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

