import { readFileSync, existsSync, statSync } from 'fs'
import { extname } from 'path'
import postcss from 'postcss'
import getHash from './getHash'
import setHash from './setHash'
import getAbsolutePath from './getAbsolutePath'
import searchParams from './searchParams'
import astErrorHandler from './astErrorHandler'
import { KV, optionsType } from '../types'

export = handlerCssUrl

function getUrls(value: string) {
  const reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g
  let match
  const urls = []

  while ((match = reg.exec(value)) !== null) {
    const meta = {
      source: match[0],
      before: match[1],
      quote: match[2],
      value: match[3],
      after: match[4]
    }
    if (meta.value.indexOf('data:') !== 0 || meta.value.indexOf('#') !== 0) {
      urls.push(meta)
    }
  }
  return urls
}

function handlerCssUrl(options: optionsType, content: string, file: string) {
  try {
    const { css } = postcss({
      postcssPlugin: 'cache-hash-css-url',
      Once(root) {
        root.walkDecls(function (decl) {
          if (decl.value && decl.value.includes('url(')) {
            getUrls(decl.value).map((meta) => {
              let path = meta.value
              const pathParams = searchParams(path)
              path = path.replace(pathParams, '')
              const filePath = getAbsolutePath(options.output as string, file, path)
              if (existsSync(filePath) && statSync(filePath).isFile()) {
                const data = readFileSync(filePath)
                meta.value = setHash(path + pathParams, options.versionKey as string, getHash(data, options.size))
                meta.value = 'url(' + meta.before + meta.quote + meta.value + meta.quote + meta.after + ')'
                decl.value = decl.value.replace(meta.source, meta.value)
              }
            })
          }
        })
      }
    }).process(content, { from: undefined })
    return css
  } catch (error) {
    const info: { line?: string; index?: string; msg: string } = {
      line: (error as KV).line,
      index: (error as KV).column,
      msg: ''
    }
    if (extname(file) === '.html') {
      delete info.line
      delete info.index
      info.msg =
        'A syntactically incorrect css style is detected in the ${filePath} file,' +
        ' so the style tag will not be processed (other style tags are not affected)'
    }
    astErrorHandler(options, file, info)
    return content
  }
}
