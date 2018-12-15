var express = require('express')
var os = require("os")
var path = require("path")

const app = express();

let desktopPath = os.homedir()
if (process.platform == "win32") desktopPath = path.join(desktopPath, "desktop")
// console.log(desktopPath)
const apps = [
  { id: "3000-proxy", port: 80, daemon: null }
]

// var nodemon = require('nodemon');




apps.forEach(app => {
  // app.daemon = nodemon({
  //   script: path.join(desktopPath, "Servisler", app.id, "app.js"),
  //   watch: path.join(desktopPath, "Servisler", app.id),
  //   ext: 'js'
  // });
  // app.daemon.on('start', () => console.log(app.id, "started."))
  // app.daemon.on('quit', () => console.log(app.id, "has quit."))
  // app.daemon.on('restart', (files) => console.log(app.id, "restarted due to: ", files))
  // console.log(app.daemon)
})

// var nodemon = require('nodemon');

// nodemon({ script: 'app.js' }).on('start', function () {
//   console.log('nodemon started');
// }).on('crash', function () {
//   console.log('script crashed for some reason');
// });


// // force a restart
// nodemon.emit('restart');

// // force a quit
// nodemon.emit('quit');



app.listen(8888, function () {
  console.log("Service running on http://127.0.0.1:8888")
})

//=============================================================================
// process controller clean up
//=============================================================================
process.stdin.resume();//so the program will not close instantly
function exitHandler(options, exitCode) {
  apps.forEach(app => {
    // if (app.daemon) app.daemon.emit("quit")
  })
  if (options.cleanup) console.log('clean');
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
