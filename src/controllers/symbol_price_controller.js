const fs = require('fs');
const format = require('pg-format');
const { pool } = require('../utils/configuration');
const { SymbolDataStream } = require('../services/market_stream');

const insertTicksBulk = async (ticks) => {
  const values = ticks.map(tick => [
    tick.symbol,
    tick.timestamp,
    tick.open,
    tick.high,
    tick.low,
    tick.close,
    tick.volume
  ]);

  const query = format(`
    INSERT INTO SymbolPrice(symbol, timestamp, open, high, low, close, volume)
    VALUES %L
  `, values);

  await pool.query(query);
  return `${ticks.length} ticks inserted`;
};

const insertSymbolPrice = async (req, res, next) => {
  const { symbol, timeframe } = req.body;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ success: false, message: "Invalid or missing symbol" });
  }

  if (!timeframe || typeof timeframe !== "string") {
    return res.status(400).json({ success: false, message: "Invalid or missing timeframe" });
  }

  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "CSV file is required" });
  }

  const filePath = req.file.path;

  try {
    const refinedData = await SymbolDataStream.fromFile(filePath, { symbol, timeframe });
    const result = await insertTicksBulk(refinedData);
    fs.unlinkSync(filePath);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    fs.unlinkSync(filePath);
    next(error);
  }
};


module.exports = {insertSymbolPrice };
