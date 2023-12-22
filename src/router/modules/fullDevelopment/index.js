// =================全开发 营销投标总表====================//
import marketBidStatisics from "./marketBidStatisics"
// =================全开发 业务单元=======================//
import businessUnit from './businessUnit'
// =================全开发 银行档案=======================//
import baseBankArchiveMain from './baseBankArchiveMain'
// =================全开发 目标成本====================//
import targetCost from "./targetCost"
// =============全开发 资料归档 =======================//
import dataArchiving from "./dataArchiving"
// =============全开发 项目维修 =======================//
import targetRepair from "./targetRepair"
// =============全开发 员工费用报销 =======================//
import claimExpense from "./claimExpense"
// =============全开发 客户信息登记 =======================//
// import customerInfoReg from "./customerInfoReg"
// =============全开发 客商档案 =======================//
 import customerSupplierList from "./customerSupplierList"
// =============全开发 项目档案 =======================//
 import constructArchiveList from "./constructArchive"
// =============全开发 工资单 =======================//
 import contractTeamPayroll from "./contractTeamPayroll"
// =============全开发 预缴完税台账 =======================//
 import voucherLedger from "./voucherLedger"
// =============全开发 预缴完税台账 =======================//
 import laborLedger from "./laborLedger"

import Layout from '@/layout'
const fullDevelopment = [
  {
    path: '/fullDevelopment',
    component: Layout,
    redirect: '/targetCost/costList',
    name: 'fullDevelopment',
    meta: {
      title: '全开发表单',
      requireAuth: true
    },
    children: [
      ...marketBidStatisics,
      ...businessUnit,
      ...baseBankArchiveMain,
      ...targetCost,
      ...dataArchiving,
      ...targetRepair,
      ...claimExpense,
      ...customerSupplierList,
      ...constructArchiveList,
      ...contractTeamPayroll,
      ...voucherLedger,
      ...laborLedger
    ]
  },
  // 目标成本
  {
    path: '/cost',
    name: 'cost',
    component: () => import('@/views/fullDevelopment/targetCost/cost.vue'),
    meta: {
      title: 'cost',
      requireAuth: true
    }
  },
  // 目标成本调整
  {
    path: '/adjustment',
    name: 'adjustment',
    component: () => import('@/views/fullDevelopment/adjustmentCost/adjustment.vue'),
    meta: {
      title: 'adjustment',
      requireAuth: true
    }
  },
  // 目标成本分析
  {
    path: '/analysis',
    name: 'analysis',
    component: () => import('@/views/fullDevelopment/analysisCost/analysis.vue'),
    meta: {
      title: 'analysis',
      requireAuth: true
    }
  },
  // 资料归档
  {
    path: '/archiving',
    name: 'archiving',
    component: () => import('@/views/fullDevelopment/dataArchiving/archiving.vue'),
    meta: {
      title: 'archiving',
      requireAuth: true
    }
  },
  // 材料供应商注册
  {
    path: '/supplierReg',
    name: 'supplierReg',
    component: () => import('@/views/fullDevelopment/supplierRegister/supplier.vue'),
    meta: {
      title: 'supplierReg',
      requireAuth: true
    }
  },
  // 材料供应商注册 -- D3
  {
    path: '/supplierRegister',
    name: 'supplierRegister',
    component: () => import('@/views/businessModule/workflow/supplierMaterialExtend/register.vue'),
    meta: {
      title: 'supplierRegister',
      requireAuth: true
    }
  },
  // =============全开发 维修申请 =======================//
  {
    path: '/repair',
    name: 'repair',
    component: () => import('@/views/fullDevelopment/repairRequest/repair.vue'),
    meta: {
      title: 'repair',
      requireAuth: true
    }
  },
  // =============全开发表单  员工报销(新) 详细页================//
  {
    path: '/claimExpense',
    name: 'claimExpense',
    meta: {
      title: 'claimExpense',
      requireAuth: true
    },
    component: () => import('@/views/fullDevelopment/claimExpense/claimExpense.vue')
  }
]
export default fullDevelopment
