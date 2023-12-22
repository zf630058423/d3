import service from '@/utils/services';

const SUPPLIER = '/supplier';

// 劳务分包 查看
export const getlaborDetail = (id) => {
  return service.get(`${SUPPLIER}/supplierLaborSubcontractExtend/get/${id}`,{});
}

// 劳务分包  新增
export const savelaborDetail = (params) => {
  return service.post(`${SUPPLIER}/supplierLaborSubcontractExtend/save`, params, {
    action: '劳务分包保存',
  });
}

// 劳务分包 更新
export const updatelaborDetail = (params) => {
  return service.put(`${SUPPLIER}/supplierLaborSubcontractExtend/update`, params, {
    action: '劳务分包更新',
  });
}

// 获取劳务分包列表
export const getlaborList = (params) => {
  return service.post(`/supplier/supplierLaborSubcontractExtend/list`, params);
};
// 劳务分包 删除
export const deleteLabor = (ids) => {
  return service.delete(`/supplier/supplierLaborSubcontractExtend/delete/${ids}`, {}, {
    action: '劳务分包删除',
  });
}
// 劳务分包 导出
export const exportLabor = (params) => {
  return service.download(`${SUPPLIER}/supplierLaborSubcontractExtend/exportData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
  })
}

// 获取零星供应商列表
export const getSporadiclist = (params) => {
  return service.post(`/supplier/supplierMain/list`, params);
};
// 零星供应商 删除
export const deleteSporadic = (ids) => {
  return service.delete(`/supplier/supplierMain/delete/${ids}`, {}, {
    action: '零星供应商删除',
  });
}
// 零星供应商 查看
export const getSporadicDetail = (id) => {
  return service.get(`${SUPPLIER}/supplierMain/get/${id}`,{});
}
// 零星供应商  新增
export const saveSporadic = (params) => {
  return service.post(`${SUPPLIER}/supplierMain/save`, params, {
    action: '零星供应商保存',
  });
}
// 零星供应商 更新
export const updateSporadic = (params) => {
  return service.put(`${SUPPLIER}/supplierMain/update`, params, {
    action: '零星供应商更新',
  });
}
// 零星供应商 导出
export const exportSporadic = (params) => {
  return service.download(`${SUPPLIER}/supplierMain/exportData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
  })
}

// 获取班组库列表
export const getTeamlist = (params) => {
  return service.post(`/base/baseLaborTeamMain/list`, params);
};
// 班组库 删除
export const deleteTeam = (ids) => {
  return service.delete(`/base/baseLaborTeamMain/delete/${ids}`, {}, {
    action: '班组库删除',
  });
}
// 班组库 查看
export const getTeamDetail = (id) => {
  return service.get(`/base/baseLaborTeamMain/get/${id}`,{});
}
// 班组库  新增
export const saveTeam = (params) => {
  return service.post(`/base/baseLaborTeamMain/save`, params, {
    action: '班组库保存',
  });
}
// 班组库 更新
export const updateTeam = (params) => {
  return service.put(`/base/baseLaborTeamMain/update`, params, {
    action: '班组库更新',
  });
}
// 班组库 导出
export const exportTeam = (params) => {
  return service.download(`/base/baseLaborTeamMain/exportData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type": "application/json; charset=utf-8"
  })
}

// 获取产值填报完成情况列表
export const getOutputlist = (params) => {
  return service.post(`/contract/contractOutputValueCompleteMain/list`, params);
};
// 产值填报完成情况 删除
export const deleteOutputValue = (ids) => {
  return service.delete(`/contract/contractOutputValueCompleteMain/delete/${ids}`, {}, {
    action: '产值填报完成情况删除',
  });
}
// 产值填报完成情况 查看
export const getOutputDetail = (id) => {
  return service.get(`/contract/contractOutputValueCompleteMain/get/${id}`,{});
}
// 产值填报完成情况  新增
export const saveOutputValue = (params) => {
  return service.post(`/contract/contractOutputValueCompleteMain/save`, params, {
    action: '产值填报完成情况保存',
  });
}
// 产值填报完成情况 更新
export const updateOutputValue = (params) => {
  return service.put(`/contract/contractOutputValueCompleteMain/update`, params, {
    action: '产值填报完成情况更新',
  });
}
// 产值填报完成情况 导出
export const exportOutputValue = (params) => {
  return service.download(`/contract/contractOutputValueCompleteMain/exportData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
  })
}
// 产值填报完成情况 导出项目填报明细
export const exportOutputComplete = (params) => {
  return service.download(`/contract/contractOutputValueCompleteMain/exportDetailData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type":"application/json; charset=utf-8"
  })
}

// 获取产值统计表列表  listDetailStatistic
export const getOutputDetaillist = (params) => {
  return service.post(`/contract/outputValueStatistic/listDetailStatistic`, params);
};
// 产值统计表 导出
export const exportOutputDetail = (params) => {
  return service.download(`/contract/outputValueStatistic/exportDetailStatisticData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type":"application/json; charset=utf-8"
  })
}
// 获取产值监控表列表  listDetailStatistic
export const getMonitorList = (params) => {
  return service.post(`/contract/outputValueStatistic/listMonitorStatistic`, params);
};
// 产值监控表 导出
export const exportMonitorData = (params) => {
  return service.download(`/contract/outputValueStatistic/exportMonitorStatisticData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type":"application/json; charset=utf-8"
  })
}
// 获取材料价格库  listDetailStatistic
export const getMaterpriList = (params) => {
  return service.post(`/construct/contractOutPurchaseExtend/materialPriceBank`, params);
};
// 材料价格库 导出
export const exportMaterpriData = (params) => {
  return service.download(`/construct/contractOutPurchaseExtend/exportMaterialPriceBank`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type":"application/json; charset=utf-8"
  })
}

/**
 * 获取供应商合作列表
 * @param {*} params
 * @returns
 */
export const getSupplierCooperateMain = (params) => {
  return service.post(`/supplier/supplierCooperateMain/list`, params);
}
/**
 * 获取供应商合作详情
 * @param {*} id
 * @returns
 */
export const getSupplierCooperateMainById = (id) => {
  return service.get(`/supplier/supplierCooperateMain/get/${id}`);
}
/**
 * 新增供应商合作
 * @param {*} id
 * @returns
 */
export const saveSupplierCooperate = (params) => {
  return service.post(`/supplier/supplierCooperateMain/save`, params);
}
/**
 * 导出供应商合作
 * @param {*} params
 * @returns
 */
export const exportSupplierCooperate = (params) => {
  return service.download(`/supplier/supplierCooperateMain/exportData`, {
    type: 'post',
    isLoading: true, //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params, //传的参数
    "Content-Type": "application/json; charset=utf-8"
  })
}

// 获取付款台账列表
export const queryPayoutList = (params) => {
  return service.post(`/finance/financePayoutMain/queryFinancePayoutLedger`, params);
};
// 付款台账 导出
export const exportPayoutLedger = (params) => {
  return service.download(`/finance/financePayoutMain/exportFinancePayoutLedger`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
    "Content-Type": "application/json; charset=utf-8"
  })
}
