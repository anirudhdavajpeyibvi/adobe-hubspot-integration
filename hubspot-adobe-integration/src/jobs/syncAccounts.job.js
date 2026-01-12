const accountsService = require('../services/accounts.service');
const logger = require('../utils/logger');

async function syncAccounts() {
  try {
    logger.info('Starting accounts synchronization job');
    
    // Sync from HubSpot to Adobe
    const hubspotToAdobe = await accountsService.syncFromHubspotToAdobe();
    
    // Sync from Adobe to HubSpot
    const adobeToHubspot = await accountsService.syncFromAdobeToHubspot();
    
    logger.info('Accounts synchronization job completed', {
      hubspotToAdobe: hubspotToAdobe.synced,
      adobeToHubspot: adobeToHubspot.synced,
    });
    
    return {
      hubspotToAdobe,
      adobeToHubspot,
    };
  } catch (error) {
    logger.error('Accounts synchronization job failed', { error: error.message });
    throw error;
  }
}

module.exports = syncAccounts;



