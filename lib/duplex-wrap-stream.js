const {Duplex} = require('stream')

class DuplexWrapStream extends Duplex {
  constructor(opt){
  
    opt.objectMode = true
    super(opt)
    this._cache = []
  }
  _write(chunk, encoding, callback) {
    this._cache.push(chunk.toString());
    // console.log('Write')
    callback();
   
  }

  _read(size){
    // console.log('Read data')
    while(this._cache.length){
      
      let chunk = this._cache.shift()
      this.push(chunk.toString())
    }
    setTimeout(()=>{
      this._read(size)
    },100)
  }
}

module.exports = DuplexWrapStream