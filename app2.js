var http = require('http'), httpProxy = require('http-proxy'); // // Create your proxy server and set the target in the options. // httpProxy.createProxyServ

httpProxy.createProxyServer({target:'http://localhost:3004'}).listen(80); // See ()

