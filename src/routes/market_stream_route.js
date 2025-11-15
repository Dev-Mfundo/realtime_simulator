const express = require("express");
const getSymbolDataRoute = express.Router();
const { getSymbolData } = require("../controllers/get_symbol_price_controller");

getSymbolDataRoute.post("/market/v1/symbol/query", getSymbolData);

module.exports = {getSymbolDataRoute };
