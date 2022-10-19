import { strictEqual } from 'assert'
import astErrorHandler from '../astErrorHandler'

const options = {
  target: 'abc',
  output: '123'
}

const red = '\x1B[31m[ERROR]\x1B[39m '

describe('AST error handler', () => {
  it('Customized error messages', () => {
    const msg = 'Customized error messages'

    // eslint-disable-next-line no-console
    console.error = function () {
      // eslint-disable-next-line prefer-rest-params
      strictEqual(red + msg, arguments[0] + ' ' + arguments[1])
    }
    astErrorHandler(options, 'test/file.js', { line: 1, index: 10, msg })
  })

  it('Detection of error files and error locations', () => {
    const args =
      // eslint-disable-next-line max-len
      red + 'An error was sent while processing \x1B[31m"test\\file.js:1:10"\x1B[39m and the file will not be processed'

    // eslint-disable-next-line no-console
    console.error = function () {
      // eslint-disable-next-line prefer-rest-params
      strictEqual(args, arguments[0] + ' ' + arguments[1])
    }
    astErrorHandler(options, 'test/file.js', { line: 1, index: 10 })
  })
})
