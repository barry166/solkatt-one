export const PROJECT = 'project'
export const COMPONENT = 'component'

export const types = [PROJECT, COMPONENT]
export const typesMap = {
  [PROJECT]: '项目',
  [COMPONENT]: '组件',
}
// 执行脚本命令白名单
export const whiteCommandList = ['npm', 'yarn', 'pnpm']

export interface Template {
  label: string
  npmName: string
  npmVersion: string
  type: 'normal' | 'custom'
  tags: string[]
  installCommand: string
  startCommand: string
  ignore?: string[]
}

export const getTemplateData = async (): Promise<Template[]> => {
  return [
    {
      label: 'react模板',
      npmName: '@solkatt-one/react-template',
      npmVersion: '1.0.0',
      type: 'normal',
      tags: ['project'],
      installCommand: 'npm install --registry=https://registry.npmmirror.com',
      startCommand: 'npm run dev',
      ignore: ['public/**/*']
    },
    {
      label: 'lib基础类库',
      npmName: '@solkatt-one/lib-base',
      npmVersion: '1.0.0',
      type: 'normal',
      tags: ['component'],
      installCommand: 'npm install --registry=https://registry.npmmirror.com',
      startCommand: 'npm run start',
      ignore: ['public/**/*', 'coverage/**/*', 'tests/**/*', 'dist/**/*']
    },
    {
      label: '自定义模板',
      npmName: '@solkatt-one/custom-template',
      npmVersion: '1.0.0',
      type: 'custom',
      tags: ['project'],
      installCommand: 'npm install --registry=https://registry.npmmirror.com',
      startCommand: 'npm run start',
      ignore: ['public/**/*', 'coverage/**/*']
    },
  ]
}
