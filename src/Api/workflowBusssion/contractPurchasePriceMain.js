import service from '@/utils/services';
/**
 * 导出明细
 * @param params
 * @returns {*}
 */
export const exportDataDetail = (params) => {
  return service.download(`/construct/contractPurchasePriceMain/exportDataDetail`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}