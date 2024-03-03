const https = require('https');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const app = express();
const path = require('path');

const options = {
  key: fs.readFileSync('./sslcert/key.pem'),
  cert: fs.readFileSync('./sslcert/fullchain.pem'),
};

app.use(compression());

app.use(express.static(path.resolve(__dirname, 'build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const server = https.createServer(options, app);

server.listen(443, () => {
  console.log(`Server started on port 443`)
});
