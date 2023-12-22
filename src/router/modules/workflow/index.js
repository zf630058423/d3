import personalTodo from './personalTodo'
import apaasDesigner from './apaasDesigner'
import solutionLayout from '@/views/workflow/security/solution/solutionLayout'
// ==============流程管理===============================//
import processManage from './processManager'
// ==============SmartForm===============================//
import smartFormBlock from './smartFormBlock'
// ==============流程辅助===============================//
import liucnegfuzhu from './liucnegfuzhu'
// ==============维护管理===============================//
import weihu from './weihu'
// ==============发版管理===============================//
import release from './release'
// ====================流程监控  workflowMonitor=========================//
import processmonitoring from './processmonitoring'
// ====================流程监控  workflowAnalysis=========================//
import workflowAnalysis from './workflowAnalysis'
// ==============集成接入===============================//
import jinchengjieru from './jinchengjieru'
// ==============印章管理===============================//
import selManager from './selManager'
// ==============应用管理===============================//
import application from './application'
// ==============信息管理===============================//
import articleManager from './articleManager'
// ==============系统设置===============================//
import flowSystem from './flowSystem'
// ==============个人业务===============================//
import workflowBusiness from './workflowBusiness'
import Layout from '@/layout'
const workflow = [
  {
    path: '/PersonalTodoList',
    component: Layout,
    redirect: '/workflow/workflowBusiness/todoList',
    name: 'PersonalTodoListName',
    meta: {
      title: '个人工作台',
      requireAuth: true
    },
    children: [
      ...personalTodo,
      ...processManage,
      ...smartFormBlock,
      ...liucnegfuzhu,
      ...weihu,
      ...release,
      ...processmonitoring,
      ...workflowAnalysis,
      ...jinchengjieru,
      ...selManager,
      ...application,
      ...articleManager,
      ...flowSystem,
      ...workflowBusiness
    ]
  }, {
    path: '/apaasDesigner',
    component: solutionLayout,
    redirect: '/',
    name: '应用设计方案',
    meta: {
      title: ''
    },
    children: [...apaasDesigner]
  }, {
    path: '/workflow/notification/notificationView',
    name: 'notificationView',
    component: () => import('@/views/workflow/notification/notificationView')
  }, {
    path: '/workflow/gridEditor/relevancePrepay',
    name: 'relevancePrepay',
    component: () => import('@/views/workflow/gridEditor/relevancePrepay')
  },
  // ==============系统管理    ===================//
  {
    name: 'loginLockEdit',
    path: '/workflow/frame/loginLock/loginLockEdit',
    component: () => import('@/views/workflow/frame/loginLock/loginLockEdit')
  }, {
    path: '/workflow/security/tenantor/optionsEdit',
    name: 'optionsEdit',
    component: () => import('@/views/workflow/security/tenantor/optionsEdit')
  }, {
    path: '/workflow/security/tenantor/tenantorInResourceList',
    name: 'tenantorInResourceList',
    component: () => import('@/views/workflow/security/tenantor/tenantorInResourceList')
  }, {
    path: '/workflow/security/tenantor/tenantorEdit',
    name: 'tenantorEdit',
    component: () => import('@/views/workflow/security/tenantor/tenantorEdit')
  },
  // 开票申请确认重开弹窗
  {
    path: '/workflow/gridEditor/confirmReopen',
    name: 'confirmReopen',
    component: () => import('@/views/workflow/gridEditor/confirmReopen')
  },
  // 开票申请百望重开
  {
    path: '/workflow/gridEditor/baiwangReopen',
    name: 'baiwangReopen',
    component: () => import('@/views/workflow/gridEditor/baiwangReopen')
  },
  // ==============表单应用设计方案一体化设计===============================//
  {
    name: 'tableModeEdit',
    path: '/workflow/smartForm/table/tableModeEdit',
    component: () => import('@/views/workflow/smartForm/table/tableModeEdit')
  }, {
    name: 'processAppConfig',
    path: '/workflow/security/solution/processAppConfig',
    component: () => import('@/views/workflow/security/solution/processAppConfig')
  }, {
    name: 'solutionEdit',
    meta: {
      title: '方案编辑'
    },
    path: '/workflow/security/solution/solutionEdit',
    component: () => import('@/views/workflow/security/solution/solutionEdit')
  }, {
    name: 'processDesigner',
    path: '/workflow/processDef/processDesigner',
    meta: {
      title: '流程设计'
    },
    component: () => import('@/views/workflow/processDef/processDesigner')
  }, {
    name: 'processDefListByWorkflowKey',
    meta: {
      title: '流程定义'
    },
    path: '/workflow/processDef/processDefListByWorkflowKey',
    component: () => import('@/views/workflow/processDef/processDefListByWorkflowKey')
  }, {
    name: 'processDefImport',
    path: '/workflow/processDef/processDefImport',
    meta: {
      title: '流程导入'
    },
    component: () => import('@/views/workflow/processDef/processDefImport')
  }, {
    name: 'processAppImport',
    path: '/workflow/processDef/processAppImport',
    meta: {
      title: '流程应用导入'
    },
    component: () => import('@/views/workflow/processDef/processAppImport')
  }, {
    name: 'processOneStationImport',
    path: '/workflow/processDef/processOneStationImport',
    meta: {
      title: '一站式流程设计导入'
    },
    component: () => import('@/views/workflow/processDef/processOneStationImport')
  },
  // ==============SmartForm===============================//
  {
    name: 'todoList2',
    path: '/workflow/workflowBusiness/todoList2',
    component: () => import('@/views/workflow/workflowBusiness/todoList')
  }, {
    name: 'generalFieldEdit',
    path: '/workflow/security/generalField/generalFieldEdit',
    component: () => import('@/views/workflow/security/generalField/generalFieldEdit')
  }, {
    name: 'formFieldList',
    path: '/workflow/smartForm/formFieldList',
    component: () => import('@/views/workflow/smartForm/form/formFieldList')
  }, {
    name: 'formFieldListPermission',
    path: '/workflow/smartForm/formFieldListPermission',
    component: () => import('@/views/workflow/smartForm/form/formFieldListPermission')
  }, {
    name: 'formFieldListPermissions',
    path: '/workflow/smartForm/formPermission/formFieldListPermissions',
    component: () => import('@/views/workflow/smartForm/formPermission/formFieldListPermissions')
  }, {
    name: 'setFieldPermissionDetail',
    path: '/workflow/smartForm/formPermission/setFieldPermissionDetail',
    component: () => import('@/views/workflow/smartForm/formPermission/setFieldPermissionDetail')
  }, {
    name: 'onlineFormPreview',
    path: '/workflow/smartForm/onlineFormPreview',
    component: () => import('@/views/workflow/smartForm/form/onlineFormPreview')
  }, {
    name: 'onlineFormDesigner',
    path: '/workflow/smartForm/onlineFormDesigner',
    component: () => import('@/views/workflow/smartForm/formDesigner/onlineFormDesigner')
  }, {
    name: 'formDesigner',
    path: '/workflow/smartForm/formDesigner/index',
    component: () => import('@/views/workflow/smartForm/formDesigner/onlineFormDesigner')
  }, {
    name: 'generationTempaltePlan',
    path: '/workflow/smartForm/generationTempaltePlan',
    component: () => import('@/views/workflow/smartForm/form/generationTempaltePlan')
  }, {
    name: 'onlineExcelCellStyle',
    path: '/workflow/smartForm/onlineExcelCellStyle',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelCellStyle')
  }, {
    name: 'onlineExcelDesigner',
    path: '/workflow/smartForm/onlineExcelDesigner',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelDesigner')
  }, {
    name: 'onlineExcelImport',
    path: '/workflow/smartForm/onlineExcelImport',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelImport')
  }, {
    name: 'processFromImport',
    path: '/workflow/processDef/processFromImport',
    component: () => import('@/views/workflow/processDef/processFromImport')
  }, {
    name: 'dataServiceImport',
    path: '/workflow/security/dataService/dataServiceImport',
    component: () => import('@/views/workflow/security/dataService/dataServiceImport')
  }, {
    name: 'onlineExcelOptionsEdit',
    path: '/workflow/smartForm/onlineExcelOptionsEdit',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelOptionsEdit')
  }, {
    name: 'onlineExcelView',
    path: '/workflow/smartForm/onlineExcelView',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelView')
  }, {
    name: 'formBusObjectEdit',
    path: '/workflow/smartForm/formBusObjectEdit',
    component: () => import('@/views/workflow/smartForm/form/formBusObjectEdit')
  }, {
    name: 'formBusObjectList',
    path: '/workflow/smartForm/formBusObjectList',
    component: () => import('@/views/workflow/smartForm/form/formBusObjectList')
  }, {
    name: 'busObjectSubsEdit',
    path: '/workflow/smartForm/busObjectSubsEdit',
    component: () => import('@/views/workflow/smartForm/form/busObjectSubsEdit')
  }, {
    name: 'onlineFormSubTableEdit',
    path: '/workflow/smartForm/onlineFormSubTableEdit',
    component: () => import('@/views/workflow/smartForm/form/onlineFormSubTableEdit')
  }, {
    name: 'formCustButtonPermission',
    path: '/workflow/smartForm/formCustButtonPermission',
    component: () => import('@/views/workflow/smartForm/form/formCustButtonPermission')
  }, {
    name: 'formSubTableCustButtonPermission',
    path: '/workflow/smartForm/formSubTableCustButtonPermission',
    component: () => import('@/views/workflow/smartForm/form/formSubTableCustButtonPermission')
  }, {
    name: 'formOptionsEdit',
    path: '/workflow/smartForm/formOptionsEdit',
    component: () => import('@/views/workflow/smartForm/form/formOptionsEdit')
  }, {
    name: 'showProcessFormOfFormDef',
    path: '/workflow/smartForm/showProcessFormOfFormDef',
    component: () => import('@/views/workflow/smartForm/form/showProcessFormOfFormDef')
  }, {
    name: 'fieldOptionsEdit',
    path: '/workflow/smartForm/fieldOptionsEdit',
    component: () => import('@/views/workflow/smartForm/form/fieldOptionsEdit')
  }, {
    name: 'fieldLinkagesEdit',
    path: '/workflow/smartForm/fieldLinkagesEdit',
    component: () => import('@/views/workflow/smartForm/form/fieldLinkagesEdit')
  }, {
    name: 'formDefEdit',
    path: '/workflow/smartForm/formDefEdit',
    component: () => import('@/views/workflow/smartForm/form/formDefEdit')
  }, {
    name: 'formModeDesigner',
    meta: {
      title: '数据建模'
    },
    path: '/workflow/smartForm/form/formModeDesigner',
    component: () => import('@/views/workflow/smartForm/form/formModeDesigner')
  }, {
    name: 'importFormDef',
    path: '/workflow/smartForm/importFormDef',
    component: () => import('@/views/workflow/smartForm/form/importFormDef')
  }, {
    name: 'formFieldEdit',
    path: '/workflow/smartForm/formFieldEdit',
    component: () => import('@/views/workflow/smartForm/form/formFieldEdit')
  }, {
    name: 'formFieldPermissionEdit',
    path: '/workflow/smartForm/formFieldPermissionEdit',
    component: () => import('@/views/workflow/smartForm/form/formFieldPermissionEdit')
  }, {
    name: 'showFormDefOfBusObject',
    path: '/workflow/smartForm/showFormDefOfBusObject',
    component: () => import('@/views/workflow/smartForm/form/showFormDefOfBusObject')
  }, {
    name: 'formDataTransferList',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferList',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferList')
  }, {
    name: 'formDataTransferEdit',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferEdit',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferEdit')
  }, {
    name: 'formDataTransferItemEdit',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferItemEdit',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferItemEdit')
  }, {
    name: 'formDataTransferItemList',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferItemList',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferItemList')
  },
  // Controls
  {
    name: 'getSelector',
    path: '/workflow/smartForm/getSelector',
    component: () => import('@/views/workflow/smartForm/controls/getSelector')
  }, {
    name: 'getCustomDialog',
    path: '/workflow/smartForm/getCustomDialog',
    component: () => import('@/views/workflow/smartForm/controls/getCustomDialog')
  }, {
    name: 'getDataService',
    path: '/workflow/smartForm/getDataService',
    component: () => import('@/views/workflow/smartForm/controls/getDataService')
  }, {
    name: 'mathEdit',
    path: '/workflow/smartForm/mathEdit',
    component: () => import('@/views/workflow/smartForm/controls/mathEdit')
  },
  // table
  {
    name: 'formDefTableRelList',
    path: '/workflow/smartForm/table/formDefTableRelList',
    component: () => import('@/views/workflow/smartForm/table/formDefTableRelList')
  }, {
    name: 'tableDefinitionEdit',
    path: '/workflow/smartForm/table/tableDefinitionEdit',
    component: () => import('@/views/workflow/smartForm/table/tableDefinitionEdit')
  }, {
    name: 'tableDefinitionImprot',
    path: '/workflow/smartForm/table/tableDefinitionImprot',
    component: () => import('@/views/workflow/smartForm/table/tableDefinitionImprot')
  }, {
    name: 'tableColumnList',
    path: '/workflow/smartForm/tableColumnList',
    component: () => import('@/views/workflow/smartForm/table/tableColumnList')
  }, {
    name: 'tableColumnEdit',
    path: '/workflow/smartForm/tableColumnEdit',
    component: () => import('@/views/workflow/smartForm/table/tableColumnEdit')
  }, {
    name: 'showBusObjectOfTable',
    path: '/workflow/smartForm/table/showBusObjectOfTable',
    component: () => import('@/views/workflow/smartForm/table/showBusObjectOfTable')
  },
  // Selector
  {
    name: 'busObjectColumnSelect',
    path: '/workflow/smartForm/busObjectColumnSelect',
    component: () => import('@/views/workflow/smartForm/selector/busObjectColumnSelect')
  }, {
    name: 'selectExtendEvent',
    path: '/workflow/smartForm/selectExtendEvent',
    component: () => import('@/views/workflow/smartForm/selector/selectExtendEvent')
  }, {
    name: 'tableDefinitionSelect',
    path: '/workflow/smartForm/tableDefinitionSelect',
    component: () => import('@/views/workflow/smartForm/selector/tableDefinitionSelect')
  }, {
    name: 'selectSystemVars',
    path: '/workflow/selector/selectSystemVars',
    component: () => import('@/views/workflow/selector/selectSystemVars')
  }, {
    name: 'commonExcelImport',
    path: '/workflow/security/commonImport/commonExcelImport',
    meta: {
      title: '通用导入'
    },
    component: () => import('@/views/workflow/security/commonImport/commonExcelImport')
  },
  // ==============扩展开发的自定选择器 统一写在这里==============================//
  {
    name: 'custDemoSelector',
    path: '/workflow/custSelector/custDemoSelector',
    component: () => import('@/views/workflow/custSelector/custDemoSelector')
  },
  // 节点参与者的自定义选择器
  {
    name: 'custDemoActorSelector',
    path: '/workflow/custSelector/custDemoActorSelector',
    component: () => import('@/views/workflow/custSelector/custDemoActorSelector')
  },
  {
    path: '/workflow/security/integration/integrationEdit',
    name: 'integrationEdit',
    component: () => import('@/views/workflow/security/integration/integrationEdit')
  }, {
    name: 'departAssignLeaderList_byorgid',
    meta: {
      title: '部门分管领导'
    },
    path: '/workflow/security/departAssignLeader/departAssignLeaderList_byorgid',
    component: () => import('@/views/workflow/security/departAssignLeader/departAssignLeaderList')
  }, {
    name: 'categoryList_bygroupKey',
    meta: {
      title: '类别管理'
    },
    path: '/workflow/security/category/categoryList_bygroupKey',
    component: () => import('@/views/workflow/security/category/categoryList')
  }, {
    name: 'relationTypeListByInfotype',
    meta: {
      title: '汇报关系类型'
    },
    path: '/workflow/security/relation/relationTypeListByInfotype',
    component: () => import('@/views/workflow/security/relation/relationTypeList')
  }, {
    path: '/workflow/security/relation/relationEdit',
    name: 'relationEdit',
    component: () => import('@/views/workflow/security/relation/relationEdit')
  }, {
    path: '/workflow/security/relation/relationImportXml',
    name: 'relationEdit',
    component: () => import('@/views/workflow/security/relation/relationImportXml')
  }, {
    path: '/workflow/security/relation/relationTypeEdit',
    name: 'relationTypeEdit',
    component: () => import('@/views/workflow/security/relation/relationTypeEdit')
  }, {
    path: '/workflow/security/customDataGrid/customDataGridList',
    name: '自定义列表',
    meta: {
      title: ''
    },
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridList')
  }, {
    name: 'processVarInstEdit',
    path: '/workflow/processVarInst/processVarInstEdit',
    component: () => import('@/views/workflow/processVarInst/processVarInstEdit')
  }, {
    path: '/workflow/security/serialNum/serialNumEdit',
    meta: {
      title: ''
    },
    component: () => import('@/views/workflow/security/serialNum/serialNumEdit')
  }, {
    name: 'processVarEdit',
    path: '/workflow/processVar/processVarEdit',
    component: () => import('@/views/workflow/processVar/processVarEdit')
  }, {
    name: 'appPortalDesigner',
    path: '/workflow/frame/appPortal/appPortalDesigner',
    component: () => import('@/views/workflow/frame/appPortal/appPortalDesigner')
  }, {
    name: 'appPortalEdit',
    path: '/workflow/frame/appPortal/appPortalEdit',
    component: () => import('@/views/workflow/frame/appPortal/appPortalEdit')
  }, {
    name: 'appPortalImport',
    path: '/workflow/frame/appPortal/appPortalImport',
    component: () => import('@/views/workflow/frame/appPortal/appPortalImport')
  }, {
    name: 'appPortalOptionsEdit',
    path: '/workflow/frame/appPortal/appPortalOptionsEdit',
    component: () => import('@/views/workflow/frame/appPortal/appPortalOptionsEdit')
  }, {
    name: 'appPortalPreView',
    path: '/workflow/frame/appPortal/appPortalPreView',
    component: () => import('@/views/workflow/frame/appPortal/appPortalView')
  }, {
    name: 'appPortalViewSingle',
    path: '/workflow/frame/appPortal/appPortalViewSingle',
    component: () => import('@/views/workflow/frame/appPortal/appPortalView')
  }, {
    name: 'appFenceEdit',
    path: '/workflow/frame/appFence/appFenceEdit',
    component: () => import('@/views/workflow/frame/appFence/appFenceEdit')
  }, {
    name: 'reportDesigner',
    path: '/workflow/security/report/reportDesigner',
    component: () => import('@/views/workflow/security/report/reportDesigner')
  }, {
    name: 'reportView',
    meta: {
      title: '查看图表',
      requireAuth: true
    },
    path: '/workflow/security/report/reportView',
    component: () => import('@/views/workflow/security/report/reportView')
  }, {
    name: 'reportEdit',
    path: '/workflow/security/report/reportEdit',
    component: () => import('@/views/workflow/security/report/reportEdit')
  }, {
    name: 'reportImport',
    path: '/workflow/security/report/reportImport',
    component: () => import('@/views/workflow/security/report/reportImport')
  }, {
    name: 'customDataGridImport',
    path: '/workflow/security/customDataGrid/customDataGridImport',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridImport')
  }, {
    name: 'customDataGridImportAll',
    path: '/workflow/security/customDataGrid/customDataGridImportAll',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridImportAll')
  }, {
    name: 'customDataGridEdit',
    path: '/workflow/security/customDataGrid/customDataGridEdit',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridEdit')
  }, {
    name: 'customDataGridPermission',
    path: '/workflow/security/customDataGrid/customDataGridPermission',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridPermission')
  }, {
    name: 'customDataGridPreView',
    path: '/workflow/security/customDataGrid/customDataGridPreView',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridView')
  }, {
    name: 'customDataGridViewSingle',
    path: '/workflow/security/customDataGrid/customDataGridViewSingle',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridView')
  }, {
    name: 'taskJobEdit',
    path: '/workflow/security/taskJob/taskJobEdit',
    component: () => import('@/views/workflow/security/taskJob/taskJobEdit')
  }, {
    name: 'holidayEdit',
    path: '/workflow/pageRoute/holidayEdit',
    component: () => import('@/views/workflow/holiday/holidayEdit')
  }, {
    name: 'dataServiceEdit',
    path: '/workflow/security/dataService/dataServiceEdit',
    component: () => import('@/views/workflow/security/dataService/dataServiceEdit')
  }, {
    name: 'dataBaseSourceEdit',
    path: '/workflow/security/dataBaseSource/dataBaseSourceEdit',
    component: () => import('@/views/workflow/security/dataBaseSource/dataBaseSourceEdit')
  }, {
    name: 'userRelationEdit',
    path: '/workflow/security/userRelation/userRelationEdit',
    component: () => import('@/views/workflow/security/userRelation/userRelationEdit')
  }, {
    name: 'selectorDailogEdit',
    path: '/workflow/selectorDailog/selectorDailogEdit',
    component: () => import('@/views/workflow/selectorDailog/selectorDailogEdit')
  }, {
    name: 'settingDialog',
    path: '/workflow/customDialog/settingDialog',
    component: () => import('@/views/workflow/customDialog/settingDialog')
  }, {
    name: 'helperDialog',
    path: '/workflow/customDialog/helperDialog',
    component: () => import('@/views/workflow/customDialog/helperDialog')
  },
   // ==========sendActor============
  {
    name: 'actorRejectSelect',
    path: '/workflow/sendActor/actorRejectSelect',
    component: () => import('@/views/workflow/sendActor/actorRejectSelect')
  }, {
    name: 'actorSelect',
    path: '/workflow/sendActor/actorSelect',
    component: () => import('@/views/workflow/sendActor/actorSelect')
  }, {
    name: 'assistActorSelect',
    path: '/workflow/sendActor/assistActorSelect',
    component: () => import('@/views/workflow/sendActor/assistActorSelect')
  }, {
    name: 'circulatedActorSelect',
    path: '/workflow/sendActor/circulatedActorSelect',
    component: () => import('@/views/workflow/sendActor/circulatedActorSelect')
  }, {
    name: 'openSendTaskCommunicationDailog',
    path: '/workflow/sendActor/openSendTaskCommunicationDailog',
    component: () => import('@/views/workflow/sendActor/openSendTaskCommunicationDailog')
  }, {
    name: 'openSendTaskdisterDailog',
    path: '/workflow/sendActor/openSendTaskdisterDailog',
    component: () => import('@/views/workflow/sendActor/openSendTaskdisterDailog')
  }, {
    name: 'showHistoryTaskdisterDailog',
    path: '/workflow/sendActor/showHistoryTaskdisterDailog',
    component: () => import('@/views/workflow/sendActor/showHistoryTaskdisterDailog')
  }, {
    name: 'taskdisterSelect',
    path: '/workflow/sendActor/taskdisterSelect',
    component: () => import('@/views/workflow/sendActor/taskdisterSelect')
  },
  // ====================流程监控  workflowMonitor=========================//
  {
    name: 'taskHandoverEdit',
    path: '/workflow/taskHandover/taskHandoverEdit',
    component: () => import('@/views/workflow/taskHandover/taskHandoverEdit')
  }, {
    name: 'changeProcessInstanceStator',
    path: '/workflow/workflowMonitor/changeProcessInstanceStator',
    component: () => import('@/views/workflow/workflowMonitor/changeProcessInstanceStator')
  }, {
    name: 'bathCirculationDialog',
    path: '/workflow/workflowMonitor/bathCirculationDialog',
    component: () => import('@/views/workflow/workflowMonitor/bathCirculationDialog')
  }, {
    name: 'bathHandoverTaskDialog',
    path: '/workflow/workflowMonitor/bathHandoverTaskDialog',
    component: () => import('@/views/workflow/workflowMonitor/bathHandoverTaskDialog')
  }, {
    name: 'bathSendTaskDialog',
    path: '/workflow/workflowBusiness/bathSendTaskDialog',
    component: () => import('@/views/workflow/workflowBusiness/bathSendTaskDialog')
  }, {
    name: 'freeflowactivityEdit',
    path: '/workflow/workflowMonitor/freeflowactivityEdit',
    component: () => import('@/views/workflow/workflowMonitor/freeflowactivityEdit')
  }, {
    name: 'freeflowactivityList',
    path: '/workflow/workflowMonitor/freeflowactivityList',
    component: () => import('@/views/workflow/workflowMonitor/freeflowactivityList')
  }, {
    name: 'urgeRemind',
    path: '/workflow/workflowMonitor/urgeRemind',
    component: () => import('@/views/workflow/workflowMonitor/urgeRemind')
  }, {
    name: 'appendComment',
    path: '/workflow/workflowMonitor/appendComment',
    component: () => import('@/views/workflow/workflowMonitor/appendComment')
  }, {
    name: 'logMonitorView',
    path: '/workflow/security/logMonitor/logMonitorView',
    component: () => import('@/views/workflow/security/logMonitor/logMonitorView')
  }, {
    name: 'appendTask',
    path: '/workflow/workflowMonitor/appendTask',
    component: () => import('@/views/workflow/workflowMonitor/appendTask')
  }, {
    name: 'sendToActivityDialog',
    path: '/workflow/workflowMonitor/sendToActivityDialog',
    component: () => import('@/views/workflow/workflowMonitor/sendToActivityDialog')
  }, {
    name: 'sendActiveToActivityDialog',
    path: '/workflow/workflowMonitor/sendActiveToActivityDialog',
    component: () => import('@/views/workflow/workflowMonitor/sendActiveToActivityDialog')
  }, {
    name: 'implShowUserInPosition',
    path: '/workflow/security/orgImpl/implShowUserInPosition',
    component: () => import('@/views/workflow/security/orgImpl/implShowUserInPosition')
  }, {
    name: 'clusterWebsiteEdit',
    path: '/workflow/security/clusterWebsite/clusterWebsiteEdit',
    component: () => import('@/views/workflow/security/clusterWebsite/clusterWebsiteEdit')
  }, {
    name: 'appSystemConfigEdit',
    path: '/workflow/security/appSystemConfig/appSystemConfigEdit',
    component: () => import('@/views/workflow/security/appSystemConfig/appSystemConfigEdit')
  }, {
    name: 'sealEdit',
    path: '/workflow/security/seal/sealEdit',
    component: () => import('@/views/workflow/security/seal/sealEdit')
  }, {
    name: 'sealInstEdit',
    path: '/workflow/security/seal/sealInstEdit',
    component: () => import('@/views/workflow/security/seal/sealInstEdit')
  }, {
    name: 'applicationGroupEdit',
    path: '/workflow/security/application/applicationGroupEdit',
    component: () => import('@/views/workflow/security/application/applicationGroupEdit')
  }, {
    name: 'applicationEdit2',
    path: '/workflow/security/application/applicationEdit',
    component: () => import('@/views/workflow/security/application/applicationEdit')
  }, {
    name: 'applicationItemList',
    path: '/workflow/security/application/applicationItemList',
    component: () => import('@/views/workflow/security/application/applicationItemList')
  }, {
    name: 'applicationItemEdit',
    path: '/workflow/security/application/applicationItemEdit',
    component: () => import('@/views/workflow/security/application/applicationItemEdit')
  }, {
    name: 'applicationEdit',
    path: '/workflow/security/application/applicationEdit',
    component: () => import('@/views/workflow/security/application/applicationEdit')
  }, {
    name: 'articleEdit',
    path: '/workflow/security/article/articleEdit',
    component: () => import('@/views/workflow/security/article/articleEdit')
  }, {
    name: 'fastChannelEdit',
    path: '/workflow/security/article/fastChannelEdit',
    component: () => import('@/views/workflow/security/article/fastChannelEdit')
  }, {
    name: 'articleView',
    path: '/workflow/security/article/articleView',
    component: () => import('@/views/workflow/security/article/articleView')
  }, {
    name: 'publicAuthorEdit',
    path: '/workflow/security/publicAuthor/publicAuthorEdit',
    component: () => import('@/views/workflow/security/publicAuthor/publicAuthorEdit')
  }, {
    name: 'registerLicList',
    path: '/workflow/security/register/registerLicList',
    component: () => import('@/views/workflow/security/register/registerLicList')
  }, {
    name: 'registerLicEdit',
    path: '/workflow/security/register/registerLicEdit',
    component: () => import('@/views/workflow/security/register/registerLicEdit')
  }, {
    name: 'systemStatusEdit',
    path: '/workflow/security/systemStatus/systemStatusEdit',
    component: () => import('@/views/workflow/security/systemStatus/systemStatusEdit')
  },
  // ==============interfaceConfig    ===================//
  {
    name: 'gridConfigList',
    path: '/workflow/security/gridConfig/gridConfigList',
    component: () => import('@/views/workflow/security/gridConfig/gridConfigList')
  },
  // ==============customDialog  ===================//
  {
    name: 'openCustomDialog',
    path: '/workflow/customDialog/openCustomDialog',
    component: () => import('@/views/workflow/customDialog/openCustomDialog')
  }, {
    name: 'customDialogEdit',
    path: '/workflow/customDialog/customDialogEdit',
    component: () => import('@/views/workflow/customDialog/customDialogEdit')
  }, {
    name: 'customDialogImport',
    path: '/workflow/customDialog/customDialogImport',
    component: () => import('@/views/workflow/customDialog/customDialogImport')
  }, {
    name: 'settingResultField',
    path: '/workflow/customDialog/settingResultField',
    component: () => import('@/views/workflow/customDialog/settingResultField')
  },
  // ==============SelectorController 选择器  ===================//
  // grid Editor编辑器
  {
    name: 'defaultEditor',
    path: '/workflow/gridEditor/defaultEditor',
    component: () => import('@/views/workflow/gridEditor/defaultEditor')
  },

  {
    name: 'listCloseDialog',
    path: '/workflow/gridEditor/listCloseDialog',
    component: () => import('@/views/workflow/gridEditor/listCloseDialog')
  },
  {
    name: 'markCloseDialog',
    path: '/workflow/gridEditor/markCloseDialog',
    component: () => import('@/views/workflow/gridEditor/markCloseDialog')
  },{
    name: 'defaultEditor2',
    path: '/workflow/gridEditor/defaultEditor2',
    component: () => import('@/views/workflow/gridEditor/defaultEditor2')
  }, {
    name: 'updateInvicode',
    path: '/workflow/gridEditor/updateInvicode',
    component: () => import('@/views/workflow/gridEditor/updateInvicode')
  }, {
    name: 'invoiceDialog',
    path: '/workflow/gridEditor/invoiceDialog',
    component: () => import('@/views/workflow/gridEditor/invoiceDialog')
  }, {
    // 银企直连收款
    name: 'bankCollectionDialog',
    path: '/workflow/gridEditor/bankCollectionDialog',
    component: () => import('@/views/workflow/gridEditor/bankCollectionDialog')
  }, {
    name: 'generateDialogInvoiceDialog',
    path: '/workflow/gridEditor/generatedDialogInvoice',
    component: () => import('@/views/workflow/gridEditor/generatedDialogInvoice.vue')
  }, {
    name: 'billCollectorDialog',
    path: '/workflow/gridEditor/billCollectorDialog',
    component: () => import('@/views/workflow/gridEditor/billCollectorDialog.vue')
  },
  // 材料供应商 链接弹窗
  {
    name: 'linkDialog',
    path: '/workflow/gridEditor/linkDialog',
    component: () => import('@/views/workflow/gridEditor/linkDialog')
  },
  // 开票 更新附件
  {
    name: 'updateFiles',
    path: '/workflow/gridEditor/updateFiles',
    component: () => import('@/views/workflow/gridEditor/updateFiles')
  },
  // 银行信息控件
  {
    name: 'bankDialog',
    path: '/workflow/gridEditor/bankDialog',
    component: () => import('@/views/workflow/gridEditor/bankDialog')
  },
  // 批量认领发票 batchClaimInvoicesDialog
  {
    name: 'bankDialog',
    path: '/workflow/gridEditor/batchClaimInvoicesDialog',
    component: () => import('@/views/workflow/gridEditor/batchClaimInvoicesDialog')
  }, {
    name: 'commonEditor',
    path: '/workflow/selector/commonEditor',
    component: () => import('@/views/workflow/gridEditor/commonEditor')
  },
  // 通用editors 编辑器
  {
    name: 'keyValueEditor',
    path: '/workflow/selector/keyValueEditor',
    component: () => import('@/views/workflow/editors/keyValueEditor')
  },
  // 材料供应商 链接弹窗
  {
    name: 'linkDialog',
    path: '/workflow/gridEditor/linkDialog',
    component: () => import('@/views/workflow/gridEditor/linkDialog')
  },
  // 开票 更新附件
  {
    name: 'updateFiles',
    path: '/workflow/gridEditor/updateFiles',
    component: () => import('@/views/workflow/gridEditor/updateFiles')
  },
  // 银行信息控件
  {
    name: 'bankDialog',
    path: '/workflow/gridEditor/bankDialog',
    component: () => import('@/views/workflow/gridEditor/bankDialog')
  },
  // 批量认领发票 batchClaimInvoicesDialog
  {
    name: 'bankDialog',
    path: '/workflow/gridEditor/batchClaimInvoicesDialog',
    component: () => import('@/views/workflow/gridEditor/batchClaimInvoicesDialog')
  }, {
    name: 'commonEditor',
    path: '/workflow/selector/commonEditor',
    component: () => import('@/views/workflow/gridEditor/commonEditor')
  },
  // 通用editors 编辑器
  {
    name: 'keyValueEditor',
    path: '/workflow/selector/keyValueEditor',
    component: () => import('@/views/workflow/editors/keyValueEditor')
  },
  {
    name: 'selectTextEditor',
    path: '/workflow/selector/selectTextEditor',
    component: () => import('@/views/workflow/editors/selectTextEditor')
  },
  // selector 通用选择器
  {
    name: 'selectReport',
    path: '/workflow/selector/selectReport',
    component: () => import('@/views/workflow/selector/selectReport')
  }, {
    name: 'processVarExpressEdit',
    path: '/workflow/selector/processVarExpressEdit',
    component: () => import('@/views/workflow/selector/processVarExpressEdit')
  }, {
    name: 'selectDicConfigType',
    path: '/workflow/selector/selectDicConfigType',
    component: () => import('@/views/workflow/selector/selectDicConfigType')
  }, {
    name: 'selectMapAddress',
    path: '/workflow/selector/selectMapAddress',
    component: () => import('@/views/workflow/selector/selectMapAddress')
  }, {
    name: 'selectCategory',
    path: '/workflow/selector/selectCategory',
    component: () => import('@/views/workflow/selector/selectCategory')
  }, {
    name: 'selectTemplateBackup',
    path: '/workflow/selector/selectTemplateBackup',
    component: () => import('@/views/workflow/selector/selectTemplateBackup')
  }, {
    name: 'customButtonSelect',
    path: '/workflow/selector/customButtonSelect',
    component: () => import('@/views/workflow/selector/customButtonSelect')
  }, {
    name: 'workflowAppSelect',
    path: '/workflow/selector/workflowAppSelect',
    component: () => import('@/views/workflow/selector/workflowAppSelect')
  }, {
    name: 'workflowFormSelect',
    path: '/workflow/selector/workflowFormSelect',
    component: () => import('@/views/workflow/selector/workflowFormSelect')
  }, {
    name: 'selectUsers',
    path: '/workflow/selector/selectUsers',
    component: () => import('@/views/workflow/selector/selectUsers')
  }, {
    name: 'selectPosition',
    path: '/workflow/selector/selectPosition',
    component: () => import('@/views/workflow/selector/selectPosition')
  }, {
    name: 'selectPostJob',
    path: '/workflow/selector/selectPostJob',
    component: () => import('@/views/workflow/selector/selectPostJob')
  }, {
    name: 'selectOnlyUsers',
    path: '/workflow/selector/selectOnlyUsers',
    component: () => import('@/views/workflow/selector/selectOnlyUsers')
  }, {
    name: 'selectRole',
    path: '/workflow/selector/selectRole',
    component: () => import('@/views/workflow/selector/selectRole')
  }, {
    name: 'selectOrg',
    path: '/workflow/selector/selectOrg',
    component: () => import('@/views/workflow/selector/selectOrg')
  },
  // 添加部门选择（修改版） selectOrg_custom
  {
    name: 'selectOrg_custom',
    path: '/workflow/selector/selectOrg_custom',
    component: () => import('@/views/workflow/selector/selectOrg_custom')
  }, {
    name: 'selectHistoryActivity',
    path: '/workflow/selector/selectHistoryActivity',
    component: () => import('@/views/workflow/selector/selectHistoryActivity')
  }, {
    name: 'selectApproAction',
    path: '/workflow/selector/selectApproAction',
    component: () => import('@/views/workflow/selector/selectApproAction')
  }, {
    name: 'selectFormField',
    path: '/workflow/selector/selectFormField',
    component: () => import('@/views/workflow/selector/selectFormField')
  }, {
    name: 'formDefSelect',
    path: '/workflow/selector/formDefSelect',
    component: () => import('@/views/workflow/selector/formDefSelect')
  }, {
    name: 'customDataGridSelect',
    path: '/workflow/selector/customDataGridSelect',
    component: () => import('@/views/workflow/selector/customDataGridSelect')
  }, {
    name: 'appPortalSelect',
    path: '/workflow/selector/appPortalSelect',
    component: () => import('@/views/workflow/selector/appPortalSelect')
  }, {
    name: 'applicationItemSelect',
    path: '/workflow/selector/applicationItemSelect',
    component: () => import('@/views/workflow/selector/applicationItemSelect')
  }, {
    name: 'selectDataDict',
    path: '/workflow/selector/selectDataDict',
    component: () => import('@/views/workflow/selector/selectDataDict')
  }, {
    name: 'selectRelationType',
    path: '/workflow/selector/selectRelationType',
    component: () => import('@/views/workflow/selector/selectRelationType')
  }, {
    name: 'selectRelation',
    path: '/workflow/selector/selectRelation',
    component: () => import('@/views/workflow/selector/selectRelation')
  }, {
    name: 'selectTenantor',
    path: '/workflow/selector/selectTenantor',
    component: () => import('@/views/workflow/selector/selectTenantor')
  }, {
    name: 'selectFormFieldProcInstContextVar',
    path: '/workflow/selector/selectFormFieldProcInstContextVar',
    component: () => import('@/views/workflow/selector/selectFormFieldProcInstContextVar')
  }, {
    name: 'workflowSelect',
    path: '/workflow/selector/workflowSelect',
    component: () => import('@/views/workflow/selector/workflowSelect')
  }, {
    name: 'selectPersonalSeal',
    path: '/workflow/selector/selectPersonalSeal',
    component: () => import('@/views/workflow/selector/selectPersonalSeal')
  }, {
    name: 'selectDbTable',
    path: '/workflow/selector/selectDbTable',
    component: () => import('@/views/workflow/selector/selectDbTable')
  }, {
    name: 'selectAweIcon',
    path: '/workflow/selector/selectAweIcon',
    component: () => import('@/views/workflow/selector/selectAweIcon')
  }, {
    name: 'dbfieldSelect',
    path: '/workflow/selector/dbfieldSelect',
    component: () => import('@/views/workflow/selector/dbfieldSelect')
  }, {
    name: 'dbfieldWhereSelect',
    path: '/workflow/selector/dbfieldWhereSelect',
    component: () => import('@/views/workflow/selector/dbfieldWhereSelect')
  }, {
    name: 'dbfieldParamsSelect',
    path: '/workflow/selector/dbfieldParamsSelect',
    component: () => import('@/views/workflow/selector/dbfieldParamsSelect')
  }, {
    name: 'handsignQRCodeDialog',
    path: '/workflow/selector/handsignQRCodeDialog',
    component: () => import('@/views/workflow/selector/handsignQRCodeDialog')
  }, {
    name: 'selectWorkflowActForm',
    path: '/workflow/selector/selectWorkflowActForm',
    component: () => import('@/views/workflow/selector/selectWorkflowActForm')
  }, {
    name: 'selectWorkflowActivity',
    path: '/workflow/selector/selectWorkflowActivity',
    component: () => import('@/views/workflow/selector/selectWorkflowActivity')
  }, {
    name: 'selectFormTable',
    path: '/workflow/selector/selectFormTable',
    component: () => import('@/views/workflow/selector/selectFormTable')
  }, {
    name: 'formDefTableRelSelect',
    path: '/workflow/selector/formDefTableRelSelect',
    component: () => import('@/views/workflow/selector/formDefTableRelSelect')
  }, {
    name: 'selectColor',
    path: '/workflow/selector/selectColor',
    component: () => import('@/views/workflow/selector/selectColor')
  }, {
    name: 'selectStyle',
    path: '/workflow/selector/selectStyle',
    component: () => import('@/views/workflow/selector/selectStyle')
  }, {
    name: 'handsign',
    path: '/workflow/public/handsign',
    component: () => import('@/views/workflow/public/handsign')
  },
  // ==============flowDesigner  ===================//
  {
    name: 'buildFormCondition',
    path: '/workflow/flowDesigner/buildFormCondition',
    component: () => import('@/views/workflow/flowDesigner/buildFormCondition')
  }, {
    name: 'transitionConditionEdit',
    path: '/workflow/flowDesigner/transitionConditionEdit',
    component: () => import('@/views/workflow/flowDesigner/transitionConditionEdit')
  }, {
    name: 'actionButtonsList',
    path: '/workflow/flowDesigner/actionButtonsList',
    component: () => import('@/views/workflow/flowDesigner/actionButtonsList')
  }, {
    name: 'workflowMap',
    path: '/workflow/flowDesigner/workflowMap',
    component: () => import('@/views/workflow/flowDesigner/workflowMap')
  }, {
    name: 'workflowMapTimeline',
    path: '/workflow/flowDesigner/workflowMapTimeline',
    component: () => import('@/views/workflow/flowDesigner/workflowMapTimeline')
  }, {
    name: 'workflowSimulation',
    path: '/workflow/flowDesigner/workflowSimulation',
    component: () => import('@/views/workflow/flowDesigner/workflowSimulation')
  }, {
    name: 'simulationParamsList',
    path: '/workflow/simulationParams/simulationParamsList',
    component: () => import('@/views/workflow/simulationParams/simulationParamsList')
  }, {
    name: 'simulationParamsEdit',
    path: '/workflow/simulationParams/simulationParamsEdit',
    component: () => import('@/views/workflow/simulationParams/simulationParamsEdit')
  }, {
    name: 'windowTextEdit',
    path: '/workflow/flowDesigner/windowTextEdit',
    component: () => import('@/views/workflow/flowDesigner/windowTextEdit')
  }, {
    name: 'actorParamterEdit',
    path: '/workflow/flowDesigner/actorParamterEdit',
    component: () => import('@/views/workflow/flowDesigner/actorParamterEdit')
  }, {
    name: 'advancedOptionsDialog',
    path: '/workflow/flowDesigner/advancedOptionsDialog',
    component: () => import('@/views/workflow/flowDesigner/advancedOptionsDialog')
  }, {
    name: 'assemblyEdit',
    path: '/workflow/flowDesigner/assemblyEdit',
    component: () => import('@/views/workflow/flowDesigner/assemblyEdit')
  }, {
    name: 'dataActorService',
    path: '/workflow/flowDesigner/dataActorService',
    component: () => import('@/views/workflow/flowDesigner/dataActorService')
  }, {
    name: 'expirationRuleList',
    path: '/workflow/flowDesigner/expirationRuleList',
    component: () => import('@/views/workflow/flowDesigner/expirationRuleList')
  }, {
    name: 'importActivity',
    path: '/workflow/flowDesigner/importActivity',
    component: () => import('@/views/workflow/flowDesigner/importActivity')
  }, {
    name: 'configurationCheckView',
    path: '/workflow/flowDesigner/configurationCheckView',
    component: () => import('@/views/workflow/flowDesigner/configurationCheckView')
  }, {
    name: 'extendedPropertyEdit',
    path: '/workflow/flowDesigner/extendedPropertyEdit',
    component: () => import('@/views/workflow/flowDesigner/extendedPropertyEdit')
  }, {
    name: 'messageTemplateEdit',
    path: '/workflow/flowDesigner/messageTemplateEdit',
    component: () => import('@/views/workflow/flowDesigner/messageTemplateEdit')
  }, {
    name: 'nodeFormEdit',
    path: '/workflow/flowDesigner/nodeFormEdit',
    component: () => import('@/views/workflow/flowDesigner/nodeFormEdit')
  }, {
    name: 'procMonitorUserEdit',
    path: '/workflow/flowDesigner/procMonitorUserEdit',
    component: () => import('@/views/workflow/flowDesigner/procMonitorUserEdit')
  }, {
    name: 'rejectActivityDialog',
    path: '/workflow/flowDesigner/rejectActivityDialog',
    component: () => import('@/views/workflow/flowDesigner/rejectActivityDialog')
  }, {
    name: 'selectActorByPage',
    path: '/workflow/flowDesigner/selectActorByPage',
    component: () => import('@/views/workflow/flowDesigner/selectActorByPage')
  }, {
    name: 'selectActorUsers',
    path: '/workflow/flowDesigner/selectActorUsers',
    component: () => import('@/views/workflow/flowDesigner/selectActorUsers')
  }, {
    name: 'setCategoryCode',
    path: '/workflow/flowDesigner/setCategoryCode',
    component: () => import('@/views/workflow/flowDesigner/setCategoryCode')
  }, {
    name: 'todoNotifyMessageTemplateList',
    path: '/workflow/flowDesigner/todoNotifyMessageTemplateList',
    component: () => import('@/views/workflow/flowDesigner/todoNotifyMessageTemplateList')
  }, {
    name: 'windowCommonInputEdit',
    path: '/workflow/flowDesigner/windowCommonInputEdit',
    component: () => import('@/views/workflow/flowDesigner/windowCommonInputEdit')
  },
  // ==============WorkflowBusiness ===================//
  {
    name: 'workflowform',
    path: '/workflow/workflowform/index',
    component: () => import('@/views/workflow/workflowBusiness/workflowform')
  }, {
    name: 'noWorkflowform',
    path: '/workflow/noWorkflowform/index',
    component: () => import('@/views/workflow/workflowBusiness/noWorkflowform')
  }, {
    name: 'showApprovalHistory',
    path: '/workflow/workflowBusiness/showApprovalHistory',
    component: () => import('@/views/workflow/workflowBusiness/showApprovalHistory')
  }, {
    name: 'showCirculatedHistory',
    path: '/workflow/workflowBusiness/showCirculatedHistory',
    component: () => import('@/views/workflow/workflowBusiness/showCirculatedHistory')
  }, {
    name: 'showAppendOpinion',
    path: '/workflow/workflowBusiness/showAppendOpinion',
    component: () => import('@/views/workflow/workflowBusiness/showAppendOpinion')
  }, {
    name: 'showProcInstBaseInfo',
    path: '/workflow/workflowBusiness/showProcInstBaseInfo',
    component: () => import('@/views/workflow/workflowBusiness/showProcInstBaseInfo')
  }, {
    name: 'attachmentUpload',
    path: '/workflow/workflowBusiness/attachmentUpload',
    component: () => import('@/views/workflow/workflowBusiness/attachmentUpload')
  },
  // ==============通用dialog start=========//
  {
    name: 'showModalMsg',
    path: '/workflow/dialog/showModalMsg',
    component: () => import('@/views/workflow/dialog/showModalMsg')
  },
  // ==============PageRoute 非菜路由 start=========//
  {
    name: 'opinionEdit',
    path: '/workflow/opinion/opinionEdit',
    component: () => import('@/views/workflow/opinion/opinionEdit')
  }, {
    name: 'activityDelegateEdit',
    path: '/workflow/delegates/activityDelegateEdit',
    component: () => import('@/views/workflow/delegates/activityDelegateEdit')
  }, {
    name: 'activityDelegateList',
    path: '/workflow/delegates/activityDelegateList',
    component: () => import('@/views/workflow/delegates/activityDelegateList')
  }, {
    name: 'appDelegateEdit',
    path: '/workflow/delegates/appDelegateEdit',
    component: () => import('@/views/workflow/delegates/appDelegateEdit')
  }, {
    name: 'dataDictEdit',
    path: '/workflow/security/systemss/dataDictEdit',
    component: () => import('@/views/workflow/security/dataDict/dataDictEdit')
  }, {
    name: 'dataDictTypeEdit',
    path: '/workflow/security/dataDict/dataDictTypeEdit',
    component: () => import('@/views/workflow/security/dataDict/dataDictTypeEdit')
  }, {
    name: 'processFormEdit',
    path: '/workflow/processDef/processFormEdit',
    component: () => import('@/views/workflow/processDef/processFormEdit')
  }, {
    name: 'showAppOfDef',
    path: '/workflow/processDef/showAppOfDef',
    component: () => import('@/views/workflow/processDef/showAppOfDef')
  }, {
    name: 'processDefEdit',
    path: '/workflow/processDef/processDefEdit',
    component: () => import('@/views/workflow/processDef/processDefEdit')
  }, {
    name: 'processFromImport',
    path: '/workflow/processDef/processFromImport',
    component: () => import('@/views/workflow/processDef/processFromImport')
  }, {
    name: 'processAppCombinEdit',
    path: '/workflow/processDef/processAppCombinEdit',
    component: () => import('@/views/workflow/processDef/processAppCombinEdit')
  }, {
    name: 'processAppCombinBathAdd',
    path: '/workflow/processDef/processAppCombinBathAdd',
    component: () => import('@/views/workflow/processDef/processAppCombinBathAdd')
  }, {
    name: 'processAppEdit',
    path: '/workflow/processDef/processAppEdit',
    component: () => import('@/views/workflow/processDef/processAppEdit')
  }, {
    name: 'authorizeDefEdit',
    path: '/workflow/security/authorize/authorizeDefEdit',
    component: () => import('@/views/workflow/security/authorize/authorizeDefEdit')
  }, {
    name: 'authorizeSourceUserEdit',
    path: '/workflow/security/authorize/authorizeSourceUserEdit',
    component: () => import('@/views/workflow/security/authorize/authorizeSourceUserEdit')
  }, {
    name: 'categoryEdit',
    path: '/workflow/security/category/categoryEdit',
    component: () => import('@/views/workflow/security/category/categoryEdit')
  }, {
    name: 'importCategoryXml',
    path: '/workflow/security/category/importCategoryXml',
    component: () => import('@/views/workflow/security/category/importCategoryXml')
  }, {
    name: 'categoryGroupEdit',
    path: '/workflow/security/category/categoryGroupEdit',
    component: () => import('@/views/workflow/security/category/categoryGroupEdit')
  }, {
    name: 'previewpdf',
    path: '/workflow/security/pdfview/previewpdf',
    component: () => import('@/views/workflow/security/pdfview/previewpdf')
  }, {
    name: 'previewpicture',
    path: '/workflow/security/pdfview/previewpicture',
    component: () => import('@/views/workflow/security/pdfview/previewpicture')
  }, {
    name: 'previewpdf2',
    path: '/workflow/security/pdfview/previewpdf2',
    component: () => import('@/views/workflow/security/pdfview/previewpdf2')
  }, {
    name: 'previewpdf3',
    path: '/workflow/security/pdfview/previewpdf3',
    component: () => import('@/views/workflow/security/pdfview/previewpdf3')
  }, {
    path: '/workflow/security/customDataGrid/selectCustomDataGridExtendEvent',
    name: 'selectCustomDataGridExtendEvent',
    meta: {
      title: '自定义列表扩展方法'
    },
    component: () =>
      import('@/views/workflow/security/customDataGrid/selectCustomDataGridExtendEvent')
  },
  // ====================================== Demo===================//
  {
    path: '/workflow/demo/demoUrlForm',
    name: 'demoUrlForm',
    component: () => import('@/views/workflow/demo/demoUrlForm')
  }, {
    path: '/workflow/demo/demoUrlFormList',
    name: 'demoUrlFormList',
    component: () => import('@/views/workflow/demo/demoUrlFormList')
  }, {
    path: '/workflow/demo/demoUrlFormEdit',
    name: 'demoUrlFormEidt',
    component: () => import('@/views/workflow/demo/demoUrlFormEdit')
  },
  // ============== 外部系统iframe集成页面 start===================//
  {
    path: '/home/access_desktopIndex',
    name: 'access_desktopIndex',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/home/access_desktopIndex')
  }, {
    path: '/workflow/workflowBusiness/access_startWorkflowList',
    name: 'access_startWorkflowList',
    meta: {
      title: '发起流程'
    },
    component: () => import('@/views/workflow/workflowBusiness/startWorkflowList')
  }, {
    path: '/workflow/workflowBusiness/access_todoList',
    name: 'access_todoList',
    meta: {
      title: '待办事项'
    },
    component: () => import('@/views/workflow/workflowBusiness/todoList')
  }, {
    path: '/workflow/workflowBusiness/access_doneList',
    name: 'access_doneList',
    meta: {
      title: '已办流程'
    },
    component: () => import('@/views/workflow/workflowBusiness/doneList')
  }, {
    path: '/workflow/workflowBusiness/access_doneDetailList',
    name: 'access_doneDetailList',
    meta: {
      title: '已办历史'
    },
    component: () => import('@/views/workflow/workflowBusiness/doneDetailList')
  }, {
    path: '/workflow/workflowBusiness/access_myWorkItem',
    name: 'access_myWorkItem',
    meta: {
      title: '我发起的'
    },
    component: () => import('@/views/workflow/workflowBusiness/myWorkItem')
  }, {
    path: '/workflow/workflowBusiness/access_draftList',
    name: 'access_draftList',
    meta: {
      title: '草稿箱'
    },
    component: () => import('@/views/workflow/workflowBusiness/draftList')
  }, {
    path: '/workflow/workflowBusiness/access_myCancelList',
    name: 'access_myCancelList',
    meta: {
      title: '已作废'
    },
    component: () => import('@/views/workflow/workflowBusiness/myCancelList')
  }, {
    path: '/workflow/pageRoute/access_opinionList',
    name: 'access_opinionList',
    meta: {
      title: '常用意见'
    },
    component: () => import('@/views/workflow/opinion/opinionList')
  }, {
    path: '/workflow/smartForm/access_formDefList',
    name: 'access_formDefList',
    meta: {
      title: '表单定义'
    },
    component: () => import('@/views/workflow/smartForm/form/formDefList')
  }, {
    name: 'access_processDefList',
    meta: {
      title: '流程设计'
    },
    path: '/workflow/processDef/access_processDefList',
    component: () => import('@/views/workflow/processDef/processDefList')
  }, {
    name: 'access_processAppList',
    meta: {
      title: '流程应用'
    },
    path: '/workflow/processDef/access_processAppList',
    component: () => import('@/views/workflow/processDef/processAppList')
  }, {
    name: 'access_authorizeDefList',
    meta: {
      title: '分管授权'
    },
    path: '/workflow/security/authorize/access_authorizeDefList',
    component: () => import('@/views/workflow/security/authorize/authorizeDefList')
  }, {
    path: '/workflow/delegates/access_appDelegateList',
    name: 'access_appDelegateList',
    meta: {
      title: '流程委托'
    },
    component: () => import('@/views/workflow/delegates/appDelegateList')
  }
  // ==============外部系统iframe集成页面 end===================//
]

export default workflow;
