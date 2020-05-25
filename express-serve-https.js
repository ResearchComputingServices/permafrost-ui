const https = require('https');
const fs = require('fs');
const expressApp = require('./express-app.js');
const ip = require("ip");
const port = 3000

const server = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/example.org/fullchain.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/example.org/privkey.pem', 'utf8')
}, expressApp);

server.listen(port);

console.log("Server running on:\n\thttps://localhost:" + port + "\n\thttps://" + ip.address() + ":" + port)