export const mapAdobeStoreToHubSpot = (store) => ({
  properties: {
    name: store.store_name,
    store_id: store.store_id,
    account_id: store.account_id,
    contact_id: store.contact_id,
    ship_to_address: store.ship_to_address,
    city: store.city,
    state: store.state,
    zip: store.zip,
    country: store.country,
    phone: store.phone,
    email: store.email,
    division: store.division,
  },
});

