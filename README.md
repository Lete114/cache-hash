# Cache-hash

![visitor](https://visitor_badge.deta.dev/?pageID=github.Lete114.cache-hash)
![version](https://img.shields.io/npm/v/cache-hash?color=critical&logo=npm)
![license](https://img.shields.io/npm/l/cache-hash?color=ee5535)

## Installation

```bash
npm install cache-hash -D
```

Or global install

```bash
npm install cache-hash -g
```

## Use CLI

```bash
cache-hash --target source --output public
```

Or

```bash
cache-hash -t source -o public
```

See help `cache-hash --help` for more configuration

```bash
$ cache-hash --help
Usage: cache-hash [options]

Options:
  -v, --version          output the version number
  -t, --target <target>  Target resource directory (default: "./")
  -o, --output <output>  Output directory, If not set, he will overwrite the "target" content
  --size <size>          Generate hash length (default: 10)
  --key <key>            Version key (default: "v")
  --lazy <lazy>          Image lazy loading (default: "src")
  --html <html>          Generate hash for html referenced resources (default: true)
  --css <css>            Generate hash for css referenced resources (default: true)
  --js <js>              Generate hash for js referenced resources (default: true)
  --style <style>        Generating hashes for resources referenced by style tags (<style>) (default: true)
  --script <script>      Generating hashes for resources referenced by script tags (<script>) (default: true)
  --ignore <ignore...>   Ignore the specified directory or file (default: [])
  -h, --help             display help for command
```

## Use JavaScript API

```js
const cacheHash = require('cache-hash')

cacheHash({
  target: 'source',
  output: 'public'
})

// Please see the cli help parameter description above
// defualtOptions: {
//   target: process.cwd(), // Current command line path
//   output: process.cwd(), // Current command line path
//   size: 10,
//   versionKey: 'v',
//   lazy: 'src',
//   html: true,
//   css: true,
//   js: true,
//   style: true,
//   script: true,
//   ignore: []
// }
```
