module.exports = searchParams

const baseURL = 'http://127.0.0.1'

function searchParams(path) {
  try {
    const url = new URL(path, baseURL)
    return url.search + url.hash
  } catch (error) {
    return
  }
}
