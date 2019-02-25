- [proxy](#proxy)
  - [Platform](#platform)
  - [Requirements](#requirements)
  - [Command Line Arguments](#command-line-arguments)
  - [Configuration Files](#configuration-files)
  - [Usage](#usage)
  - [Credits](#credits)
  - [License](#license)

# proxy 
> Proxy service for other SoftRoles services. 

This service simply transfers incoming traffic to the other services and websockets. Also static webpages can be served within this __*proxy*__ service

## Platform

Code is tested on following platforms:
 - **Linux**: Ubuntu 18.04 LTS x64
 - **Windows**: Win7, Win10

## Requirements

Service code is developed and tested within environment that has:

 - **Node.js**: v.10.15

## Command Line Arguments

No command line arguments.

## Configuration Files

Files below are needed to run services.

| File              | Type | Sample                               |
| :---------------- | :--- | :----------------------------------- |
| *services.json*   | json | `{"name": "database", "port": 3005}` |
| *pages.json*      | json | `{"name": "login", "path": "login"}` |
| *websockets.json* | json | `{"name": "stats", "port": 3010}`    |


## Usage

`$ node index.js`

or with pm2 *ecosystem.config.js* file

```
module.exports = {
  apps: [{
    name: 'proxy',
    cwd: 'Services/proxy',
    script: 'index.js',
    autorestart: true,
    watch: ['index.js', 'services.json', 'pages.json', 'websockets.json'],
    watch_delay: 5000,
    restart_delay: 10000,
    max_restarts: 6,
    max_memory_restart: '1G'
  }]
}
```

`$ pm2 start ecosystem.config.js`

## Credits

  - [SoftRoles](http://github.com/softroles) as organization
  - [Hüseyin Yiğit](http://github.com/yigithsyn) as main contributor

## License

[The MIT License](http://opensource.org/licenses/MIT)