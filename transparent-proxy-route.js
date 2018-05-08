var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxy(); 
var options = { pathnameOnly: true, router: { '/webssh': 'http://127.0.0.1:443'} }

var proxyServer = httpProxy.createServer(options); proxyServer.listen(80);

