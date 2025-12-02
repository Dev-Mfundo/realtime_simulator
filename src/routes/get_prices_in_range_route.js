const express = require("express");
const getPricesInRangeRoute = express.Router();
const {getPricesInRangeData} = require("../controllers/get_prices_in_range_controller")
const {keyAuth} = require("../utils/middleware")

getPricesInRangeRoute.post("/market/v1/symbol/timeframe/range", keyAuth, getPricesInRangeData)

module.exports={getPricesInRangeRoute}