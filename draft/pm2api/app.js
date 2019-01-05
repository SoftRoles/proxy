const fs = require("fs")
const path = require("path")

const pm2 = require("pm2")
pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
})

var asyncLoop = require('node-async-loop');

const freePort = require("find-free-port")

const argparse = require("argparse")
  
let dir = path.normalize(__dirname + "/../../..")
fs.readdir(dir, function (err, items) {
  let services = items.filter(item => {
    let isDirectory = fs.statSync(path.join(dir, item)).isDirectory()
    let isSelf = path.basename(path.normalize(__dirname + "/../..")) == item
    return isDirectory && !isSelf
  })
  asyncLoop(services, function (service, next) {
    freePort(3000, (err, port) => {
      console.log(port)
      pm2.start(path.join(dir, service, "app.js"), { name: service }, function (err, proc) {
        if (err) throw err
        else {
          // console.log(proc)
          pm2.list(function (err, items) {
            items.forEach(item => { console.log(item.name) })
          })
          setTimeout(function () { next() }, 5000)
        }
      })
    })
  }, function (err) {
    if (err) console.log(err)
    else console.log("Finished.")
    pm2.disconnect()
  })
  // console.log(services)
  // items.forEach(item => {
  // console.log(item, ": ", fs.statSync(path.join(dir, item)).isDirectory())
  // })
})

// pm2.connect(function (err) {
//   if (err) {
//     console.error(err);
//     process.exit(2);
//   }

// pm2.start(path.normalize(__dirname + "/../app.1.js"), { name: "test" }, function (err, proc) {
//   if (err) throw err
//   else {
//     console.log(proc)
//     pm2.list(function (err, items) {
//       items.forEach(item => { console.log(item.name) })
//     })
//     setTimeout(function(){pm2.disconnect()},5000)     
//   }

// })

// pm2.list(function(err,items){
//   items.forEach(item=>{console.log(item.name)})
// })
// setTimeout(pm2.disconnect,5000)
// });

var ArgumentParser = argparse.ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
});
parser.addArgument(
  ['-p', '--port'],
  {
    type: "int",
    help: 'server listening port'
  }
);
var args = parser.parseArgs();
console.dir(args);
console.dir(args.port);