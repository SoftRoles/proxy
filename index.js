//=============================================================================
// modules
//=============================================================================
const express = require('express');
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const assert = require('assert')
const mongoClient = require("mongodb").MongoClient
const mongodbUrl = "mongodb://127.0.0.1:27017"
const showdown = require('showdown')
const { spawn } = require('child_process');

//-------------------------------------
// proxy middlewares
//-------------------------------------
mongoClient.connect(mongodbUrl, { poolSize: 10, useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  client.db('softroles').collection('services').find({}).toArray((err,docs)=>{
    assert.equal(null,err)
    docs.forEach(service => {
      console.log(`Service proxying: from ${service.name} to http://127.0.0.1:${service.port}`)
      app.use(`/${service.name}`, proxy({ target: `http://127.0.0.1:${service.port}`, changeOrigin: true }));
    })
  })
  client.db('softroles').collection('pages').find({}).toArray((err,docs)=>{
    assert.equal(null,err)
    docs.forEach(page => {
      console.log(`Static page serving: from ${page.name} at ${page.path}`)
      app.use(`/${page.path}`, express.static(path.normalize(`../../pages/${page.name}`)))
    })
  })
  client.db('softroles').collection('websockets').find({}).toArray((err,docs)=>{
    assert.equal(null,err)
    docs.forEach(ws => {
      console.log(`Websocket proxying: from ${ws.name} to ws://127.0.0.1:${ws.port}`)
      app.use(`/${ws.name}`, proxy(`ws://127.0.0.1:${ws.port}`))
    })
  })
})

//=============================================================================
// http server
//=============================================================================
const app = express();

app.use("/apps/propagation", express.static(path.normalize("/root/softroles/jsonshell/propagation/propagation-ui")))
app.use("/bash", proxy({ target: "http://127.0.0.1:3010", changeOrigin: true }));

//-------------------------------------
// common middlewares
//-------------------------------------
app.use(require('morgan')('tiny'));
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require("cors")())

//=============================================================================
// api v1
//=============================================================================
app.get('/jsonshell/:module/:func', function(req, res) {
  //console.log(req.params)
  //console.log(req.query)
  //console.log(process.env.PATH)
  let args = [req.params.func]
  let response = { output: "", error: "", exit: null }
  for (key of Object.keys(req.query)) {
    args.push(`--${key}=${req.query[key]}`)
  }
  try{
    //console.log(process.env)
    var func = spawn(req.params.module, args);
    func.on("error", err => {
      response.error += "function error"
      console.log(err)
      //throw err;
    })
  }
  catch (e) {
    response.error += "spawn error"
    res.send(response)
  }

  //console.log(args)
  func.stdout.on('data', data => {
    response.output += `${data}`
  })
  func.stderr.on('data', data => {
    response.error += `${data}`
  })
  func.on('close', code => {
    response.exit = code
    res.send(response)
  })
});

//-------------------------------------
// docs
//-------------------------------------
showdown.setFlavor('github')
const markdown = new showdown.Converter()
app.get('/proxy/readme', function(req, res){
  fs.readFile('README.md', (err, data)=>{
    const html = markdown.makeHtml(String(data));
    res.send(html)
  })
})

//=============================================================================
// start service
//=============================================================================
let server = app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})

mongoClient.connect(mongodbUrl, { poolSize: 10, useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  client.db('softroles').collection('websockets').find({}).toArray((err,docs)=>{
    assert.equal(null,err)
    docs.forEach(ws => {
      server.on('upgrade', proxy(`ws://127.0.0.1:${ws.port}`).upgrade)
    })
  })
})
