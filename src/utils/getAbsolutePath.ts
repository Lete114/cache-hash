import { join, parse, isAbsolute } from 'path'

export = getAbsolutePath

function getAbsolutePath(rootPath: string, filePath: string, improtPath: string) {
  return isAbsolute(improtPath) ? join(rootPath, improtPath) : join(parse(filePath).dir, improtPath)
}
