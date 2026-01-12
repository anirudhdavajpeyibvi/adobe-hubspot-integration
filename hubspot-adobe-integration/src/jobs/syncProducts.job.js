import { adobe } from "../clients/adobe.client.js";
import { createOrUpdateObject } from "../clients/hubspot.client.js";
import { productSchema } from "../validators/product.schema.js";
import { validateBatch } from "../validators/validate.js";
import { mapAdobeProductToHubSpot } from "../mappers/product.mapper.js";

export const syncProducts = async () => {
  const { data } = await adobe.get("/products");
  const valid = validateBatch(productSchema, data.items, "Products");

  const payload = {
    inputs: valid.map(mapAdobeProductToHubSpot),
  };

  await createOrUpdateObject("products", payload);
};
