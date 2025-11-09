const express = require("express");
const app = express();
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const {corsOptions} = require('./utils/configuration')
const {symbolDataRoute} = require('./routes/market_stream_route')
const {unknownEndpoint, errorHandler} = require('./utils/middleware')

app.use(express.json());

const limiter= rateLimit({
	windowMs: 15* 60* 1000,
	max: 100,
	message: 'Exceeded limit, Too many requests!' 
})

app.use(limiter)
app.use(hpp())
app.use(helmet())
app.use(cors(corsOptions))

app.use('/api', symbolDataRoute)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = { app };

