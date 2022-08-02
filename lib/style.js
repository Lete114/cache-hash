const { readFileSync, writeFileSync } = require('fs')
const { parseDocument } = require('htmlparser2')
const CSSselect = require('css-select')
const render = require('dom-serializer').default
const handlerCssUrl = require('../utils/handlerCssUrl')

/* eslint-disable max-statements*/
module.exports = (params) => {
  const { options, htmlFiles } = params
  if (!options.style) return

  for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile).toString()
    const dom = parseDocument(content)
    const sources = CSSselect.selectAll('style', dom)
    for (const source of sources) {
      const cssText = source.children[0].data
      const css = handlerCssUrl(options, cssText, htmlFile)
      source.children[0].data = css
    }
    const result = render(dom, { encodeEntities: 'utf8' })
    writeFileSync(htmlFile, result)
  }
}
/* eslint-enable */
