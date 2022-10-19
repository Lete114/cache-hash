import { strictEqual } from 'assert'
import { join } from 'path'
import getAbsolutePath from '../getAbsolutePath'

const path = 'test/path/'
const filePath = 'test/path/index.js'

describe('getAbsolutePath', () => {
  it('1 - getAbsolutePath', () => {
    const absolutePath = getAbsolutePath(path, filePath, 'index.html')

    strictEqual(absolutePath, join('test/path/index.html'))
  })
  it('2 - getAbsolutePath', () => {
    const absolutePath = getAbsolutePath(path, filePath, './../index.js')

    strictEqual(absolutePath, join('test/index.js'))
  })
})
