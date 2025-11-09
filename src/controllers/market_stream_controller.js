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
	if(data.length === 0){
        return res.status(404).json({
            success: false,
            error: "No valid data found for the given symbol and timeframe",
        });
    }
	res.status(200).json(data)


    }catch(error){
    	next(error)
    }
}


module.exports={getSymbolData}