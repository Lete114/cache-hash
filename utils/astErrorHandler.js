const { join } = require('path')

const red = '\x1b[31m[ERROR]\x1b[39m'

module.exports = astErrorHandler

function astErrorHandler(options, file, { line, index, msg }) {
  const filePath = join(file).replace(options.output, options.target)
  const location = line && index ? `${filePath}:${line}:${index}` : filePath
  msg = (msg || 'An error was sent while processing ${filePath} and the file will not be processed').replace(
    '${filePath}',
    `\x1b[31m"${location}"\x1b[39m`
  )

  // eslint-disable-next-line no-console
  console.error(red, msg)
}
