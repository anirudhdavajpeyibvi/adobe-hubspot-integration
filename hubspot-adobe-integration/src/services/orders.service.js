const hubspotClient = require('../clients/hubspot.client');
const adobeClient = require('../clients/adobe.client');
const orderMapper = require('../mappers/order.mapper');
const logger = require('../utils/logger');
const { processInChunks } = require('../utils/chunk');
const config = require('../config/env');

class OrdersService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting orders sync from HubSpot to Adobe');
      
      // Fetch deals from HubSpot
      const hubspotDeals = await hubspotClient.get('/crm/v3/objects/deals');
      
      if (!hubspotDeals.results || hubspotDeals.results.length === 0) {
        logger.info('No deals found in HubSpot');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        hubspotDeals.results,
        config.sync.batchSize,
        async (chunk) => {
          const adobeOrders = chunk.map(orderMapper.hubspotToAdobe);
          // Sync to Adobe Commerce
          return adobeOrders;
        }
      );

      logger.info(`Successfully synced ${results.length} orders from HubSpot to Adobe`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing orders from HubSpot to Adobe', { error: error.message });
      throw error;
    }
  }

  async syncFromAdobeToHubspot() {
    try {
      logger.info('Starting orders sync from Adobe to HubSpot');
      
      // Fetch orders from Adobe Commerce
      const adobeOrders = await adobeClient.get('/V1/orders');
      
      if (!adobeOrders.items || adobeOrders.items.length === 0) {
        logger.info('No orders found in Adobe');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        adobeOrders.items,
        config.sync.batchSize,
        async (chunk) => {
          const hubspotDeals = chunk.map(orderMapper.adobeToHubspot);
          // Sync to HubSpot
          return hubspotDeals;
        }
      );

      logger.info(`Successfully synced ${results.length} orders from Adobe to HubSpot`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing orders from Adobe to HubSpot', { error: error.message });
      throw error;
    }
  }
}

module.exports = new OrdersService();



