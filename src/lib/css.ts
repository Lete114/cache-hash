import { readFileSync, writeFileSync } from 'fs'
import { handlerType } from '../types'
import handlerCssUrl from '../utils/handlerCssUrl'

export = (params: handlerType) => {
  const { options, cssFiles } = params
  if (!options.css) return

  for (const cssFile of cssFiles) {
    const content = readFileSync(cssFile).toString()
    const css = handlerCssUrl(options, content, cssFile)
    writeFileSync(cssFile, css)
  }
}
