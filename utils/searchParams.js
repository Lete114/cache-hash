module.exports = searchParams

const baseURL = 'http://127.0.0.1'

function searchParams(path, versionKey, version) {
  const url = new URL(path, baseURL)
  url.searchParams.set(versionKey, version)
  return path + url.search + url.hash
}
