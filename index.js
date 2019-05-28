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

//-------------------------------------
// common middlewares
//-------------------------------------
app.use(require("morgan")('tiny'))
app.use(require("cors")())

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
