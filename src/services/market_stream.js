const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { validateSymbol, validateTimeframe } = require("../utils/utils");

class SymbolData {
  #symbolData;
  #symbolDir;

  constructor(symbol) {
    this.symbol = validateSymbol(symbol);
    this.#symbolDir = path.join(__dirname, `../history_data/${symbol}`);
    this.#symbolData = (timeframe) => {
      const filePath = `${this.#symbolDir}/${this.symbol}_${validateTimeframe(timeframe)}.csv`;
      return fs.createReadStream(filePath, {
        encoding: "utf-8",
        highWaterMark: 1024,
      });
    };
  }

  async getSymbolDataByTimeframe(timeframe) {
    let stream;

    stream = this.#symbolData(timeframe);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const data = [];
    let lineCount = 0;

    for await (const line of rl) {
      lineCount++;
      const parts = line.split("\t");

      if (parts.length !== 6) {
        console.warn(`Malformed line at ${lineCount}: ${line}`);
        continue;
      }

      const [timestamp, open, high, low, close, volume] = parts;

      const parsed = {
        timestamp,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseInt(volume),
      };

      if (
        Object.values(parsed).some((val) => isNaN(val) && val !== timestamp)
      ) {
        console.warn(`Invalid numeric data at line ${lineCount}: ${line}`);
        continue;
      }

      data.push(parsed);
    }

    return data;
  }
}

module.exports = { SymbolData };
