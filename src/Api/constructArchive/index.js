import service from '@/utils/services';

/**
 * 项目档案
 */

//获取列表
export const getList = (params) => {
  return service.post(`/construct/constructArchiveMain/list`, params);
};

//新增
export const saveForm = (params) => {
  return service.post(`/construct/constructArchiveMain/save`,
    params
  );
};

//更新
export const updateForm = (params) => {
  return service.put(`/construct/constructArchiveMain/update`,
    params
  );
};

//查看
export const getForm = (id) => {
  return service.get(`/construct/constructArchiveMain/get/${id}`);
};

//删除
export const deleteForm = (id) => {
  return service.delete(`/construct/constructArchiveMain/delete/${id}`);
};
