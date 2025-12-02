const {getSymbolPrice} = require("../utils/helpers")

const getSymbolData = async (req, res, next) => {
  const { symbol, timeframe, limit} = req.body;

  try {
    const result =  await getSymbolPrice(symbol,timeframe,limit)
    res.status(200).json({
      success: true,
      content: result
    })
  } catch (error) {
    next(error);
  }
};

module.exports = {getSymbolData};
