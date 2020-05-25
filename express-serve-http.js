const express = require('express');
const path = require('path');
const app = express();
const ip = require("ip");
const port = 9000

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);

console.log("Server running on:\n\thttp://localhost:" + port + "\n\thttp://" + ip.address() + ":" + port)
