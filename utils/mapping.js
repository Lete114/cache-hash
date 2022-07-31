const { extname } = require('path')
const { readFileSync } = require('fs')
const hash = require('./hash')

module.exports = mapping

/**
 * Generating a hash object map
 * @param {Array} files Path to the file where the hash needs to be generated
 * @param {Object} options options
 * @returns {Object}
 */
function mapping(files, options) {
  const obj = {}
  for (const file of files) {
    if (extname(file) === '.html') continue

    const relativePath = file.replace(options.output, '')

    const urlPath = relativePath.replace(/\\/g, '/')

    obj[urlPath] = {}
    obj[urlPath].hash = hash(readFileSync(file), options.size)
    obj[urlPath].relative = []
    obj[urlPath].path = file

    if (!options.relative) continue

    // Generate relative path maps
    const uSplit = urlPath.split('/')
    // Remove the first empty string, and the file nickname
    const relativePathDirArr = uSplit.slice(1, uSplit.length - 1)
    relativePathDirArr.reduce((previous, current) => {
      previous = previous.replace(/^\/?/, '')
      // Replace the path folder with...
      const res = previous.replace(current, '..')
      obj[urlPath].relative.push(res)
      return res
    }, urlPath)

    /*
      Example of relative path generation process

      urlPath:                  /third-party/fontawesome-free/webfonts/fa-v4compatibility.woff2
      uSplit:                   [ '', 'third-party', 'fontawesome-free', 'webfonts', 'fa-v4compatibility.woff2' ]
      relativePathDirArr:       [ 'third-party', 'fontawesome-free', 'webfonts' ]
      previous:                 third-party/fontawesome-free/webfonts/fa-v4compatibility.woff2
      res[0]:                   /../fontawesome-free/webfonts/fa-v4compatibility.woff2
      res[1]:                   /../../webfonts/fa-v4compatibility.woff2
      res[2]:                   /../../../fa-v4compatibility.woff2

      The final generated relative path mapping resul

      obj[urlPath].relative:    [
                                  '../fontawesome-free/webfonts/fa-v4compatibility.woff2',
                                  '../../webfonts/fa-v4compatibility.woff2',
                                  '../../../fa-v4compatibility.woff2'
                                ]
      */
  }
  return obj
}
