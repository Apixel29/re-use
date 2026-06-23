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

// Render y otros proveedores de BD en la nube requieren SSL
if (isProduction || process.env.DB_SSL === 'true') {
    poolConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = new Pool(poolConfig);

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