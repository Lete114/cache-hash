const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const createDirPath = require('./createDirPath')
const readAllFile = require('./readAllFile')

module.exports = copy

function copy(target, output) {
  const files = readAllFile(target)
  for (const file of files) {
    const _file = file.replace(target, '')
    const _output = join(output, _file)
    createDirPath(_output)
    const content = readFileSync(file)
    writeFileSync(_output, content)
  }
}
