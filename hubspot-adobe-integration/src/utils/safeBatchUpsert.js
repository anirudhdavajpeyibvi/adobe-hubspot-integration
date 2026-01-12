import { chunk } from "./chunk.js";
import { hubspot } from "../clients/hubspot.client.js";

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
      console.error(
        `❌ ${objectType} batch failed`,
        err.response?.data || err.message
      );
    }
  }

  return results;
};
