const fs = require("fs");
const readline = require("readline");
const {
  validateSymbol,
  validateTimeframe,
  validateNumericField,
  validateTimestamp,
} = require("../utils/validators");
const { ValidationError } = require("../utils/app_error");

class SymbolDataStream {
  static async fromFile(filePath, { symbol, timeframe }, maxRecords = 5000) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stream = fs.createReadStream(filePath, {
      encoding: "utf-8",
      highWaterMark: 1024,
    });

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const data = [];
    let lineCount = 0;
    let isHeader = true;

    for await (const line of rl) {
      if (data.length >= maxRecords) {
        throw new ValidationError(
          `File exceeds maximum allowed records (${maxRecords}). Please split your data.`,
        );
      }

      lineCount++;
      if (!line.trim()) continue;

      if (isHeader && line.toLowerCase().includes("open")) {
        isHeader = false;
        continue;
      }

      const parts = line.split("\t");

      if (parts.length < 6) {
        console.warn(`Malformed line at ${lineCount}: ${line}`);
        continue;
      }

      const [timestamp, open, high, low, close, volume] = parts.map((v) =>
        v.trim(),
      );

      const parsed = {
        symbol: validateSymbol(symbol),
        timeframe: validateTimeframe(timeframe),
        timestamp: validateTimestamp(timestamp, lineCount),
        open: validateNumericField(open, "open", lineCount),
        high: validateNumericField(high, "high", lineCount),
        low: validateNumericField(low, "low", lineCount),
        close: validateNumericField(close, "close", lineCount),
        volume: validateNumericField(volume, "volume", lineCount),
      };

      if (
        Object.values(parsed).some(
          (val) => val === "" || (typeof val === "number" && isNaN(val)),
        )
      ) {
        console.warn(`Invalid numeric data at line ${lineCount}: ${line}`);
        continue;
      }

      data.push(parsed);
    }

    if (!data.length)
      throw new ValidationError("No valid data found in CSV file");
    return data;
  }
}
module.exports = { SymbolDataStream };
