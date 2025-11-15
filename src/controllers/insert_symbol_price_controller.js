const fs = require("fs");
const { SymbolDataStream } = require("../services/market_stream");
const {
  insertSymbolData,
  validateSymbol,
  validateTimeframe,
} = require("../utils/validators");

const insertSymbolPrice = async (req, res, next) => {
  const { symbol, timeframe } = req.body;
  const validSymbol = validateSymbol(symbol);
  const validTimeframe = validateTimeframe(timeframe);
  if (!req.file || !req.file.path) {
    return res
      .status(400)
      .json({ success: false, error: "CSV file is required" });
  }

  const filePath = req.file.path;

  try {
    const refinedData = await SymbolDataStream.fromFile(filePath, {
      validSymbol,
      validTimeframe,
    });
    console.log(refinedData[0]);
    const result = await insertSymbolData(refinedData);
    fs.unlinkSync(filePath);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    fs.unlinkSync(filePath);
    next(error);
  }
};

module.exports = { insertSymbolPrice };
