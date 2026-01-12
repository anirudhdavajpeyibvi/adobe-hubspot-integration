# HubSpot-Adobe Integration - Complete Setup & Run Guide

## 📋 What This Project Does

This is a **data synchronization service** that bridges **HubSpot CRM** and **Adobe Commerce (Magento)** platforms. It automatically keeps customer data, orders, products, and other business information synchronized between both systems.

### Key Functionality:

1. **Bidirectional Data Sync**: Syncs data from Adobe Commerce → HubSpot CRM
   - **Contacts** (customers)
   - **Companies** (business accounts)
   - **Products**
   - **Orders**
   - **Stores**
   - **Users**
   - **Items** (order line items)

2. **Automatic Relationships**: Creates associations between entities:
   - Contacts ↔ Companies
   - Contacts ↔ Stores
   - Companies ↔ Stores
   - Orders ↔ Companies
   - Orders ↔ Contacts

3. **Scheduled Synchronization**: Runs nightly sync jobs automatically (configurable via cron schedule)

4. **Data Transformation**: Maps Adobe Commerce data format to HubSpot CRM format using custom mappers

5. **Error Handling**: Includes retry mechanisms, rate limiting, and comprehensive logging

## 🎯 Why This Project Exists

**Business Problem**: Companies using both HubSpot (for CRM/marketing) and Adobe Commerce (for e-commerce) need to keep customer data synchronized. Without this integration:
- Customer data becomes inconsistent between platforms
- Sales teams can't see purchase history in CRM
- Marketing campaigns can't target customers based on purchase behavior
- Manual data entry is required, leading to errors and inefficiency

**Solution**: This service automates the synchronization process, ensuring:
- ✅ Single source of truth for customer data
- ✅ Real-time visibility of e-commerce data in CRM
- ✅ Better customer segmentation and targeting
- ✅ Reduced manual work and data entry errors
- ✅ Automated nightly sync keeps data fresh

## 🚀 Step-by-Step Setup Instructions

### Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) installed
- **npm** (Node Package Manager) installed
- **HubSpot API Key** (from your HubSpot account)
- **Adobe Commerce API Credentials** (API Key, Secret, Base URL, Access Token URL)

### Step 1: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd hubspot-adobe-integration
npm install
```

This installs:
- `express` - Web server framework
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable management
- `node-cron` - Scheduled job execution
- `winston` - Logging
- `joi` - Data validation
- `bottleneck` - Rate limiting
- `axios-retry` - Automatic retry logic

### Step 2: Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   copy env.example .env
   ```
   (On Linux/Mac: `cp env.example .env`)

2. **Open `.env` file** and fill in your actual credentials:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # HubSpot Configuration
   HUBSPOT_API_KEY=your_actual_hubspot_api_key
   HUBSPOT_BASE_URL=https://api.hubapi.com

   # Adobe Configuration
   ADOBE_API_KEY=your_actual_adobe_api_key
   ADOBE_API_SECRET=your_actual_adobe_api_secret
   ADOBE_BASE_URL=https://your-instance.commercecloud.salesforce.com
   ADOBE_ACCESS_TOKEN_URL=https://your-instance.commercecloud.salesforce.com/ccadmin/v1/oauth/token

   # Sync Configuration (optional - defaults shown)
   SYNC_BATCH_SIZE=100
   SYNC_RETRY_ATTEMPTS=3
   SYNC_RETRY_DELAY=1000

   # Cron Schedule (optional - defaults to 2 AM daily)
   NIGHTLY_SYNC_SCHEDULE=0 2 * * *
   ```

   **Where to get credentials:**
   - **HubSpot API Key**: HubSpot Account → Settings → Integrations → Private Apps → Create App → Copy API Key
   - **Adobe Credentials**: Adobe Commerce Admin → System → Integrations → Create Integration → Copy credentials

### Step 3: Set Up HubSpot Custom Properties (One-Time Setup)

Before running syncs, you need to create custom properties in HubSpot to store Adobe-specific data:

```bash
# Create contact properties
node scripts/createContactProperties.js

# Create company properties
node scripts/createCompanyProperties.js

# Create product properties
node scripts/createProductProperties.js

# Create custom objects (if needed)
node scripts/createCustomObjects.js
```

**Why?** HubSpot needs custom fields to store Adobe-specific IDs and data (like `adobe_customer_id`, `store_name`, etc.). These scripts create those fields automatically.

### Step 4: Verify Configuration

Check that your `.env` file is properly configured:

```bash
# On Windows PowerShell
Get-Content .env

# On Linux/Mac
cat .env
```

Ensure all required values are filled (not left as placeholders).

### Step 5: Start the Server

**For Production:**
```bash
npm start
```

**For Development (with auto-reload):**
```bash
npm run dev
```

You should see output like:
```
Server running on port 3000
Nightly sync scheduled: 0 2 * * *
```

### Step 6: Verify Server is Running

Open your browser or use curl:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "hubspot-adobe-integration"
}
```

## 🔄 How It Works

### Architecture Flow:

```
Adobe Commerce API
       ↓
[Adobe Client] → Fetches data (customers, orders, products)
       ↓
[Mapper] → Transforms Adobe format → HubSpot format
       ↓
[Validator] → Validates data structure
       ↓
[HubSpot Client] → Creates/Updates records in HubSpot
       ↓
[Association Service] → Links related records (contacts↔companies, etc.)
```

### Sync Process:

1. **Nightly Sync Job** (runs automatically at scheduled time):
   - Syncs Companies from Adobe → HubSpot
   - Syncs Contacts from Adobe → HubSpot
   - Syncs Stores from Adobe → HubSpot
   - Creates associations between contacts, companies, and stores
   - Syncs Products from Adobe → HubSpot
   - Syncs Orders from Adobe → HubSpot
   - Creates associations between orders, companies, and contacts

2. **Data Processing**:
   - Data is fetched from Adobe Commerce API
   - Transformed using mappers to match HubSpot schema
   - Validated using Joi schemas
   - Processed in batches (configurable batch size)
   - Upserted to HubSpot (creates new or updates existing)

3. **Error Handling**:
   - Automatic retries with exponential backoff
   - Rate limiting to respect API limits
   - Comprehensive logging for debugging

## 📁 Project Structure Explained

```
hubspot-adobe-integration/
├── src/
│   ├── config/          # Configuration files (env.js, hubspot.js, adobe.js)
│   ├── clients/         # API clients for HubSpot and Adobe
│   ├── services/        # Business logic for syncing entities
│   ├── mappers/         # Data transformation between formats
│   ├── jobs/            # Scheduled sync jobs (nightlySync, syncContacts, etc.)
│   ├── associations/    # Creates relationships between HubSpot objects
│   ├── validators/      # Data validation schemas
│   ├── utils/           # Helper functions (logger, chunking, retry)
│   ├── routes/          # API endpoints (health check)
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point with cron scheduling
├── scripts/             # One-time setup scripts for HubSpot properties
├── logs/                # Application logs
├── .env                 # Your environment variables (create from env.example)
├── env.example          # Example environment file
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration Options

### Environment Variables Explained:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `HUBSPOT_API_KEY` | **Yes** | - | HubSpot API authentication key |
| `HUBSPOT_BASE_URL` | No | https://api.hubapi.com | HubSpot API base URL |
| `ADOBE_API_KEY` | **Yes** | - | Adobe Commerce API key |
| `ADOBE_API_SECRET` | **Yes** | - | Adobe Commerce API secret |
| `ADOBE_BASE_URL` | **Yes** | - | Adobe Commerce instance URL |
| `ADOBE_ACCESS_TOKEN_URL` | **Yes** | - | Adobe OAuth token endpoint |
| `SYNC_BATCH_SIZE` | No | 100 | Number of records per batch |
| `SYNC_RETRY_ATTEMPTS` | No | 3 | Number of retry attempts on failure |
| `SYNC_RETRY_DELAY` | No | 1000 | Delay between retries (ms) |
| `NIGHTLY_SYNC_SCHEDULE` | No | 0 2 * * * | Cron schedule (2 AM daily) |

### Cron Schedule Format:
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Examples:
- `0 2 * * *` - Every day at 2:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Every Sunday at midnight

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot find module" errors**
   - Run `npm install` again
   - Check Node.js version: `node --version` (should be v14+)

2. **API Authentication errors**
   - Verify API keys in `.env` file
   - Check API key permissions in HubSpot/Adobe
   - Ensure `.env` file is in project root

3. **Sync not running**
   - Check server logs in `logs/` directory
   - Verify cron schedule format
   - Check server is running: `npm start`

4. **Rate limiting errors**
   - Adjust `SYNC_BATCH_SIZE` to smaller value
   - Increase delays between requests

5. **Missing properties in HubSpot**
   - Run setup scripts: `node scripts/createContactProperties.js`
   - Check HubSpot account permissions

## 📊 Monitoring

- **Logs**: Check `logs/combined.log` and `logs/error.log`
- **Health Check**: `GET http://localhost:3000/api/health`
- **Server Status**: Check console output for sync job status

## 🔐 Security Notes

- **Never commit `.env` file** to version control
- Keep API keys secure and rotate them periodically
- Use environment-specific `.env` files for different environments
- Review API key permissions regularly

## 📝 Next Steps

After setup:
1. Monitor first sync job execution
2. Verify data in HubSpot CRM
3. Adjust sync schedule if needed
4. Configure additional mappings if required
5. Set up monitoring/alerting for production

---

**Need Help?** Check the logs directory for detailed error messages and sync status.
