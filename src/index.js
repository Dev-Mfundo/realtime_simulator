const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const { corsOptions } = require("./utils/configuration");
const {uploadSymbolDataRoute} = require("./routes/insert_symbol_price_route");
const {getSymbolDataRoute} = require("./routes/get_symbol_price_route");
const {listAllSymbolsRoute} = require("./routes/list_symbols_route")
const {getPricesInRangeRoute} = require("./routes/get_prices_in_range_route")
const {deleteSymbolDataRoute} = require("./routes/delete_symbol_price_route")
const {
  unknownEndpoint,
  errorHandler,
  limiter,
} = require("./utils/middleware");
const { setupTimescaleTable } = require("./model/symbol_price");
const {logger} = require("./utils/logger");

app.use(express.json());

(async () => {
  try {
    await setupTimescaleTable();
    logger.info("TimescaleDB tables ready");
  } catch (err) {
    logger.error("Failed to initialize TimescaleDB: " + err.message);
  }
})();


app.use(limiter);
app.use(hpp());
app.use(helmet());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api", getSymbolDataRoute);
app.use("/api", getPricesInRangeRoute);
app.use("/api", listAllSymbolsRoute);
app.use("/api", uploadSymbolDataRoute);
app.use("/api", deleteSymbolDataRoute);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = { app };
