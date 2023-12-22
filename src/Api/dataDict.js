import service from '@/utils/services';
/**
 * 获取字典列表（多选）
 */
export const getDataDictByConfigType = (params) => {
  return service.get(`/workflow/security/dataDictType/getDataDictByConfigType`, params);
}

/**
 * 营销立项——————校验项目介绍人
 * @param {*} id 
 */
export const getCheckProjectManager = (id) => {
  return service.get(`/market/marketManagerMain/checkProjectManager/${id}`);
}

// 查询统一社会信用代码
export const getSocialUnifiedCreditCode = (id) => {
  return service.get(`/market/marketLegalLetterMain/getCode/${id}`);
}
