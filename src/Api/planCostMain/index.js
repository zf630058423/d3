import service from '@/utils/services';
/**
 * 计划成本
 * */


//获取项目信息
export const getConstructInfo = (params) => {
  return service.post(`/construct/planCostMain/getAutomaticData`, params,{
    action: '获取项目信息',
  });
};

//校验唯一性
export const checkOnlyData = (params) => {
  return service.post(`/construct/planCostMain/checkUnique`, params,{
    action: '校验唯一性',
  });
};

/**
 * 计划成本调整
 * */

//获取项目信息
export const getAdjustConstructInfo = (params) => {
  return service.post(`/construct/planCostMainAdjust/getAutomaticData`, params,{
    action: '获取项目信息',
  });
};

//获取计划成本最新数据
export const getLastestInfo = (params) => {
  return service.post(`/construct/planCostMainAdjust/getLatest`, params,{
    action: '获取项目信息',
  });
};
//校验唯一性
export const checkOnlyAdjustData = (params) => {
  return service.post(`/construct/planCostMainAdjust/checkUnique`, params,{
    action: '校验唯一性',
  });
};

