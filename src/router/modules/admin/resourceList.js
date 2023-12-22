const resourceList = [{
    path: '/admin/resource/resourceList',
    name: 'resourceList',
    meta: {
      title: '菜单管理',
      requireAuth: true
    },
    component: () => import('@/views/admin/resource/resourceList')
  },
  {
    path: '/workflow/security/systemss/systemDataDictList',
    name: 'systemDataDictList',
    meta: {
      title: '数据字典',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/dataDict/systemDataDictList')
  },
  {
    path: '/workflow/security/systemss/dataDictList',
    name: 'dataDictList',
    meta: {
      title: '数据字典',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/dataDict/dataDictList')
  },
  {
    path: '/workflow/security/tenantor/tenantorList',
    name: 'tenantorList',
    meta: {
      title: '租户管理',
      requireAuth: true
    },
    component: () => import('@/views//workflow/security/tenantor/tenantorList')
  },

  {
    path: '/workflow/security/tenantor/systemConfig',
    name: 'systemConfig',
    meta: {
      title: '系统设置',
      requireAuth: true
    },
    component: () => import('@/views//workflow/security/tenantor/systemConfig')
  },
  {
    path: '/admin/org/orgFrame',
    name: 'orgFrame',
    meta: {
      title: '组织管理',
      requireAuth: true
    },
    component: () => import('@/views/admin/org/orgFrame')
  },
  {
    path: '/admin/user/userList',
    name: 'userList',
    meta: {
      title: '用户管理',
      requireAuth: true
    },
    component: () => import('@/views/admin/user/userList')
  },
  {
    path: '/admin/role/roleList',
    name: 'roleList',
    meta: {
      title: '角色管理',
      requireAuth: true
    },
    component: () => import('@/views/admin/role/roleList')
  },
  {
    path: '/admin/role/roleInResourceList',
    name: 'roleInResourceList',
    meta: {
      title: '角色授权',
      requireAuth: true
    },
    component: () => import('@/views/admin/role/roleInResourceList')
  },
  {
    path: '/admin/user/userInRoleList',
    name: 'userInRoleList',
    meta: {
      title: '角色用户',
      requireAuth: true
    },
    component: () => import('@/views/admin/user/userInRoleList')
  },
  {
    name: 'postJobList',
    meta: {
      title: '职务管理',
      requireAuth: true
    },
    path: '/admin/postjob/postJobList',
    component: () => import('@/views/admin/postJob/postJobList')
  },
  {
    name: 'positionList',
    meta: {
      title: '岗位管理',
      requireAuth: true
    },
    path: '/admin/position/positionList',
    component: () => import('@/views/admin/position/positionList')
  },

  {
    path: '/admin/sys/loginLogList',
    name: 'loginLogList',
    meta: {
      title: '登录日志',
      requireAuth: true
    },
    component: () => import('@/views/admin/sys/loginLogList')
  },
  {
    path: '/admin/sys/cachePoolInformationList',
    name: 'cachePoolInformationList',
    meta: {
      title: '查看缓存',
      requireAuth: true
    },
    component: () => import('@/views/admin/sys/cachePoolInformationList')
  },
  {
    path: '/admin/sqlExecuteLog/sqlExecuteLogList',
    name: 'sqlExecuteLogList',
    component: () => import('@/views/admin/sqlExecuteLog/sqlExecuteLogList')
  },
  {
    name: 'loginLockList',
    meta: {
      title: '登录锁定',
      requireAuth: true
    },
    path: '/workflow/frame/loginLock/loginLockList',
    component: () => import('@/views/workflow/frame/loginLock/loginLockList')
  },
  {
    path: '/admin/sys/sysFilelogList',
    name: 'sysFilelogList',
    meta: {
      title: '系统日志',
      requireAuth: true
    },
    component: () => import('@/views/admin/sys/sysFilelogList')
  },

  {
    name: 'permutationsList',
    meta: {
      title: '排列组合工具',
      requireAuth: true
    },
    path: '/admin/sys/permutationsList',
    component: () => import('@/views/admin/sys/permutationsList')
  },
  {
    name: 'codeGeneratorList',
    meta: {
      title: '代码生成器',
      requireAuth: true
    },
    path: '/admin/codeGenerator/codeGeneratorList',
    component: () => import('@/views/admin/codeGenerator/codeGeneratorList')
  },
  {
    name: 'leaveList',
    meta: {
      title: '代码生成示例',
      requireAuth: true
    },
    path: '/admin/demo/leaveList',
    component: () => import('@/views/admin/demo/leaveList')
  }
]

export default resourceList