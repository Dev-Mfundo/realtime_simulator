const {validateTimeframe} = require("../utils/validators")
const {getSymbolData,ListAllSymbols} = require("../controllers/get_symbol_price_controller")
const app = require("../index")
const http = require("http")
const {Server} = require("socket.io")

const server = http.createServer(app)

const VOLATILITY = {
  1: 60000,
  5: 300000,
  15: 900000,
  30: 1800000,
  60: 3600000,
  120: 7200000,
  240: 14400000,
  1440: 86400000
}
 
let intervalId;

const startRealtimeOutput=(volatilityInput)=>{

	const volatilityInput = validateTimeframe(volatility)
	
	if(!Object.keys(VOLATILITY).includes(volatility)){
		throw new Error(`Invalid volatility input, expected either of the following: ${Object.keys(VOLATILITY).join(", ")}`)
	}

	let count = 0
	setInterval(()=>{
	count++	
	   },VOLATILITY[volatility])
    
}

const stopRealtimeOutput=()=>{
	if(intervalId){
	clearInterval(startRealtimeOutput)
	return true
  }
} 
