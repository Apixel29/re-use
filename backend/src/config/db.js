const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    max: 10, // Límite de conexiones concurrentes en el pool
    idleTimeoutMillis: 30000
});

// Comprobar conexión al inicializar
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al adquirir cliente del pool de PostgreSQL:', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos PostgreSQL (reuse_db).');
        release();
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};