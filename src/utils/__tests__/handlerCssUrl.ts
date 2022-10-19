import { strictEqual } from 'assert'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import handlerCssUrl from '../handlerCssUrl'

const content = 'hello world!'

describe('style handlerCssUrl', () => {
  let TEST_DIR: string

  beforeEach((done) => {
    TEST_DIR = join(tmpdir(), 'cache-hash', 'handlerCssUrl')
    fs.emptyDir(TEST_DIR, done)
  })

  afterEach((done) => fs.remove(TEST_DIR, done))

  function handler(type: string, quote = '') {
    const path = type + '/font/index.woff2'
    const testPath = join(TEST_DIR, path)
    const cssRaw = `
        @font-face {
            font-family: test2;
            font-display: block;
            src: url(${quote}path${quote}) format('woff2');
        }`
    const expected = cssRaw.replace('path', type + '/font/index.woff2?v=fc3ff98e8c')
    fs.ensureFileSync(testPath)
    fs.writeFileSync(testPath, content)
    const css = handlerCssUrl(
      { output: TEST_DIR, versionKey: 'v' },
      cssRaw.replace('path', path),
      join(TEST_DIR, 'style.css')
    )
    return [css, expected]
  }

  it('Normal hash injection', () => {
    const result = handler('normal')
    strictEqual(result[0], result[1])
  })
  it('single quotes hash injection', () => {
    const result = handler('single-quotes', "'")
    strictEqual(result[0], result[1])
  })

  it('double quotes hash injection', () => {
    const result = handler('double-quotes', '"')
    strictEqual(result[0], result[1])
  })
})
