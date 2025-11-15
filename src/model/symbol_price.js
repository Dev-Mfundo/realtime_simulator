const { pool } = require("../utils/configuration");
const { DatabaseError } = require("../utils/app_error");

const setupTimescaleTable = async () => {
  await pool.connect();
  try {
    await pool.query("BEGIN");
    await pool.query("CREATE EXTENSION IF NOT EXISTS timescaledb;");

    await pool.query(`
    CREATE TABLE IF NOT EXISTS SymbolPrice (
      symbol TEXT NOT NULL,
      timeframe INT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      open NUMERIC(20,8) NOT NULL,
      high NUMERIC(20,8) NOT NULL,
      low NUMERIC(20,8) NOT NULL,
      close NUMERIC(20,8) NOT NULL,
      volume BIGINT,
      create_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (symbol, timeframe, timestamp)
    );
  `);

    await pool.query(`
SELECT create_hypertable('SymbolPrice', 'timestamp', if_not_exists => TRUE, migrate_data => TRUE);

  `);

    await pool.query(`
    ALTER TABLE SymbolPrice SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol, timeframe');
  `);

    await pool.query(`
    SELECT add_compression_policy('SymbolPrice', INTERVAL '1 day', if_not_exists => TRUE)
    WHERE NOT EXISTS (
    SELECT 1 FROM timescaledb_information.compression_settings
    WHERE hypertable_name = 'SymbolPrice'
    );
  `);

    await pool.query(`
    SELECT add_retention_policy('SymbolPrice', INTERVAL '90 days', if_not_exists => TRUE)
    WHERE NOT EXISTS (
    SELECT 1 FROM timescaledb_information.jobs
    WHERE proc_name = 'policy_retention'
    AND hypertable_name = 'SymbolPrice'
    );
  `);

    await pool.query(`
                   CREATE INDEX IF NOT EXISTS idx_symbol_price_main ON SymbolPrice(symbol, timeframe, timestamp DESC);`);
    await pool.query(`
                   CREATE INDEX IF NOT EXISTS idx_symbol_price_compressed ON SymbolPrice(symbol, timestamp, timestamp DESC);

                   `);

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw new DatabaseError("Database setup failed", error);
  }
};

module.exports = { setupTimescaleTable };
