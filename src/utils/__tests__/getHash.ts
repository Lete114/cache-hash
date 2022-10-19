import { strictEqual } from 'assert'
import getHash from '../getHash'

describe('getHash', () => {
  it('"hello world!" md5 encrypted hash', () => {
    const hash = getHash('hello world!')

    strictEqual(hash, 'fc3ff98e8c')
  })

  it('"hello world!" md5 encrypted hash size 20', () => {
    const hash = getHash('hello world!', 20)

    strictEqual(hash, 'fc3ff98e8c6a0d3087d5')
  })
})
