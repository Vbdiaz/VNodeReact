const http = require('http');
const db = require('./database'); // Import database connection

// Create HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET /data: Fetch all records from the "login" table
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
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const query = 'INSERT INTO login (username, password) VALUES (?, ?)';
                
                db.query(query, [username, password], (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "User registered successfully!" }));
                });
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid request data" }));
            }
        });
    } 
    // Handle unknown routes
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

// Start server
server.listen(3001, () => console.log("Server running at http://localhost:3001/"));
