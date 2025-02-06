const http = require('http');
const db = require('./database');  // Import the database connection


const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // CORS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === "GET" && req.url === "/data") {
        db.query("SELECT * FROM login", (err, results) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Database query failed" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        });
    } 
    // POST /register: Insert username and password into the "login" table
    else if (req.method === "POST" && req.url === "/register") {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(data);

                // Insert username and password into the "login" table
                const query = 'INSERT INTO login (username, password) VALUES (?, ?)';
                db.query(query, [username, password], (err, results) => {
                    if (err) {
                        console.error("Database insertion error:", err); // Log error
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error", details: err.message }));
                        return;
                    }

                    console.log(`User ${username} registered successfully`); // Log success
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "User registered successfully!" }));
                });
            } catch (e) {
                console.error("Error parsing request data:", e); // Log parsing error
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid request data" }));
            }
        });
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

server.listen(3001, () => {
    console.log("Server running at http://localhost:3001/");
});
