export = searchParams

const baseURL = 'http://127.0.0.1'

function searchParams(path: string) {
  try {
    const url = new URL(path, baseURL)
    return url.search + url.hash
    // eslint-disable-next-line no-empty
  } catch (error) {}
  return ''
}
