export const mapAdobeContactToHubSpot = (c) => ({
  properties: {
    email: c.email,
    firstname: c.firstname,
    lastname: c.lastname,
    company: c.company,
    division: c.division,
    store_name: c.store_name,
    adobe_customer_id: c.adobe_customer_id,
    store_id: c.store_id,
  },
});
