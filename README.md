# Project Summary {STILL IN DEVELOPMENT BUT FUNCTIONAL}
## Market Data API Endpoints 

## Project Purpose

- This project is primarily designed to run locally in a container to simulate real market data endpoints for development purposes. 
- Most market data APIs are either paid or have limited free tiers. By using this project, developers can have **unlimited access to market data** while working in a development environment.
### Important Notes

- These endpoints are **not intended for production use**, as most of the data is historical.  
- If your data source is legitimate, the historical data provided here will match the data available from any forex exchange.  

### Verified Historical Data Source

- [https://forexsb.com/historical-forex-data](https://forexsb.com/historical-forex-data)

### Uses

- Build a market scanner to analyze and predict future prices.  
- Create a backtesting application for retail traders.  
- Develop a trading bot to simulate strategies.  

Once your application is ready, you can then integrate data from paid API providers for production use.


- This API provides endpoints for managing and querying market symbol price data with basic authentication protection.

# Setup
```
npm install       # Install dependencies
npm run dev       # Start development server - nodemon
npm test          # Run tests
npm start         # Start production server
npm run lint      # Runs lint
npm run format    # Prettify code
```

## Environment Variables (.env)
- Create a .env file in the root directory with the following keys:
```
PORT=xxxx
POSTGRES_HOST=xxxx
POSTGRES_USER=xxxx
POSTGRES_PASSWORD=xxxx
POSTGRES_DB=xxxxx
POSTGRES_PORT=5432
CORS_ORIGIN=https://frontend-domain
API_KEY=xxxx
```


##  API - Endpoint
### Authentication
- All endpoints require API key authentication via the keyAuth middleware. Include your API key in the request headers.

# API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| DELETE | `/api/market/v1/symbol/deleteBySymbol` | Delete all price data for a specific symbol |
| DELETE | `/api/market/v1/symbol/deleteBySymbolAndTimeframe` | Delete price data for a specific symbol and timeframe |
| POST   | `/api/market/v1/symbol/query/range` | Retrieve price data for a symbol within a specific time range |
| GET    | `/api/market/v1/symbol/allSymbols` | Retrieve all available symbols |
| POST   | `/api/market/v1/symbol/query` | Retrieve price data for a specific symbol (latest or filtered by criteria) |


1. Delete Symbol Data
DELETE api/market/v1/symbol/deleteBySymbol
Delete all price data for a specific symbol.
```
Request Body:

json
{
  "symbol": "BTCUSDT"
}
Response: Success confirmation message
```
2. Delete Symbol Data by Timeframe
DELETE api/market/v1/symbol/deleteBySymbolAndTimeframe
Delete price data for a specific symbol and timeframe.
```
Request Body:

json
{
  "symbol": "BTCUSDT",
  "timeframe": 60
}
Response: Success confirmation message
```
3. Get Prices in Range
POST api/market/v1/symbol/query/range
Retrieve price data for a symbol within a specific time range.
```
Request Body:

json
{
  "symbol": "BTCUSDT",
  "startTime": "2023-01-01T00:00:00Z",
  "endTime": "2023-01-31T23:59:59Z",
  "timeframe": 60
}
Response:

json
{
  "symbol": "BTCUSDT",
  "timeframe": 60,
  "prices": [
    {
      "timestamp": "2023-01-01T00:00:00Z",
      "open": 16500.00,
      "high": 16600.00,
      "low": 16450.00,
      "close": 16575.00,
      "volume": 1250.50
    }
    // ... more price data
  ]
}
```
4. Get All Symbols
GET api/market/v1/symbol/allSymbols
Retrieve a list of all available symbols in the system.
```
Request Parameters: None

Response:

json
{
  "symbols": ["BTCUSDT", "ETHUSDT", "ADAUSDT", "SOLUSDT"]
}
```
5. Get Symbol Data
POST api/market/v1/symbol/query
Retrieve price data for a specific symbol (latest or by criteria).
```
Request Body:

json
{
  "symbol": "BTCUSDT",
  "limit": 100,
  "timeframe": 60
}
Response:

json
{
  "symbol": "BTCUSDT",
  "timeframe": 60,
  "data": [
    {
      "timestamp": "2023-12-01T00:00:00Z",
      "open": 16500.00,
      "high": 16600.00,
      "low": 16450.00,
      "close": 16575.00,
      "volume": 1250.50
    }
    // ... more price candles
  ]
}
```
Usage Examples
cURL Examples
Get All Symbols:
```
bash
curl -X GET "http://site/api/market/v1/symbol/allSymbols" \
  -H "X-API-Key: your-api-key-here"
```
Get Prices in Range:
```
bash
curl -X POST "http://site/api/market/v1/symbol/query/range" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "symbol": "BTCUSDT",
    "startTime": "2023-01-01T00:00:00Z",
    "endTime": "2023-01-02T00:00:00Z",
    "timeframe": 60
  }'
```
Notes

- Symbols should be in uppercase (e.g., "BTCUSDT"). Not Strict

- Common timeframes: 1, 5, 15, 30, 60, 120, 240, 1440

- Delete operations are permanent and cannot be undone

## Error Responses
### All endpoints return standard HTTP status codes:
```
200: Success

400: Bad Request (invalid parameters)

401: Unauthorized (invalid/missing API key)

404: Not Found (symbol not found) / unknown endpoints

500: Internal Server Error
```
### Typical response
```
{
	success: boolean,
	content: array
}
or
{
	success: boolean,
	error: message
}
```