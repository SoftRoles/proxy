//=============================================================================
// modules
//=============================================================================
const express = require('express');
const proxy = require('http-proxy-middleware');
const fs = require('fs');

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
const services = JSON.parse(fs.readFileSync('services.json'))
services.forEach(service => {
  app.use(`/${service.name}`, proxy({ target: `/authorize/${service.name}`, changeOrigin: true }));
  app.use(`/authorized/${service.name}`, proxy({ target: `http://127.0.0.1:${service.port}`, pathRewrite: { '^/authorized': '' }, changeOrigin: true }));
})

//=============================================================================
// start service
//=============================================================================
app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})