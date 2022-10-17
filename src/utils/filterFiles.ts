import path from 'path'

export = filterFiles

function filterFiles(files: string[], extname: string) {
  return files.filter((file) => path.extname(file) === extname)
}
