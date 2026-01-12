const itemsService = require('../services/items.service');
const logger = require('../utils/logger');

async function syncItems() {
  try {
    logger.info('Starting items synchronization job');
    
    // Sync from HubSpot to Adobe
    const hubspotToAdobe = await itemsService.syncFromHubspotToAdobe();
    
    // Sync from Adobe to HubSpot
    const adobeToHubspot = await itemsService.syncFromAdobeToHubspot();
    
    logger.info('Items synchronization job completed', {
      hubspotToAdobe: hubspotToAdobe.synced,
      adobeToHubspot: adobeToHubspot.synced,
    });
    
    return {
      hubspotToAdobe,
      adobeToHubspot,
    };
  } catch (error) {
    logger.error('Items synchronization job failed', { error: error.message });
    throw error;
  }
}

module.exports = syncItems;



