
// asithi 
const VOLATILITY = {
  minute: 60000,
  fiveMinutes: 300000,
  fiftenMinutes: 900000,
  thirtyminutes: 1800000,
  oneHour: 3600000,
  twoHours: 7200000,
  fourHours: 14400000,
  day: 86400000
}

const realtimeOutput=(volatility)=>{
	if(typeof volatility !== 'string'){
		throw new Error("Volatility should be a string")
	}
	
	if(!Object.keys(VOLATILITY).includes(volatility)){
		throw new Error(`Invalid volatility input, expected either of the following: ${Object.keys(VOLATILITY).join(", ")}`)
	}

	let count = 0
	setInterval(()=>{
		console.log(`${count} minutes elapesed`)
	count++	
	   },volatility)
    
}

realtimeOutput("second")
// 1, 5, 15, 30 , 60, 120, 240, 1440