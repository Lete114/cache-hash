import { strictEqual } from 'assert'
import searchParams from '../searchParams'

describe('searchParams', () => {
  it('get searchParams', () => {
    const result = searchParams('test/path/index.js?age=18#ddd')
    strictEqual(result, '?age=18#ddd')
  })
})
