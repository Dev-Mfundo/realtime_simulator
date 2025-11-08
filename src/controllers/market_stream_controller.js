const {SymbolData} = require('../services/market_stream')

const getSymbolData = async(req,res,next)=>{
	const {symbol, timeframe} = req.body
	try{
	if(!symbol || !timeframe){
		return res.status(400).json({
			success: false,
			error: "Both symbol and timeframe input are required"
		})
	}

	const pair = new SymbolData(symbol)
	const data = await pair.getSymbolDataByTimeframe(timeframe)
	res.status(200).json(data)


    }catch(error){
    	next(error)
    }
}


module.exports={getSymbolData}