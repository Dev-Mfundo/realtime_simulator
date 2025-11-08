const fs = require("fs");
const path = require("path");
const { listDir } = require("../../src/services/market");

describe("List Directories", () => {
  it("should return the list of all available symbol directories", () => {
    const mockDirants = [
      { name: "sp500", isDirectory: () => true },
      { name: "errorDir", isDirectory: () => true },
      { name: "data", isDirectory: () => true },
    ];

    spyOn(fs, "readdirSync").and.returnValue(mockDirants);

    const result = listDir();

    expect(fs.readdirSync).toHaveBeenCalledWith(
      path.join(__dirname, "../../src/history_data"),
      { withFileTypes: true },
    );
    expect(result).toEqual(["sp500", "errorDir", "data"]);
  });

  it("should throw error for non-directory content in directory", () => {
    const mockDirants = [
      { name: "sp500", isDirectory: () => true },
      { name: "errorDir", isDirectory: () => false },
      { name: "data", isDirectory: () => true },
    ];

    spyOn(fs, "readdirSync").and.returnValue(mockDirants);
    expect(() => listDir()).toThrowError("Non-directory entry found: errorDir");
  });
});
