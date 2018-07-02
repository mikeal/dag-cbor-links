const createCBOR = require('dag-cbor-sync')
const cbor = createCBOR()
const CID = require('cids')

const links = (obj, maxsize, path = []) => {
  if (Buffer.isBuffer(obj)) {
    try {
      obj = cbor.deserialize(obj)
    } catch (e) {
      obj = createCBOR(1e+7).deserialize(obj)
      console.error(Object.keys(obj).length)
      throw e
    }

  }
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
              yield [__path.join('/'), new CID(o['/'])]
            }
          }
        } else {
          if (val['/']) yield [ _path.join('/'), new CID(val['/'])]
          else {
            for (let link of links(val, maxsize, _path)) {
              yield link
            }
          }
        }
      }
    }
  })()
}

module.exports = links
