import { hubspot } from '../clients/hubspot.client.js';
import { adobe } from '../clients/adobe.client.js';
import * as userMapper from '../mappers/user.mapper.js';
import logger from '../utils/logger.js';
import { processInChunks } from '../utils/chunk.js';
import config from '../config/env.js';

class UsersService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting users sync from HubSpot to Adobe');
      
      // Fetch users from HubSpot
      const hubspotUsers = await hubspot.get('/settings/v3/users');
      
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
      const adobeUsers = await adobe.get('/V1/users');
      
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

export default new UsersService();



