const fs = require("fs");
const utils = require("../../src/utils/utils");

describe("Utility Functions", () => {
  let validateSymbol;
  let validateTimeframe;

  beforeEach(() => {
    validateSymbol = utils.validateSymbol;
    validateTimeframe = utils.validateTimeframe;
  });

  describe("validateSymbol", () => {
    beforeEach(() => {
      spyOn(fs, "existsSync").and.returnValue(true);
    });

    it("should return valid symbol", () => {
      const result = validateSymbol("btcusdt");
      expect(result).toBe("btcusdt");
    });

    it("should convert symbol to lowercase", () => {
      const result = validateSymbol("BTCUSDT");
      expect(result).toBe("btcusdt");
    });

    it("should throw error for empty symbol", () => {
      expect(() => validateSymbol("")).toThrowError("Symbol input missing!");
    });

    it("should throw error for non-string symbol", () => {
      expect(() => validateSymbol(123)).toThrowError(
        "Symbol input should be a string",
      );
      expect(() => validateSymbol(null)).toThrowError("Symbol input missing!");
      expect(() => validateSymbol(undefined)).toThrowError(
        "Symbol input missing!",
      );
    });

    it("should throw error for symbol with invalid characters", () => {
      expect(() => validateSymbol("btc-usdt")).toThrowError(
        "Symbol can only consist of alphanumeric characters and with no spaces",
      );
      expect(() => validateSymbol("btc usdt")).toThrowError(
        "Symbol can only consist of alphanumeric characters and with no spaces",
      );
    });

    it("should throw error for non-existent symbol directory", () => {
      fs.existsSync.and.returnValue(false);
      expect(() => validateSymbol("nonexistent")).toThrowError(
        "nonexistent is not included in the data",
      );
    });
  });

  describe("validateTimeframe", () => {
    it("should return valid timeframe", () => {
      const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];

      timeframes.forEach((tf) => {
        const result = validateTimeframe(tf);
        expect(result).toBe(tf);
      });
    });

    it("should throw error for empty timeframe", () => {
      expect(() => validateTimeframe("")).toThrowError(
        "Timeframe input missing",
      );
      expect(() => validateTimeframe(null)).toThrowError(
        "Timeframe input missing",
      );
      expect(() => validateTimeframe(undefined)).toThrowError(
        "Timeframe input missing",
      );
    });

    it("should throw error for non-string timeframe", () => {
      expect(() => validateTimeframe(123)).toThrowError(
        "Timeframe input should be a string",
      );
      expect(() => validateTimeframe({})).toThrowError(
        "Timeframe input should be a string",
      );
      expect(() => validateTimeframe([])).toThrowError(
        "Timeframe input should be a string",
      );
    });

    it("should throw error for invalid timeframe", () => {
      expect(() => validateTimeframe("2h")).toThrowError(
        "Invalid timeframe: allowed inputs 1m, 5m, 15m, 30m, 1h, 4h, 1d",
      );
      expect(() => validateTimeframe("invalid")).toThrowError(
        "Invalid timeframe: allowed inputs 1m, 5m, 15m, 30m, 1h, 4h, 1d",
      );
      expect(() => validateTimeframe("1H")).toThrowError(
        "Invalid timeframe: allowed inputs 1m, 5m, 15m, 30m, 1h, 4h, 1d",
      );
    });
  });
});
