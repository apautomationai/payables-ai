import app from "./app";
import { logger } from "@/helpers/logger";
import { config } from "./lib/config";

app.listen(config.port, () => {
  logger.info(`Server is running on http://localhost:${config.port}`);
});
