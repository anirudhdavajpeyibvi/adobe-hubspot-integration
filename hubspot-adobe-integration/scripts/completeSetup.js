import dotenv from "dotenv";
dotenv.config();

import { hubspot } from "../src/clients/hubspot.client.js";
import { createProperty } from "../src/utils/createProperty.js";
import { safeBatchCreate } from "../src/utils/safeBatchUpsert.js";
import logger from "../src/utils/logger.js";

/**
 * Complete HubSpot Setup Script
 * 
 * This script does EVERYTHING in one go:
 * 1. Creates Custom Objects (Stores, Orders)
 * 2. Creates all Properties (Contacts, Companies, Products, Deals)
 * 3. Creates Sample Records (Contacts, Companies, Products, Deals)
 * 
 * Run with: node scripts/completeSetup.js
 */

// ============================================================================
// STEP 1: Custom Objects
// ============================================================================
const customObjects = [
  {
    name: "stores",
    labels: { singular: "Store", plural: "Stores" },
    primaryDisplayProperty: "store_name",
    requiredProperties: ["store_name", "store_id"],
  },
  {
    name: "orders",
    labels: { singular: "Order", plural: "Orders" },
    primaryDisplayProperty: "adobe_order_number",
    requiredProperties: ["adobe_order_number"],
  },
];

// ============================================================================
// STEP 2: Contact Properties
// ============================================================================
const contactProperties = [
  {
    name: "division",
    label: "Division",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "ED", value: "ED" },
      { label: "LSH", value: "LSH" },
      { label: "PLX", value: "PLX" },
      { label: "DIY", value: "DIY" },
      { label: "HOME", value: "HOME" },
    ],
  },
  {
    name: "segment",
    label: "Segment",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "Distributor", value: "Distributor" },
      { label: "Contractor", value: "Contractor" },
      { label: "Designer", value: "Designer" },
    ],
  },
  {
    name: "store_name",
    label: "Store Name",
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
    name: "oracle_customer_id",
    label: "Oracle Customer ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "territory",
    label: "Territory",
    type: "string",
    fieldType: "text",
  },
];

// ============================================================================
// STEP 3: Company Properties
// ============================================================================
const companyProperties = [
  {
    name: "account_type",
    label: "Account Type",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "Distributor", value: "Distributor" },
      { label: "Rep Agency", value: "Rep Agency" },
      { label: "Contractor", value: "Contractor" },
    ],
  },
  {
    name: "division",
    label: "Division",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "ED", value: "ED" },
      { label: "LSH", value: "LSH" },
      { label: "PLX", value: "PLX" },
      { label: "DIY", value: "DIY" },
      { label: "HOME", value: "HOME" },
    ],
  },
  {
    name: "adobe_account_id",
    label: "Adobe Account ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "oracle_account_id",
    label: "Oracle Account ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "credit_terms",
    label: "Credit Terms",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "Net 30", value: "Net 30" },
      { label: "Net 60", value: "Net 60" },
      { label: "Prepaid", value: "Prepaid" },
    ],
  },
];

// ============================================================================
// STEP 4: Product Properties
// ============================================================================
const productProperties = [
  { name: "incoming_qty", label: "Incoming Quantity", type: "number", fieldType: "number" },
  { name: "incoming_date", label: "Incoming Date", type: "date", fieldType: "date" },
  { name: "qty_available", label: "Quantity Available", type: "number", fieldType: "number" },
  { name: "uom", label: "Unit of Measure", type: "string", fieldType: "text" },
  { name: "category_l1", label: "Category Level 1", type: "string", fieldType: "text" },
  { name: "category_l2", label: "Category Level 2", type: "string", fieldType: "text" },
  { name: "category_l3", label: "Category Level 3", type: "string", fieldType: "text" },
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
// STEP 5: Deal Properties
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
// STEP 6: Sample Records
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
// Main Setup Function
// ============================================================================
async function completeSetup() {
  logger.info("🚀 Starting complete HubSpot setup...");

  try {
    // Step 1: Create Custom Objects
    logger.info("📦 Step 1/6: Creating custom objects...");
    for (const obj of customObjects) {
      try {
        await hubspot.post("/crm/v3/schemas", obj);
        logger.info(`✅ Created custom object: ${obj.name}`, { objectName: obj.name });
      } catch (err) {
        if (err.response?.status === 409 || err.response?.status === 400) {
          logger.info(`⚠️ Custom object already exists: ${obj.name}`, { objectName: obj.name });
        } else {
          logger.warn(`⚠️ Could not create custom object: ${obj.name}`, {
            objectName: obj.name,
            error: err.response?.data?.message || err.message,
          });
        }
      }
    }

    // Step 2: Create Contact Properties
    logger.info("👤 Step 2/6: Creating contact properties...");
    for (const property of contactProperties) {
      await createProperty("contacts", "contactinformation", property);
    }

    // Step 3: Create Company Properties
    logger.info("🏢 Step 3/6: Creating company properties...");
    for (const property of companyProperties) {
      await createProperty("companies", "companyinformation", property);
    }

    // Step 4: Create Product Properties
    logger.info("📦 Step 4/6: Creating product properties...");
    for (const property of productProperties) {
      await createProperty("products", "productinformation", property);
    }

    // Step 5: Create Deal Properties
    logger.info("💰 Step 5/6: Creating deal properties...");
    for (const property of dealProperties) {
      await createProperty("deals", "dealinformation", property);
    }

    // Wait a moment for properties to be available
    logger.info("⏳ Waiting for properties to be available...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 6: Create Sample Records
    logger.info("📝 Step 6/6: Creating sample records...");
    
    // Create Companies
    logger.info("🏢 Creating companies...");
    const companiesInput = sampleCompanies.map(company => ({ properties: company }));
    const companies = await safeBatchCreate("companies", companiesInput);
    logger.info(`✅ Created ${companies.length} companies`);

    // Create Contacts
    logger.info("👤 Creating contacts...");
    const contactsInput = sampleContacts.map(contact => ({ properties: contact }));
    const contacts = await safeBatchCreate("contacts", contactsInput);
    logger.info(`✅ Created ${contacts.length} contacts`);

    // Create Products
    logger.info("📦 Creating products...");
    const productsInput = sampleProducts.map(product => ({ properties: product }));
    const products = await safeBatchCreate("products", productsInput);
    logger.info(`✅ Created ${products.length} products`);

    // Create Deals
    logger.info("💰 Creating deals...");
    const dealsInput = sampleDeals.map(deal => ({ properties: deal }));
    try {
      const deals = await safeBatchCreate("deals", dealsInput);
      logger.info(`✅ Created ${deals.length} deals`);
    } catch (err) {
      logger.warn("⚠️ Some deals may have failed. Check logs for details.", { error: err.message });
    }

    logger.info("✅ Complete HubSpot setup finished!");
    logger.info("📋 Summary:");
    logger.info(`   - Custom Objects: ${customObjects.length}`);
    logger.info(`   - Contact Properties: ${contactProperties.length}`);
    logger.info(`   - Company Properties: ${companyProperties.length}`);
    logger.info(`   - Product Properties: ${productProperties.length}`);
    logger.info(`   - Deal Properties: ${dealProperties.length}`);
    logger.info(`   - Sample Companies: ${companies.length}`);
    logger.info(`   - Sample Contacts: ${contacts.length}`);
    logger.info(`   - Sample Products: ${products.length}`);
    logger.info("\n💡 Tip: Check your HubSpot account to see all created items!");
  } catch (error) {
    logger.error("❌ Complete setup failed", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Run the setup
completeSetup();
