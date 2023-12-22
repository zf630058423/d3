
import service from '@/utils/services';

/**
 * 获取材料付款实时数据
 * @param {*} params
 * @returns
 */
export const getCurrentData = (params) => {
  return service.get(`/finance/financePayoutMaterialExtend/getCurrentData`, {
    params
  });
}
/**
 * 根据客商档案自动带出数据
 * @param {*} params 
 * @returns 
 */
export const getCustomerOrSupplierData = (params) => {
  return service.post(`/finance/financePayoutOtherExtend/getCustomerOrSupplierData`, params);
}
/**
 * 根据立项项目或者项目档案自动带出数据
 * @param {*} params 
 * @returns 
 */
export const getAutomaticData = (params) => {
  return service.post(`/finance/financePayoutOtherExtend/getAutomaticData`, params);
}
/**
 * 取收款账号
 * @param {*} params 
 * @returns 
 */
export const getPayInAccountNo = (params) => {
  return service.post(`/finance/financePayoutOtherExtend/getPayInAccountNo`, params);
}
/**
 * 获取付款账号
 * @param {*} params 
 * @returns 
 */
export const getPayOutAccountNo = (params) => {
  return service.post(`/finance/financePayoutOtherExtend/getPayOutAccountNo`, params);
}
/**
 * 获取付款账号 - 集采付款
 * @param {*} params 
 * @returns 
 */
export const getPurchasePayOutAccountNo = (params) => {
  return service.get(`/finance/financePayoutCenterPurchaseExtend/getPayOutAccountNo`, {
    params
  });
}
/**
 * 获取收款账号 - 集采付款
 * @param {*} params 
 * @returns 
 */
export const getPurchasePayInAccountNo = (params) => {
  return service.get(`/finance/financePayoutCenterPurchaseExtend/getPayInAccountNo`, {
    params
  });
}
/**
 * 获取付款组织 - 集采付款
 * @param {*} params 
 * @returns 
 */
export const getPayOrg = (params) => {
  return service.get(`/finance/financePayoutCenterPurchaseExtend/getPayOrg`, {
    params
  });
}

