const express = require('express')
const symbolDataRoute = express.Router()
const {getSymbolData} = require('../controllers/market_stream_controller')

symbolDataRoute.post('/market/symbol/price', getSymbolData)

module.exports={symbolDataRoute}