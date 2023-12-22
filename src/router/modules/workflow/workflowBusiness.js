const workflowBusiness = [
  {
    name: 'workflowBusiness',
    meta: {
      title: '流程表单',
      requireAuth: true
    },
    path: '/workflowForm',
    component: () => import('@/views/businessModule/workflow/workflowProcess/formBox')
  },
  {
    name: 'noWorkflowBusiness',
    meta: {
      title: '无流程表单',
      requireAuth: true
    },
    path: '/noWorkflowForm',
    component: () => import('@/views/businessModule/noWorkflow/noWorkflowProcess/formBox')
  },
  {
    name: 'businessUnitList',
    path: '/marketBusinessUnitMain/businessUnitList',
    component: () => import('@/views/businessModule/noWorkflow/marketBusinessUnitMain/businessUnitList'),
    meta: {
      title: '业务单元',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'marketStatistic',
    path: '/marketStatistic/listTotal',
    component: () => import('@/views/businessModule/noWorkflow/marketStatistic/listTotal'),
    meta: {
      title: '营销投标台账总表',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'marketStatistic',
    path: '/marketStatistic/listDetail',
    component: () => import('@/views/businessModule/noWorkflow/marketStatistic/listDetail'),
    meta: {
      title: '营销投标台账明细表',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'financePayoutMain',
    path: '/financePayoutMain/list',
    component: () => import('@/views/businessModule/noWorkflow/financePayoutMain/list'),
    meta: {
      title: '付款台账',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {  //开票 无流程表单
    name: 'invoiceOpenMain',
    path: '/invoiceOpenMain/list',
    component: () => import('@/views/businessModule/noWorkflow/invoiceOpenMain/list'),
    meta: {
      title: '开票',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {  //发票信息采集 
    name: 'invoiceCollectionMain',
    path: '/invoiceCollectionMain/list',
    component: () => import('@/views/businessModule/noWorkflow/invoiceCollectionMain/list'),
    meta: {
      title: '发票信息采集',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    //银企直连付款
    name: 'bankPaymentMain',
    path: '/bankPaymentMain/list',
    component: () => import('@/views/businessModule/noWorkflow/bankPaymentMain/list'),
    meta: {
      title: '银企直连付款',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    //银企直连收款
    name: 'bankCollectionMain',
    path: '/bankCollectionMain/list',
    component: () => import('@/views/businessModule/noWorkflow/bankCollectionMain/list'),
    meta: {
      title: '银企直连收款',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'supplierLaborList',
    path: '/supplierLaborSubcontractExtend/supplierLaborList',
    component: () => import('@/views/businessModule/noWorkflow/supplierLaborSubcontractExtend/list'),
    meta: {
      title: '劳务分包商-列表',
      requireAuth: true,
    }
  },
  {
    name: 'supplierLaborForm',
    path: '/supplierLaborSubcontractExtend/supplierLaborForm',
    component: () => import('@/views/businessModule/noWorkflow/supplierLaborSubcontractExtend/form'),
    meta: {
      title: '劳务分包商-详情',
      requireAuth: true,
    }
  },
  {
    name: 'supplierCooperateMainList',
    path: '/supplierCooperate/supplierCooperateList',
    component: () => import('@/views/businessModule/noWorkflow/supplierCooperateMain/list'),
    meta: {
      title: '供应商合作-列表',
      requireAuth: true,
    }
  },
  {
    name: 'supplierCooperateMainForm',
    path: '/supplierCooperate/supplierCooperateForm',
    component: () => import('@/views/businessModule/noWorkflow/supplierCooperateMain/form'),
    meta: {
      title: '供应商合作-详情',
      requireAuth: true,
    }
  },
  {
    name: 'projectDataInformationLedger',
    path: '/projectDataInformationLedger/projectDataInformationLedgerList',
    component: () => import('@/views/businessModule/noWorkflow/projectDataInformationLedger/list'),
    meta: {
      title: '项目资料信息台账-列表',
      requireAuth: true,
    }
  },
  {
    name: 'baseProjectDataStoreList',
    path: '/baseProjectDataStore/baseProjectDataStoreList',
    component: () => import('@/views/businessModule/noWorkflow/baseProjectDataStore/list'),
    meta: {
      title: '资料归档-列表',
      requireAuth: true,
    }
  },
  {
    name: 'baseProjectDataStoreForm',
    path: '/baseProjectDataStore/baseProjectDataStoreForm',
    component: () => import('@/views/businessModule/noWorkflow/baseProjectDataStore/form'),
    meta: {
      title: '资料归档-详情',
      requireAuth: true,
    }
  },
  {
    name: 'sporadicList',
    path: '/supplierMain/sporadicList',
    component: () => import('@/views/businessModule/noWorkflow/supplierMain/list'),
    meta: {
      title: '零星供应商-列表',
      requireAuth: true,
    }
  },
  {
    name: 'sporadicForm',
    path: '/supplierMain/sporadicForm',
    component: () => import('@/views/businessModule/noWorkflow/supplierMain/form'),
    meta: {
      title: '零星供应商-详情',
      requireAuth: true,
    }
  },
  {
    name: 'baselaborList',
    path: '/baseLaborTeamMain/baselaborList',
    component: () => import('@/views/businessModule/noWorkflow/baseLaborTeamMain/list'),
    meta: {
      title: '班组库-列表',
      requireAuth: true,
    }
  },
  {
    name: 'baselaborForm',
    path: '/baseLaborTeamMain/baselaborForm',
    component: () => import('@/views/businessModule/noWorkflow/baseLaborTeamMain/form'),
    meta: {
      title: '班组库-详情',
      requireAuth: true,
    }
  },
  {
    name: 'outputvalueList',
    path: '/contractOutputValueCompleteMain/outputvalueList',
    component: () => import('@/views/businessModule/noWorkflow/contractOutputValueCompleteMain/list'),
    meta: {
      title: '产值填报完成情况表-列表',
      requireAuth: true,
    }
  },
  {
    name: 'outputvalueForm',
    path: '/contractOutputValueCompleteMain/outputvalueForm',
    component: () => import('@/views/businessModule/noWorkflow/contractOutputValueCompleteMain/form'),
    meta: {
      title: '产值填报完成情况表-详情',
      requireAuth: true,
    }
  },
  {
    name: 'listDetailList',   // contract/outputValueStatistic/listDetailStatistic
    path: '/listDetailStatistic/listDetailList',
    component: () => import('@/views/businessModule/noWorkflow/listDetailStatistic/list'),
    meta: {
      title: '产值统计表-列表',
      requireAuth: true,
    }
  },
  {
    name: 'listMonitorList',
    path: '/listMonitorStatistic/listMonitorList',
    component: () => import('@/views/businessModule/noWorkflow/listMonitorStatistic/list'),
    meta: {
      title: '产值监控表-列表',  // contract/outputValueStatistic/listMonitorStatistic
      requireAuth: true,
    }
  },
  {
    name: 'materialPriceList',
    path: '/materialPriceBank/materialPriceList',
    component: () => import('@/views/businessModule/noWorkflow/materialPriceBank/list'),
    meta: {
      title: '材料价格库-列表',  // /construct/contractOutPurchaseExtend/materialPriceBank
      requireAuth: true,
    }
  },
  // {
  //   name: 'businessUnitForm',
  //   meta: {
  //     title: '业务单元',
  //     requireAuth: true
  //   },
  //   path: '/businessUnit/businessUnitForm',
  //   component: () => import('@/views/businessModule/noWorkflow/businessUnit/businessUnitForm')
  // },
  {
    name: 'baseBankArchiveMainList',
    path: '/baseBankArchiveMain/list',
    component: () => import('@/views/businessModule/noWorkflow/baseBankArchiveMain/list'),
    meta: {
      title: '银行档案',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'listContractInMain',
    path: '/marketStatistic/listContractInMain',
    component: () => import('@/views/businessModule/noWorkflow/marketStatistic/listContractInMain'),
    meta: {
      title: '收入类合同台账',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'listVoucherCrossLedger',
    path: '/marketStatistic/listVoucherCrossLedger',
    component: () => import('@/views/businessModule/noWorkflow/marketStatistic/listVoucherCrossLedger'),
    meta: {
      title: '跨区涉税台账',
      requireAuth: true,
      icon: 'dashboard'
    }
  },
  {
    name: 'tableDataGrid',
    meta: {
      title: '示例列表',
      requireAuth: true
    },
    path: '/businessModule/tableDataGrid',
    component: () => import('@/views/businessModule/tableDataGrid')
  },
  {
    name: 'marketMainPre',
    meta: {
      title: '业务信息预查询',
      requireAuth: true
    },
    path: '/marketMainPre',
    component: () => import('@/views/businessModule/noWorkflow/marketMainPre/list')
  }
]

export default workflowBusiness;
