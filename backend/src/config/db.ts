import mysql from 'mysql2/promise';

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db', // 'db' matches our docker-compose service name
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'football_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;