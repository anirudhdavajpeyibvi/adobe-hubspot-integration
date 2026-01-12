import { adobe } from "../clients/adobe.client.js";
import { createOrUpdateObject } from "../clients/hubspot.client.js";
import { companySchema } from "../validators/company.schema.js";
import { validateBatch } from "../validators/validate.js";
import { mapAdobeCompanyToHubSpot } from "../mappers/company.mapper.js";
import { indexByAdobeId } from "../utils/index.js";

export const syncCompanies = async () => {
  const { data } = await adobe.get("/companies");
  const valid = validateBatch(companySchema, data.items, "Companies");

  const payload = {
    inputs: valid.map(mapAdobeCompanyToHubSpot),
  };

  const response = await createOrUpdateObject("companies", payload);

  return indexByAdobeId(response.data.results, "adobe_account_id");
};
