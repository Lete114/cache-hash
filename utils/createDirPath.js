const { parse } = require('path')
const { existsSync, mkdirSync, statSync } = require('fs')

/**
 * Create a directory based on a path
 * @param {String} sourcePath
 * @param {String} targetPath
 */
function createDirPath(sourcePath, targetPath) {
  const dirs = []

  if (statSync(sourcePath).isFile()) targetPath = parse(targetPath).dir

  getAllDir(targetPath)

  function getAllDir(tempPath) {
    dirs.push(tempPath)
    const { root, dir, ext } = parse(tempPath)
    if (!ext && root !== dir) getAllDir(dir)
  }

  for (const d of dirs.reverse()) {
    if (!existsSync(d)) mkdirSync(d)
  }
}

module.exports = createDirPath
