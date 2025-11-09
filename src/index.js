const express = require("express");
const app = express();
const helmet = require('helmet')
const cors = require('cors')
const hpp = require('hpp')
const {corsOptions} = require('./utils/configuration')
const {symbolDataRoute} = require('./routes/market_stream_route')
const {unknownEndpoint, errorHandler, keyAuth, limiter} = require('./utils/middleware')

app.use(express.json());

app.use(limiter)
app.use(hpp())
app.use(helmet())
app.use(cors(corsOptions))

app.use('/api', keyAuth, symbolDataRoute)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = { app };

