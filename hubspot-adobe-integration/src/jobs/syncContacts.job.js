import { adobe } from "../clients/adobe.client.js";
import { createOrUpdateObject } from "../clients/hubspot.client.js";
import { contactSchema } from "../validators/contact.schema.js";
import { validateBatch } from "../validators/validate.js";
import { mapAdobeContactToHubSpot } from "../mappers/contact.mapper.js";
import { indexByAdobeId } from "../utils/index.js";

export const syncContacts = async () => {
  const { data } = await adobe.get("/customers");
  const valid = validateBatch(contactSchema, data.items, "Contacts");

  const payload = {
    inputs: valid.map(mapAdobeContactToHubSpot),
  };

  const response = await createOrUpdateObject("contacts", payload);

  return indexByAdobeId(response.data.results, "adobe_customer_id");
};
