var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")

var fs = require('fs');
var os = require('os');
var path = require('path');

var proxy = require('http-proxy-middleware');

const app = express();
app.use('/filesystem', proxy({ target: 'http://127.0.0.1:3001', changeOrigin: true }));
app.use('/webscrap', proxy({ target: 'http://127.0.0.1:3003', changeOrigin: true }));
app.use('/mongodb', proxy({ target: 'http://127.0.0.1:3005', changeOrigin: true }));
app.use('/login', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/logout', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/user', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/user', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/serialport', proxy({ target: 'http://127.0.0.1:3008', changeOrigin: true }));
if(process.platform == "win32"){
	app.use("/favorites", express.static(path.join(os.homedir(), "desktop/Uygulamalar/8000-favorites")))
}
else{
	app.use("/favorites", express.static(path.join(os.homedir(), "/Uygulamalar/8000-favorites")))
}
if(process.platform == "win32"){
	app.use("/", express.static(path.join(os.homedir(), "desktop/Sayfalar/9000-antenio")))
}
else{
	app.use("/", express.static(path.join(os.homedir(), "/Sayfalar/9000-antenio")))
}

app.use("/", express.static(path.join(__dirname, "node_modules")))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})
