const fs = require('fs');
const format = require('pg-format');
const { pool } = require('../utils/configuration');
const { SymbolDataStream } = require('../services/market_stream');
const {setupTimescaleTable} = require('../model/symbol_price')

const insertTicksBulk = async (ticks) => {
  await setupTimescaleTable()
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

  if (!symbol) {
    return res.status(400).json({ success: false, message: "Missing symbol" });
  }

  if (typeof symbol !== "string") {
    return res.status(400).json({ success: false, message: "Invalid, symbol should be a string" });
  }

  if (!timeframe) {
    return res.status(400).json({ success: false, message: "Missing timeframe" });
  }

  if (typeof timeframe !== "string") {
    return res.status(400).json({ success: false, message: "Invalid, timeframe should be a string" });
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
