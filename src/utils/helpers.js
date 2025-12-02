const { pool } = require("./configuration");
const format = require("pg-format");
const {
  validateSymbol,
  validateTimeframe,
  validateLimit,
  validateDate,
  validateMultipleSymbols,
} = require("./validators");


const ListAllSymbols=async()=>{
  const query = `SELECT DISTINCT symbol FROM SymbolPrice;`
  const result = await pool.query(query)
  return result.rows
}

const getSymbolPrice = async (symbol, timeframe, limit = 2000) => {
  symbol = validateSymbol(symbol);
  timeframe = validateTimeframe(timeframe);
  limit = validateLimit(limit);

  const query = `
   SELECT * FROM SymbolPrice
   WHERE symbol = $1 AND timeframe = $2
   ORDER BY timestamp DESC
   LIMIT $3
  `;
  const result = await pool.query(query, [symbol, timeframe, limit]);
  return result.rows;
};


const getPricesInRange=async(symbol,timeframe,startDate,endDate,limit = 1000)=>{
  symbol = validateSymbol(symbol);
  timeframe = validateTimeframe(timeframe);
  limit = validateLimit(limit);
  const { start, end } = validateDate(startDate, endDate);

  const query = `
    SELECT * FROM SymbolPrice
    WHERE symbol = $1
      AND timeframe = $2
      AND timestamp >= $3
      AND timestamp <= $4
    ORDER BY timestamp DESC
    LIMIT $5
  `;

  const result = await pool.query(query, [
    symbol,
    timeframe,
    start,
    end,
    limit,
  ]);
  if(!result.rows){
    throw new Error(`${symbol}: price data not found `)
  }
  return result.rows;
};


const insertSymbolData = async (ticks) => {
  const values = ticks.map((tick) => [
    tick.symbol,
    tick.timeframe,
    tick.timestamp,
    tick.open,
    tick.high,
    tick.low,
    tick.close,
    tick.volume,
  ]);

  const query = format(
    `
    INSERT INTO SymbolPrice(symbol, timeframe, timestamp, open, high, low, close, volume)
    VALUES %L
    ON CONFLICT (symbol, timeframe, timestamp)
    DO UPDATE SET
      open = EXCLUDED.open,
      high = EXCLUDED.high,
      low = EXCLUDED.low,
      close = EXCLUDED.close,
      volume = EXCLUDED.volume
      RETURNING *, (xmax = 0) as was_inserted;
  `,
    values,
  );

  const result = await pool.query(query);
  const inserted = result.rows.filter((row) => row.was_inserted).length;
  const updated = result.rows.length - inserted;
  return {
  symbol: values[0][0],
  timeframe: values[0][1],
  inserted: inserted,
  updated: updated,
  message: `${inserted} new ticks inserted, ${updated} existing ticks updated for ${values[0][0]}-${values[0][1]}`
  }
};

const deleteSymbolByTimeframe=async(symbol, timeframe)=>{
  symbol = validateSymbol(symbol);
  timeframe = validateTimeframe(timeframe);
  const query = `DELETE FROM SymbolPrice
   WHERE symbol=$1 AND timeframe=$2 
  RETURNING *;`
  const result = await pool.query(query, [symbol, timeframe])
  return result.rows
}

const deleteSymbol=async(symbol)=>{
  symbol = validateSymbol(symbol);
  const query = `DELETE FROM SymbolPrice
   WHERE symbol=$1 
  RETURNING *;`
  const result = await pool.query(query, [symbol])
  return result.rows
}


module.exports = {
  insertSymbolData,
  getSymbolPrice,
  getPricesInRange,
  ListAllSymbols,
  deleteSymbolByTimeframe,
  deleteSymbol
};
