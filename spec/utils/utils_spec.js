const fs = require("fs");
const { validateSymbol } = require("../../src/utils/utils");

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
      "Symbol input should be a string ",
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
