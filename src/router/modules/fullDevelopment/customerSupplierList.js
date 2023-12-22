const customerSupplierList =[ {
  path: '/customerSupplierArchiveMain/customerSupplierList',
  name: 'customerSupplierList',
  component: () => import('@/views/businessModule/noWorkflow/customerSupplierArchiveMain/list'),
  meta: { title: '客商档案', requireAuth: true }
},
  {
    path: '/customerSupplierForm',
    name: 'customerSupplierForm',
    component: () => import('@/views/businessModule/noWorkflow/customerSupplierArchiveMain/form'),
    meta: { title: '新增', requireAuth: true }
  }]
export default customerSupplierList;
