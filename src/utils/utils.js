const fs = require("fs");
const path = require("path");

const validateSymbol = (symbol) => {
  if (!symbol) {
    throw new Error("Symbol input missing!");
  }
  if (typeof symbol !== "string") {
    throw new Error("Symbol input should be a string ");
  }
  symbol = symbol.toLowerCase();
  if (!/^[A-Za-z0-9]+$/.test(symbol)) {
    throw new Error(
      "Symbol can only consist of alphanumeric characters and with no spaces",
    );
  }
  const symbolDir = path.join(__dirname, `../history_data/${symbol}`);

  if (!fs.existsSync(symbolDir)) {
    throw new Error(`${symbol} is not included in the data`);
  }

  return symbol;
};

module.exports = { validateSymbol };
