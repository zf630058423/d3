import service from '@/utils/services';

/**
 * 获取采购合同实时数据
 * @param {*} params
 * @returns
 */
export const getRealTimeData = (params) => {
  return service.get(`/construct/contractOutPurchaseExtend/getRealTimeData`, {
    params: params
  });
}
/**
 * 获取送货单信息
 * @param {*} params
 * @returns
 */
export const getBillDetail = (params) => {
  return service.get(`/contract/contractDeliverBillMain/getBillDetail`, { params: params });
}

/**
 * 项目资料归档导出
 * @param {*} params
 * @returns
 */
export const exportProjectFile = (params) => {
  return service.download(`/construct/baseProjectDataStore/exportData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中',
    params: params
  })
}

/**
 * 批量下载附件
 * @param {*} params
 * @returns
 */
export const batchDownloadProjectFile = (params) => {
  return service.download(`/construct/baseProjectDataStore/downloadZip`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中',
    params: params
  })
}

/**
 * 项目资料归档查看
 * @param {*} id
 * @returns
 */
export const getBaseProjectDataStoreById = (id) => {
  return service.get(`/construct/baseProjectDataStore/get/${id}`);
}

/**
 * 项目资料归档查看
 * @param {*} params
 * @returns
 */
export const getBaseProjectDataStoreList = (params) => {
  return service.post(`/construct/baseProjectDataStore/list`, params);
}

/**
 * 获取文件列表
 * @param {*} params
 * @returns
 */
export const getProjectFilelist = (params) => {
  return service.post(`/construct/baseProjectDataStore/projectFilelist`, params);
}

/**
 * 获取资料分类树形数据
 * @param {*} params
 * @returns
 */
export const queryDataClassification = (params) => {
  return service.post(`/construct/baseProjectDataStore/queryDataClassification`, params);
}

