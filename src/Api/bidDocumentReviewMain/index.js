import service from '@/utils/services';
/**
 * 投标文件评审
 * */

//获取客户和项目介绍人状态
export const getCustomerAndProjectLeaderState = (marketMainId) => {
  return service.get(`/bid/bidDocumentReviewMain/getCustomerAndProjectLeaderState/${marketMainId}`, {},{
    action: '获取客户和项目介绍人状态',
  });
};


//检查当前营销项目是否关闭
export const checkMarketMainIsClose = (marketMainId) => {
  return service.get(`/bid/bidDocumentReviewMain/checkMarketMainIsClose/${marketMainId}`, {},{
    action: '检查当前营销项目是否关闭',
  });
};

//投标验证
export const checkTenderDocumentReviewInfo = (params) => {
  return service.post(`/bid/bidDocumentReviewMain/checkTenderDocumentReviewInfo`, params);
};
