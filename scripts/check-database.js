require('dotenv').config();
const { connectDatabase, demoMode } = require('../src/config/database');

if (demoMode) {
  console.log('DB_MODE=demo: la aplicación está usando el almacén temporal en memoria.');
  process.exit(0);
}

connectDatabase()
  .then(async (pool) => {
    const [rows] = await pool.query('SELECT DATABASE() AS database_name, VERSION() AS mysql_version');
    console.log(`MySQL conectado: ${rows[0].database_name} (${rows[0].mysql_version})`);
    await pool.end();
  })
  .catch((error) => {
    console.error(`No se pudo conectar a MySQL: ${error.message}`);
    process.exitCode = 1;
  });
