const { readFileSync, writeFileSync } = require('fs')
const { extname, join } = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const cssUrl = require('../utils/cssUrl')
const injectHash = require('./queryString')
const searchParams = require('../utils/searchParams')

const DOCTYPE = '<!DOCTYPE html>'
const baseURL = 'http://127.0.0.1'

/* eslint-disable */
function handlerSource(params) {
  const { options, sources, mappings, caches } = params
  const { versionKey, lazy, output } = options
  const obj = { IMG: 'src', LINK: 'href', SCRIPT: 'src' }
  if (lazy) obj.IMG = lazy
  for (const source of sources) {
    let url = source.getAttribute(obj[source.tagName]) || ''
    const relativePath = url
      .replace(/#.*$/, '') // Removing anchor points
      .replace(/\?.*$/, '') // Removal of parameters

    let filePath = join(output, relativePath)

    let version = ''
    if (!caches[filePath]) {
      for (const key in mappings) {
        const mapping = mappings[key]
        if (mapping.path === filePath) {
          caches[filePath] = mapping.hash
        }
      }
    }
    version = caches[filePath]
    if (!version) continue
    url = new URL(url, baseURL)

    url.searchParams.set(versionKey, version)
    const value = searchParams(relativePath, versionKey, version)
    source.setAttribute(obj[source.tagName], value)
  }
}
/* eslint-enable */

async function handlerInline(params, inlines, file) {
  const { dom, options } = params

  inlines = inlines.filter((inline) => inline.textContent)

  for (const inline of inlines) {
    const newTag = dom.window.document.createElement(inline.tagName)
    let content = inline.text || inline.textContent || inline.innerHTML || ''

    Array.from(inline.attributes).forEach((attr) => newTag.setAttribute(attr.name, attr.value))
    newTag.text = content
    if (inline.tagName === 'SCRIPT') {
      content = injectHash(params, content, options.relative)
      inline.parentNode.replaceChild(newTag, inline)
    } else {
      const css = await cssUrl(options, content, file)
      newTag.textContent = css
      inline.parentNode.replaceChild(newTag, inline)
    }
  }
}

/* eslint-disable max-statements*/
module.exports = async (params) => {
  const { options, files } = params
  const { queryString } = options
  if (!options.html) return
  const htmls = files.filter((file) => extname(file) === '.html')
  const Selector = `script[src],link[href],img[${options.lazy || 'src'}]`
  for (const html of htmls) {
    const content = readFileSync(html).toString()
    const dom = new JSDOM(content, { url: baseURL })
    const sources = Array.from(dom.window.document.querySelectorAll(Selector))
    const scripts = Array.from(dom.window.document.querySelectorAll('script'))
    const styles = Array.from(dom.window.document.querySelectorAll('style'))
    params.dom = dom
    params.sources = sources
    handlerSource(params)
    queryString.html.script && (await handlerInline(params, scripts, html))
    options.style && (await handlerInline(params, styles, html))

    let outerHTML = dom.window.document.documentElement.outerHTML
    const isDoctype = new RegExp('^' + DOCTYPE).test(content)
    if (isDoctype) outerHTML = DOCTYPE + outerHTML

    writeFileSync(html, outerHTML)
  }
}
/* eslint-enable */
