const express = require("express");
const getSymbolDataRoute = express.Router();
const { getSymbolData } = require("../controllers/market_stream_controller");

getSymbolDataRoute.post("/market/v1/symbol/query", getSymbolData);

module.exports = { getSymbolDataRoute };
