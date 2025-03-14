import neostandard from 'neostandard'

/** 尾随逗号 */
const commaDangle = val => {
  if (typeof val?.rules?.['@stylistic/comma-dangle']?.[1] === 'object') {
    val.rules['@stylistic/comma-dangle'][0] = 'off'
    Object.keys(val?.rules?.['@stylistic/comma-dangle']?.[1]).forEach(key => {
      val.rules['@stylistic/comma-dangle'][1][key] = 'always-multiline'
    })
  }

  return val
}

/** 忽略的文件 */
const ignores = [
  'node_modules',
  'lib',
  'dist'
]

const options = neostandard({
  ts: true,
  ignores,
}).map(commaDangle)

export default options
