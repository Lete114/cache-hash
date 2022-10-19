import { strictEqual } from 'assert'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import handlerScript from '../handlerScript'

const content = 'hello world!'

describe('script handlerScript', () => {
  let TEST_DIR: string

  beforeEach((done) => {
    TEST_DIR = join(tmpdir(), 'cache-hash', 'handlerScript')
    fs.emptyDir(TEST_DIR, done)
  })

  afterEach((done) => fs.remove(TEST_DIR, done))

  it('hash injection', () => {
    const path = 'font/index.woff2'
    const testPath = join(TEST_DIR, path)
    const jsRaw = "const a = 'font/index.woff2?name=aaa'"
    fs.ensureFileSync(testPath)
    fs.writeFileSync(testPath, content)
    const js = handlerScript({ output: TEST_DIR, versionKey: 'V' }, jsRaw, join(TEST_DIR, 'index.js'))

    strictEqual(js, 'const a = "font/index.woff2?name=aaa&V=fc3ff98e8c"')
  })
})
