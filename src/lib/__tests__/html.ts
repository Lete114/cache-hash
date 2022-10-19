import { strictEqual } from 'assert'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import handlerHtml from '../html'
import { handlerType } from '../../types'

const content = 'hello world!'

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>中文-English</title>
    <link rel="stylesheet" href="css/index.css?age=18#ddd" />
    <script src="index.js?name=123#abc"></script>
    <style>
      @font-face {
        font-family: test2;
        font-display: block;
        src: url(font/index.woff2) format('woff2');
      }
    </style>
  </head>
  <body>
    666
    <span>
      <!-- Detects if there is a misjudgment -->
      <!-- <script src="index.js?name=123#abc"></script> -->
      index.js css/index.css
    </span>
    <script>
      const a = 'index.js?name=aaa'
    </script>
  </body>
</html>

`

describe('handlerHtml', () => {
  let TEST_DIR: string

  beforeEach((done) => {
    TEST_DIR = join(tmpdir(), 'cache-hash', 'handlerHtml')
    fs.emptyDir(TEST_DIR, done)
  })

  afterEach((done) => fs.remove(TEST_DIR, done))

  it('hash injection', () => {
    const options: handlerType = {
      options: { output: TEST_DIR, versionKey: 'v', html: true },
      cssFiles: [],
      jsFiles: [],
      htmlFiles: [join(TEST_DIR, 'index.html')]
    }
    const path = 'css/index.css'
    const testPath = join(TEST_DIR, path)

    fs.ensureFileSync(testPath)
    fs.writeFileSync(testPath, content)

    const indexHtml = options.htmlFiles[0]
    fs.ensureFileSync(indexHtml)
    fs.writeFileSync(indexHtml, html)

    handlerHtml(options)

    const mainCssContent = fs.readFileSync(indexHtml, { encoding: 'utf8' })

    const str = 'css/index.css?age=18&amp;v=fc3ff98e8c#ddd'
    const result = mainCssContent.includes(str)
    strictEqual(result, true)
  })
})
