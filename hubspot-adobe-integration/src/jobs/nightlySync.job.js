import { syncCompanies } from "./syncCompanies.job.js";
import { syncContacts } from "./syncContacts.job.js";
import { syncStores } from "./syncStores.job.js";
import { syncProducts } from "./syncProducts.job.js";
import { syncOrders } from "./syncOrders.job.js";
import logger from "../utils/logger.js";

import {
  associateContactsToCompanies,
  associateContactsToStores,
  associateCompaniesToStores,
  associateOrdersToCompanies,
  associateOrdersToContacts,
} from "../associations/index.js";

export const nightlySync = async () => {
  try {
    logger.info("🌙 Nightly sync started");

    const companies = await syncCompanies();
    const contacts = await syncContacts();
    const stores = await syncStores();
  
    await associateContactsToCompanies(contacts, companies);
    await associateContactsToStores(contacts, stores);
    await associateCompaniesToStores(stores, companies);
  
    await syncProducts();
  
    const orders = await syncOrders();
    await associateOrdersToCompanies(orders, companies);
    await associateOrdersToContacts(orders, contacts);
  
    logger.info("✅ Nightly sync completed");
  } catch (err) {
    logger.error("🔥 Nightly sync crashed", {
      error: err.message,
      stack: err.stack,
    });
    throw err;
  }
};

