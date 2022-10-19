import { strictEqual } from 'assert'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import handlerCss from '../css'
import { handlerType } from '../../types'

const content = 'hello world!'

const css1 = `
* {
    color: pink;
  }
  
  @font-face {
    font-family: test;
    font-display: block;
    src: url(../font/index.woff2) format('woff2');
  }
`

const css2 = `
* {
    color: pink;
  }
  
  @font-face {
    font-family: test;
    font-display: block;
    src: url(font/index.woff2) format('woff2');
  }
`

describe('handlerCss', () => {
  let TEST_DIR: string

  beforeEach((done) => {
    TEST_DIR = join(tmpdir(), 'cache-hash', 'handlerCss')
    fs.emptyDir(TEST_DIR, done)
  })

  afterEach((done) => fs.remove(TEST_DIR, done))

  it('hash injection', () => {
    const options: handlerType = {
      options: { output: TEST_DIR, versionKey: 'v', css: true },
      cssFiles: [join(TEST_DIR, 'css/main.css'), join(TEST_DIR, 'index.css')],
      jsFiles: [],
      htmlFiles: []
    }
    const path = 'font/index.woff2'
    const testPath = join(TEST_DIR, path)

    fs.ensureFileSync(testPath)
    fs.writeFileSync(testPath, content)

    const mainCss = options.cssFiles[0]
    fs.ensureFileSync(mainCss)
    fs.writeFileSync(mainCss, css1)

    const indexCss = options.cssFiles[1]
    fs.ensureFileSync(indexCss)
    fs.writeFileSync(indexCss, css2)

    handlerCss(options)

    const mainCssContent = fs.readFileSync(mainCss, { encoding: 'utf8' })
    const indexCssContent = fs.readFileSync(indexCss, { encoding: 'utf8' })

    const str = 'font/index.woff2?v=fc3ff98e8c'
    const result = mainCssContent.includes(str) && indexCssContent.includes(str)
    strictEqual(result, true)
  })
})
