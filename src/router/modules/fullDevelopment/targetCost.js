const targetCost = [{
  path: '/targetCost/costList',
  name: 'targetCost',
  component: () => import('@/views/fullDevelopment/targetCost/costList'),
  meta: {
    title: '目标成本',
    icon: 'dashboard'
  }
}, {
  path: '/adjustmentCost/adjustmentList',
  name: 'adjustmentCost',
  component: () => import('@/views/fullDevelopment/adjustmentCost/adjustmentList'),
  meta: {
    title: '目标成本调整',
    icon: 'dashboard'
  }
}, {
  path: '/analysisCost/analysisList',
  name: 'analysisCost',
  component: () => import('@/views/fullDevelopment/analysisCost/analysisList'),
  meta: {
    title: '目标成本分析',
    icon: 'dashboard'
  }
}]

export default targetCost