import { readFileSync, writeFileSync } from 'fs'
import { handlerType } from '../types'
import handlerScript from '../utils/handlerScript'

export = (params: handlerType) => {
  const { options, jsFiles } = params
  if (!options.js) return

  for (const jsFile of jsFiles) {
    const content = readFileSync(jsFile).toString()
    const code = handlerScript(options, content, jsFile)
    writeFileSync(jsFile, code)
  }
}
