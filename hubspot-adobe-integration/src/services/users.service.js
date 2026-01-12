const hubspotClient = require('../clients/hubspot.client');
const adobeClient = require('../clients/adobe.client');
const userMapper = require('../mappers/user.mapper');
const logger = require('../utils/logger');
const { processInChunks } = require('../utils/chunk');
const config = require('../config/env');

class UsersService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting users sync from HubSpot to Adobe');
      
      // Fetch users from HubSpot
      const hubspotUsers = await hubspotClient.get('/settings/v3/users');
      
      if (!hubspotUsers.results || hubspotUsers.results.length === 0) {
        logger.info('No users found in HubSpot');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        hubspotUsers.results,
        config.sync.batchSize,
        async (chunk) => {
          const adobeUsers = chunk.map(userMapper.hubspotToAdobe);
          // Sync to Adobe Commerce
          return adobeUsers;
        }
      );

      logger.info(`Successfully synced ${results.length} users from HubSpot to Adobe`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing users from HubSpot to Adobe', { error: error.message });
      throw error;
    }
  }

  async syncFromAdobeToHubspot() {
    try {
      logger.info('Starting users sync from Adobe to HubSpot');
      
      // Fetch users from Adobe Commerce
      // Implementation depends on Adobe Commerce API structure
      const adobeUsers = await adobeClient.get('/V1/users');
      
      if (!adobeUsers || adobeUsers.length === 0) {
        logger.info('No users found in Adobe');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        adobeUsers,
        config.sync.batchSize,
        async (chunk) => {
          const hubspotUsers = chunk.map(userMapper.adobeToHubspot);
          // Sync to HubSpot
          return hubspotUsers;
        }
      );

      logger.info(`Successfully synced ${results.length} users from Adobe to HubSpot`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing users from Adobe to HubSpot', { error: error.message });
      throw error;
    }
  }
}

module.exports = new UsersService();



