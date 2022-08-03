/**
 * @author Lete114
 * github: https://github.com/Lete114/cache-hash
 * blog: https://blog.imlete.cn
 */

const { existsSync } = require('fs')
const { isAbsolute, join, extname } = require('path')
const prettyHrtime = require('pretty-hrtime')
const readAllFile = require('./utils/readAllFile')
const copy = require('./utils/copy')
const handlerJs = require('./lib/js')
const handlerCss = require('./lib/css')
const handlerHtml = require('./lib/html')
const handlerStyle = require('./lib/style')
const handlerScript = require('./lib/script')

const CWD = process.cwd()

const defualtOptions = {
  target: CWD,
  output: CWD,
  size: 10,
  versionKey: 'v',
  lazy: 'src',
  html: true,
  css: true,
  js: true,
  style: true,
  script: true
}

/* eslint-disable max-statements*/
module.exports = async function (options) {
  try {
    options.target = isAbsolute(options.target) ? options.target : join(CWD, options.target, '/')
    options.output = isAbsolute(options.output) ? options.output : join(CWD, options.output, '/')

    if (!existsSync(options.target)) throw new Error('Target directory does not exist')

    const start = process.hrtime()

    options = Object.assign(defualtOptions, options)

    copy(options.target, options.output)

    const files = readAllFile(options.output)

    const htmlFiles = files.filter((file) => extname(file) === '.html')
    const cssFiles = files.filter((file) => extname(file) === '.css')
    const jsFiles = files.filter((file) => extname(file) === '.js')

    const params = { options, htmlFiles, cssFiles, jsFiles }

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
