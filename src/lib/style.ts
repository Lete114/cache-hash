import { readFileSync, writeFileSync } from 'fs'
import { parseDocument } from 'htmlparser2'
import { selectAll } from 'css-select'
import render from 'dom-serializer'
import handlerCssUrl from '../utils/handlerCssUrl'
import { handlerType, KV } from '../types'

/* eslint-disable max-statements*/
export = (params: handlerType) => {
  const { options, htmlFiles } = params
  if (!options.style) return

  for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile).toString()
    const dom = parseDocument(content)
    const sources = selectAll('style', dom)
    for (const source of sources) {
      const cssText = (source.children[0] as KV).data
      const css = handlerCssUrl(options, cssText, htmlFile)
      ;(source.children[0] as KV).data = css
    }
    const result = render(dom, { encodeEntities: 'utf8' })
    writeFileSync(htmlFile, result)
  }
}
/* eslint-enable */
