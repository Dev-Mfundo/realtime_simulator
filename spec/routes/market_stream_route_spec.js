const express = require("express");
const request = require("supertest");

describe("Market Stream", () => {
  let app;
  let mockSymbolDataService;
  let marketStreamController;
  let originalConsoleError;

  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jasmine.createSpy("console.error");
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    mockSymbolDataService = jasmine.createSpyObj("SymbolData", [
      "getSymbolDataByTimeframe",
    ]);

    require.cache[require.resolve("../../src/services/market_stream")] = {
      exports: {
        SymbolData: jasmine
          .createSpy("SymbolData")
          .and.returnValue(mockSymbolDataService),
      },
    };

    delete require.cache[
      require.resolve("../../src/controllers/market_stream_controller")
    ];
    marketStreamController = require("../../src/controllers/market_stream_controller");

    app = express();
    app.use(express.json());
    app.post("/market/v1/symbol/price", marketStreamController.getSymbolData);
  });

  afterEach(() => {
    delete require.cache[require.resolve("../../src/services/market_stream")];
    delete require.cache[
      require.resolve("../../src/controllers/market_stream_controller")
    ];
  });

  describe("marketStreamRoute", () => {
    it("should return 200 and data for valid symbol and timeframe", async () => {
      const mockData = [
        {
          symbol: "XAUUSD",
          timeframe: "1h",
          price: 1950.5,
          volume: 1500.75,
          timestamp: "2023-01-01T00:00:00.000Z",
        },
      ];

      const requestBody = {
        symbol: "XAUUSD",
        timeframe: "1h",
      };

      mockSymbolDataService.getSymbolDataByTimeframe.and.returnValue(
        Promise.resolve(mockData),
      );

      const response = await request(app)
        .post("/market/v1/symbol/price")
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData[0]);
      expect(
        mockSymbolDataService.getSymbolDataByTimeframe,
      ).toHaveBeenCalledWith("1h");
    });

    it("should return 400 when symbol is missing", async () => {
      const requestBody = {
        timeframe: "1h",
      };

      const response = await request(app)
        .post("/market/v1/symbol/price")
        .send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(
        "Both symbol and timeframe input are required",
      );
    });

    it("should return 400 when timeframe is missing", async () => {
      const requestBody = {
        symbol: "XAUUSD",
      };

      const response = await request(app)
        .post("/market/v1/symbol/price")
        .send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(
        "Both symbol and timeframe input are required",
      );
    });

    it("should return 404 when no data found", async () => {
      const requestBody = {
        symbol: "INVALID",
        timeframe: "1h",
      };

      mockSymbolDataService.getSymbolDataByTimeframe.and.returnValue(
        Promise.resolve([]),
      );

      const response = await request(app)
        .post("/market/v1/symbol/price")
        .send(requestBody);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(
        "No valid data found for the given symbol and timeframe",
      );
    });
  });
});
