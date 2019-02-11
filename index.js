//=============================================================================
// modules
//=============================================================================
const express = require('express');
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

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
// proxy middlewares
//-------------------------------------
const services = JSON.parse(fs.readFileSync(path.join(__dirname,'services.json')))
services.forEach(service => {
  console.log(`Service proxying: from ${service.name} to http://127.0.0.1:${service.port}`)
  app.use(`/${service.name}`, proxy({ target: `http://127.0.0.1:${service.port}`, changeOrigin: true }));
})

const pages = JSON.parse(fs.readFileSync(path.join(__dirname,'pages.json')))
pages.forEach(page => {
  console.log(`Static page serving: from ${page.name} at ${page.path}`)
  app.use(`/${page.path}`, express.static(path.normalize(`../../Pages/${page.name}`)))
})


let websockets = JSON.parse(fs.readFileSync(path.join(__dirname,'websockets.json')))
websockets.forEach(ws => {
  ws.proxy = proxy(`ws://127.0.0.1:${ws.port}`)
  console.log(`Websocket proxying: from ${ws.name} to ws://127.0.0.1:${ws.port}`)
  app.use(`/${ws.name}`, ws.proxy)
})

//=============================================================================
// start service
//=============================================================================
let server = app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})
websockets.forEach(ws => {
  server.on('upgrade', ws.proxy.upgrade)
})