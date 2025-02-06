const mysql = require('mysql2');
const fs = require('fs');

// Database connection configuration
const db = mysql.createConnection({
    host: "mysql-344edd44-first-project1234.i.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_tWRNiEjGh9XP6kCgrdE",
    database: "defaultdb",
    port: "26056",
    ssl: { ca: fs.readFileSync("./ca.pem") } // Load CA certificate for SSL
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

module.exports = db;
