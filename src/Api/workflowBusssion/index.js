import service from '@/utils/services';

const EXTEND = '/extend/marketing';
/**
 * 获取工作流表单
 * @param {*} params
 * @returns
 */
export const geteWorkflowInfo = (params) => {
  return service.post(`${EXTEND}/marketingBidStatistic/selectStatistic`, params);
}
/**
 * 创建工作流表单
 */
export const createWorkflow = (params) => {
  return service.post(`${EXTEND}/marketingBidStatistic/selectStatistic`, params);
}
/**
 * 列表
 */
export const getTableList = (modelName, key, params) => {
  return service.post(`/${modelName}/${key}/list`, params);
}
/**
 * 获取表单详情
 */
export const getFormInfo = (modelName, key, rowId) => {
  return service.get(`/${modelName}/${key}/get/${rowId}`);
}

/**
 * 营销 重启获取详情
 * @param {*} modelName 
 * @param {*} key 
 * @param {*} params 
 * @returns 
 */
export const getReStartInfo = (modelName, key, rowId) => {
  return service.get(`/${modelName}/${key}/selectByMarket/${rowId}`); //application/x-www-form-urlencoded
}

/**
 * 获取单据编号
 */
export const getSerialNumber = (params) => {
  return service.postForm(`/workflow/fuiFramework/getSerialNumber`, params);
}
/**
 * 提交表单
 */
export const submitForm = (modelName, key, params) => {
  return service.post(`/${modelName}/${key}/save`, params);
}
/**
 * 更新
 */
export const updateForm = (modelName, key, params) => {
  return service.put(`/${modelName}/${key}/update`, params);
}

/**
 * 修订
 */
export const reviseForm = (modelName, key, params) => {
  return service.put(`/${modelName}/${key}/revise`, params);
}
/**
 * 删除列表
 */
export const deleteForm = (modelName, key, ids) => {
  return service.delete(`/${modelName}/${key}/delete/${ids}`);
}

/**
 * 导出
 * @param params
 * @returns {*}
 */
export const exportData = (modelName, key, params) => {
  return service.download(`/${modelName}/${key}/exportData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}
/**
 * 导出明细
 * @param params
 * @returns {*}
 */
export const exportDataDetails = (url, params) => {
  return service.download(url, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}

/**
 * 自定义对话框api
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 * @returns 
 */
export const customDialogApi = (url, params) => {
  return service.post(url, params)
}

/**
 * 导入
 * @param params
 * @returns {*}
 */
export const importData = (modelName, key, params) => {
  return service.importForm(`/${modelName}/${key}/importData`, params)
}

/**
 * 导入明细
 * @param params
 * @returns {*}
 */
export const importDataDetails = (url, params) => {
  return service.importForm(url, params)
}

/**
 * 更新附件
 * @param {*} url 
 * @param {*} params 
 * @returns 
 */
export const updateFile = (url, params) => { 
  // return service.put(url, params)
  return service.post(url, params)
}

/**
 * 通用模板文件下载
 * @param params
 * @returns {*}
 */
export const downloadTemplateFile = (key) => {
  return service.download(`/base/template/downloadTemplateFile/${key}`, {
    type: 'get',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中'
  })
}

/**
 * 待办跳转审批详情
 * @param {*} params 
 * @returns 
 */
export const getDetailData = (params) => {
  return service.get(`/workflow/workflowform/getDetailData`, {
    params: params
  });
}
