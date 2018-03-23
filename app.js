var fs = require("fs")
var spawn = require("child_process").spawn
var exec = require("child_process").exec

var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")
var notifier = require('node-notifier');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(__dirname + "/test"))
app.listen(3000, function () {
  notifier.notify({
    title: 'Service: 3000-proxy',
    message: "Started succesfully!",
    wait: true
  });
})

app.get("/proxy/list", function (req, res) {
  fs.readdir("..", function (err, files) {
    if (!err) {
      res.send(files.filter(file => {
        return fs.statSync("../" + file).isDirectory() && file !== "3000-proxy"
      }));
    }
    else res.send(err)
  })
})

apps = []
app.get("/proxy/app/:app", function (req, res) {
  var child = { name: req.params.app }
  child.proc = spawn("node", ["../" + req.params.app + "/app.js"])
  child.proc.on('exit', function (code, signal) {
    console.log(child.name + ' exited with ' + `code ${code} and signal ${signal}`);
  });
  child.proc.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`);
  });
  child.proc.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
  });
  apps.push(child)
  console.log(req.params.app)
})

app.delete("/proxy/app/:app", function (req, res) {
  var child = apps.filter(function (child) { return child.name == req.params.app })[0]
  exec('taskkill /PID ' + child.proc.pid + ' /T /F', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      res.send({error: error})
    }
    else {
      apps = apps.filter(function (app) { return app.name !== req.params.app })
      res.send("OK")
    }
  });
})
