const { readFileSync, writeFileSync } = require('fs')
const handlerScript = require('../utils/handlerScript')

module.exports = (params) => {
  const { options, jsFiles } = params
  if (!options.js) return

  for (const jsFile of jsFiles) {
    const content = readFileSync(jsFile).toString()
    const code = handlerScript(options, content, jsFile)
    writeFileSync(jsFile, code)
  }
}
