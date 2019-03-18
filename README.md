 [proxy](#proxy)
  - [Platform](#platform)
  - [Dependency](#dependency)
  - [Install](#install)
  - [Start](#start)
  - [Proxy Inputs](#proxy-inputs)
  - [Usage](#usage)
  - [Command Line Arguments](#command-line-arguments)
  - [Credits](#credits)
  - [License](#license)

# proxy 
> Proxy service for other SoftRoles services. 

This service simply transfers incoming traffic to the other services and websockets. Also static webpages can be served within this __*proxy*__ service

## Platform

Code is tested on following platforms:
 - **Linux**: Ubuntu 18.04 LTS x64
 - **Windows**: Win7, Win10

Service code is developed and tested within environment that has:

 - **[Node.js: v.10.x](https://nodejs.org/dist/latest-v10.x/)**
 - **[MongoDB: v.4.x](https://www.mongodb.com/download-center/community)**: Runs as a database service

## Dependency
 
 This service is standalone, does not depend any other *SoftRoles* service.

## Install

```
$ npm install
```

## Start

```
$ node index.js
```

or with pm2 *ecosystem.config.js* file

```javascript
module.exports = {
  apps: [{
    name: 'proxy',
    cwd: 'Services/proxy',
    script: 'index.js',
    autorestart: true,
    watch: ['index.js'],
    watch_delay: 5000,
    restart_delay: 10000,
    max_restarts: 6,
    max_memory_restart: '1G'
  }, {
    ...
  }]
}
```

`$ pm2 start ecosystem.config.js`

## Proxy Inputs

Proxy inputs are taken from MongoDB database. In order to register service/page/websocket following commands can be used in bash to insert.

```bash
mongo softroles --eval "db.services.insertOne({name:'database', port:3005})" # for services
mongo softroles --eval "db.pages.insertOne({name:'login', path:'login'})" # for pages
mongo softroles --eval "db.websockets.insertOne({name:'system', port:3010})" # for websockets
```

## Command Line Arguments

No command line arguments.

## Credits

  - [SoftRoles](http://github.com/softroles) as organization
  - [Hüseyin Yiğit](http://github.com/yigithsyn) as main contributor

## License

[The MIT License](http://opensource.org/licenses/MIT)
