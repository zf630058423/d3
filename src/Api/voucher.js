import service from '@/utils/services';

const EXTEND = '/voucher';



//跨区涉税台账
export const getDetailStatistic = (params) => {
  return service.post(`${EXTEND}/voucherCrossTaxLedgerMain/list`, params, {
    action: '跨区涉税台账',
  });
}

//跨区涉税台账导出
export const exportLedgerData = (params) => {
  return service.download(`${EXTEND}/voucherCrossTaxLedgerMain/exportLedgerData`, {
    type: 'post',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}
//收入类合同台账
export const getContractInMain = (params) => {
  return service.post(`/contract/contractInMain/list`, params, {
    action: '收入类合同台账',
  });
}

//收入类合同台账导出
export const exportContractData = (params) => {
  return service.download(`/contract/contractInMain/exportData`, {
    type: 'post',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}