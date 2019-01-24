//=============================================================================
// modules
//=============================================================================
const express = require('express');
const userEnvVariable = require('@softroles/user-env-variable')
const proxy = require('http-proxy-middleware');
const cors = require("cors")

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
userEnvVariable.list(function (err, vars) {
  const services = vars.filter(item => item.indexOf("SOFTROLES_SERVICE") > -1)
    .filter(item => item.indexOf('PORT') > -1)
    .map(item => item.replace('SOFTROLES_SERVICE_', ''))
    .map(item => item.split('_')[0])
  userEnvVariable.get('SOFTROLES_SERVICE_AUTHORIZATION_PORT', function (err, authorizationPort) {
    if (authorizationPort) {
      services.forEach(service => {
        userEnvVariable.get('SOFTROLES_SERVICE_' + service + '_PORT', function (err, servicePort) {
          const beforeAuthFrom = '/' + service.toLowerCase()
          const beforeAuthTo = 'http://127.0.0.1:' + authorizationPort.value + '/authorize' + beforeAuthFrom
          const afterAuthFrom = '/authorized/' + service.toLowerCase()
          const afterAuthTo = 'http://127.0.0.1:' + servicePort.value
          console.log(`Proxy ${beforeAuthFrom} -> ${beforeAuthTo}`)
          console.log(`Proxy ${afterAuthFrom} -> ${afterAuthTo}`)
          app.use(beforeAuthFrom, proxy({ target: beforeAuthTo, changeOrigin: true }));
          app.use(afterAuthFrom, proxy({ target: afterAuthTo, changeOrigin: true, pathRewrite: { '^/authorized': '' } }));
        })
      });
    }
  })
})

app.listen(80, function () {
  console.log("Service running on http://127.0.0.1:80")
})