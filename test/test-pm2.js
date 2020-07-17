const pm2Dect = require('../lib/pm2_detector')
const fs = require('fs')
let p = new pm2Dect()

p.on('watch_upd',(ret)=>{
  console.log(JSON.stringify(ret))
})
p.connect().then(()=>{
  p.watch()
})