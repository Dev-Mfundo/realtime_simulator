const { deleteSymbolByTimeframe, deleteSymbol } = require("../utils/helpers");

const deleteSymbolDataByTimeframe = async (req, res, next) => {
  const { symbol, timeframe } = req.body;
  try {
    const result = await deleteSymbolByTimeframe(symbol, timeframe);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching records found",
      });
    }

    res.status(200).json({
      success: true,
      content: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSymbolData = async (req, res, next) => {
  const { symbol } = req.body;
  try {
    const result = await deleteSymbol(symbol);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching records found",
      });
    }

    res.status(200).json({
      success: true,
      content: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { deleteSymbolDataByTimeframe, deleteSymbolData };
