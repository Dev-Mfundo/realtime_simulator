const fs = require("fs");
const readline = require("readline");
const { SymbolDataStream } = require("../../src/services/market_stream");
const { ValidationError } = require("../../src/utils/app_error");

describe("SymbolDataStream.fromFile", () => {
  let mockStream;
  let mockInterface;

  beforeEach(() => {
    mockStream = { on: jasmine.createSpy(), pipe: jasmine.createSpy() };

    spyOn(fs, "existsSync").and.returnValue(true);
    spyOn(fs, "createReadStream").and.returnValue(mockStream);

    mockInterface = {
      [Symbol.asyncIterator]: function* () {
        yield "timestamp\topen\thigh\tlow\tclose\tvolume";
        yield "2025-12-02T10:00:00Z\t1\t2\t3\t4\t5";
        yield "2025-12-02T11:00:00Z\t6\t7\t8\t9\t10";
      },
      close: jasmine.createSpy(),
    };

    spyOn(readline, "createInterface").and.returnValue(mockInterface);
  });

  it("should parse valid file data", async () => {
    const result = await SymbolDataStream.fromFile("fakefile.txt", {
      symbol: "btcusdt",
      timeframe: 60,
    });

    expect(result.length).toBe(2);
    expect(result[0].symbol).toBe("btcusdt");
    expect(result[0].timeframe).toBe(60);
    expect(result[0].timestamp).toBeDefined();
    expect(result[0].open).toBe(1);
  });

  it("should throw error if file does not exist", async () => {
    fs.existsSync.and.returnValue(false);

    await expectAsync(
      SymbolDataStream.fromFile("nofile.txt", { symbol: "btc", timeframe: 60 })
    ).toBeRejectedWithError(/File not found/);
  });

  it("should skip malformed lines", async () => {
    mockInterface[Symbol.asyncIterator] = function* () {
      yield "timestamp\topen\thigh\tlow\tclose\tvolume";
      yield "badline";
      yield "2025-12-02T11:00:00Z\t6\t7\t8\t9\t10";
    };

    const result = await SymbolDataStream.fromFile("fakefile.txt", {
      symbol: "ethusdt",
      timeframe: 1440,
    });

    expect(result.length).toBe(1);
    expect(result[0].symbol).toBe("ethusdt");
  });

  it("should throw error if no valid data", async () => {
    mockInterface[Symbol.asyncIterator] = function* () {
      yield "timestamp\topen\thigh\tlow\tclose\tvolume";
    };

    await expectAsync(
      SymbolDataStream.fromFile("fakefile.txt", { symbol: "btc", timeframe: 60})
    ).toBeRejectedWithError(ValidationError, /No valid data found/);
  });

  it("should throw error if file exceeds maxRecords", async () => {
  mockInterface[Symbol.asyncIterator] = function* () {
    yield "timestamp\topen\thigh\tlow\tclose\tvolume"; // header
    for (let i = 0; i < 10; i++) {
      yield `2025-12-02T${i.toString().padStart(2, "0")}:00:00Z\t1\t2\t3\t4\t5`;
    }
  };

  await expectAsync(
    SymbolDataStream.fromFile(
      "fakefile.txt",
      { symbol: "btc", timeframe: "1h" }, // valid timeframe
      5 // maxRecords
    )
  ).toBeRejectedWithError(ValidationError, /File exceeds maximum allowed records/);
  });

});
