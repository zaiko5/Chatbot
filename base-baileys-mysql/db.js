// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,     // ej: 'localhost'
    user: process.env.DB_USER,     // ej: 'root'
    password: process.env.DB_PASS, // tu contraseña
    database: process.env.DB_NAME, // nombre de tu base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;