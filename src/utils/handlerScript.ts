import { statSync, existsSync, readFileSync } from 'fs'
import { simple } from 'acorn-walk'
import { parse, print } from 'recast'
import getHash from './getHash'
import setHash from './setHash'
import searchParams from './searchParams'
import getAbsolutePath from './getAbsolutePath'
import astErrorHandler from './astErrorHandler'
import { KV, optionsType } from '../types'

export = handlerScript

function handlerScript(options: optionsType, content: string, file: string) {
  try {
    const ast = parse(content)
    simple(ast.program, {
      Literal(node) {
        let path = (node as KV).value
        if (typeof path !== 'string') return
        const pathParams = searchParams(path)
        path = path.replace(pathParams, '')
        const filePath = getAbsolutePath(options.output as string, file, path)
        if (existsSync(filePath) && statSync(filePath).isFile()) {
          const data = readFileSync(filePath)
          const sourceHash = setHash(path + pathParams, options.versionKey as string, getHash(data, options.size))
          ;(node as KV).value = sourceHash
        }
      }
    })
    const { code } = print(ast)
    return code
  } catch (error) {
    const locationInfo = {
      line: (error as KV).lineNumber,
      index: 1
    }
    astErrorHandler(options, file, locationInfo)
    return content
  }
}
