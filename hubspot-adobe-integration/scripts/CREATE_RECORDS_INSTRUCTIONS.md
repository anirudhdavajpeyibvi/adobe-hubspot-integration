# Create Sample Records Instructions

This guide will help you create sample records (contacts, companies, deals, products) in HubSpot.

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **HubSpot API Key** (Personal Access Token)
3. **Environment variables** configured in `.env` file
4. **Properties and Custom Objects** already created (run `setupHubspot.js` first)

## Step 1: Configure Environment Variables

Make sure your `.env` file is set up with your HubSpot API key:

```env
HUBSPOT_API_KEY=your_hubspot_api_key_here
HUBSPOT_BASE_URL=https://api.hubapi.com
```

## Step 2: Run Setup Script First (If Not Done)

Before creating records, make sure all properties and custom objects are created:

```bash
node scripts/setupHubspot.js
```

This ensures all required properties exist before creating records.

## Step 3: Create Sample Records

Run the sample records creation script:

```bash
node scripts/createSampleRecords.js
```

## What This Script Creates

The script creates the following sample records:

### Contacts (3 records)
- John Doe (john.doe@example.com) - Acme Corporation
- Jane Smith (jane.smith@example.com) - Tech Solutions Inc
- Bob Johnson (bob.johnson@example.com) - Design Co

### Companies (3 records)
- Acme Corporation
- Tech Solutions Inc
- Design Co

### Products (3 records)
- Widget Pro 1000 ($299.99)
- Gadget Max 2000 ($499.99)
- Tool Basic 500 ($99.99)

### Deals (2 records)
- Order ADOBE-ORD-001 ($2,999.99) - Closed Won
- Order ADOBE-ORD-002 ($1,499.99) - Qualified to Buy

### Custom Objects
- Stores (2 records)
- Orders (2 records)

## Expected Output

```
info: 🚀 Starting sample records creation...
info: 🏢 Creating companies...
info: ✅ Created 3 companies
info: 👤 Creating contacts...
info: ✅ Created 3 contacts
info: 📦 Creating products...
info: ✅ Created 3 products
info: 💰 Creating deals...
info: ✅ Created 2 deals
info: 🏪 Creating stores (custom objects)...
info: ✅ Created 2 stores
info: 📋 Creating orders (custom objects)...
info: ✅ Created 2 orders
info: ✅ Sample records creation completed!
info: 📋 Summary:
info:    - Companies: 3
info:    - Contacts: 3
info:    - Products: 3
info:    - Deals: 2
info:    - Stores: 2
info:    - Orders: 2
```

## Customizing Sample Data

To create your own records, edit `scripts/createSampleRecords.js` and modify the sample data arrays:

- `sampleContacts` - Add/modify contact records
- `sampleCompanies` - Add/modify company records
- `sampleProducts` - Add/modify product records
- `sampleDeals` - Add/modify deal records
- `sampleStores` - Add/modify store records
- `sampleOrders` - Add/modify order records

## Troubleshooting

### Error: Property does not exist
- Make sure you've run `setupHubspot.js` first to create all properties
- Check that property names match exactly (case-sensitive)

### Error: Custom object does not exist
- Run `setupHubspot.js` to create custom objects first
- The script will warn but continue if custom objects don't exist

### Error: Duplicate records
- The script uses `batch/upsert` which will update existing records if they match
- Records are matched by email (contacts), domain (companies), SKU (products), etc.

### Error: Rate limit exceeded
- HubSpot has rate limits. The script includes retry logic
- If you hit limits, wait a few minutes and run again

## Verification

After running the script, verify in HubSpot:

1. **Contacts**: Go to Contacts → All contacts
2. **Companies**: Go to Contacts → Companies
3. **Deals**: Go to Sales → Deals
4. **Products**: Go to Sales → Products
5. **Custom Objects**: Go to Settings → Objects → Stores/Orders

## Creating Your Own Records

To create records programmatically, you can use the helper functions:

```javascript
import { safeBatchUpsert } from "../src/utils/safeBatchUpsert.js";

// Create contacts
const contacts = [
  {
    email: "new@example.com",
    firstname: "New",
    lastname: "Contact",
    // ... other properties
  }
];

const inputs = contacts.map(contact => ({ properties: contact }));
await safeBatchUpsert("contacts", inputs);
```

## Support

If you encounter issues:
1. Check the logs in `logs/combined.log` and `logs/error.log`
2. Verify your API key permissions
3. Ensure all properties exist before creating records
