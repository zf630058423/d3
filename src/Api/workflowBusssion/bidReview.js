import service from '@/utils/services';

/**
 * 校验项目数据
 * @param {*} params
 * @returns
 */
export const checkProjectDetail = (params) => {
  return service.get(`/bid/bidPreReviewMain/checkProjectDetail`, {
    params: params
  });
}
