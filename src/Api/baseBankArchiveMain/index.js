import service from "@/utils/services";

const MODULES = "/base";

/**
 * 银行档案
 */

//银行档案列表
export const getList = params => {
  return service.post(`${MODULES}/baseBankArchiveMain/list`, params, {
    action: "银行档案列表"
  });
};


//银行档案 查看
export const getDetail = id => {
  return service.get(`${MODULES}/baseBankArchiveMain/get/${id}`, {});
};

//银行档案 新增
export const saveForm = params => {
  return service.post(`${MODULES}/baseBankArchiveMain/save`, params, {
    action: "银行档案新增"
  });
};

//银行档案 更新
export const updateBankFile = params => {
  return service.put(`${MODULES}/baseBankArchiveMain/update`, params, {
    action: "银行档案更新"
  });
};
//银行档案 校验银行账号
export const checkBankArchive = params => {
  return service.post(`${MODULES}/baseBankArchiveMain/checkBankArchive`, params, {
    action: "校验银行账号",
    hideErrorMsg:true
  }).catch(err=>err);
};

//银行档案 删除
export const deleteBankFile = id => {
  return service.delete(
    `${MODULES}/baseBankArchiveMain/delete/${id}`,
    {},
    {
      action: "银行档案删除"
    }
  );
};

//银行档案 导出
export const exportBankFile = params => {
  return service.download(`${MODULES}/baseBankArchiveMain/exportData`, {
    type: "post",
    isLoading: true, //是否有加载提示
    loadingMsg: "导出中", //提示信息
    'Content-Type': 'application/json; charset=utf-8',
    params //传的参数
  });
};
