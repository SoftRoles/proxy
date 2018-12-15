
var pm2 = require('pm2');

pm2.connect(true, function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.list((err, processList)=>{
    console.log(processList[0].name)
    console.log(processList[0].pid)
    console.log(processList[0].pm2_env.pm_out_log_path)
  })
});

