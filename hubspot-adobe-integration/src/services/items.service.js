const hubspotClient = require('../clients/hubspot.client');
const adobeClient = require('../clients/adobe.client');
const itemMapper = require('../mappers/item.mapper');
const logger = require('../utils/logger');
const { processInChunks } = require('../utils/chunk');
const config = require('../config/env');

class ItemsService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting items sync from HubSpot to Adobe');
      
      // Fetch products from HubSpot
      const hubspotProducts = await hubspotClient.get('/crm/v3/objects/products');
      
      if (!hubspotProducts.results || hubspotProducts.results.length === 0) {
        logger.info('No products found in HubSpot');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        hubspotProducts.results,
        config.sync.batchSize,
        async (chunk) => {
          const adobeProducts = chunk.map(itemMapper.hubspotToAdobe);
          // Sync to Adobe Commerce
          return adobeProducts;
        }
      );

      logger.info(`Successfully synced ${results.length} items from HubSpot to Adobe`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing items from HubSpot to Adobe', { error: error.message });
      throw error;
    }
  }

  async syncFromAdobeToHubspot() {
    try {
      logger.info('Starting items sync from Adobe to HubSpot');
      
      // Fetch products from Adobe Commerce
      const adobeProducts = await adobeClient.get('/V1/products');
      
      if (!adobeProducts.items || adobeProducts.items.length === 0) {
        logger.info('No products found in Adobe');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        adobeProducts.items,
        config.sync.batchSize,
        async (chunk) => {
          const hubspotProducts = chunk.map(itemMapper.adobeToHubspot);
          // Sync to HubSpot
          return hubspotProducts;
        }
      );

      logger.info(`Successfully synced ${results.length} items from Adobe to HubSpot`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing items from Adobe to HubSpot', { error: error.message });
      throw error;
    }
  }
}

module.exports = new ItemsService();



