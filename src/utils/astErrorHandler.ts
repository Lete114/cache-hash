import { join } from 'path'
import { optionsType } from '../types'

const red = '\x1b[31m[ERROR]\x1b[39m'

export = astErrorHandler

type infoType = { line?: string | number; index?: string | number; msg?: string }

function astErrorHandler(options: optionsType, file: string, info: infoType) {
  // eslint-disable-next-line prefer-const
  let { line, index, msg } = info
  const filePath = join(file).replace(options.output as string, options.target as string)
  const location = line && index ? `${filePath}:${line}:${index}` : filePath
  msg = (msg || 'An error was sent while processing ${filePath} and the file will not be processed').replace(
    '${filePath}',
    `\x1b[31m"${location}"\x1b[39m`
  )

  // eslint-disable-next-line no-console
  console.error(red, msg)
}
