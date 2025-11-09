const fs = require("fs");
const { validateSymbol, validateTimeframe } = require("../../src/utils/utils");
describe("validateSymbol", () => {
  it("should return lowercase symbol if valid and directory exists", () => {
    spyOn(fs, "existsSync").and.returnValue(true);
    const result = validateSymbol("SP500");
    expect(result).toBe("sp500");
  });

  it("should throw error if symbol is missing", () => {
    expect(() => validateSymbol()).toThrowError("Symbol input missing!");
  });

  it("should throw error if symbol is not a string", () => {
    expect(() => validateSymbol(123)).toThrowError(
      "Symbol input should be a string",
    );
  });

  it("should throw error if symbol contains non-alphanumeric characters", () => {
    expect(() => validateSymbol("sp 500")).toThrowError(
      "Symbol can only consist of alphanumeric characters and with no spaces",
    );
    expect(() => validateSymbol("sp-500")).toThrowError(
      "Symbol can only consist of alphanumeric characters and with no spaces",
    );
  });

  it("should throw error if directory does not exist", () => {
    spyOn(fs, "existsSync").and.returnValue(false);
    expect(() => validateSymbol("sp500")).toThrowError(
      "sp500 is not included in the data",
    );
  });
});

describe("validateTimeframe", () => {
  it("should return timeframe if valid", () => {
    const result = validateTimeframe("5m");
    expect(result).toBe("5m");
  });
  it("should throw an error for undefined timeframe", () => {
    expect(() => validateTimeframe()).toThrowError("Timeframe input missing");
  });
  it("should throw an error for non-string timeframe", () => {
    expect(() => validateTimeframe(6)).toThrowError(
      "Timeframe input should be a string",
    );
  });
  it("should throw an error for timeframe not included in data", () => {
    const allowedTimeframe = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];
    expect(() => validateTimeframe("10m")).toThrowError(
      `Invalid timeframe: allowed inputs ${allowedTimeframe.join(", ")}`,
    );
  });
});
