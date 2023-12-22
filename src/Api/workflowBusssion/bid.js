import service from '@/utils/services';

/**
 * 身份证 / 纳税识别号
 * @param {*} params
 * @returns
 */
export const verifyExist = (params) => {
  return service.post(`/bid/baseBidTeamLibraryMain/verifyExist`, params);
}
/**
 * 近两年投标
 * @param {*} teamName 
 * @returns 
 */
export const getBid = (teamName) => {
  return service.get(`/bid/baseBidTeamLibraryMain/getBid/${teamName}`);
}
/**
 * 近两年中标
 * @param {*} teamName 
 * @returns 
 */
export const getSuccessBidder = (teamName) => {
  return service.get(`/bid/baseBidTeamLibraryMain/getSuccessBidder/${teamName}`);
}
/**
 * 已完成审批流程
 * @param marketMainId
 * @returns 
 */
export const getBidDocument = (marketMainId) => {
  return service.get(`/bid/bidResultMain/getBidDocument/${marketMainId}`);
}
