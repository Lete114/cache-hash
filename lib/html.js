const { readFileSync, writeFileSync, existsSync, statSync } = require('fs')
const { parseDocument } = require('htmlparser2')
const CSSselect = require('css-select')
const render = require('dom-serializer').default
const getAbsolutePath = require('../utils/getAbsolutePath')
const getHash = require('../utils/getHash')
const setHash = require('../utils/setHash')
const searchParams = require('../utils/searchParams')

/* eslint-disable max-statements*/
module.exports = (params) => {
  const { options, htmlFiles } = params
  if (!options.html) return

  const Selector = `script[src],link[href],img[${options.lazy || 'src'}]`
  for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile).toString()
    const dom = parseDocument(content)
    const sources = CSSselect.selectAll(Selector, dom)
    for (const source of sources) {
      const attribs = { img: 'src', link: 'href', script: 'src' }
      if (options.lazy) attribs.img = options.lazy
      let path = source.attribs[attribs[source.name]]
      const pathParams = searchParams(path)
      path = path.replace(pathParams, '')
      const sourcePath = getAbsolutePath(options.output, htmlFile, path)
      if (existsSync(sourcePath) && statSync(sourcePath).isFile()) {
        const data = readFileSync(sourcePath)
        const sourceHash = getHash(data, options.size)
        const sourceHashPath = setHash(path + pathParams, options.versionKey, sourceHash)
        source.attribs[attribs[source.name]] = sourceHashPath
      }
    }
    const result = render(dom, { encodeEntities: 'utf8' })

    writeFileSync(htmlFile, result)
  }
}
/* eslint-enable */
