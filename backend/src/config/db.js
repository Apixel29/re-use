const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
      };

poolConfig.max = 10; // Límite de conexiones concurrentes en el pool
poolConfig.idleTimeoutMillis = 30000;

// Habilitar SSL si no es localhost/127.0.0.1 o si se fuerza por entorno
const host = poolConfig.host || '';
const connStr = poolConfig.connectionString || '';
const isLocal = host === 'localhost' || host === '127.0.0.1' || connStr.includes('localhost') || connStr.includes('127.0.0.1');

if (!isLocal || isProduction || process.env.DB_SSL === 'true') {
    poolConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = new Pool(poolConfig);

console.log('--- DB connection config debug ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_SSL:', process.env.DB_SSL);
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);
console.log('Is connection local:', isLocal);
console.log('SSL configuration active:', !!poolConfig.ssl);
console.log('----------------------------------');

// Comprobar conexión al inicializar
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al adquirir cliente del pool de PostgreSQL:', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos PostgreSQL.');
        release();
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};