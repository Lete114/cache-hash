import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import fg from 'fast-glob'

import createDirPath from './createDirPath'

export = copy

function copy(target: string, output: string) {
  const files = fg.sync('**', { dot: true, absolute: true, cwd: target })
  for (const file of files) {
    const _file = join(file).replace(target, '')
    const _output = join(output, _file)
    createDirPath(file, _output)
    const content = readFileSync(file)
    writeFileSync(_output, content)
  }
}
