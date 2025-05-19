const axios = require("axios");
const WebSocket = require("ws");

const HOST = "10.230.29.218";
const PEERJS_PATH = "/codecollab";

async function testConnection() {
  console.log("=== Starting PeerJS Connection Tests ===\n");

  // 1. Test HTTP endpoint
  console.log("[1/3] Testing HTTP endpoint...");
  try {
    const response = await axios.get(`http://${HOST}${PEERJS_PATH}/`, {
      timeout: 3000,
    });
    console.log(`✅ HTTP Server: Online (Status ${response.status})`);
    console.log(`   Response: ${JSON.stringify(response.data)}\n`);
  } catch (error) {
    console.error("❌ HTTP Server Failed:");
    console.error(`   ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return;
  }

  // 2. Test WebSocket connection
  console.log("[2/3] Testing WebSocket connection...");
  try {
    const wsUrl = `ws://${HOST}${PEERJS_PATH}/peerjs/ws?key=peerjs&id=test-client-123`;
    console.log(`   Connecting to: ${wsUrl}`);

    const ws = new WebSocket(wsUrl, {
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
        "Sec-WebSocket-Protocol": "peerjs",
      },
    });

    //const ws = new WebSocket(wsUrl);

    const wsTest = await new Promise((resolve) => {
      let succeeded = false;
      const timeout = setTimeout(() => {
        if (!succeeded) {
          ws.close();
          resolve(false);
        }
      }, 5000);

      ws.on("open", () => {
        clearTimeout(timeout);
        succeeded = true;
        ws.close();
        resolve(true);
      });

      ws.on("error", (err) => {
        clearTimeout(timeout);
        console.error(`   WebSocket Error: ${err.message}`);
        resolve(false);
      });
    });

    if (wsTest) {
      console.log("✅ WebSocket: Connection established successfully\n");
    } else {
      console.error("❌ WebSocket: Failed to establish connection\n");
    }
  } catch (error) {
    console.error("❌ WebSocket test crashed:", error.message);
    return;
  }

  // 3. Test PeerJS API endpoint
  console.log("[3/3] Testing PeerJS API endpoint...");
  try {
    const apiUrl = `http://${HOST}${PEERJS_PATH}/peerjs/id`;
    console.log(`   Requesting: ${apiUrl}`);

    const response = await axios.get(apiUrl, { timeout: 3000 });
    console.log(`✅ PeerJS API: Responded with ID ${response.data.id}`);
    console.log("=== All tests completed successfully ===");
  } catch (error) {
    console.error("❌ PeerJS API Failed:");
    console.error(`   ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

// Run tests with error handling
testConnection()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("!!! Test suite crashed:", err);
    process.exit(1);
  });
