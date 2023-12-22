const businessUnit = [{
  path: '/marketBusinessUnitMain/businessUnitList',
  name: 'businessUnitList',
  component: () => import('@/views/businessModule/noWorkflow/marketBusinessUnitMain/businessUnitList.vue'),
  meta: {
    title: '业务单元',
    icon: 'dashboard'
  }
}]

export default businessUnit;