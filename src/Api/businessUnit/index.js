import service from '@/utils/services';

// const BUSINESS = '/business';
const BUSINESS = '/base';
const SUPPLIER = '/supplier';

/**
 * 业务单元
 */

//业务单元 列表
export const getList = (params) => {
  return service.get(`${BUSINESS}/marketBusinessUnitMain/list`, {
    params,
    action: '业务单元列表',
  });
}

//业务单元递归控件
export const getTree = (params) => {
  return service.get(`${BUSINESS}/marketBusinessUnitMain/getRecursion`, {
    params,
    action: '业务单元递归控件',
  });
}

//业务单元 查看
export const getDetail = (id) => {
  return service.get(`${BUSINESS}/marketBusinessUnitMain/get/${id}`, {});
}

//业务单元 新增
export const saveForm = (params) => {
  return service.post(`${BUSINESS}/marketBusinessUnitMain/save`, params, {
    action: '业务单元新增',
  });
}

//业务单元 更新
export const updateBusiness = (params) => {
  return service.put(`${BUSINESS}/marketBusinessUnitMain/update`, params, {
    action: '业务单元更新',
  });
}

//业务单元 删除
export const deleteBusiness = (id) => {
  return service.delete(`${BUSINESS}/marketBusinessUnitMain/delete/${id}`, {}, {
    action: '业务单元删除',
  });
}

//业务单元 导出
export const exportBusiness = (params) => {
  return service.download(`${BUSINESS}/marketBusinessUnitMain/exportData`, {
    type: 'post',
    isLoading: true,  //是否有加载提示
    loadingMsg: '导出中', //提示信息
    params,  //传的参数
  })
}
