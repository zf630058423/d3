const laborLedger =[
  {
    path: '/laborLedger/laborLedgerList',
    name: 'laborLedgerList',
    component: () => import('@/views/businessModule/noWorkflow/laborLedger/laborLedgerList'),
    meta: { title: '劳务台账', requireAuth: true }
  }];
export default laborLedger;
