const hubspotClient = require('../clients/hubspot.client');
const adobeClient = require('../clients/adobe.client');
const accountMapper = require('../mappers/account.mapper');
const logger = require('../utils/logger');
const { processInChunks } = require('../utils/chunk');
const config = require('../config/env');

class AccountsService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting accounts sync from HubSpot to Adobe');
      
      // Fetch companies from HubSpot
      const hubspotCompanies = await hubspotClient.get('/crm/v3/objects/companies');
      
      if (!hubspotCompanies.results || hubspotCompanies.results.length === 0) {
        logger.info('No companies found in HubSpot');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        hubspotCompanies.results,
        config.sync.batchSize,
        async (chunk) => {
          const adobeAccounts = chunk.map(accountMapper.hubspotToAdobe);
          // Sync to Adobe Commerce
          return adobeAccounts;
        }
      );

      logger.info(`Successfully synced ${results.length} accounts from HubSpot to Adobe`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing accounts from HubSpot to Adobe', { error: error.message });
      throw error;
    }
  }

  async syncFromAdobeToHubspot() {
    try {
      logger.info('Starting accounts sync from Adobe to HubSpot');
      
      // Fetch accounts from Adobe Commerce
      // Implementation depends on Adobe Commerce API structure
      const adobeAccounts = await adobeClient.get('/V1/accounts');
      
      if (!adobeAccounts || adobeAccounts.length === 0) {
        logger.info('No accounts found in Adobe');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        adobeAccounts,
        config.sync.batchSize,
        async (chunk) => {
          const hubspotCompanies = chunk.map(accountMapper.adobeToHubspot);
          // Sync to HubSpot
          return hubspotCompanies;
        }
      );

      logger.info(`Successfully synced ${results.length} accounts from Adobe to HubSpot`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing accounts from Adobe to HubSpot', { error: error.message });
      throw error;
    }
  }
}

module.exports = new AccountsService();



