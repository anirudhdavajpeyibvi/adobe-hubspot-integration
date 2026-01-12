/**
 * Maps HubSpot company to Adobe Commerce format
 * @param {Object} hubspotCompany - HubSpot company object
 * @returns {Object} Adobe Commerce account object
 */
function hubspotToAdobe(hubspotCompany) {
  return {
    name: hubspotCompany.properties?.name || '',
    // Add additional field mappings as needed
  };
}

/**
 * Maps Adobe Commerce account to HubSpot company format
 * @param {Object} adobeAccount - Adobe Commerce account object
 * @returns {Object} HubSpot company properties
 */
function adobeToHubspot(adobeAccount) {
  return {
    name: adobeAccount.name,
    // Add additional field mappings as needed
  };
}

module.exports = {
  hubspotToAdobe,
  adobeToHubspot,
};



