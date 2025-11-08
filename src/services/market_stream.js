const path = require("path");
const fs = require("fs");
const { validateSymbol } = require("../utils/utils");

class Symbol {
  constructor(symbol) {
    this.symbol = validateSymbol(symbol);
  }
}

const pair = new Symbol("xauusd");

console.log(pair.listDir);
