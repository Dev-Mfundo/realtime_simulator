const fs = require('fs');
const readline = require('readline');
const { validateSymbol, validateTimeframe } = require('../utils/helpers');

class SymbolDataStream {
  static async fromFile(filePath, { symbol, timeframe }) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stream = fs.createReadStream(filePath, {
      encoding: 'utf-8',
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
      lineCount++;
      if (!line.trim()) continue;

      if (isHeader && line.toLowerCase().includes('open')) {
        isHeader = false;
        continue;
      }

      const parts = line.split('\t');

      if (parts.length < 6) {
        console.warn(`Malformed line at ${lineCount}: ${line}`);
        continue;
      }

      const [timestamp, open, high, low, close, volume] = parts.map(v => v.trim());

      const parsed = {
        symbol: validateSymbol(symbol),
        timeframe: validateTimeframe(timeframe),
        timestamp: timestamp,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
      };

      if (
        Object.values(parsed).some(val => val === '' || (typeof val === 'number' && isNaN(val)))
      ) {
        console.warn(`Invalid numeric data at line ${lineCount}: ${line}`);
        continue;
      }

      data.push(parsed);
    }

    if (!data.length) throw new Error('No valid data found in CSV file');
    return data;
  }
}

module.exports = { SymbolDataStream };
