const express = require("express");
const deleteSymbolDataRoute = express.Router()
const {deleteSymbolDataByTimeframe,deleteSymbolData} = require("../controllers/delete_symbol_price_controller");
const { keyAuth } = require("../utils/middleware")

deleteSymbolDataRoute.post("/market/v1/symbol/deleteBySymbol",keyAuth,deleteSymbolData)

deleteSymbolDataRoute.post("/market/v1/symbol/deleteBySymbolAndTimeframe",keyAuth,deleteSymbolDataByTimeframe)

module.exports={deleteSymbolDataRoute}