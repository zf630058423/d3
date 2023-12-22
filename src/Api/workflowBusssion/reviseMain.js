import service from '@/utils/services';

/**
 * 修订记录列表
 * @param {*} params
 * @returns
 */
export const getReviseMainList = (params) => {
  return service.get(`/business/reviseMain/list`, params);
}
/**
 * 修订记录详情
 * @param {*} params
 * @returns
 */
export const getReviseMainInfo = (id) => {
  return service.get(`/business/reviseMain/get/${id}`);
}
