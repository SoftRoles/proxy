var express = require('express')
const app = express();

// proxies
var proxy = require('http-proxy-middleware');
const proxyDefault = {changeOrigin: true, onProxyReq: (proxyReq, req) => {
  if (req.user) proxyReq.setHeader("Authorization", "Bearer " + req.user.token);
}}
app.use('/filesystem', proxy({ target: 'http://127.0.0.1:3001', changeOrigin: true }));
app.use('/webscrap', proxy({ target: 'http://127.0.0.1:3003', changeOrigin: true }));
app.use('/mongodb', proxy({ target: 'http://127.0.0.1:3005', changeOrigin: true }));
app.use('/login', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/logout', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/user', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/403', proxy({ target: 'http://127.0.0.1:3007', changeOrigin: true }));
app.use('/serialport', proxy(Object.assign({target: 'http://127.0.0.1:3008'}, proxyDefault)))
app.use('/localcdn', proxy({ target: 'http://127.0.0.1:3009', changeOrigin: true }));

app.use('/socket/serialport', proxy({target: 'http://127.0.0.1:3008', pathRewrite:{"^/socket/serialport":"/socket.io"}, ws:true}))

// platform specific proxies
var os = require('os');
var path = require('path');
if (process.platform == "win32") {
  app.use("/", express.static(path.join(os.homedir(), "desktop/Sayfalar/9000-antenio")))
  app.use("/favorites", express.static(path.join(os.homedir(), "desktop/Uygulamalar/8000-favorites")))
  app.use("/serial", express.static(path.join(os.homedir(), "desktop/Uygulamalar/8002-serial")))
  app.use("/local", express.static(path.join(os.homedir(), "desktop/Yerel")))
}
else {
  app.use("/", express.static(path.join(os.homedir(), "/Sayfalar/9000-antenio")))
  app.use("/favorites", express.static(path.join(os.homedir(), "/Uygulamalar/8000-favorites")))
  app.use("/serial", express.static(path.join(os.homedir(), "/Uygulamalar/8002-serial")))
}

// default middlewares
var bodyParser = require("body-parser")
var cors = require("cors")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})
