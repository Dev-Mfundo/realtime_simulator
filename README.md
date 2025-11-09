## Setup
```
npm install // install modules

npm run dev // development
npm test // runs test
npm start // producution ready
```

## Environmental viarables
- .env
```
PORT= which port your server will use
CORS_ORIGIN = domain that will have access to endpoints
API_KEY = secret key
```

## Data
- source: https://forexsb.com/historical-forex-data
- data csv format
- save data in a directory name accordingly
```
e.g data for gold
directory => xauusd // name 
csv file => xauusd_1m.csv // 1m interval data
         => xauusd_5m.csv // 5m interval data
         => xauusd_15m.csv // 15m interval data
         => xauusd_30m.csv // 30m interval data
         => xauusd_1h.csv // 1h interval data
         => xauusd_4h.csv // 4h interval data
         => xauusd_1d.csv // 1d interval data
```
- The application will able to ready it if only saved in this format and structure style
- In a case that there's errors of "Malformed line" re-download file from the source and rename again.

## API 
```
Endpoint: /api/market/v1/symbol/price
```
 
 - Request
```
// e.g
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
// Frontend
const apiKey = "api_key_here";

fetch("https://domain-url/api/market/v1/symbol/price", {
  method: 'GET',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  }
})
```