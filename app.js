var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")

var fs = require('fs');
// var http = require('http');
// var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

var proxy = require('http-proxy-middleware');

const app = express();
// app.use('/em', proxy({ target: 'http://localhost:5001', changeOrigin: true }));
// app.use('/dirtree', proxy({ target: 'http://localhost:3001', pathRewrite: {'^/dirtree' : ''}, changeOrigin: true }));
app.use('/filesystem', proxy({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/mongodb', proxy({ target: 'http://localhost:3005', changeOrigin: true }));
app.use('/webssh', proxy({ target: 'http://localhost:3004', pathRewrite: {'^/webssh' : '/ssh/host/127.0.0.1'}, changeOrigin: true }));
app.use('/socket.io', proxy({ target: 'http://localhost:3004', changeOrigin: true }));
app.use('/socket.io', proxy({ target: 'ws://localhost:3004', changeOrigin: true, ws:true }));
app.use('/favorites', proxy({ target: 'http://localhost:8000', changeOrigin: true }));
app.use('/ide', proxy({ target: 'http://localhost:8001', changeOrigin: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(__dirname + "/public"))

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(80);
// httpsServer.listen(443);

app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})
