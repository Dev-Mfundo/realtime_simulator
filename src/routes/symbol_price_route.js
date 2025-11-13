const express = require('express')
const uploadSymbolDataRoute = express.Router()
const {insertSymbolPrice} = require('../controllers/symbol_price_controller')
const {upload} = require('../utils/middleware')

uploadSymbolDataRoute.post('/market/v1/symbol/upload', upload.single('file') ,insertSymbolPrice)

module.exports={uploadSymbolDataRoute}