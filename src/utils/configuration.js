const Pool = require("pg").Pool;
require("dotenv").config();

if (!process.env.POSTGRES_USER) throw new Error("User is missing");
if (!process.env.POSTGRES_PASSWORD) throw new Error("Password is missing");
if (!process.env.POSTGRES_HOST) throw new Error("Host is missing");
if (!process.env.POSTGRES_DATABASE) throw new Error("Database not configured");
if (!process.env.POSTGRES_PORT) throw new Error("Port missing");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DATABASE,
});

const API_KEY = process.env.API_KEY;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["POST"],
  credentials: true,
};

module.exports = { corsOptions, API_KEY, pool };
