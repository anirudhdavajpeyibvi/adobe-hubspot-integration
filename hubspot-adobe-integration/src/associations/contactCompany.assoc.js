import { associateBatch } from "../utils/associate.js";

export const associateContactsToCompanies = async (
  contacts,
  companiesByAdobeId
) => {
  const links = [];

  // contacts is an object indexed by adobe_customer_id
  for (const contactId in contacts) {
    const contact = contacts[contactId];
    const accountId = contact.properties?.adobe_account_id || contact.adobe_account_id;
    if (!accountId) continue;

    const company = companiesByAdobeId[accountId];
    if (!company) continue;

    links.push({
      fromId: contact.hubspotId,
      toId: company.hubspotId,
    });
  }

  await associateBatch("contacts", "companies", links);
};
