import service from '@/utils/services';

/**
 * 客商档案
 */

//获取列表
export const getList = (params) => {
  return service.post(`/customer/customerSupplierArchiveMain/list`, params);
};
//新增
export const saveForm = (params) => {
  return service.post(`/customer/customerSupplierArchiveMain/save`,
    params
  );
};

//更新
export const updateForm = (params) => {
  return service.put(`/customer/customerSupplierArchiveMain/update`,
    params
  );
};

//查看
export const getForm = (id) => {
  return service.get(`/customer/customerSupplierArchiveMain/get/${id}`);
};

//删除
export const deleteForm = (id) => {
  return service.delete(`/customer/customerSupplierArchiveMain/delete/${id}`);
};

// 校验客商名称唯一性
export const checkCustomerName = (params) => {
  return service.post(`/customer/customerSupplierArchiveMain/checkCustomerName`, params);
};

// 导出
export const exportData = (params) => {
  return service.download(`/customer/customerSupplierArchiveMain/exportData`, {
    type: 'json',
    isLoading: true, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    params // 传的参数
  })
}
