const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const fg = require('fast-glob')

const createDirPath = require('./createDirPath')

module.exports = copy

function copy(target, output) {
  const files = fg.sync('**', { dot: true, absolute: true, cwd: target })
  for (const file of files) {
    const _file = join(file).replace(target, '')
    const _output = join(output, _file)
    createDirPath(file, _output)
    const content = readFileSync(file)
    writeFileSync(_output, content)
  }
}
