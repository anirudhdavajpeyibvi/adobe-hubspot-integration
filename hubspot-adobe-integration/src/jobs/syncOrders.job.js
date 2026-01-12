import { adobe } from "../clients/adobe.client.js";
import { createOrUpdateObject } from "../clients/hubspot.client.js";
import { orderSchema } from "../validators/order.schema.js";
import { validateBatch } from "../validators/validate.js";
import { mapAdobeOrderToHubSpot } from "../mappers/order.mapper.js";
import { indexByOrderNumber } from "../utils/index.js";

export const syncOrders = async () => {
  const { data } = await adobe.get("/orders");
  const valid = validateBatch(orderSchema, data.items, "Orders");

  const payload = {
    inputs: valid.map(mapAdobeOrderToHubSpot),
  };

  const response = await createOrUpdateObject("orders", payload);

  return indexByOrderNumber(response.data.results);
};
