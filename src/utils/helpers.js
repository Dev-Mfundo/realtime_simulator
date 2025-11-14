const {pool} = require('./configuration')

const validateSymbol = (symbol) => {
  if (!symbol || symbol.length === 0) {
    throw new Error("Symbol input missing!");
  }
  if (typeof symbol !== "string") {
    throw new Error("Symbol input should be a string");
  }
  symbol = symbol.toLowerCase();
  if (!/^[a-z0-9]+$/.test(symbol)) {
    throw new Error(
      "Symbol can only consist of alphanumeric characters and with no spaces",
    );
  }
  return symbol;
};

const validateTimeframe = (timeframe) => {
  const allowedTimeframe = [1, 5, 15, 30, 60, 120, 240, 1440];
  if (!timeframe) {
    throw new Error("Timeframe input missing");
  }
  if (typeof timeframe !== "string") {
    throw new Error("Timeframe input should be a string");
  }
  timeframe=parseInt(timeframe)
  if (!/^[0-9]+$/.test(timeframe) || !allowedTimeframe.includes(timeframe)) {
    throw new Error(
      `Invalid timeframe: allowed timeframe inputs ${allowedTimeframe.join(", ")}`,
    );
  }
  return timeframe;
};


const getSymbolPrice=async(symbol, timeframe, limit=100)=>{
  const query=`
   SELECT * FROM SymbolPrice
   WHERE symbol = $1 AND timeframe = $2
   ORDER BY timestamp DESC
   LIMIT $3
  `;
const result = await pool.query(query, [symbol, timeframe, limit])
if(!result){
  throw new Error(`Failed to retrive ${symbol}:${timeframe}`)
}

return result.rows

}


const getLatestPriceOnly=async(symbol, timeframe)=>{
  const query=`
  SELECT * FROM SymbolPrice
  WHERE symbol=$1 AND timeframe = $2
  ORDER BY timestamp DESC
  LIMIT 1
  `
const result = await pool.query(query, [syymbol, timeframe])
if(!result){
  throw new Error(`Failed to retrive latest price for ${symbol}:${timeframe}`)
}
return result.rows[0]
}

const getPricesInRange = async (symbol, timeframe, startDate, endDate, limit = 1000) => {
  const query = `
    SELECT * FROM SymbolPrice
    WHERE symbol = $1
      AND timeframe = $2
      AND timestamp >= $3
      AND timestamp <= $4
    ORDER BY timestamp DESC
    LIMIT $5
  `;

  const result = await pool.query(query, [symbol, timeframe, startDate, endDate, limit]);
  return result.rows
}


const getMultipleSymbols = async (symbols, timeframe, limit = 100) => {
  const query = `
    SELECT * FROM SymbolPrice
    WHERE symbol = ANY($1) AND timeframe = $2
    ORDER BY symbol, timestamp DESC
    LIMIT $3
  `;
  const result = await pool.query(query, [symbols, timeframe, limit])
  return result.rows
}



module.exports = {getSymbolPrice, getMultipleSymbol,getLatestPriceOnly, getPricesInRange,validateSymbol, validateTimeframe };
