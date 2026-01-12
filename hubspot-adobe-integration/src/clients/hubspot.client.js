import axios from "axios";
import axiosRetry from "axios-retry";
import Bottleneck from "bottleneck";
import config from "../config/env.js";

const limiter = new Bottleneck({
  minTime: 300, // ~3 requests/sec
  maxConcurrent: 1,
});

export const hubspot = axios.create({
  baseURL: config.hubspot.baseUrl,
  headers: {
    Authorization: `Bearer ${config.hubspot.apiKey}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosRetry(hubspot, {
  retries: config.sync.retryAttempts,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 429,
});

hubspot.interceptors.request.use(config =>
  limiter.schedule(() => config)
);

export const createOrUpdateObject = async (objectType, payload) => {
  return await hubspot.post(`/crm/v3/objects/${objectType}/batch/upsert`, payload);
};
