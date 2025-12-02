const {getAllSymbols} = require("../controllers/list_symbols_controller")
const {keyAuth} = require("../utils/middleware")
const express = require("express")
const listAllSymbolsRoute = express.Router()

listAllSymbolsRoute.get("/market/v1/symbol/allSymbols", keyAuth, getAllSymbols)

module.exports={listAllSymbolsRoute}