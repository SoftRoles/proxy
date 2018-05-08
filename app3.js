var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxy(); 
var options = { pathnameOnly: true, router: { '/wiki': '127.0.0.1:3004'} }

var proxyServer = httpProxy.createServer(options); proxyServer.listen(80);

