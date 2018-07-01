# Get all links in a single `dag-cbor` node.

Usage:

```javascript
let links = require('dag-cbor-links')
let cbor = require('dag-cbor-sync')()

let node = {
  mylink: {'/': 'zdpuAkv7jA671owT26AnJiFXG9usHmCAW6MTzpwFJw46X1PLG'},
  myarray: [
    {'/': 'zdpuAkv7jA671owT26AnJiFXG9usHmCAW6MTzpwFJw46X1PLG'}
  ]
}

let buffer = cbor.serialize(node)
for (let link of links(buffer)) {
  console.log(link)
  /* prints:
    {path: 'mylink', cid: CID(zdpuAkv7jA671owT26AnJiFXG9usHmCAW6MTzpwFJw46X1PLG)}
    {path: 'myarray/0', cid: CID(zdpuAkv7jA671owT26AnJiFXG9usHmCAW6MTzpwFJw46X1PLG)}
  */
}
```

