import usersService from '../services/users.service.js';
import logger from '../utils/logger.js';

async function syncUsers() {
  try {
    logger.info('Starting users synchronization job');
    
    // Sync from HubSpot to Adobe
    const hubspotToAdobe = await usersService.syncFromHubspotToAdobe();
    
    // Sync from Adobe to HubSpot
    const adobeToHubspot = await usersService.syncFromAdobeToHubspot();
    
    logger.info('Users synchronization job completed', {
      hubspotToAdobe: hubspotToAdobe.synced,
      adobeToHubspot: adobeToHubspot.synced,
    });
    
    return {
      hubspotToAdobe,
      adobeToHubspot,
    };
  } catch (error) {
    logger.error('Users synchronization job failed', { error: error.message });
    throw error;
  }
}

export { syncUsers };



