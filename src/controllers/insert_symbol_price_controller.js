const fs = require('fs');
const format = require('pg-format');
const { pool } = require('../utils/configuration');
const { SymbolDataStream } = require('../services/market_stream');
const {setupTimescaleTable} = require('../model/symbol_price')

const insertTicksBulk = async (ticks) => {

  const values = ticks.map(tick => [
    tick.symbol,
    tick.timeframe,
    tick.timestamp,
    tick.open,
    tick.high,
    tick.low,
    tick.close,
    tick.volume
  ]);

  const query = format(`
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
  `, values);

  const result = await pool.query(query);
  const inserted = result.rows.filter(row=>row.was_inserted).length
  const updated = result.rows.length - inserted
  return `${inserted} new ticks inserted ${updated} existing ticks updated for ${values[0][0]}-${values[0][1]}`;
};

const insertSymbolPrice = async (req, res, next) => {
  const { symbol, timeframe } = req.body;

  if (!symbol) {
    return res.status(400).json({ success: false, error: "Missing symbol" });
  }

  if (typeof symbol !== "string") {
    return res.status(400).json({ success: false, error: "Invalid, symbol should be a string" });
  }

  if (!timeframe) {
    return res.status(400).json({ success: false, error: "Missing timeframe" });
  }

  if (!/^\d+$/.test(timeframe)) {
    return res.status(400).json({ success: false, error: "Invalid, timeframe should be a number" });
  }

  const validTimeframes = ['1', '5', '15', '30', '60', '120', '240', '1440'];
  const timeframeStr = String(timeframe)
  if (!validTimeframes.includes(timeframeStr)) {
     return res.status(400).json({
          success: false,
          message: `Invalid timeframe: ${timeframeStr}, allowed timeframes - ${validTimeframes.join(', ')}`
  });
  }

  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, error: "CSV file is required" });
  }

  const filePath = req.file.path;

  try {
    const refinedData = await SymbolDataStream.fromFile(filePath, { symbol, timeframe });
    console.log(refinedData[0])
    const result = await insertTicksBulk(refinedData);
    fs.unlinkSync(filePath);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    fs.unlinkSync(filePath);
    next(error);
  }
};



module.exports = {insertSymbolPrice};
