import service from '@/utils/services';

/**
 * 获取入库详情
 * @param {*} params
 * @returns
 */
export const getStockInDetails = (params) => {
  return service.get(`/stock/stockInMain/getStockInDetails`, {
    params: params
  });
}
/**
 * 导出入库信息
 * @param {*} params
 * @returns
 */
export const exportDetails = (params) => {
  return service.download(`/stock/stockInMain/exportDetails`, {type:'json',params:params})
}
/**
 * 导出材料明细
 * @param {*} params
 * @returns
 */
export const exportStockOutMainDetails = (params) => {
  return service.download(`/stock/stockOutMain/exportDetails`, {
    type: 'json',
    params: params
  })
}
/**
 * 导出退货信息
 * @param {*} params
 * @returns
 */
export const exportStockReturnDetails = (params) => {
  return service.download(`/stock/stockMaterialReturnMain/exportDetails`, {
    type: 'json',
    params: params
  })
}
/**
 * 获取材料信息
 * @param {*} params
 * @returns
 */
export const getStockReturnDetail = (params) => {
  return service.get(`/stock/stockMaterialReturnMain/getDetail`, {
    params: params
  });
}
