require('dotenv').config()

const corsOptions={
	origin: process.env.CORS_ORIGIN,
	methods: ["POST"],
	credentials: true
}


module.exports={corsOptions}