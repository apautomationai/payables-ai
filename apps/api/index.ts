import { createServer } from 'http';
import app from "./app";
import { logger } from "@/helpers/logger";
import { config } from "./lib/config";
import { startFetchEmails } from "./helpers/corn";
import { getWebSocketService } from "@/services/websocket.service";

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket service
getWebSocketService(server);

server.listen(config.port, () => {
  startFetchEmails();
  logger.info(`Server is running on http://localhost:${config.port}`);
  logger.info(`WebSocket server initialized`);
});
