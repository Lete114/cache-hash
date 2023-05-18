import { join } from 'path'
import cacheHash from '../src/cache-hash'
import { removeSync } from 'fs-extra'

const options = {
  target: join(__dirname, 'source'),
  output: join(__dirname, 'dist'),
  selectAll: [
    ['script', 'src'],
    ['script', 'search'],
    ['link', 'href'],
    ['img', 'src']
  ]
}

removeSync(options.output)

cacheHash(options)
