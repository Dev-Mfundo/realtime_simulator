const {pool} = require('../utils/configuration')

const getSymbolPrice=async(req,res,next)=>{
   const {symbol, timeframe}
    if (!symbol) {
    return res.status(400).json({ success: false, error: "Missing symbol" });
    }

    if (typeof symbol !== "string") {
    return res.status(400).json({ success: false, error: "Invalid, symbol should be a string" });
    }

    if (!timeframe) {
    return res.status(400).json({ success: false, error: "Missing timeframe" });
    }

    if (!/^\d+$/.test(timeframe)) {
    return res.status(400).json({ success: false, error: "Invalid, timeframe should be a number" });
    }

    const validTimeframes = ['1', '5', '15', '30', '60', '120', '240', '1440'];
    const timeframeStr = String(timeframe)
    if (!validTimeframes.includes(timeframeStr)) {
     return res.status(400).json({
          success: false,
          message: `Invalid timeframe: ${timeframeStr}, allowed timeframes - ${validTimeframes.join(', ')}`
    });

    try{
    }
    const result = await pool.query(``)
    }catch(error){
    next(error)
    }
}

module.exports={}
