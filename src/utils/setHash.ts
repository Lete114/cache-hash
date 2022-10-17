import searchParams from './searchParams'

export = setHash

const baseURL = 'http://127.0.0.1'

function setHash(path: string, versionKey: string, version: string) {
  const url = new URL(path, baseURL)
  url.searchParams.set(versionKey, version)
  path = path.replace(searchParams(path), '')
  return path + url.search + url.hash
}
