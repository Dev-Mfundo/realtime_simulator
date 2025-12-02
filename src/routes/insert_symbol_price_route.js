const express = require("express");
const uploadSymbolDataRoute = express.Router();
const {insertSymbolPrice} = require("../controllers/insert_symbol_price_controller");
const { upload,keyAuth } = require("../utils/middleware")

uploadSymbolDataRoute.post("/market/v1/symbol/upload", keyAuth, upload.single("file"), insertSymbolPrice)

module.exports = { uploadSymbolDataRoute };