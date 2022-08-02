const { readFileSync, writeFileSync } = require('fs')
const handlerCssUrl = require('../utils/handlerCssUrl')

module.exports = (params) => {
  const { options, cssFiles } = params
  if (!options.css) return

  for (const cssFile of cssFiles) {
    const content = readFileSync(cssFile).toString()
    const css = handlerCssUrl(options, content, cssFile)
    writeFileSync(cssFile, css)
  }
}
