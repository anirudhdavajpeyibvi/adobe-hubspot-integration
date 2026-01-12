import config from './env.js';

export default {
  apiKey: config.adobe.apiKey,
  apiSecret: config.adobe.apiSecret,
  baseUrl: config.adobe.baseUrl,
  accessTokenUrl: config.adobe.accessTokenUrl,
};

