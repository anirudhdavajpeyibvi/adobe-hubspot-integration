const config = require('./env');

module.exports = {
  apiKey: config.hubspot.apiKey,
  baseUrl: config.hubspot.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.hubspot.apiKey}`,
    'Content-Type': 'application/json',
  },
};

