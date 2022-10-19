import { strictEqual } from 'assert'
import filterFiles from '../filterFiles'

const files = [
  'test/path/test.js',
  'test/path/test.html',
  'test/path/test.css',
  'test/path/test.jpg',
  'test/path/index.jpg',
  'test/path/index.css',
  'test/path/index.html',
  'test/path/index.js'
]

describe('filterFiles', () => {
  it('filter .js', () => {
    const newFiles = filterFiles(files, '.js')

    strictEqual(JSON.stringify(newFiles), '["test/path/test.js","test/path/index.js"]')
  })
})
