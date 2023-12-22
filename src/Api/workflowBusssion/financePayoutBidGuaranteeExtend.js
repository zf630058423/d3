import service from '@/utils/services';

const FINANCE = '/finance/financePayoutBidGuaranteeExtend';
const FINANCEAPPLY = '/finance/financePayoutPerformanceGuaranteeExtend';
// /finance/financePayoutPerformanceGuaranteeExtend/checkPerformanceGuaranteeApply



// 校验投标保证金支付申请
export const checkBidGuaranteeApplyApi = (params) => {
  return service.post(`${FINANCE}/checkBidGuaranteeApply`, params, {
    action: '校验投标保证金支付申请',
  });
}

// 校验履约保证金支付申请
export const checkPerformanceGuaranteeApi = (params) => {
  return service.post(`${FINANCEAPPLY}/checkPerformanceGuaranteeApply`, params, {
    action: '校验履约保证金支付申请',
  });
}