const {getPricesInRange} = require("../utils/helpers")

const getPricesInRangeData = async (req, res, next) => {
  const {symbol, timeframe, startDate, endDate, limit} = req.body
  try{
    const result = await getPricesInRange(symbol, timeframe, startDate, endDate, limit)

    res.status(200).json({
      success: true,
      content: result
    })
  }catch(error){
    next(error)
  }
}

module.exports ={getPricesInRangeData}