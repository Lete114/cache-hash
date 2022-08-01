const { readFileSync } = require('fs')
const { join, parse, isAbsolute } = require('path')
const postcss = require('postcss')
const hash = require('./hash')
const searchParams = require('./searchParams')

module.exports = cssUrl

function getUrls(value) {
  const reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g
  let match
  const urls = []

  while ((match = reg.exec(value)) !== null) {
    const meta = {
      source: match[0],
      before: match[1],
      quote: match[2],
      value: match[3],
      after: match[4]
    }
    if (meta.value.indexOf('data:') !== 0 || meta.value.indexOf('#') !== 0) {
      urls.push(meta)
    }
  }
  return urls
}

async function cssUrl(options, content, file) {
  const plugin = {
    postcssPlugin: 'cache-hash-css-url',
    Once(root) {
      root.walkDecls(function (decl) {
        if (decl.value && decl.value.includes('url(')) {
          getUrls(decl.value).map((meta) => {
            const filepath = isAbsolute(meta.value)
              ? join(options.output, meta.value)
              : join(parse(file).dir, meta.value)
            const data = readFileSync(filepath)
            meta.value = searchParams(meta.value, options.versionKey, hash(data, options.size))
            meta.value = 'url(' + meta.before + meta.quote + meta.value + meta.quote + meta.after + ')'
            decl.value = decl.value.replace(meta.source, meta.value)
          })
        }
      })
    }
  }
  const { css } = await postcss(plugin).process(content, { from: undefined })

  return css
}
