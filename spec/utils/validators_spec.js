const {
  insertSymbolData,
  getSymbolPrice,
  getPricesInRange,
  ListAllSymbols,
  deleteSymbolByTimeframe,
  deleteSymbol
} = require("../../src/utils/helpers");

const { pool } = require("../../src/utils/configuration");

describe("Helpers", () => {

  beforeEach(() => {
    spyOn(pool, "query").and.stub();
  });

  describe("ListAllSymbols", () => {
    it("should return list of distinct symbols", async () => {
      pool.query.and.returnValue(Promise.resolve({ rows: [{ symbol: "btcusdt" }] }));

      const result = await ListAllSymbols();
      expect(result).toEqual([{ symbol: "btcusdt" }]);
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe("getSymbolPrice", () => {
    it("should query correct SQL with parameters", async () => {
      pool.query.and.returnValue(Promise.resolve({ rows: [] }));

      const result = await getSymbolPrice("btcusdt", 60, 1);
      expect(pool.query).toHaveBeenCalledWith(jasmine.any(String), ["btcusdt",60, 1]);
      expect(result).toEqual([]);
    });

    it("should throw validation error for bad symbol", async () => {
      await expectAsync(getSymbolPrice("", 60)).toBeRejected();
    });
  });

  describe("getPricesInRange", () => {
    it("should return prices within date range", async () => {
      pool.query.and.returnValue(Promise.resolve({ rows: [{ timestamp: "2024-10-01" }] }));

      const result = await getPricesInRange("ethusdt", 1440, "2024-01-01", "2024-12-31");
      expect(result.length).toBeGreaterThan(0);
      expect(pool.query).toHaveBeenCalled();
    });

    it("should throw error if no rows returned", async () => {
      pool.query.and.returnValue(Promise.resolve({ rows: null }));

      await expectAsync(
        getPricesInRange("ethusdt", 1440, "2024-01-01", "2024-12-31")
      ).toBeRejectedWithError(/price data not found/);
    });
  });

  describe("insertSymbolData", () => {
    it("should insert and update ticks", async () => {
      pool.query.and.returnValue(Promise.resolve({
        rows: [{ was_inserted: true }, { was_inserted: false }]
      }));

      const mockTicks = [
        { symbol: "btcusdt", timeframe: 60, timestamp: new Date(), open: 1, high: 2, low: 1, close: 2, volume: 10 },
        { symbol: "btcusdt", timeframe: 60, timestamp: new Date(), open: 2, high: 3, low: 2, close: 3, volume: 20 }
      ];

      const result = await insertSymbolData(mockTicks);
      expect(result.inserted).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.message).toContain("btcusdt-60");
    });
  });

  describe("deleteSymbolByTimeframe", () => {
    it("should delete records by symbol and timeframe", async () => {
      pool.query.and.returnValue(Promise.resolve({ rows: [{ symbol: "adausdt" }] }));

      const result = await deleteSymbolByTimeframe("adausdt", 240);
      expect(result).toEqual([{ symbol: "adausdt" }]);
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe("deleteSymbol", () => {
    it("should delete all records by symbol", async () => {
      pool.query.and.returnValue(Promise.resolve({ rows: [{ symbol: "ethusdt" }] }));

      const result = await deleteSymbol("ethusdt");
      expect(result).toEqual([{ symbol: "ethusdt" }]);
      expect(pool.query).toHaveBeenCalled();
    });
  });

});
