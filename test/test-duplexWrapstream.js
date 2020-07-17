const child_process = require('child_process')

const DuplexWrapStream = require('../lib/duplex-wrap-stream')
const dps = new DuplexWrapStream({highWaterMark:1})


// dps.on('pipe', (src) => {
//   console.log('Something is piping into the writer.');
//   // assert.equal(src,cp.stdout );
  
// });
dps.on('data',(chunk)=>{
  console.log(chunk)
})
let cp = child_process.spawn('pm2',['log','2'])
cp.stdout.pipe(dps)
cp.stderr.pipe(dps)
