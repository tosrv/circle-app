import http from "http";
import app from "./app";
import dotenv from "dotenv";
import { initWebSocket } from "./sockets/websocket";
import { initRedis } from "./lib/redis";

dotenv.config();

const server = http.createServer(app);
const port = Number(process.env.PORT) || 3000;

async function bootstrap() {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  try {
    await initRedis();
    initWebSocket(server);
  } catch (err) {
    console.error("Init error:", err);
  }
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
