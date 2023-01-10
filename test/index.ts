import cacheHash from '../src/cache-hash'
import { removeSync } from 'fs-extra'

const options = {
  target: 'L:\\Coding\\Code\\Nodejs\\cache-hash\\test\\source',
  output: 'L:\\Coding\\Code\\Nodejs\\cache-hash\\test\\dist'
}

removeSync(options.output)

cacheHash(options)
