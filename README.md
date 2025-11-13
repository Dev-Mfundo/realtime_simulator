# Project Summary
## Market Data API

### Setup
```
npm install       # Install dependencies
npm run dev       # Start development server - nodemon
npm test          # Run tests - jasmine + superset
npm start         # Start production server
npm run lint      # Runs lint
npm run format    # Prettify code
```

### Environment Variables (.env)
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

### Data
- history_data - acts as database
- Download CSV files from: https://forexsb.com/historical-forex-data
- Save each symbol in its own directory using the format below:

```
# e.g data for gold
/xauusd/
       ├── xauusd_1m.csv
       ├── xauusd_5m.csv
       ├── xauusd_15m.csv
       ├── xauusd_30m.csv
       ├── xauusd_1h.csv
       ├── xauusd_4h.csv
       └── xauusd_1d.csv
```
- The application will able to ready it if only saved in this format and structure style
- If you encounter a “Malformed line” error, re-download and rename the file.

- Supported Symbols
```
btcusd
gbpnzd
gbpjpy
gbpaud
us100
us30
usdjpy
usoil
xauusd
```

###  API - Endpoint
```
POST /api/market/v1/symbol
```

 - Request - POST
```
# e.g
{
  symbol: "xauusd",
  timeframe: "5m"
}

```
 - Response
```
[
  {
    "timestamp": "2024-07-26 12:00",
    "open": 67288.2,
    "high": 67964.7,
    "low": 66874.8,
    "close": 67530.9,
    "volume": 8
  },
  {
    "timestamp": "2024-07-26 12:05",
    "open": 67284.2,
    "high": 67965.7,
    "low": 66871.8,
    "close": 67531.9,
    "volume": 6
  },
  ...
]
```

- Usage
```
# Frontend
const apiKey = "your_secret_key";

fetch("https://domain-url/api/market/v1/symbol/price", {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: "xauusd",
    timeframe: "5m"
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("API error:", err));
// And yes there's axios also, don't forget the API KEY
```

## Notes
- Only requests with a valid x-api-key header will be authorized.
- Data must follow the naming and directory structure for the API to read it correctly.
- Rate limiting and security headers are applied via middleware.