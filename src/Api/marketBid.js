import service from '@/utils/services';

const EXTEND = '/extend/marketing';

//营销投标台账
export const getData = (params) => {
  // return service.post(`${EXTEND}/marketingBidStatistics/getData`, params, {
  //   action: '营销投标台账',
  // });
  return service.post(`${EXTEND}/marketingBidStatistic/selectStatistic`, params, {
    action: '营销投标台账',
  });
}

//查询产品线
export const getProductlineList = (params) => {
  return service.get(`${EXTEND}/marketingBidStatistic/productlineList`, {
    params,
    action: '查询产品线',
  });
}

//营销投标台账明细表
export const getDetailStatistic = (params) => {
  return service.post(`${EXTEND}/marketingBidStatistic/selectDetailStatistic`, params, {
    action: '营销投标台账明细表',
  });
}

//导出台账明细
export const exportTable = (params) => {
  // return service.get(`/public/export/marketingDetailStatistic`, {
  //   params,
  //   action: '导出台账明细',
  // })
  return service.post(`/public/export/marketingDetailStatistic`, params, {
    action: '导出台账明细',
  });
}

//营销投标总表
export const getListTotal = (params) => {
  return service.post(`/market/marketStatistic/listTotal`, params, {
    action: '营销投标总表'
  })
}

//营销投标总表导出
export const exportTotalData = (params) => {
  return service.download(`/market/marketStatistic/exportTotalData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}

//营销投标明细表
export const getListDetail = (params) => {
  return service.post(`/market/marketStatistic/listDetail`, params, {
    action: '营销投标明细表'
  })
}

//营销投标明细表导出
export const exportDetailData = (params) => {
  return service.download(`/market/marketStatistic/exportDetailData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}