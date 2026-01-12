import app from './app.js';
import config from './config/env.js';
import logger from './utils/logger.js';
import cron from "node-cron";
import { nightlySync } from "./jobs/nightlySync.job.js";

cron.schedule(config.cron.nightlySyncSchedule, async () => {
  try {
    await nightlySync();
  } catch (err) {
    logger.error("❌ Nightly sync failed", { error: err.message, stack: err.stack });
  }
});

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`, {
    environment: config.nodeEnv,
    port: config.port,
  });
  
  logger.info(`Nightly sync scheduled: ${config.cron.nightlySyncSchedule}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default server;

