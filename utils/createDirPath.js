const { parse } = require('path')
const { existsSync, mkdirSync } = require('fs')

/**
 * Create a directory based on a path
 * @param {String} path
 */
function createDirPath(path) {
  const dirs = []

  getAllDir(path)
  function getAllDir(tempPath) {
    if (parse(tempPath).ext) tempPath = parse(tempPath).dir
    dirs.push(tempPath)
    const { root, dir, ext } = parse(tempPath)
    if (!ext && root !== dir) getAllDir(dir)
  }

  for (const d of dirs.reverse()) {
    if (!existsSync(d)) mkdirSync(d)
  }
  return path
}

module.exports = createDirPath
