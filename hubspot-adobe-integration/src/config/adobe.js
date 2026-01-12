const config = require('./env');

module.exports = {
  apiKey: config.adobe.apiKey,
  apiSecret: config.adobe.apiSecret,
  baseUrl: config.adobe.baseUrl,
  accessTokenUrl: config.adobe.accessTokenUrl,
};

