import { adobe } from "../clients/adobe.client.js";
import { createOrUpdateObject } from "../clients/hubspot.client.js";
import { storeSchema } from "../validators/store.schema.js";
import { validateBatch } from "../validators/validate.js";
import { mapAdobeStoreToHubSpot } from "../mappers/store.mapper.js";
import { indexByStoreId } from "../utils/index.js";

export const syncStores = async () => {
  const { data } = await adobe.get("/stores");
  const valid = validateBatch(storeSchema, data.items, "Stores");

  const payload = {
    inputs: valid.map(mapAdobeStoreToHubSpot),
  };

  const response = await createOrUpdateObject("stores", payload);

  return indexByStoreId(response.data.results);
};
