import service from '@/utils/services';

/**
 * 发票信息采集 接口
 */

// const INVOICE = '/invoice/invoiceOpenMain/list';
const INVOICE = '/invoice';

//发票信息采集列表
export const getInvoiceCollectionList = (params) => {
  return service.post(`${INVOICE}/invoiceCollectionMain/list`, params, {
    action: '发票信息采集列表',
  })
}

//开票导出
export const exportInvoice = (params => {
   return service.download(`${INVOICE}/invoiceOpenMain/exportData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    'Content-Type': 'application/json; charset=utf-8',
    params // 传的参数
   })
})

//下载附件
export const downloadFile = (params => {
  return service.post(`${INVOICE}/invoiceOpenMain/downloadZip`, params, {
    action: '下载附件',
  })

  // return service.download(`${INVOICE}/invoiceOpenMain/downloadZip`, {
  //   type: 'json',
  //   isLoading: true, // 是否有加载提示
  //   loadingMsg: '下载中', // 提示信息
  //   params // 传的参数
  //  })
})

//流水单刪除
export const deleteFlowSheet = (params) => {
  return service.post(`${INVOICE}/deleteFlowSheet`, params, {
    action: '流水单刪除',
  });
}

//可申请开票金额(含税)(元)
export const getMayApplyInvoiceAmountTax = (params) => {
  return service.post(`${INVOICE}/getMayApplyInvoiceAmountTax`, params, {
    action: '可申请开票金额(含税)(元)',
  });
}

//累计已开票金额(含税)元
export const getTotalInvoicedAmountTax = (params) =>{
  return service.post(`${INVOICE}/getTotalInvoicedAmountTax`, params, {
    action: '累计已开票金额(含税)元',
  });
}

//累计已预缴计税基数(元)
export const getTotalPrepaidTaxBaseAmount = (params) => {
  return service.post(`${INVOICE}/getTotalPrepaidTaxBaseAmount`, params, {
    action: '累计已预缴计税基数(元)',
  })
}

//关联预缴
export const relatedPrepayment = (params) => {
  return service.post(`${INVOICE}/relatedPrepayment`, params, {
    action: '关联预缴',
  });
}

//导出开票申请列表
export const exportData = (params) => {
  return service.post(`${INVOICE}/exportData`, params, {
    action: '导出开票申请列表',
  });
}

//生成开票
export const saveMakeOutInvoice = (params) => {
  return service.post(`${INVOICE}/saveMakeOutInvoice`, params, {
    action: '生成开票',
  });
}

//更新开票申请
export const updateMakeOutInvoice = (params) => {
  return service.put(`${INVOICE}/update`, params, {
    action: '更新开票申请',
  });
}


//查询产品线
export const getProductlineList = (params) => {
  return service.get(`${EXTEND}/marketingBidStatistic/productlineList`, {
    params,
    action: '查询产品线',
  });
}

//导出开票申请明细
export const detailExport = (params) => {
  return service.download(`${DETAIL_INVOICE}/exportData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}

//导入开票申请明细
export const detailImport = (params) => {
  return service.post(`${DETAIL_INVOICE}/importData`, params, {
    action: '导入开票申请明细',
  });
}
// 付款 - 选择发票控件
export const getFinancePayoutInvoiceControl = (params) => {
  return service.post(`/finance/financePayoutRelateInvoiceDetail/queryFinancePayoutInvoiceControl`, params, {
    action: '选择发票控件',
  });
}
//付款--导出付款表单关联发票
export const exportDataInvoiceRelevancePayment = (params) => {
  return service.download(`/finance/financePayoutRelateInvoiceDetail/exportDataInvoiceRelevancePayment`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}

//付款--导入关联发票
export const importDataPayoutRelateInvoiceDetail = (params) => {
  return service.post(`/finance/financePayoutRelateInvoiceDetail/importData`, params, {
    action: '导入开票申请明细',
  });
}
