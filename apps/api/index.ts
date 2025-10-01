import app from "./app";
import { logger } from "@/helpers/logger";
import { config } from "./lib/config";
import { startFetchEmails } from "./helpers/corn";

app.listen(config.port, () => {
  // startFetchEmails();
  logger.info(`Server is running on http://localhost:${config.port}`);
});
