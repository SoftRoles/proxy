var fs = require("fs")
var spawn = require("child_process").spawn
var exec = require("child_process").exec

var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")

var proxy = require('http-proxy-middleware');

const app = express();
app.use('/em', proxy({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/dirtree', proxy({ target: 'http://localhost:3001', pathRewrite: {'^/dirtree' : ''}, changeOrigin: true }));
app.use('/webssh', proxy({ target: 'http://localhost:443', pathRewrite: {'^/webssh' : '/ssh/host/127.0.0.1'}, changeOrigin: true }));
app.use('/socket.io', proxy({ target: 'http://localhost:443', changeOrigin: true }));
app.use('/socket.io', proxy({ target: 'ws://localhost:443', changeOrigin: true, ws:true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(__dirname + "/public"))
app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:3000")
})

services = []
ps_services = []  // platform dependent services
childs = []
fs.readdir("..", function (err, files) {
  if (!err) {
    files.filter(file => {
      if (fs.statSync("../" + file).isDirectory() && file !== "3000-proxy") {
        if (ps_services.indexOf(file) == -1) {
          // var child = (file[0] == "3") ? spawn("nodemon.cmd", ["../" + file + "/app.js", "--watch", "../" + file + "/app.js"], { cwd: "../" + file })
          //   : spawn("nodemon.cmd", ["../" + file + "/app.py", "--watch", "../" + file + "/app.py"], { cwd: "../" + file })
          var child = (file[0] == "3") ? spawn("node", ["../" + file + "/app.js"], { cwd: "../" + file })
            : spawn("python", ["../" + file + "/app.py"], { cwd: "../" + file })
          child.on('exit', function (code, signal) { console.log("[" + file + `]: Exited with code ${code} and signal ${signal}`) });
          child.stdout.on('data', (data) => { console.log("[" + file + `]: ${data}`) });
          child.stderr.on('data', (data) => { console.log("[" + file + `]: ${data}`) });
          services.push({ name: file, stat: 1 })
          childs.push({ name: file, proc: child })
        }
      }
    })
  }
})

app.get("/proxy/list", function (req, res) {
  res.send(services)
})

app.get("/proxy/service/:service", function (req, res) {
  var new_child = (req.params.service[0] == "3") ? spawn("node", ["../" + req.params.service + "/app.js"], { cwd: "../" + req.params.service })
    : spawn("python", ["../" + req.params.service + "/app.py"], { cwd: "../" + req.params.service })
  new_child.on('exit', function (code, signal) { console.log("[" + req.params.service + `]: Exited with code ${code} and signal ${signal}`) });
  new_child.stdout.on('data', (data) => { console.log("[" + req.params.service + `]: ${data}`) });
  new_child.stderr.on('data', (data) => { console.log("[" + req.params.service + `]: ${data}`) });
  var child = childs.filter(function (child) { return child.name == req.params.service })[0]
  var service = services.filter(function (service) { return service.name == req.params.service })[0]
  if (child) { child = new_child; service.stat = 1; }
  else { services.push({ name: req.params.service, stat: 1 }); childs.push({ name: req.params.service, proc: child }) }
})

app.delete("/proxy/service/:service", function (req, res) {
  var child = childs.filter(function (child) { return child.name == req.params.service })[0]
  var service = services.filter(function (service) { return service.name == req.params.service })[0]
  exec('taskkill /PID ' + child.proc.pid + ' /T /F', function (error, stdout, stderr) {
    if (error) {
      res.send({ error: error })
    }
    else {
      child = null
      service.stat = 0
      res.send("K")
    }
  });
})
