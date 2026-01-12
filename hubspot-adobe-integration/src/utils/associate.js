import { hubspot } from "../clients/hubspot.client.js";

export const associateBatch = async (
  fromObject,
  toObject,
  associations
) => {
  if (!associations.length) return;

  await hubspot.post(
    `/crm/v4/associations/${fromObject}/${toObject}/batch/create`,
    {
      inputs: associations.map(a => ({
        from: { id: a.fromId },
        to: { id: a.toId },
        type: "default",
      })),
    }
  );
};

export const associateOrdersToCompanies = async (
  orders,
  companiesByAdobeId
) => {
  const links = [];

  // orders is an object indexed by order number
  for (const orderNumber in orders) {
    const order = orders[orderNumber];
    const accountId = order.properties?.adobe_account_id || order.adobe_account_id;
    if (!accountId) continue;

    const company = companiesByAdobeId[accountId];
    if (!company) continue;

    links.push({
      fromId: order.hubspotId,
      toId: company.hubspotId,
    });
  }

  await associateBatch("orders", "companies", links);
};

export const associateOrdersToContacts = async (
  orders,
  contactsByAdobeId
) => {
  const links = [];

  // orders is an object indexed by order number
  for (const orderNumber in orders) {
    const order = orders[orderNumber];
    const customerId = order.properties?.adobe_customer_id || order.adobe_customer_id;
    if (!customerId) continue;

    const contact = contactsByAdobeId[customerId];
    if (!contact) continue;

    links.push({
      fromId: order.hubspotId,
      toId: contact.hubspotId,
    });
  }

  await associateBatch("orders", "contacts", links);
};
  