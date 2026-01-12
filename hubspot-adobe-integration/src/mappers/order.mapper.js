/**
 * Maps Adobe Commerce order to HubSpot deal format
 * @param {Object} adobeOrder - Adobe Commerce order object
 * @returns {Object} HubSpot deal properties
 */
export const mapAdobeOrderToHubSpot = (order) => ({
  properties: {
    dealname: order.adobe_order_number || order.oracle_order_number,
    adobe_order_number: order.adobe_order_number,
    oracle_order_number: order.oracle_order_number,
    adobe_account_id: order.adobe_account_id,
    adobe_customer_id: order.adobe_customer_id,
    invoice_number: order.invoice_number,
    total_amount_paid: order.total_amount_paid,
    order_status: order.order_status,
    payment_status: order.payment_status,
    order_date: order.order_date,
    invoice_date: order.invoice_date,
    payment_date: order.payment_date,
    created_by: order.created_by,
    dnp: order.dnp,
  },
});

/**
 * Maps HubSpot deal to Adobe Commerce order format
 * @param {Object} hubspotDeal - HubSpot deal object
 * @returns {Object} Adobe Commerce order object
 */
export const mapHubSpotToAdobe = (hubspotDeal) => {
  return {
    increment_id: hubspotDeal.properties?.dealname || '',
    // Add additional field mappings as needed
  };
};

