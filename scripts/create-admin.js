require('dotenv').config();
const readline = require('node:readline/promises');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
  if ((process.env.DB_MODE || 'demo').toLowerCase() !== 'mysql') throw new Error('Configura DB_MODE=mysql y las variables MYSQL_* antes de crear un administrador.');
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  const username = (await terminal.question('Nombre de usuario administrador: ')).trim();
  const email = (await terminal.question('Correo del administrador: ')).trim().toLowerCase();
  const password = await terminal.question('Contraseña (mínimo 12 caracteres): ', { hideEchoBack: true });
  terminal.close();
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]{3,40}$/.test(username)) throw new Error('Nombre inválido.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Correo inválido.');
  if (password.length < 12) throw new Error('La contraseña debe tener al menos 12 caracteres.');
  const pool = mysql.createPool({ host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT || 3306), database: process.env.MYSQL_DATABASE, user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD });
  const hash = await bcrypt.hash(password, 12);
  const [result] = await pool.query("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'admin')", [username, email, hash]);
  await pool.query('INSERT INTO user_stats (user_id) VALUES (?)', [result.insertId]);
  await pool.query("INSERT INTO subscriptions (user_id, plan, status) VALUES (?, 'free', 'active')", [result.insertId]);
  await pool.end();
  console.log(`Administrador creado con id ${result.insertId}.`);
}

main().catch((error) => { console.error(`No se pudo crear el administrador: ${error.message}`); process.exitCode = 1; });
