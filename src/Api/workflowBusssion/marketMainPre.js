import service from '@/utils/services';

/**
 * 业务信息预查询
 * @param {*} params
 * @returns
 */
export const getMarketMainPreList = (params) => {
  return service.post(`/market/marketMainPre/list`, params);
}
