import { parse } from 'path'
import { existsSync, mkdirSync, statSync } from 'fs'

/**
 * Create a directory based on a path
 * @param {string} sourcePath
 * @param {string} targetPath
 */
function createDirPath(sourcePath: string, targetPath: string) {
  const dirs: string[] = []

  if (statSync(sourcePath).isFile()) targetPath = parse(targetPath).dir

  getAllDir(targetPath)

  function getAllDir(tempPath: string) {
    dirs.push(tempPath)
    const { root, dir, ext } = parse(tempPath)
    if (!ext && root !== dir) getAllDir(dir)
  }

  for (const d of dirs.reverse()) {
    if (!existsSync(d)) mkdirSync(d)
  }
}

export = createDirPath
