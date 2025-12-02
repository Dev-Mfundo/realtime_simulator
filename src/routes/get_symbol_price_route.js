const express = require("express");
const getSymbolDataRoute = express.Router();
const { getSymbolData } = require("../controllers/get_symbol_price_controller");
const {keyAuth} = require("../utils/middleware")

getSymbolDataRoute.post("/market/v1/symbol/query", keyAuth, getSymbolData);

module.exports = {getSymbolDataRoute};
