import config from './env.js';

export default {
  apiKey: config.hubspot.apiKey,
  baseUrl: config.hubspot.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.hubspot.apiKey}`,
    'Content-Type': 'application/json',
  },
};

