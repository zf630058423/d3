import service from "@/utils/services";

const MODULES = "/contract";

/**
 * 其他支出合同
 */

//根据项目id查询收入合同
export const queryContractInMain = params => {
  return service.post(`${MODULES}/contractOutOtherExtend/queryContractInMain`, params, {
    action: "查询收入合同"
  });
};
//根据项目id查询其他支出合同
export const queryContractOutOtherMain = params => {
  return service.post(`${MODULES}/contractOutOtherExtend/queryContractOutOtherMain`, params, {
    action: "查询其他支出合同"
  });
};



// 导出
export const exportFile = params => {
  return service.download(`${MODULES}/contractOutOtherExtend/exportDetailData`, {
    type: "post",
    isLoading: true, //是否有加载提示
    loadingMsg: "导出中", //提示信息
    'Content-Type': 'application/json; charset=utf-8',
    params //传的参数
  });
};

//查询主合同编号
export const getMasterContractCode = params => {
  return service.post('/workflow/fuiFramework/getViewTableListData/?deforder=desc&defsort=id&viewTable=v_contract_out_main_other&dataSource=&configTableName=CustDialog_QiTaZhiChuHeTong&isEnableAuthor=0&defaultWhere=', params, {
    action: "查询主合同编号"
  });
};