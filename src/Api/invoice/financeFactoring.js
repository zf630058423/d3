import service from '@/utils/services';

/**
 * 保理融资申请  接口
 */

const FINANCE = '/finance/financeFactoringApplyMain';

//根据收入类合同自动带出数据
export const getAutomaticApi = (params) => {
  return service.post(`${FINANCE}/getAutomaticData`, params, {
    action: '根据收入类合同自动带出数据',
  });
}

//根据银行档案自动带出数据
export const getBankArchiveDataApi = (params) => { 
  return service.post(`${FINANCE}/getBankArchiveData`, params, {
    action: '根据银行档案自动带出数据',
  });
}
