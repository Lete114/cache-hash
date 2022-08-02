const searchParams = require('./searchParams')

module.exports = setHash

const baseURL = 'http://127.0.0.1'

function setHash(path, versionKey, version) {
  const url = new URL(path, baseURL)
  url.searchParams.set(versionKey, version)
  path = path.replace(searchParams(path), '')
  return path + url.search + url.hash
}
