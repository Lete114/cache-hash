const { join } = require('path')
const { existsSync, statSync, readdirSync } = require('fs')

/**
 * Read all files in a directory
 * @param {String} dirPath Target Directory
 * @returns {Array}
 */
module.exports = function readAllFile(dirPath) {
  if (!existsSync(dirPath)) return []

  let array = []
  const result = readdirSync(dirPath)
  for (const item of result) {
    const resolvePath = join(dirPath, item)

    const stat = statSync(resolvePath)

    if (stat.isFile()) {
      array.push(resolvePath)
      continue
    }

    if (stat.isDirectory()) {
      const resultArr = readAllFile(resolvePath)
      array = [...array, ...resultArr]
    }
  }
  return array
}
