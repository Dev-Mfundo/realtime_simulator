const Pool = require("pg").Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DATABASE,
})

const API_KEY = process.env.API_KEY

const corsOptions={
	origin: process.env.CORS_ORIGIN,
	methods: ["POST"],
	credentials: true
}




module.exports={corsOptions,API_KEY,pool}