import { readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import { parseDocument } from 'htmlparser2'
import { selectAll } from 'css-select'
import render from 'dom-serializer'
import getAbsolutePath from '../utils/getAbsolutePath'
import getHash from '../utils/getHash'
import setHash from '../utils/setHash'
import searchParams from '../utils/searchParams'
import { handlerType, KV } from '../types'

type attribsType = { img: string; link: string; script: string }

/* eslint-disable max-statements*/
export = (params: handlerType) => {
  const { options, htmlFiles } = params
  if (!options.html) return

  const Selector = `script[src],link[href],img[${options.lazy || 'src'}]`
  for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile).toString()
    const dom = parseDocument(content)
    const sources = selectAll(Selector, dom)
    for (const source of sources) {
      const attribs: attribsType = { img: 'src', link: 'href', script: 'src' }

      if (options.lazy) attribs.img = options.lazy

      const name = (source as KV).name as 'img' | 'link' | 'script'
      let path = (source as KV).attribs[attribs[name]]
      const pathParams = searchParams(path)
      path = path.replace(pathParams, '')

      const sourcePath = getAbsolutePath(options.output, htmlFile, path)

      if (existsSync(sourcePath) && statSync(sourcePath).isFile()) {
        const data = readFileSync(sourcePath)
        const sourceHash = getHash(data, options.size)
        const sourceHashPath = setHash(path + pathParams, options.versionKey, sourceHash)

        ;(source as KV).attribs[attribs[name]] = sourceHashPath
      }
    }
    const result = render(dom, { encodeEntities: 'utf8' })

    writeFileSync(htmlFile, result)
  }
}
/* eslint-enable */
