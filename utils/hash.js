const crypto = require('crypto')
/**
 * Generate hash
 * @param {String | Buffer} data Generate the contents of the hash
 * @param {Number} size The size (length) of the generated hash
 * @returns {String} hash
 */
function hash(data, size) {
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
    throw new TypeError('Expected a Buffer or string')
  }
  size = Number.isInteger(size) ? size : 10
  const md5 = crypto.createHash('md5').update(data).digest('hex')
  return size > md5.length ? md5 : md5.slice(0, size)
}

module.exports = hash
