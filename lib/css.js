const { readFileSync, writeFileSync } = require('fs')
const { extname } = require('path')
const injectHash = require('./queryString')

module.exports = (params) => {
  const { options, files } = params
  if (!options.queryString.css) return
  const styles = files.filter((file) => extname(file) === '.css')

  for (const style of styles) {
    const content = readFileSync(style).toString()
    writeFileSync(style, injectHash(params, content, options.relative))
  }
}
