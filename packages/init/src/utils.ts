export const PROJECT = 'project'
export const COMPONENT = 'component'

export const getTemplateData = async () => {
  return [
    {
      label: 'react模板',
      npmName: '@solkatt-one/react-template',
      npmVersion: '1.0.0',
      type: 'project',
    },
    {
      label: 'lib基础类库',
      npmName: '@solkatt-one/lib-base',
      npmVersion: '1.0.0',
      type: 'component',
    },
  ]
}

// 生成选择项目类型
export const genProjectType = (templates) => {}
