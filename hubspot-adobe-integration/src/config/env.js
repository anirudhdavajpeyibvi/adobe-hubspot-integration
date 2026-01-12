import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY,
    baseUrl: process.env.HUBSPOT_BASE_URL || 'https://api.hubapi.com',
  },
  adobe: {
    apiKey: process.env.ADOBE_API_KEY,
    apiSecret: process.env.ADOBE_API_SECRET,
    baseUrl: process.env.ADOBE_BASE_URL,
    accessTokenUrl: process.env.ADOBE_ACCESS_TOKEN_URL,
  },
  sync: {
    batchSize: parseInt(process.env.SYNC_BATCH_SIZE) || 100,
    retryAttempts: parseInt(process.env.SYNC_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.SYNC_RETRY_DELAY) || 1000,
  },
  cron: {
    nightlySyncSchedule: process.env.NIGHTLY_SYNC_SCHEDULE || '0 2 * * *',
  },
};

