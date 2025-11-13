const {pool} = require('../utils/configuration')

const setupTimescaleTable = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS SymbolPrice (
      id SERIAL PRIMARY KEY,
      symbol VARCHAR(15) NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      open NUMERIC NOT NULL,
      high NUMERIC NOT NULL,
      low NUMERIC NOT NULL,
      close NUMERIC NOT NULL,
      volume BIGINT
    );
  `);

  await pool.query(`
    SELECT create_hypertable('SymbolPrice', 'timestamp', if_not_exists => TRUE);
  `);

  await pool.query(`
    ALTER TABLE SymbolPrice SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol');
  `);

  await pool.query(`
    SELECT add_compression_policy('SymbolPrice', INTERVAL '7 days');
  `);

  await pool.query(`
    SELECT add_retention_policy('SymbolPrice', INTERVAL '90 days');
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_symbol ON SymbolPrice(symbol);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_timestamp ON SymbolPrice(timestamp DESC);`);
};



module.exports={createSymbolPriceTable}