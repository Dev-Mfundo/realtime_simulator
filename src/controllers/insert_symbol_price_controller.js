const fs = require("fs");
const { SymbolDataStream } = require("../services/market_stream");
const {validateSymbol,validateTimeframe} = require("../utils/validators");
const {insertSymbolData} = require("../utils/helpers")

const insertSymbolPrice = async (req, res, next) => {
    if (!req.file || !req.file.path) {
    return res
      .status(400)
      .json({ success: false, error: "CSV file is required" });
    }

   const filePath = req.file.path;
  try {
    const symbol = validateSymbol(req.body.symbol);
  const timeframe = validateTimeframe(req.body.timeframe);

    const refinedData = await SymbolDataStream.fromFile(filePath, {
      symbol: symbol,
      timeframe: timeframe
    }, 5000); 
    const result = await insertSymbolData(refinedData);
    fs.unlinkSync(filePath);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    fs.unlinkSync(filePath);
    next(error);
  }
}

module.exports = insertSymbolPrice
