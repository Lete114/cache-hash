import { strictEqual } from 'assert'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import handlerJs from '../js'
import { handlerType } from '../../types'

const content = 'hello world!'

const js1 = `
console.log('start')

const abc = 'font/index.woff2'
const age = 18

const obj = {}

if (obj?.name) {
  console.log('name')
}
console.log('end')
`

const js2 = `
console.log('start')

const abc = 'font/index.woff2'
const age = 18

const obj = {}

console.log('end')
`

describe('handlerJs', () => {
  let TEST_DIR: string

  beforeEach((done) => {
    TEST_DIR = join(tmpdir(), 'cache-hash', 'handlerJs')
    fs.emptyDir(TEST_DIR, done)
  })

  afterEach((done) => fs.remove(TEST_DIR, done))

  it('hash injection', () => {
    const options: handlerType = {
      options: { output: TEST_DIR, target: TEST_DIR, versionKey: 'v', js: true },
      cssFiles: [],
      jsFiles: [join(TEST_DIR, 'js/main.js'), join(TEST_DIR, 'index.js')],
      htmlFiles: []
    }
    const path = 'font/index.woff2'
    const testPath = join(TEST_DIR, path)

    fs.ensureFileSync(testPath)
    fs.writeFileSync(testPath, content)

    const mainJs = options.jsFiles[0]
    fs.ensureFileSync(mainJs)
    fs.writeFileSync(mainJs, js1)

    const indexJs = options.jsFiles[1]
    fs.ensureFileSync(indexJs)
    fs.writeFileSync(indexJs, js2)

    // eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
    console.error = function () {}

    handlerJs(options)

    const mainJsContent = fs.readFileSync(mainJs, { encoding: 'utf8' })
    const indexJsContent = fs.readFileSync(indexJs, { encoding: 'utf8' })

    const str = 'font/index.woff2?v=fc3ff98e8c'
    const result = mainJsContent === js1 && indexJsContent.includes(str)
    strictEqual(result, true)
  })
})
