const fs = require("fs")
const path = require("path")

// let dir = path.normalize(__dirname+"/..")
// fs.readdir(dir, function(err, items){
//   items.forEach(item=>{
//     console.log(item,": ", fs.statSync(path.join(dir,item)).isDirectory())
//   })
// })

const pm2 = require("pm2")

pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

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
});

var asyncLoop = require('node-async-loop');
 
var directories = ['test', 'test/hello', 'test/hello/world'];
asyncLoop(directories, function (directory, next)
{
    fs.mkdir(directory, function (err)
    {
        if (err)
        {
            next(err);
            return;
        }
 
        next();
    });
}, function (err)
{
    if (err)
    {
        console.error('Error: ' + err.message);
        return;
    }
 
    console.log('Finished!');
});