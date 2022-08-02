const { join, parse, isAbsolute } = require('path')

module.exports = getAbsolutePath

function getAbsolutePath(rootPath, filePath, ImprotPath) {
  return isAbsolute(ImprotPath) ? join(rootPath, ImprotPath) : join(parse(filePath).dir, ImprotPath)
}
