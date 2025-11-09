require('dotenv').config()

const API_KEY = process.env.API_KEY

const corsOptions={
	origin: process.env.CORS_ORIGIN,
	methods: ["POST"],
	credentials: true
}


module.exports={corsOptions, API_KEY}