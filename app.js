var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")

var proxy = require('http-proxy-middleware');

const app = express();
// app.use('/em', proxy({ target: 'http://localhost:5001', changeOrigin: true }));
// app.use('/dirtree', proxy({ target: 'http://localhost:3001', pathRewrite: {'^/dirtree' : ''}, changeOrigin: true }));
app.use('/mongodb', proxy({ target: 'http://localhost:3005', changeOrigin: true }));
app.use('/webssh', proxy({ target: 'http://localhost:443', pathRewrite: {'^/webssh' : '/ssh/host/127.0.0.1'}, changeOrigin: true }));
app.use('/socket.io', proxy({ target: 'http://localhost:443', changeOrigin: true }));
app.use('/socket.io', proxy({ target: 'ws://localhost:443', changeOrigin: true, ws:true }));
app.use('/favorites', proxy({ target: 'http://localhost:8000', changeOrigin: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(__dirname + "/public"))
app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})
