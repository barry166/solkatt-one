export const parseArgs = (argv: string[]) => {
  let args = argv
  const cmd = args[args.length - 1]
  const o = Object.create(null)

  Object.keys(cmd).forEach((key) => {
    if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
      o[key] = cmd[key]
    }
  })
  args[args.length - 1] = o
  return args
}

/**
 * 生成spawn执行参数和代码
 * @param isEsm 是否esm模块
 * @param rootFilePath 需要执行的文件路径
 * @param args 执行文件的参数
 */
export const genExecArgs = (
  isEsm: boolean,
  rootFilePath: string,
  args: string[]
) => {
  let code = '',
    execArgs = []
  if (isEsm) {
    code = `import('${rootFilePath}').then(res => res?.default(${JSON.stringify(
      args
    )}))`
    execArgs = ['--es-module-specifier-resolution=node', '-e']
  } else {
    code = `require('${rootFilePath}').call(null, ${JSON.stringify(args)})`
    execArgs = ['-e']
  }
  return execArgs.concat(code)
}
