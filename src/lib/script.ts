import { readFileSync, writeFileSync } from 'fs'
import { parseDocument } from 'htmlparser2'
import { selectAll } from 'css-select'
import render from 'dom-serializer'
import handlerScript from '../utils/handlerScript'
import { handlerType, KV } from '../types'

/* eslint-disable max-statements*/
export = (params: handlerType) => {
  const { options, htmlFiles } = params
  if (!options.script) return

  for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile).toString()
    const dom = parseDocument(content)
    const sources = selectAll('script:not([src])', dom)
    for (const source of sources) {
      const scriptText = (source.children[0] as KV).data
      const script = handlerScript(options, scriptText, htmlFile)
      ;(source.children[0] as KV).data = script
    }
    const result = render(dom, { encodeEntities: 'utf8' })

    writeFileSync(htmlFile, result)
  }
}
/* eslint-enable */
