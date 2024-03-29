/**
 * @author Lete114
 * github: https://github.com/Lete114/cache-hash
 * blog: https://blog.imlete.cn
 */

import { existsSync, copySync } from 'fs-extra'
import { isAbsolute, join } from 'path'
import prettyHrtime from 'pretty-hrtime'
import fg from 'fast-glob'
import filterFiles from './utils/filterFiles'
import handlerJs from './lib/js'
import handlerCss from './lib/css'
import handlerHtml from './lib/html'
import handlerStyle from './lib/style'
import handlerScript from './lib/script'

import { optionsType } from './types'

const CWD = process.cwd()

const defaultOptions: optionsType = {
  target: CWD,
  output: CWD,
  size: 10,
  versionKey: 'v',
  selectAll: [
    ['script', 'src'],
    ['link', 'href'],
    ['img', 'src']
  ],
  html: true,
  css: true,
  js: true,
  style: true,
  script: true,
  ignore: []
}

/* eslint-disable max-statements*/
export = async function (opts: optionsType) {
  try {
    const options: optionsType = { ...defaultOptions, ...opts }
    options.target = isAbsolute(options.target as string) ? options.target : join(CWD, options.target as string, '/')
    options.output = isAbsolute(options.output as string) ? options.output : join(CWD, options.output as string, '/')

    if (!existsSync(options.target as string)) throw new Error('Target directory does not exist')

    const start = process.hrtime()

    if (options.target !== options.output) copySync(options.target as string, options.output as string)

    const files = fg.sync('**', { dot: true, absolute: true, cwd: options.output, ignore: options.ignore })

    const params = {
      options,
      htmlFiles: filterFiles(files, '.html'),
      cssFiles: filterFiles(files, '.css'),
      jsFiles: filterFiles(files, '.js')
    }

    handlerHtml(params)
    handlerStyle(params)
    handlerScript(params)
    handlerCss(params)
    handlerJs(params)

    const interval = prettyHrtime(process.hrtime(start))
    const cyan = '\x1b[36m' + interval + '\x1b[39m'
    const green = '\x1b[32m[INFO]\x1b[39m'

    // eslint-disable-next-line
    console.log(green, 'Successfully injected hash version in', cyan)
  } catch (error) {
    // eslint-disable-next-line
    console.error(error)
  }
}
/* eslint-enable */
