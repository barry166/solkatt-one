export const PROJECT = 'project'
export const COMPONENT = 'component'

export const getTemplateData = async () => {
  return [
    {
      name: 'react',
      url: '',
      type: 'project',
    },
    {
      name: 'vue3',
      url: '',
      type: 'component',
    },
  ]
}

// 生成选择项目类型
export const genProjectType = (templates) => {}
