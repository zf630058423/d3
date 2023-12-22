import service from '@/utils/services';

const INVOICE = '/invoice/invoiceOpenApplyMain';  //开票申请
const BASE = `/base/marketBusinessUnitMain`;
const DETAIL_INVOICE = '/invoice/invoiceOpenApplyDetail';
const INVOICE_COLL = '/invoice/invoiceCollectionMain';  //发票信息采集

//累计上报产值(含税)(元)
export const getEscalationOutputValue = (params) => {
  return service.post(`${INVOICE}/getEscalationOutputValue`, params, {
    action: '累计上报产值(含税)(元)',
  });
}

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

//导出 开票申请明细
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

//导出
export const exportApi = (modelName, enCode, params) => {
  return service.download(`/${modelName}/${enCode}/exportData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}

//项目导出
export const exportDataProjectApi = (params) => {
  return service.download(`/invoice/invoiceCollectionMain/exportDataProject`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  }) 
}

//付款导出
export const exportDataPaymentApi = (params) => {
  return service.download(`/invoice/invoiceCollectionMain/exportDataPayment`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  }) 
}

//是否预付款  开票申请
export const getIsAdvanceApi = (params) => { 
  return service.post(`${INVOICE}/getIsAdvance`, params, {
    action:'是否预付款'
  });
}

//获取税率 开票申请
export const getTaxApi = (params) => { 
  return service.post(`${INVOICE}/getTax`, params, {
    action:'获取税率'
  });
}

//根据收入合同id获取销售方和购方信息 开票申请
export const getSellerAndBuyerInfoByContractInMainIdApi = (contractInMainId) => { 
  return service.get(`${INVOICE}/getSellerAndBuyerInfoByContractInMainId/${contractInMainId}`, {
    action:'根据收入合同id获取销售方和购方信息'
  });
}

//根据发票id获取销售方和购方信息 开票申请
export const getSellerAndBuyerInfoByInvoiceCollectionMainIdApi = (invoiceCollectionMainId) => { 
  return service.get(`${INVOICE}/getSellerAndBuyerInfoByInvoiceCollectionMainId/${invoiceCollectionMainId}`, {
    action:'根据收入合同id获取销售方和购方信息'
  });
}

//根据组织id获取业务单元信息  开票申请
export const getMarketBusinessUnitInfoApi = (orgId) => { 
  return service.get(`${BASE}/getMarketBusinessUnitInfo/${orgId}`, {
    action:'根据组织id获取业务单元信息'
  });
}

//根据收入合同id获取销售方和购方信息  开票申请
// export const getSellerAndBuyerInfoByContractInMainIdApi = (contractInMainId) => { 
//   return service.get(`${INVOICE}/getSellerAndBuyerInfoByContractInMainId/${contractInMainId}`, {
//     action:'根据收入合同id获取销售方和购方信息'
//   });
// }

//发票信息采集 删除
export const invoiceCollectionDelete = (ids) => { 
  return service.delete(`/invoice/invoiceCollectionMain/delete/${ids}`, {}, {
    action: '发票信息采集删除',
  });
}

//发票信息采集 批量认领
export const queryInvoiceClaimInfoApi = (params) => { 
  return service.post(`${INVOICE_COLL}/queryInvoiceClaimInfo`, params, {
    action:'发票信息采集批量认领'
  });
}

//发票信息采集 确认认领
export const invoiceConfirmBatchClaimApi = (params) => { 
  return service.post(`/invoice/invoiceCollectionMain/invoiceConfirmBatchClaim`, params, {
    action:'确认认领'
  });
}

//发票信息采集 推费用预提单
export const pushExpenseHoldingApi = (params) => { 
  return service.post(`${INVOICE_COLL}/pushExpenseHolding`, params, {
    action:'推费用预提单'
  })
}

//发票信息采集 复核、取消复核
export const batchUpdateReviewApi = (params) => { 
  return service.post(`${INVOICE_COLL}/batchUpdateReview`, params, {
    action:'复核、取消复核'
  })
}

//发票信息采集 一键复核
export const oneClickReviewApi = (params) => { 
  return service.post(`${INVOICE_COLL}/oneClickReview`, params, {
    action:'一键复核'
  })
}

//发票信息采集 异常已交罚款
export const batchUpdateAbnormalFinePaidApi = (params) => { 
  return service.post(`${INVOICE_COLL}/batchUpdateAbnormalFinePaid`, params, {
    action:'异常已交罚款'
  })
}

//发票信息采集 收到发票原件
export const batchUpdateReceivedOriginalInvoiceApi = (params) => { 
  return service.post(`${INVOICE_COLL}/batchUpdateReceivedOriginalInvoice`, params, {
    action:'收到发票原件'
  })
}

//发票信息采集 付款 - 后补票
export const postTicketReplenishmentApi = (params) => { 
  return service.post(`${INVOICE_COLL}/postTicketReplenishment`, params, {
    action:'付款-后补票'
  })
}

//发票信息采集 更新发票信息
export const importDataUpdateInvoiceCollectionApi = (params) => { 
  return service.post(`${INVOICE_COLL}/importDataUpdateInvoiceCollection`, params, {
    action:'更新发票信息'
  })
}
