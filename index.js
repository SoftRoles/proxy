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
const services = JSON.parse(fs.readFileSync('services.json'))
services.forEach(service => {
  if (service.name !== 'authorization') {
    app.use(`/${service.name}`, proxy({ target: `http://127.0.0.1:3007/authorize/service`, changeOrigin: true }));
    app.use(`/authorized/${service.name}`, proxy({ target: `http://127.0.0.1:${service.port}`, pathRewrite: { '^/authorized': '' }, changeOrigin: true }));
  }
  else {
    app.use(`/${service.name}`, proxy({ target: `http://127.0.0.1:${service.port}`, changeOrigin: true }));
  }
})

const pages = JSON.parse(fs.readFileSync('pages.json'))
pages.forEach(page => {
  app.use(`/${page.name}`, express.static(path.normalize(`../../Pages/${page.name}`)))
})
//=============================================================================
// start service
//=============================================================================
app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})