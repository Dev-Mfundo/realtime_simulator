const express = require("express");
const app = express();
const {symbolDataRoute} = require('./routes/market_stream_route')
const {unknownEndpoint, errorHandler} = require('./utils/middleware')

app.use(express.json());
app.use('/api', symbolDataRoute)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = { app };
