# HubSpot-Adobe Integration

A Node.js service for synchronizing data between HubSpot CRM and Adobe Commerce (Magento).

## Features

- Bidirectional sync between HubSpot and Adobe Commerce
- Support for Contacts, Accounts, Orders, Items, Stores, and Users
- Scheduled nightly synchronization
- Retry mechanism for failed operations
- Chunked processing for large datasets
- Comprehensive logging

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env` file and configure your API keys
4. Start the server:
   ```bash
   npm start
   ```

## Configuration

Update the `.env` file with your HubSpot and Adobe Commerce API credentials.

## Project Structure

- `src/config/` - Configuration files for environment variables and API clients
- `src/clients/` - API client implementations for HubSpot and Adobe
- `src/services/` - Business logic for syncing different entities
- `src/mappers/` - Data transformation between HubSpot and Adobe formats
- `src/jobs/` - Scheduled synchronization jobs
- `src/utils/` - Utility functions (logger, chunking, retry)
- `src/routes/` - API routes

## Usage

The service runs scheduled jobs automatically. You can also trigger manual syncs via the API endpoints.

## License

ISC



