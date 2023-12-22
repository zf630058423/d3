import request from '@/utils/request'
/**
 * demo页面接口请求方法
 *
 **/

export default {
  // 获取列表数据
  getTableData: (obj) => {
    return request({
      url: '/demo/list',
      method: 'get',
      params:obj
    })
  },
  // 新增数据
  addData: (obj) =>{
    return request({
      url: '/demo/save',
      method: 'post',
      data:obj
    })
  },
  // 编辑数据
  updateData: (obj) =>{
    return request({
      url: '/demo/update',
      method: 'post',
      data:obj
    })
  },
  // 获取数据
  getData: (id) =>{
    return request({
      url: `/demo/get/${id}`,
      method: 'get'
    })
  },
  // 删除数据
  deleteData: (id) =>{
    return request({
      url: `/demo/delete/${id}`,
      method: 'delete'
    })
  }
}
