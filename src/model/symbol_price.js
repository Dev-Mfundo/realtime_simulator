const {pool} = require('../utils/configuration')

const setupTimescaleTable = async () => {
try {
  await pool.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');
} catch (err) {
  console.error('Failed to create extension:', err);
}


  await pool.query(`
    CREATE TABLE IF NOT EXISTS SymbolPrice (
      symbol VARCHAR(15) NOT NULL,
      timeframe VARCHAR(3) NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      open NUMERIC NOT NULL,
      high NUMERIC NOT NULL,
      low NUMERIC NOT NULL,
      close NUMERIC NOT NULL,
      volume BIGINT
    );
  `);

  await pool.query(`
SELECT create_hypertable('public.SymbolPrice', 'timestamp', if_not_exists => TRUE);

  `);

  await pool.query(`
    ALTER TABLE SymbolPrice SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol');
  `);

  //await pool.query(`
    //SELECT add_compression_policy('SymbolPrice', INTERVAL '7 days');
  //`);

  //await pool.query(`
    //SELECT add_retention_policy('SymbolPrice', INTERVAL '90 days');
  //`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_symbol ON SymbolPrice(symbol, timeframe, timestamp DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_timestamp ON SymbolPrice(timestamp DESC);`);

  console.log('Hypertable created');

};



module.exports={setupTimescaleTable}
