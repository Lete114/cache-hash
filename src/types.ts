export type KV = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type optionsType = {
  target?: string
  output?: string
  size?: number
  versionKey?: string
  selectAll?: string[][]
  html?: boolean
  css?: boolean
  js?: boolean
  style?: boolean
  script?: boolean
  ignore?: string[]
}

export type handlerType = {
  options: optionsType
  htmlFiles: string[]
  cssFiles: string[]
  jsFiles: string[]
}
