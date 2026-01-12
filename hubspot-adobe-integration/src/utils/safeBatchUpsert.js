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

/**
 * Batch create records in HubSpot
 * @param {string} objectType - The object type (contacts, companies, deals, products, etc.)
 * @param {Array} inputs - Array of objects with properties
 * @returns {Promise<Array>} Array of created records
 */
export const safeBatchCreate = async (objectType, inputs) => {
  const batches = chunk(inputs, 100);
  const results = [];

  for (const batch of batches) {
    try {
      const { data } = await hubspot.post(
        `/crm/v3/objects/${objectType}/batch/create`,
        { inputs: batch }
      );
      results.push(...data.results);
    } catch (err) {
      logger.error(`${objectType} batch create failed`, {
        objectType,
        error: err.response?.data || err.message,
        batchSize: batch.length,
      });
      throw err; // Re-throw to stop execution on error
    }
  }

  return results;
};
