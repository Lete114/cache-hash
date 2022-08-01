/**
 * @author Lete114
 * github: https://github.com/Lete114/cache-hash
 * blog: https://blog.imlete.cn
 */

const { existsSync } = require('fs')
const { isAbsolute, join } = require('path')
const prettyHrtime = require('pretty-hrtime')
const readAllFile = require('./utils/readAllFile')
const copy = require('./utils/copy')
const mapping = require('./utils/mapping')
const handlerJs = require('./lib/script')
const handlerCss = require('./lib/css')
const handlerHtml = require('./lib/html')

const CWD = process.cwd()

const defualtOptions = {
  target: CWD,
  output: CWD,
  size: 10,
  versionKey: 'v',
  lazy: 'src',
  relative: false,
  html: true,
  css: true,
  style: true,
  queryString: {
    js: true,
    html: {
      script: true
    }
  }
}

const caches = {}

module.exports = async function (options) {
  try {
    options.target = isAbsolute(options.target) ? options.target : join(CWD, options.target, '/')
    options.output = isAbsolute(options.output) ? options.output : join(CWD, options.output, '/')

    if (!existsSync(options.target)) throw new Error('Target directory does not exist')

    const start = process.hrtime()

    options = Object.assign(defualtOptions, options)

    copy(options.target, options.output)

    const files = readAllFile(options.output)

    const mappings = mapping(files, options)

    const params = { options, files, mappings, caches }

    handlerJs(params)
    await handlerCss(params)
    await handlerHtml(params)

    const interval = prettyHrtime(process.hrtime(start))
    const cyan = '\x1b[36m' + interval + '\x1b[39m'

    // eslint-disable-next-line
    console.log('Successfully injected hash version in %s', cyan)
  } catch (error) {
    // eslint-disable-next-line
    console.error(error)
  }
}
