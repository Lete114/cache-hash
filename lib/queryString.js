module.exports = injectHash

function injectHash(params, content, isRelative) {
  const { options, mappings } = params
  const { versionKey } = options
  for (const mapping in mappings) {
    const { hash, relative } = mappings[mapping]

    // Determine if hash has been injected
    const isHash = new RegExp(`(${mapping})[?${versionKey}=]`, 'g')
    if (isHash.test(content)) continue

    content = content.replace(new RegExp(`(${mapping})`, 'g'), `$1?${versionKey}=` + hash)

    if (!isRelative) continue
    for (const i of relative) {
      // Remove the redundant ... / used as secondary match
      const isRelative = i.replace(/\.\.\//g, '')
      // Determine if hash has been injected
      const isHash = new RegExp(`(${i}|${isRelative})[?${versionKey}=]`, 'g')

      if (isHash.test(content)) continue

      const reg = new RegExp(`(${i}|${isRelative})`, 'g')
      content = content.replace(reg, `$1?${versionKey}=` + hash)
    }
  }
  return content
}
