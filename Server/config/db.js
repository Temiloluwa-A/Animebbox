const mysql = require("mysql2/promise");

// connection pool so we can run async queries against MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "anime_app",
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;
