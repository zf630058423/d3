import resourceList from './resourceList'
import Layout from '@/layout'
// ==============系统管理    ===================//
const admin = [{
  path: '/adminresourceList',
  component: Layout,
  redirect: '/admin/resource/resourceList',
  name: 'PersonalTodoList',
  meta: {
    title: '系统管理'
  },
  children: [...resourceList]
}, {
  name: 'showUserPosition',
  meta: {
    title: '用户岗位'
  },
  path: '/admin/user/showUserPosition',
  component: () => import('@/views/admin/user/showUserPosition')
}, {
  name: 'positionList_byorgid',
  path: '/admin/position/positionList_byorgid',
  component: () => import('@/views/admin/position/positionList')
}, {
  name: 'positionEdit',
  path: '/admin/position/positionEdit',
  component: () => import('@/views/admin/position/positionEdit')
}, {
  path: '/admin/sqlExecuteLog/sqlExecuteLogEdit',
  name: 'sqlExecuteLogEdit',
  component: () => import('@/views/admin/sqlExecuteLog/sqlExecuteLogEdit')
}, {
  name: 'importPositionByExcel',
  path: '/admin/position/importPositionByExcel',
  component: () => import('@/views/admin/position/importPositionByExcel')
}, {
  name: 'importUserPositionByExcel',
  path: '/admin/position/importUserPositionByExcel',
  component: () => import('@/views/admin/position/importUserPositionByExcel')
}, {
  name: 'postJobEdit',
  path: '/admin/postjob/postJobEdit',
  component: () => import('@/views/admin/postJob/postJobEdit')
}, {
  name: 'importPostJobByExcel',
  path: '/admin/postjob/importPostJobByExcel',
  component: () => import('@/views/admin/postJob/importPostJobByExcel')
}, {
  path: '/admin/demo/leaveEdit',
  name: 'leaveEdit',
  component: () => import('@/views/admin/demo/leaveEdit')
}, {
  path: '/admin/codeGenerator/codeGeneratorEdit',
  name: 'codeGeneratorEdit',
  component: () => import('@/views/admin/codeGenerator/codeGeneratorEdit')
}, {
  path: '/admin/codeGenerator/codeFieldOptionsEdit',
  name: 'codeFieldOptionsEdit',
  component: () => import('@/views/admin/codeGenerator/codeFieldOptionsEdit')
}, {
  path: '/admin/codeGenerator/codeGenfieldList',
  name: 'codeGenfieldList',
  component: () => import('@/views/admin/codeGenerator/codeGenfieldList')
}, {
  path: '/admin/codeGenerator/codeGenfieldEdit',
  name: 'tenantoroptionsEdit',
  component: () => import('@/views/admin/codeGenerator/codeGenfieldEdit')
}, {
  path: '/admin/sys/systemControlpanel',
  name: 'systemControlpanel',
  meta: {
    title: '系统控制台'
  },
  component: () => import('@/views/admin/sys/systemControlpanel')
}, {
  path: '/admin/role/roleEdit',
  name: 'roleEdit',
  component: () => import('@/views/admin/role/roleEdit')
}, {
  path: '/admin/role/roleInResourceEdit',
  name: 'roleInResourceEdit',
  component: () => import('@/views/admin/role/roleInResourceEdit')
}, {
  path: '/admin/user/showUserOrgList',
  name: 'showUserOrgList',
  component: () => import('@/views/admin/user/showUserOrgList')
}, {
  path: '/admin/user/showUserRoleList',
  name: 'showUserRoleList',
  component: () => import('@/views/admin/user/showUserRoleList')
}, {
  path: '/admin/user/updateBaseInfoEdit',
  name: 'updateBaseInfoEdit',
  component: () => import('@/views/admin/user/updateBaseInfoEdit')
}, {
  path: '/admin/user/custormWarning',
  name: 'custormWarning',
  component: () => import('@/views/admin/user/custormWarning')
}, {
  path: '/admin/user/updatePwdEdit',
  name: 'updatePwdEdit',
  component: () => import('@/views/admin/user/updatePwdEdit')
}, {
  path: '/admin/user/switchLoginOrg',
  name: 'switchLoginOrg',
  component: () => import('@/views/admin/user/switchLoginOrg')
}, {
  path: '/admin/user/userEdit',
  name: 'userEdit',
  component: () => import('@/views/admin/user/userEdit')
}, {
  path: '/admin/user/importUserByExcel',
  name: 'importUserByExcel',
  component: () => import('@/views/admin/user/importUserByExcel')
}, {
  path: '/admin/org/importOrgByExcel',
  name: 'importOrgByExcel',
  component: () => import('@/views/admin/org/importOrgByExcel')
}, {
  path: '/admin/role/importRoleByExcel',
  name: 'importRoleByExcel',
  component: () => import('@/views/admin/role/importRoleByExcel')
}, {
  path: '/admin/user/userInfo',
  name: 'userInfo',
  component: () => import('@/views/admin/user/userInfo')
}, {
  path: '/admin/org/organizationList',
  name: 'organizationList',
  component: () => import('@/views/admin/org/organizationList')
}, {
  path: '/admin/org/organizationEdit',
  name: 'organizationEdit',
  component: () => import('@/views/admin/org/organizationEdit')
}, {
  path: '/admin/org/orgUserList',
  name: 'orgUserList',
  component: () => import('@/views/admin/org/orgUserList')
}, {
  path: '/admin/resource/resourceEdit',
  name: 'resourceEdit',
  component: () => import('@/views/admin/resource/resourceEdit')
}, {
  path: '/admin/resource/selectResource',
  name: 'selectResource',
  component: () => import('@/views/admin/resource/selectResource')
}]
export default admin
