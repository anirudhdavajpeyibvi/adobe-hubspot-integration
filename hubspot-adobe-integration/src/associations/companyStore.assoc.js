import { associateBatch } from "../utils/associate.js";

export const associateCompaniesToStores = async (
  stores,
  companiesByAdobeId
) => {
  const links = [];

  // stores is an object indexed by store_id
  for (const storeId in stores) {
    const store = stores[storeId];
    const accountId = store.properties?.account_id || store.account_id;
    if (!accountId) continue;

    const company = companiesByAdobeId[accountId];
    if (!company) continue;

    links.push({
      fromId: company.hubspotId,
      toId: store.hubspotId,
    });
  }

  await associateBatch("companies", "stores", links);
};
  