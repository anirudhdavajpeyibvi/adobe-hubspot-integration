import { hubspot } from '../clients/hubspot.client.js';
import { adobe } from '../clients/adobe.client.js';
import * as itemMapper from '../mappers/item.mapper.js';
import logger from '../utils/logger.js';
import { processInChunks } from '../utils/chunk.js';
import config from '../config/env.js';

class ItemsService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting items sync from HubSpot to Adobe');
      
      // Fetch products from HubSpot
      const hubspotProducts = await hubspot.get('/crm/v3/objects/products');
      
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
      const adobeProducts = await adobe.get('/V1/products');
      
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

export default new ItemsService();



