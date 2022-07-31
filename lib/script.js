const { readFileSync, writeFileSync } = require('fs')
const { extname } = require('path')
const injectHash = require('./queryString')

module.exports = (params) => {
  const { options, files } = params
  if (!options.queryString.js) return
  const scripts = files.filter((file) => extname(file) === '.js')

  for (const script of scripts) {
    const content = readFileSync(script).toString()
    writeFileSync(script, injectHash(params, content, options.relative))
  }
}
