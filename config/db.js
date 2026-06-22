require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 10, // conexiones simultáneas máximas
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
pool.on('error', (err) => {
    console.error('Error inesperado en cliente idle de PostgreSQL', err);
});
module.exports = pool;