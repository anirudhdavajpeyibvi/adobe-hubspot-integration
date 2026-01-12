import dotenv from "dotenv";
dotenv.config();

import { hubspot } from "../src/clients/hubspot.client.js";
import { safeBatchCreate } from "../src/utils/safeBatchUpsert.js";
import { createProperty } from "../src/utils/createProperty.js";
import logger from "../src/utils/logger.js";

/**
 * Create Sample Records Script
 * 
 * This script creates sample records in HubSpot:
 * - Contacts
 * - Companies
 * - Deals
 * - Products
 * - Custom Objects (Stores, Orders)
 * 
 * Run with: node scripts/createSampleRecords.js
 */

// ============================================================================
// Sample Contacts
// ============================================================================
const sampleContacts = [
  {
    email: "john.doe@example.com",
    firstname: "John",
    lastname: "Doe",
    company: "Acme Corporation",
    division: "ED",
    segment: "Distributor",
    store_name: "Acme Main Store",
    adobe_customer_id: "ADOBE-001",
    oracle_customer_id: "ORACLE-001",
    territory: "North",
  },
  {
    email: "jane.smith@example.com",
    firstname: "Jane",
    lastname: "Smith",
    company: "Tech Solutions Inc",
    division: "LSH",
    segment: "Contractor",
    store_name: "Tech Solutions Downtown",
    adobe_customer_id: "ADOBE-002",
    oracle_customer_id: "ORACLE-002",
    territory: "South",
  },
  {
    email: "bob.johnson@example.com",
    firstname: "Bob",
    lastname: "Johnson",
    company: "Design Co",
    division: "PLX",
    segment: "Designer",
    store_name: "Design Co Studio",
    adobe_customer_id: "ADOBE-003",
    oracle_customer_id: "ORACLE-003",
    territory: "East",
  },
];

// ============================================================================
// Sample Companies
// ============================================================================
const sampleCompanies = [
  {
    name: "Acme Corporation",
    account_type: "Distributor",
    division: "ED",
    adobe_account_id: "ADOBE-ACC-001",
    oracle_account_id: "ORACLE-ACC-001",
    credit_terms: "Net 30",
    domain: "acme.com",
  },
  {
    name: "Tech Solutions Inc",
    account_type: "Contractor",
    division: "LSH",
    adobe_account_id: "ADOBE-ACC-002",
    oracle_account_id: "ORACLE-ACC-002",
    credit_terms: "Net 60",
    domain: "techsolutions.com",
  },
  {
    name: "Design Co",
    account_type: "Rep Agency",
    division: "PLX",
    adobe_account_id: "ADOBE-ACC-003",
    oracle_account_id: "ORACLE-ACC-003",
    credit_terms: "Prepaid",
    domain: "designco.com",
  },
];

// ============================================================================
// Sample Products
// ============================================================================
const sampleProducts = [
  {
    name: "Widget Pro 1000",
    hs_sku: "WIDGET-PRO-1000",
    price: "299.99",
    incoming_qty: 50,
    incoming_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    qty_available: 25,
    uom: "EA",
    category_l1: "Electronics",
    category_l2: "Widgets",
    category_l3: "Professional",
    dnp: "false",
  },
  {
    name: "Gadget Max 2000",
    hs_sku: "GADGET-MAX-2000",
    price: "499.99",
    incoming_qty: 30,
    incoming_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    qty_available: 15,
    uom: "EA",
    category_l1: "Electronics",
    category_l2: "Gadgets",
    category_l3: "Premium",
    dnp: "false",
  },
  {
    name: "Tool Basic 500",
    hs_sku: "TOOL-BASIC-500",
    price: "99.99",
    incoming_qty: 100,
    incoming_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    qty_available: 50,
    uom: "EA",
    category_l1: "Tools",
    category_l2: "Basic",
    category_l3: "Standard",
    dnp: "false",
  },
];

// ============================================================================
// Deal Properties (to be created first)
// ============================================================================
const dealProperties = [
  {
    name: "adobe_order_number",
    label: "Adobe Order Number",
    type: "string",
    fieldType: "text",
  },
  {
    name: "oracle_order_number",
    label: "Oracle Order Number",
    type: "string",
    fieldType: "text",
  },
  {
    name: "adobe_account_id",
    label: "Adobe Account ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "adobe_customer_id",
    label: "Adobe Customer ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "invoice_number",
    label: "Invoice Number",
    type: "string",
    fieldType: "text",
  },
  {
    name: "total_amount_paid",
    label: "Total Amount Paid",
    type: "number",
    fieldType: "number",
  },
  {
    name: "order_status",
    label: "Order Status",
    type: "string",
    fieldType: "text",
  },
  {
    name: "payment_status",
    label: "Payment Status",
    type: "string",
    fieldType: "text",
  },
  {
    name: "order_date",
    label: "Order Date",
    type: "date",
    fieldType: "date",
  },
  {
    name: "invoice_date",
    label: "Invoice Date",
    type: "date",
    fieldType: "date",
  },
  {
    name: "payment_date",
    label: "Payment Date",
    type: "date",
    fieldType: "date",
  },
  {
    name: "created_by",
    label: "Created By",
    type: "string",
    fieldType: "text",
  },
  {
    name: "dnp",
    label: "Do Not Publish",
    type: "bool",
    fieldType: "booleancheckbox",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
];

// ============================================================================
// Sample Deals
// ============================================================================
const sampleDeals = [
  {
    dealname: "Order ADOBE-ORD-001",
    dealstage: "closedwon",
    amount: "2999.99",
    adobe_order_number: "ADOBE-ORD-001",
    oracle_order_number: "ORACLE-ORD-001",
    adobe_account_id: "ADOBE-ACC-001",
    adobe_customer_id: "ADOBE-001",
    invoice_number: "INV-001",
    total_amount_paid: "2999.99",
    order_status: "Completed",
    payment_status: "Paid",
    order_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoice_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_by: "system",
    dnp: "false",
  },
  {
    dealname: "Order ADOBE-ORD-002",
    dealstage: "qualifiedtobuy",
    amount: "1499.99",
    adobe_order_number: "ADOBE-ORD-002",
    oracle_order_number: "ORACLE-ORD-002",
    adobe_account_id: "ADOBE-ACC-002",
    adobe_customer_id: "ADOBE-002",
    invoice_number: "INV-002",
    total_amount_paid: "0",
    order_status: "Pending",
    payment_status: "Pending",
    order_date: new Date().toISOString().split('T')[0],
    invoice_date: null,
    payment_date: null,
    created_by: "system",
    dnp: "false",
  },
];

// ============================================================================
// Sample Custom Objects - Stores
// ============================================================================
const sampleStores = [
  {
    store_name: "Acme Main Store",
    store_id: "STORE-001",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
  },
  {
    store_name: "Tech Solutions Downtown",
    store_id: "STORE-002",
    address: "456 Tech Ave",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
  },
];

// ============================================================================
// Sample Custom Objects - Orders
// ============================================================================
const sampleOrders = [
  {
    adobe_order_number: "ADOBE-ORD-001",
    oracle_order_number: "ORACLE-ORD-001",
    store_id: "STORE-001",
    total_amount: "2999.99",
    order_status: "Completed",
    order_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    adobe_order_number: "ADOBE-ORD-002",
    oracle_order_number: "ORACLE-ORD-002",
    store_id: "STORE-002",
    total_amount: "1499.99",
    order_status: "Pending",
    order_date: new Date().toISOString().split('T')[0],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
async function createContacts() {
  logger.info("👤 Creating contacts...");
  const inputs = sampleContacts.map(contact => ({
    properties: contact,
  }));
  
  try {
    const results = await safeBatchCreate("contacts", inputs);
    logger.info(`✅ Created ${results.length} contacts`);
    return results;
  } catch (err) {
    logger.error("Failed to create contacts", { error: err.message });
    return [];
  }
}

async function createCompanies() {
  logger.info("🏢 Creating companies...");
  const inputs = sampleCompanies.map(company => ({
    properties: company,
  }));
  
  try {
    const results = await safeBatchCreate("companies", inputs);
    logger.info(`✅ Created ${results.length} companies`);
    return results;
  } catch (err) {
    logger.error("Failed to create companies", { error: err.message });
    return [];
  }
}

async function createProducts() {
  logger.info("📦 Creating products...");
  const inputs = sampleProducts.map(product => ({
    properties: product,
  }));
  
  try {
    const results = await safeBatchCreate("products", inputs);
    logger.info(`✅ Created ${results.length} products`);
    return results;
  } catch (err) {
    logger.error("Failed to create products", { error: err.message });
    return [];
  }
}

async function createDealProperties() {
  logger.info("🔧 Creating deal properties...");
  for (const property of dealProperties) {
    try {
      await createProperty("deals", "dealinformation", property);
    } catch (err) {
      // Property might already exist, continue
      if (!err.message.includes("does not exist")) {
        logger.warn(`⚠️ Could not create deal property: ${property.name}`, { error: err.message });
      }
    }
  }
}

async function createDeals() {
  logger.info("💰 Creating deals...");
  
  // First, try to create deals with all properties
  let inputs = sampleDeals.map(deal => ({
    properties: deal,
  }));
  
  try {
    const results = await safeBatchCreate("deals", inputs);
    logger.info(`✅ Created ${results.length} deals`);
    return results;
  } catch (err) {
    // If properties don't exist, create them and retry
    if (err.response?.data?.errors?.some(e => e.code === "PROPERTY_DOESNT_EXIST")) {
      logger.info("📝 Deal properties missing, creating them first...");
      await createDealProperties();
      // Wait a moment for properties to be available
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Retry creating deals
      try {
        const results = await safeBatchCreate("deals", inputs);
        logger.info(`✅ Created ${results.length} deals`);
        return results;
      } catch (retryErr) {
        // If still failing, create deals with only standard properties
        logger.warn("⚠️ Creating deals with standard properties only (custom properties may not be available yet)");
        inputs = sampleDeals.map(deal => ({
          properties: {
            dealname: deal.dealname,
            dealstage: deal.dealstage,
            amount: deal.amount,
          },
        }));
        try {
          const results = await safeBatchCreate("deals", inputs);
          logger.info(`✅ Created ${results.length} deals (with standard properties only)`);
          return results;
        } catch (finalErr) {
          logger.error("Failed to create deals", { error: finalErr.message });
          return [];
        }
      }
    } else {
      logger.error("Failed to create deals", { error: err.message });
      return [];
    }
  }
}

async function createStores() {
  logger.info("🏪 Creating stores (custom objects)...");
  const inputs = sampleStores.map(store => ({
    properties: store,
  }));
  
  try {
    // For custom objects, we need to use the object type ID format
    // First try with the name, if that fails, it means the object doesn't exist
    const results = await safeBatchCreate("stores", inputs);
    logger.info(`✅ Created ${results.length} stores`);
    return results;
  } catch (err) {
    if (err.response?.data?.message?.includes("Unable to infer object type")) {
      logger.warn("⚠️ Custom object 'stores' not found. Run setupHubspot.js first to create custom objects.", {
        error: err.response?.data?.message,
      });
    } else {
      logger.error("Failed to create stores", { error: err.message });
    }
    return [];
  }
}

async function createOrders() {
  logger.info("📋 Creating orders (custom objects)...");
  const inputs = sampleOrders.map(order => ({
    properties: order,
  }));
  
  try {
    const results = await safeBatchCreate("orders", inputs);
    logger.info(`✅ Created ${results.length} orders`);
    return results;
  } catch (err) {
    if (err.response?.data?.message?.includes("Unable to infer object type")) {
      logger.warn("⚠️ Custom object 'orders' not found. Run setupHubspot.js first to create custom objects.", {
        error: err.response?.data?.message,
      });
    } else {
      logger.error("Failed to create orders", { error: err.message });
    }
    return [];
  }
}

// ============================================================================
// Main Function
// ============================================================================
async function createSampleRecords() {
  logger.info("🚀 Starting sample records creation...");

  try {
    // Create records in order (companies first, then contacts, then deals)
    const companies = await createCompanies();
    const contacts = await createContacts();
    const products = await createProducts();
    
    // Create deals (will create properties if needed)
    const deals = await createDeals();
    
    // Custom objects - skip if they don't exist
    const stores = await createStores();
    const orders = await createOrders();

    logger.info("✅ Sample records creation completed!");
    logger.info("📋 Summary:");
    logger.info(`   - Companies: ${companies.length}`);
    logger.info(`   - Contacts: ${contacts.length}`);
    logger.info(`   - Products: ${products.length}`);
    logger.info(`   - Deals: ${deals.length}`);
    logger.info(`   - Stores: ${stores.length}`);
    logger.info(`   - Orders: ${orders.length}`);
    
    logger.info("\n💡 Tip: Check your HubSpot account to see the created records!");
  } catch (error) {
    logger.error("❌ Sample records creation failed", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Run the script
createSampleRecords();
