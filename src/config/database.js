const mysql = require('mysql2/promise');

const demoMode = (process.env.DB_MODE || 'demo').toLowerCase() !== 'mysql';
let pool = null;

function getMysqlConfig() {
  const config = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  };
  const missing = ['host', 'database', 'user', 'password'].filter((key) => !config[key]);
  if (missing.length) throw new Error(`Faltan variables de MySQL: ${missing.map((key) => `MYSQL_${key.toUpperCase()}`).join(', ')}.`);
  return config;
}

async function connectDatabase() {
  if (demoMode) return null;
  pool = mysql.createPool({
    ...getMysqlConfig(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  });
  await pool.query('SELECT 1');
  return pool;
}

function getPool() {
  if (!pool) throw new Error('La conexión MySQL no está inicializada.');
  return pool;
}

module.exports = { connectDatabase, getPool, getMysqlConfig, demoMode };
