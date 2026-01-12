const hubspotClient = require('../clients/hubspot.client');
const adobeClient = require('../clients/adobe.client');
const contactMapper = require('../mappers/contact.mapper');
const logger = require('../utils/logger');
const { processInChunks } = require('../utils/chunk');
const config = require('../config/env');

class ContactsService {
  async syncFromHubspotToAdobe() {
    try {
      logger.info('Starting contacts sync from HubSpot to Adobe');
      
      // Fetch contacts from HubSpot
      const hubspotContacts = await hubspotClient.get('/crm/v3/objects/contacts');
      
      if (!hubspotContacts.results || hubspotContacts.results.length === 0) {
        logger.info('No contacts found in HubSpot');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        hubspotContacts.results,
        config.sync.batchSize,
        async (chunk) => {
          const adobeCustomers = chunk.map(contactMapper.hubspotToAdobe);
          // Sync to Adobe Commerce
          // Implementation depends on Adobe Commerce API structure
          return adobeCustomers;
        }
      );

      logger.info(`Successfully synced ${results.length} contacts from HubSpot to Adobe`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing contacts from HubSpot to Adobe', { error: error.message });
      throw error;
    }
  }

  async syncFromAdobeToHubspot() {
    try {
      logger.info('Starting contacts sync from Adobe to HubSpot');
      
      // Fetch customers from Adobe Commerce
      const adobeCustomers = await adobeClient.get('/V1/customers/search');
      
      if (!adobeCustomers.items || adobeCustomers.items.length === 0) {
        logger.info('No customers found in Adobe');
        return { synced: 0 };
      }

      // Process in chunks
      const results = await processInChunks(
        adobeCustomers.items,
        config.sync.batchSize,
        async (chunk) => {
          const hubspotContacts = chunk.map(contactMapper.adobeToHubspot);
          // Sync to HubSpot
          // Implementation depends on HubSpot API structure
          return hubspotContacts;
        }
      );

      logger.info(`Successfully synced ${results.length} contacts from Adobe to HubSpot`);
      return { synced: results.length };
    } catch (error) {
      logger.error('Error syncing contacts from Adobe to HubSpot', { error: error.message });
      throw error;
    }
  }
}

module.exports = new ContactsService();



