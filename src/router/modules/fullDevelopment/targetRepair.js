const targetRepair = [{
  path: '/targetRepair/repairList',
  name: 'targetRepair',
  component: () => import('@/views/fullDevelopment/repairRequest/repairList.vue'),
  meta: {
    title: '项目维修',
    requireAuth: true
  }
}]

export default targetRepair