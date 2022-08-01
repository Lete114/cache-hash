const { readFileSync, writeFileSync } = require('fs')
const { extname } = require('path')
const cssUrl = require('../utils/cssUrl')

module.exports = async (params) => {
  const { options, files } = params
  if (!options.css) return
  const styles = files.filter((file) => extname(file) === '.css')

  for (const style of styles) {
    const content = readFileSync(style).toString()
    const css = await cssUrl(options, content, style)
    writeFileSync(style, css)
  }
}
