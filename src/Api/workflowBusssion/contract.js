import service from '@/utils/services';

/**
 * 获取采购结算实时数据
 * @param {*} params
 * @returns
 */
export const getAmount = (params) => {
  return service.get(`/contract/contractSettlePurchaseExtend/getAmount`, { params });
}
/**
 * 获取合同编号流水号
 * @param {*} contractCode 
 * @returns 
 */
export const getContractCode = (contractCode) => {
  return service.get(`/contract/contractInDesignExtend/getContractCode/${contractCode}`);
}
/**
 * 合同变更 - 变更后合同总金额(含税)
 * @param {*} contractCode 
 * @returns 
 */
export const getContractInMainAmount = (contractInMainId) => {
  return service.get(`/contract/contractInMain/getAmount/${contractInMainId}`);
}