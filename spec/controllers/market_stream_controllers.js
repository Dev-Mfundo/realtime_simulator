const {
  getSymbolData,
} = require("../../src/controllers/market_stream_controller");

describe("getSymbolData", () => {
  it("should return 400 if symbol or timeframe is missing", async () => {
    const req = { body: { symbol: null, timeframe: "1h" } };
    const res = {
      status: jasmine
        .createSpy()
        .and.returnValue({ json: jasmine.createSpy() }),
    };
    const next = jasmine.createSpy();

    await getSymbolData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith({
      error: "Both symbol and timeframe input are required",
    });
  });
});
