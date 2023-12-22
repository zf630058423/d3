import service from '@/utils/services';

/**
 * 各弹框接口
 */

//营销立项
const MARKET = '/market/marketProjectExtend';  

//营销关闭弹框 确认接口
export const closeOperateApi = (params) => {
  return service.post(`${MARKET}/closeOperate`, params, {
    action: '营销立项关闭',
  });
}