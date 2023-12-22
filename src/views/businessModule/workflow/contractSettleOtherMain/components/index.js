import service from "@/utils/services";

const MODULES = "/contract";

/**
 * 其他支出合同结算
 */

//根据项目id查询变更后合同总金额(含税)
export const getChangeTotalAmountTax = (masterContractId) => {
  return service.get(`${MODULES}/contractOutChangeMain/getChangeTotalAmountTax/${masterContractId}`, {
    action: "变更后合同总金额(含税)"
  });
};

// 导出
export const exportFile = params => {
  return service.download(`${MODULES}/contractSettleOtherMain/exportDetailData`, {
    type: "post",
    isLoading: true, //是否有加载提示
    loadingMsg: "导出中", //提示信息
    'Content-Type': 'application/json; charset=utf-8',
    params //传的参数
  });
};
