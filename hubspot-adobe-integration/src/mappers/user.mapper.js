/**
 * Maps HubSpot user to Adobe Commerce format
 * @param {Object} hubspotUser - HubSpot user object
 * @returns {Object} Adobe Commerce user object
 */
function hubspotToAdobe(hubspotUser) {
  return {
    email: hubspotUser.email || '',
    firstname: hubspotUser.firstName || '',
    lastname: hubspotUser.lastName || '',
    // Add additional field mappings as needed
  };
}

/**
 * Maps Adobe Commerce user to HubSpot user format
 * @param {Object} adobeUser - Adobe Commerce user object
 * @returns {Object} HubSpot user properties
 */
function adobeToHubspot(adobeUser) {
  return {
    email: adobeUser.email,
    firstName: adobeUser.firstname,
    lastName: adobeUser.lastname,
    // Add additional field mappings as needed
  };
}

export {
  hubspotToAdobe,
  adobeToHubspot,
};



