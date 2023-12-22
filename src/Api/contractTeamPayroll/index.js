import service from '@/utils/services';
/**
 *  工资单
 * */

//新增
export const saveForm = (params) => {
  return service.post(`/contract/contractTeamPayrollMain/save`,
    params
  );
};

//更新
export const updateForm = (params) => {
  return service.put(`/contract/contractTeamPayrollMain/update`,
    params
  );
};

//查看
export const getForm = (id) => {
  return service.get(`/contract/contractTeamPayrollMain/get/${id}`);
};
