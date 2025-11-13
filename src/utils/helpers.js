const validateSymbol = (symbol) => {
  if (!symbol || symbol.length === 0) {
    throw new Error("Symbol input missing!");
  }
  if (typeof symbol !== "string") {
    throw new Error("Symbol input should be a string");
  }
  symbol = symbol.toLowerCase();
  if (!/^[a-z0-9]+$/.test(symbol)) {
    throw new Error(
      "Symbol can only consist of alphanumeric characters and with no spaces",
    );
  }
  return symbol;
};

const validateTimeframe = (timeframe) => {
  const allowedTimeframe = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];
  if (!timeframe) {
    throw new Error("Timeframe input missing");
  }
  if (typeof timeframe !== "string") {
    throw new Error("Timeframe input should be a string");
  }
  timeframe=timeframe.toLowerCase()
  if (!/^[a-z0-9]+$/.test(timeframe) || !allowedTimeframe.includes(timeframe)) {
    throw new Error(
      `Invalid timeframe: allowed inputs ${allowedTimeframe.join(", ")}`,
    );
  }
  return timeframe;
};


module.exports = {validateSymbol, validateTimeframe };
