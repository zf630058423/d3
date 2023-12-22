const claimExpense = [{
  path: '/targetClaimExpense/claimExpenseList',
  name: 'targetClaimExpense',
  component: () => import('@/views/fullDevelopment/claimExpense/claimExpenseList.vue'),
  meta: {
    title: '员工费用报销',
    requireAuth: true
  }
}]

export default claimExpense