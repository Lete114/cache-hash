const { statSync, existsSync, readFileSync } = require('fs')
const walk = require('acorn-walk')
const getHash = require('./getHash')
const setHash = require('./setHash')
const searchParams = require('./searchParams')
const getAbsolutePath = require('./getAbsolutePath')
const { parse, print } = require('recast')

module.exports = handlerScript

function handlerScript(options, content, file) {
  const ast = parse(content)
  walk.simple(ast.program, {
    Literal(node) {
      let path = node.value
      if (typeof path !== 'string') return
      const pathParams = searchParams(path)
      path = path.replace(pathParams, '')
      const filePath = getAbsolutePath(options.output, file, path)
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        const data = readFileSync(filePath)
        const sourceHash = setHash(path + pathParams, options.versionKey, getHash(data, options.size))
        node.value = sourceHash
      }
    }
  })
  const { code } = print(ast)
  return code
}
