# Fulfillment Worker — SFTP → Shopify Sync (Print Royal)

A lightweight Node.js worker that polls an SFTP server for shipment CSV files from **Print Royal GmbH** and automatically creates Shopify fulfillments with tracking numbers.

## What It Does

1. Connects to the SFTP server every **60 minutes** (configurable)
2. Reads CSV files from `/from_print` — each file = one order
3. Parses the tracking number, Shopify order number, and shipping method
4. Finds the matching Shopify order via the Admin GraphQL API
5. Identifies the **open fulfillment order(s)** assigned to **Print Royal GmbH**
6. Creates a fulfillment with the tracking number and notifies the customer
7. Moves the CSV to `/processed_shopify_fullfilment` (success) or `/error_fullfilment` (failure)

## CSV Format

```csv
Sendungsnummer,Bestellnummer,Versandart
340434761032660401,#22188,DHL - National - PST
```

| Column | Maps To |
|---|---|
| `Sendungsnummer` | Tracking number |
| `Bestellnummer` | Shopify order name (e.g. `#22188`) |
| `Versandart` | Shipping carrier |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in all values — see below

# 3. Build TypeScript
npm run build

# 4. Run
npm start
```

## Development

```bash
npm run dev   # runs with tsx watch (auto-reload on changes)
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | Your `.myshopify.com` domain | Yes |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Shopify Admin API access token | Yes |
| `SHOPIFY_API_VERSION` | API version (default: `2025-04`) | No |
| `SFTP_HOST` | SFTP server hostname | Yes |
| `SFTP_PORT` | SFTP port (default: `22`) | No |
| `SFTP_USERNAME` | SFTP username | Yes |
| `SFTP_PASSWORD` | SFTP password | Yes |
| `SFTP_INCOMING_DIR` | CSV pickup directory (default: `/from_print`) | No |
| `SFTP_PROCESSED_DIR` | Success directory (default: `/processed_shopify_fullfilment`) | No |
| `SFTP_ERROR_DIR` | Error directory (default: `/error_fullfilment`) | No |
| `POD_LOCATION_NAME` | Shopify location name (default: `Print Royal GmbH`) | No |
| `POLL_INTERVAL_MINUTES` | Poll frequency in minutes (default: `60`) | No |

### Required Shopify Access Scopes

The Admin API token needs these scopes:

- `read_orders`
- `read_assigned_fulfillment_orders`
- `write_assigned_fulfillment_orders`

## Error Handling

| Scenario | Behavior |
|---|---|
| SFTP connection fails | Logs error, skips cycle, retries next interval |
| Invalid CSV format | Moves file to error directory |
| Order not found in Shopify | Moves file to error directory |
| No open Print Royal fulfillment orders | Moves file to error directory |
| Already fulfilled | Moves file to processed directory (skip) |
| Shopify API error | Moves file to error directory |

## Non-Scope

This worker does **not**:
- Generate outbound CSV files
- Export orders from Shopify
- Handle non-Print-Royal warehouse items
- Interfere with TM3 or other fulfillment flows
- Provide a dashboard or UI
