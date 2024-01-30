const https = require('https');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const { StaticRouter } = require('react-router-dom');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const app = express();
const path = require('path');

const App = require('./src/components/app/App')

const options = {
  key: fs.readFileSync('./sslcert/key.pem'),
  cert: fs.readFileSync('./sslcert/fullchain.pem'),
};

app.use(compression());

app.use(express.static(path.resolve(__dirname, 'build')))

app.use('*', (req, res) => {

  let indexHTML = fs.readFileSync( path.resolve(__dirname, 'build', 'index.html'), {
    encoding: 'utf8',
  } );

  const context = {};
  const reactMarkup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const finalHtml = indexHTML.replace('<div id="root"></div>', `<div id="root">${reactMarkup}</div>`);

  return res.send( finalHtml );
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

const server = https.createServer(options, app);

server.listen(443, () => {
    console.log(`Server started on port 443`)
});
