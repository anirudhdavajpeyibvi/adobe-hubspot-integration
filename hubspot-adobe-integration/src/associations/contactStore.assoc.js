import { associateBatch } from "../utils/associate.js";

export const associateContactsToStores = async (
  contacts,
  storesByStoreId
) => {
  const links = [];

  // contacts is an object indexed by adobe_customer_id
  for (const contactId in contacts) {
    const contact = contacts[contactId];
    const storeId = contact.properties?.store_id || contact.store_id;
    if (!storeId) continue;

    const store = storesByStoreId[storeId];
    if (!store) continue;

    links.push({
      fromId: contact.hubspotId,
      toId: store.hubspotId,
    });
  }

  await associateBatch("contacts", "stores", links);
};
  