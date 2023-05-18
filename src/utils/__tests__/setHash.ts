import { strictEqual } from 'assert'
import setHash from '../setHash'

describe('setHash', () => {
  it('searchParams append', () => {
    const result = setHash('test/path/index.js?age=18#ddd', 'vv', 'fc3ff98e8c')
    strictEqual(result, 'test/path/index.js?age=18&vv=fc3ff98e8c#ddd')
  })
})
