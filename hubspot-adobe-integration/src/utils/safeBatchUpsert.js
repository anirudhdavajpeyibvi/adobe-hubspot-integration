import { chunk } from "./chunk.js";
import { hubspot } from "../clients/hubspot.client.js";
import logger from "./logger.js";

export const safeBatchUpsert = async (objectType, inputs) => {
  const batches = chunk(inputs, 100);
  const results = [];

  for (const batch of batches) {
    try {
      const { data } = await hubspot.post(
        `/crm/v3/objects/${objectType}/batch/upsert`,
        { inputs: batch }
      );
      results.push(...data.results);
    } catch (err) {
      logger.error(`${objectType} batch failed`, {
        objectType,
        error: err.response?.data || err.message,
        batchSize: batch.length,
      });
    }
  }

  return results;
};
