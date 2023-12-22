const voucherLedger =[
  {
    path: '/voucherLedger/voucherLedgerList',
    name: 'voucherLedgerList',
    component: () => import('@/views/businessModule/noWorkflow/voucherLedger/voucherLedgerList'),
    meta: { title: '预缴完税台账', requireAuth: true }
  }];
export default voucherLedger;
