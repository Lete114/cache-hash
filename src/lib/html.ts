import { readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import { parseDocument } from 'htmlparser2'
import { selectAll } from 'css-select'
import render from 'dom-serializer'
import getAbsolutePath from '../utils/getAbsolutePath'
import getHash from '../utils/getHash'
import setHash from '../utils/setHash'
import searchParams from '../utils/searchParams'
import { handlerType, KV } from '../types'

/* eslint-disable max-statements*/
export = (params: handlerType) => {
  const { options, htmlFiles } = params
  if (!options.html) return

  const Selector = []
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  for (const [tag, attr] of options.selectAll!) {
    Selector.push(`${tag}[${attr}]`)
  }
  for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile).toString()
    const dom = parseDocument(content)
    const sources = selectAll(Selector.toString(), dom)
    for (const source of sources) {
      const name = (source as KV).name
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      options
        .selectAll!.filter(([tag, attr]) => tag === name && (source as KV).attribs[attr])
        .forEach(([, attr]) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          let path = (source as KV).attribs[attr]
          const pathParams = searchParams(path)
          path = path.replace(pathParams, '')

          const sourcePath = getAbsolutePath(options.output as string, htmlFile, path)
          if (existsSync(sourcePath) && statSync(sourcePath).isFile()) {
            const data = readFileSync(sourcePath)
            const sourceHash = getHash(data, options.size)
            const sourceHashPath = setHash(path + pathParams, options.versionKey as string, sourceHash)

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ;(source as KV).attribs[attr] = sourceHashPath
          }
        })
    }
    const result = render(dom, { encodeEntities: 'utf8' })

    writeFileSync(htmlFile, result)
  }
}
/* eslint-enable */
