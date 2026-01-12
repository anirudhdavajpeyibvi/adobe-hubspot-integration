/**
 * Maps HubSpot product to Adobe Commerce product format
 * @param {Object} hubspotProduct - HubSpot product object
 * @returns {Object} Adobe Commerce product object
 */
function hubspotToAdobe(hubspotProduct) {
  return {
    sku: hubspotProduct.properties?.hs_sku || '',
    name: hubspotProduct.properties?.name || '',
    // Add additional field mappings as needed
  };
}

/**
 * Maps Adobe Commerce product to HubSpot product format
 * @param {Object} adobeProduct - Adobe Commerce product object
 * @returns {Object} HubSpot product properties
 */
function adobeToHubspot(adobeProduct) {
  return {
    name: adobeProduct.name,
    hs_sku: adobeProduct.sku,
    // Add additional field mappings as needed
  };
}

export {
  hubspotToAdobe,
  adobeToHubspot,
};



