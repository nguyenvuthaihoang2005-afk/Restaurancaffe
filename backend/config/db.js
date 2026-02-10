const mysql = require('mysql2');
require('dotenv').config();  // Phải có dòng này để đọc .env

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'restaurants_cafe',
  charset: 'utf8mb4'
  // KHÔNG THÊM PORT ở đây, vì MySQL mặc định 3306
});

connection.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = connection;