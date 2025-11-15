const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const { corsOptions } = require("./utils/configuration");
const {uploadSymbolDataRoute} = require("./routes/insert_symbol_price_route");
const {getSymbolDataRoute} = require("./routes/get_symbol_price_route");
const {
  unknownEndpoint,
  errorHandler,
  keyAuth,
  limiter,
} = require("./utils/middleware");
const { setupTimescaleTable } = require("./model/symbol_price");

app.use(express.json());

const initializeTimescaleDB = async (req, res, next) => {
  try {
    await setupTimescaleTable();
    next();
  } catch (err) {
    next(err);
  }
};

app.use(initializeTimescaleDB);

app.use(limiter);
app.use(hpp());
app.use(helmet());
app.use(cors(corsOptions));

app.use("/api", keyAuth, getSymbolDataRoute);
app.use("/api", uploadSymbolDataRoute);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = { app };
