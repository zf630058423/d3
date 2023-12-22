import service from '@/utils/services';

//班组核量--查询金额信息(已核量金额(元)(不含本次)、合同总金额(元)、甲方/监理累计确认)
export const getContractAmountInfo = (params) => {
  return service.post(`/contract/contractCheckLaborTeamExtend/getAmountInfo`,
    params
  );
};

// 班组核量--获取核量信息
export const getTeamContractDetail = (contractOutMainId) =>{
  return service.get(`/contract/contractCheckLaborTeamExtend/getTeamContractDetail/${contractOutMainId}`)
}
// 班组合同--获取可签订金额
export const getCanBeSignedAmount = (laborSubContractId) =>{
  return service.get(`/contract/contractOutLaborTeamExtend/getCanBeSignedAmountByLaborSubId/${laborSubContractId}`)
}

// 班组结算--获取结算信息
export const getTeamContractSettleDetail = (contractOutMainId) =>{
  return service.get(`/contract/contractSettleLaborTeamExtend/getTeamContractDetail/${contractOutMainId}`)
}

// 班组结算--获取金额信息
export const getTeamContractSettleAmount = (contractOutMainId) =>{
  return service.get(`/contract/contractSettleLaborTeamExtend/getAmountInfor/${contractOutMainId}`)
}
// 班组结算--获取产值填报
export const getProjectOutputValue = (constructArchiveMainId) =>{
  return service.get(`/contract/contractSettleLaborTeamExtend/getProjectOutputValue/${constructArchiveMainId}`)
}

// 班组工资确认单--获取班组合同金额
export const getContractTeamAmount = (params) =>{
  return service.post(`/contract/contractTeamPayrollCheckDetail/getContractTeamAmount`,params)
}

// 劳务付款--获取劳务付款相关金额(应付金额)
export const getPayoutLaborAmount = (params) =>{
  return service.post(`/finance/financePayoutLaborExtend/getPayoutLaborAmount`,params)
};

//专业分包核量--查询金额信息(已核量金额(元)、合同总金额(元)) /contract/contractCheckProfessionExtend/getProfessionCheckAmountInfo
export const getProfessionCheckAmountInfo = (params) => {
  return service.post(`/contract/contractCheckProfessionExtend/getProfessionCheckAmountInfo`,params);
};

// 专业分包核量--获取核量信息
export const getContractCheckLaborTeamExtendDetail = (contractOutMainId) =>{
  return service.get(`/contract/contractCheckProfessionExtend/getTeamContractDetail/${contractOutMainId}`)
}

// 专业分包结算--获取结算信息
export const getProfessionContractDetail = (contractOutMainId) =>{
  return service.get(`/contract/contractSettleProfessionExtend/getProfessionContractDetail/${contractOutMainId}`)
}

// 专业分包结算--获取金额信息
export const getProfessionSettleAmount = (contractOutMainId) =>{
  return service.get(`/contract/contractSettleProfessionExtend/getProfessionSettleAmountInfor/${contractOutMainId}`)
}

// 专业分包付款--获取专业分包付款相关金额
export const getPayoutProfessionAmount = (params) =>{
  return service.post(`/finance/financePayoutProfessionExtend/getPayoutProfessionAmount`,params)
};

// 预缴完税台账--获取列表
export const getVoucherLedgerList = (params) =>{
  return service.post(`/voucher/voucherMain/queryVoucherLedger`,params)
};

// 预缴完税台账--导出列表
export const exportVoucherLedger = (params) => {
  return service.download(`/voucher/voucherMain/exportVoucherLedger`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type": "application/json; charset=utf-8"
  })
}

// 预缴完税台账--扣除信息 - 选择发票控件
export const getDeductInvoiceControlList = (params) =>{
  return service.post(`/voucher/voucherMain/queryDeductInvoiceControl`,params)
};

// 劳务台账--获取列表
export const getLaborLedgerList = (params) =>{
  return service.post(`/contract/contractOutLaborTeamExtend/laborLedgerList`,params)
};

// 劳务台账--导出列表
export const exportLaborLedgerData = (params) => {
  return service.download(`/contract/contractOutLaborTeamExtend/exportLaborLedgerData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type": "application/json; charset=utf-8"
  })
}

// 项目资料信息台账
export const projectDataInformationLedger = (params) => {
  return service.post(`/construct/projectDataInformationLedger/list`, params)
};

// 审批修订流程表单
export const reviseWildForm = (modelName, key, params) => {
  return service.put(`/${modelName}/${key}/updataRevise`,params);
}

// 资格预审文件评审--投标校验
export const checkBidQualificationReviewInfo = (params) => {
  return service.post(`/bid/bidQualificationReviewMain/checkBidQualificationReviewInfo`, params)
};

// 营销立项——————校验项目介绍人
export const checkProjectManager = (id) =>{
  return service.get(`/market/marketManagerMain/checkProjectManager/${id}`)
}

// 通用接口--获取跳转表单需要信息
export const getDateJumpInfo = (params) => {
  return service.post('/workflow/workflowform/getDateJump?rowId='+params.rowId+'&appId='+params.appId+'&tableName='+params.tableName)
};
