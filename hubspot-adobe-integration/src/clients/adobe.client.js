import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../config/env.js";

export const adobe = axios.create({
  baseURL: config.adobe.baseUrl,
  headers: {
    Authorization: `Bearer ${config.adobe.apiKey}`,
  },
  timeout: 30000,
});

axiosRetry(adobe, {
  retries: config.sync.retryAttempts,
  retryDelay: axiosRetry.exponentialDelay,
});
