const config = require('../../config.js');

module.exports = {
    database: {
        host: `${config.DB_HOST}`,
        port: `${config.DB_PORT}`,
        user: `${config.DB_USER}`,
        password: `${config.DB_PASS}`,
        database: `${config.DB_NAME}`,
        charset: 'utf8mb4', // Configura el conjunto de caracteres a utf8mb4
        collation: 'utf8mb4_unicode_ci' // Configura la codificación a utf8mb4_unicode_ci
    }
}