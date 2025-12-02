const {ListAllSymbols} = require("../utils/helpers")

const getAllSymbols=async(req,res,next)=>{
  try {
    const symbols = await ListAllSymbols()
    const result = symbols.map(name=>name.symbol)
    res.status(200).json({
    	success: true,
    	content: result
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {getAllSymbols}
