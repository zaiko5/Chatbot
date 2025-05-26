// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        database: process.env.MYSQL_DB_NAME,
        password: process.env.MYSQL_DB_PASSWORD,
        port: parseInt(process.env.MYSQL_DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;