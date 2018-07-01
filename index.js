const cbor = require('dag-cbor-sync')()
const CID = require('cids')

const links = (obj, path = []) => {
  if (Buffer.isBuffer(obj)) obj = cbor.deserialize(obj)
  return (function * () {
    for (let key in obj) {
      let _path = path.slice()
      _path.push(key)
      let val = obj[key]
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            let __path = _path.slice()
            __path.push(i)
            let o = val[i]
            if (typeof o === 'object' && o['/']) {
              yield {path: __path.join('/'), cid: new CID(o['/'])}
            }
          }
        } else {
          if (val['/']) yield {
            path: _path.join('/'), cid: new CID(val['/'])
          }
          else {
            for (let link of links(val, _path)) {
              yield link
            }
          }
        }
      }
    }
  })()
}

module.exports = links
