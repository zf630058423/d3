const marketBidStatisics = [{
  path: '/marketBidStatisics/marketBidList',
  name: 'marketBidList',
  component: () => import('@/views/fullDevelopment/marketBidStatisics/marketBidList.vue'),
  meta: {
    title: '营销投标统计总表',
    icon: 'dashboard'
  }
}, {
  path: '/marketBidStatisicsDetail/marketBidDetailList',
  name: 'marketBidDetailList',
  component: () => import('@/views/fullDevelopment/marketBidStatisicsDetail/marketBidDetailList.vue'),
  meta: {
    title: '营销投标统计明细表',
    icon: 'dashboard'
  }
}]

export default marketBidStatisics