const pm2 = require('pm2')
const util = require('util')
const _ = require('lodash')
const EventEmitter = require('events');
class Pm2Detector extends  EventEmitter {
  constructor(opt = {monitInterval:1000}){
    super()
    this.opt = opt
    this.connect = util.promisify(pm2.connect.bind(pm2))
    this._list = util.promisify(pm2.list.bind(pm2))
    this._stop = util.promisify(pm2.stop)
    this._start = util.promisify(pm2.start)
  }

  list(){
    return this.connect().then(()=>{
      return this._list()
    }).then(data=>{
      return data.map(app=>{
        let {name,pm2_env,monit} =app
        let {status,pm2_uptime} = pm2_env
        return {name,status,pm2_uptime,monit}
      })
    })
  }

  disconnect(){
    pm2.disconnect()
  }

  watch(){
    if(!this._watchHandle){
      this._watchHandle=setInterval(()=>{
        this.list().then((ret)=>{
          this.emit('watch_upd',ret)
        })
       
      },this.opt.monitInterval)
    }
  }

  unWatch(){
    clearInterval(this._watchHandle)
    delete this._watchHandle
  }

  async stop(name){
    let ret = await this._stop(name)
    return ret
  }

  start(name){
    return this._start(name)
  }

  reload(name){
    return this._stop(name).then(()=>{
      return this._start()
    })
  }
}

module.exports = Pm2Detector