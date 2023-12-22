

/**
 * 公共静态数据定义(下拉框、弹出框、复选框、单选按钮)
 * 
 */

/**
 * 流程状态
 */
// 拟稿 提单环节
export const MAKEDRAFT_STATUS = 0;
//草稿 新增
export const DRAFT_STATUS = 1;
//审批中
export const REVIEW_STATUS = 2;
 //审批完成 已完成
export const COMPLETE_STATUS = 3;
//驳回 驳回发起人
export const REJECT_STATUS = 5;
 //取消 已作废
export const CANCEL_STATUS = 99;

/**
 * 弹框配置项
 */
//业务单元弹框配置的参数
export const BUSINERSSUNIT_MODEL = {
  code: 'YeWuDanYuan',
  parm: {
    resultFieldKey: '', //取Id的哪个字段
    isEnableAuthor: 0,
    data: [],
    isMulti: false,  //是否多选 false:单选
  }
}

//银行档案、收款账号弹框配置的参数
export const PAYEEBANK_MODEL = {
  // code: 'YinXingDangAn',
  code: 'ShouKuanZhangHaoYeWuDanYuan',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//开票申请 项目编号(项目档案)
export const PROJECTCODEINVOICE_MODE = {
  code: 'XiangMuDangAnKaiPiaoShenQing',
  isShowLink:true,
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//开票申请  跨税报号
export const TAXACROSS_MODE = {
  code: 'KuaShuiBaoHaoTongYong',
  isShowLink:false,
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//开票申请 预缴完税凭证号
export const VOUCHER_MODE = {
  code: 'YuJiaoWanShuiPingZhengHao',
  isShowLink:true,
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//开票申请 对应蓝字发票号码
export const VOUCHER_OPEN_MODE = {
  code: 'DuiYingLanZiFaPiaoHaoMa',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//开票号码 开票作废申请
export const VOUCHER_CANCEL_MODEL = {
  // code: 'KaiPiaoHaoMa',
  code: 'INVOICE_OPEN_MAIN_CANCEL',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//客商档案 客户 弹框
export const CUSTOMER_MODEL = {
  code: 'KeShangDangAn',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//客商档案(劳务分包合同) 客户 弹框
export const CUSTOMER2_MODEL = {
  code: 'KeShangDangAn_CP236_CP269',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//开票申请 收入合同弹框 
 export const CONTRACTCODE_MODEL = {
   code: 'ShouRuHeTongBianHao',
   isShowLink:true,
    parm: {
      isEnableAuthor: 0,
      data: [],
      isMulti: false
    }
}

//开票 开票申请单号 KaiPiaoShenQingDanHao
export const INVOICE_CODE_MODEL = {
  code: 'KaiPiaoShenQingDanHao',
   isShowLink:true,
    parm: {
      isEnableAuthor: 0,
      data: [],
      isMulti: false
    }
}

//产品线弹框
export const PRODUCTLINE_MODEL = {
  code: 'ChanPinXian',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//营销立项弹框
export const MARKETMAIN_MODEL = {
  code: 'market_main',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

//预选承包商入库弹窗
export const MARKETCONTRACTOR_MODEL = {
  code: 'YuXuanChengBaoShangRuKu',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}

// 组织+用户控件  跟进人
export const FOLLOWER_MODEL = {
  code: 'GenJinRen',  //当前弹框的code，从自定义对话框取
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

// 战略采购合同 组织+用户控件  甲方
export const FJiaFang_MODEL = {
  code: 'JiaFang',  //当前弹框的code，从自定义对话框取
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 战略采购合同  组织+用户控件 主协议编号
export const ZhanLueCaiGouCode_MODEL = {
  code: 'ZhanLueCaiGouCode',  //当前弹框的code，从自定义对话框取
  parm: {
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

//项目介绍人 customDialog
export const PROJECT_LEADER_MODEL = {
  code: 'XiangMuJieShaoRen',  //当前弹框的code，从自定义对话框取
  parm: {
    resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

//标前评审（投标文件评审） customDialog
export const V_MARKET_MAIN_DOCUMENT_MODEL = {
  code: 'BiaoQianPingShenTouBiaoWenJianPingShen',  //当前弹框的code，从自定义对话框取
  parm: {
    //resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
//投标团队库（投标文件评审） customDialog
export const BASE_BID_TEAM_LIBRARY_MODEL = {
  code: 'TouBiaoTuanDuiKuTouBiaoWenJianPingShen',  //当前弹框的code，从自定义对话框取
  parm: {
    //resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
//开标结果（设计施工立项） customDialog
export const DESIGN_CONSTRUCT_MODEL = {
  code: 'KaiBiaoJieGuoSheJiShiGongLiXiang',  //当前弹框的code，从自定义对话框取
  parm: {
    //resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

//项目档案 建安合同
export const CONTRACT_IN_PROJECT_EXTEND = {
  code: 'XiangMuDangAn_CP147',  //当前弹框的code，从自定义对话框取
  parm: {
    //resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
};
//税率 customDialog
export const BASE_TAX_RATE_ARCHIVE_MODEL = {
  code: 'base_tax_rate_archive',  //当前弹框的code，从自定义对话框取
  parm: {
    //resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
};

//税率 公用
export const TAX_RATE_ARCHIVE_MODEL = {
  code: 'base_tax_rate_archive',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false,
    varParams: [
      {
          key: 'tax_attribute',
          value: 6
      }
    ]
  }
}
//班组库 customDialog
export const BASE_LABOR_TEAM_MAIN_MODEL = {
  code: 'BanZuKuGongYong',  //当前弹框的code，从自定义对话框取
  parm: {
    //resultFieldKey: 'personName',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
};

//商品服务分类
export const GOODS_CLASSIFICATION = {
  code: 'ShangPinFuWuFenLei',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
};

// 产值填报 组织+用户控件 项目编号 
export const XiangMuBianHao_MODEL = {
  code: 'XiangMuBianHao',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    isEnableAuthor: 0,
    data: [],
    isMulti: false   //是否是单选 true：单选
  }
}

//银企直连收款 项目编号
export const PROJECT_CODE_BANK_MODEL = {
  code: 'YinQiZhiLianShouKuan',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    isEnableAuthor: 0,
    data: [],
    isMulti: false   //是否是单选 true：单选
  }
}

//银企直连收款 项目借款
export const PROJECT_LOAN_MODEL = {
  code: 'XiangMuJieKuanDan',
  customDialog: 'XiangMuJieKuanDan',
  isSetHead: 1,
  isMulti: false,
  initailData: []
}

// 项目送审 组织+用户控件 项目编号
export const XiangMuDangAnProjectSubmission_MODEL = {
  code: 'XiangMuDangAnProjectSubmission',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 项目送审 组织+用户控件 收入类合同编号
export const ShouRuLeiHeTongBianHaoProjectSubmission_MODEL = {
  code: 'ShouRuLeiHeTongBianHaoProjectSubmission',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    // resultFieldKey: 'constructArchiveMainId',
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

//保理融资申请 合同编号
export const FINAN_CONTRACT_CODE_MODEL = {
  code: 'HeTongBianHaoBaoLiRongZiShenQing',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    // resultFieldKey: 'constructArchiveMainId',
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

//保理融资申请 收款账号
export const PAYINACCOUNT_NO_MODEL = {
  code: 'ShouKuanZhangHaoBaoLiRongZiShenQing',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

//本次保理融资协议编号 
 export const FINANCING_APPLY_CODE_MODEL = {
  code: 'BenCiBaoLiRongZiXieYiBianHao',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}

// 项目审定 组织+用户控件 项目编号
export const XiangMuDangAnProjectAuthorizeMain_MODEL = {
  code: 'XiangMuDangAnProjectAuthorizeMain',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 保函收回申请 保函申请单号
export const BaoHanShenQingDanHao_MODEL = {
  code: 'BaoHanShenQingDanHao',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 保函收回申请 立项编号
export const LiXiangBianHao_MODEL = {
  code: 'LiXiangBianHao',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 项目借款 付款财务组织
export const FuKuanCaiWuZuZhi_MODEL = {
  code: 'FuKuanCaiWuZuZhi',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 还款单 借款单号
export const JieKuanDanHaoHuaiKuanDan_MODEL = {
  code: 'JieKuanDanHaoHuaiKuanDan',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 投标保证金支付 立项编号
export const LiXiangBianHaoTouBiaoBaoZhengJinZhiFu_MODEL = {
  code: 'LiXiangBianHaoTouBiaoBaoZhengJinZhiFu',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 投标保证金支付申请 收款账号 
export const ShouKuanZhangHao_MODEL = {
  code: 'ShouKuanZhangHao',  //当前弹框的code，从自定义对话框取
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 投标保证金支付申请(履约保证金支付申请) 
export const TouBiaoBaoZhengJinZhiFuShenQing_MODEL = {
  code: 'TouBiaoBaoZhengJinZhiFuShenQing',
  isShowLink:true,
  parm: {
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 项目保险购买登记 项目编号 
export const contractInsureMainCode_MODEL = {
  code: 'contractInsureMainCode', 
  isShowLink:true,
  parm: {
    // resultFieldKey:'',  //取Id的哪个字段，不设置默认是userId
    isEnableAuthor: 0,
    data: [],
    isMulti: false   //是否是单选 true：单选
  }
}

// 项目保险购买登记-保险单号 (项目保险单)
export const XiangMuBaoXianDan_MODEL = {
  code: 'XiangMuBaoXianDan',
  parm: {
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 收支项目 (项目费用报销)
export const ShouZhiXiangMu_MODEL = {
  code: 'ShouZhiXiangMu',
  parm: {
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 项目借款申请 (项目费用报销-借款单号)
export const XiangMuJieKuanShenQing_MODEL = {
  code: 'XiangMuJieKuanShenQing',
  parm: {
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
// 费用预提单(项目费用报销-关联费用预提单)
export const Fa_MODEL = {
  code: 'Fa',
  isShowLink:true,
  parm: {
    data: [],
    singleSelect: true   //是否是单选 true：单选
  }
}
//是否禁用下拉
export const RADIO_GROUP = [
  { label: '1', name: '是' },
  { label: '0', name: '否' }
];

//是否禁用下拉
export const RADIO2_GROUP = [
  { label: '1', name: '需要' },
  { label: '0', name: '不需要' }
];

//是否禁用下拉
export const RADIO3_GROUP = [
  { label: '1', name: '是' },
  { label: '0', name: '否' }
]

//招投标形式
export const ATTRACT_TENDER_LIST = [
  { id: 1, name: '政府公开' },
  { id: 2, name: '其他公开' },
  { id: 3, name: '议标' },
  { id: 4, name: '邀请' },
  { id: 5, name: '其他' },
]

//关闭状态
export const CLOSE_STATE_LIST = [
  { id: 1, name: '正常' },
  { id: 2, name: '主动关闭' },
  { id: 3, name: '被动关闭' },
  { id: 4, name: '预警' },
  { id: 5, name: '已开标' },
  { id: 6, name: '已投标未走开标结果被动关闭' }
]

//关闭原因  不转换
export const CLOSE_REASE_LIST = [  //关闭原因
  { id: 1, name: '业务关系不够' },
  { id: 2, name: '合同条件限制' },
  { id: 3, name: '客户终止招标或招标发生重大变化' },
  { id: 4, name: '公开项目市场环境原因' },
  { id: 5, name: '资信业绩不够' },
  { id: 6, name: '不符合营销底限' },
  { id: 7, name: '垫资过大' },
  { id: 8, name: '控制价过低' },
  { id: 9, name: '其他' },
  { id: 10, name: '长期无动态系统关闭' },
]

//项目当前状态
export const PROJECT_STATUS_LIST = [
  { id: 1, name: '已立项未投标' },
  { id: 2, name: '在投' },
  { id: 3, name: '已投待定' },
  { id: 4, name: '中标' },
  { id: 5, name: '未中标' },
  { id: 6, name: '已施工立项' },
  { id: 7, name: '已设计施工立项' },
  { id: 8, name: '已签合同' }
]

//当前流程
export const PROCESS_LIST = [
  { id: 1, name: '营销立项' },
  { id: 2, name: '预选承包商入库' },
  { id: 3, name: '标前评审' },
  { id: 4, name: '投标文件评审' },
  { id: 5, name: '资格预审文件评审' },
  { id: 6, name: '开标结果' },
  { id: 7, name: '设计施工立项' },
  { id: 8, name: '施工立项' },
  { id: 9, name: '建安合同' },
  { id: 10, name: '设计收入合同' }
]

//立项类型
export const APPROVAL_TYPE = ['市政园林', '施工', '地产园林', '设计施工一体化', '设计', '建工', '幕墙门窗']

//入库类型
export const INCOMING_TYPE = ['企业入库', '投标入库', '设计投标入库'];
//项目计税方式
export const PROJECTTAXMETHOD_GROUP = [
  { label: '1', name: '一般计税' },
  { label: '2', name: '简易计税' },
  { label: '3', name: '免税' }
];
//是否使用
export const ISUSEDOPTIONS_GROUP = [
  { label: '0', name: '未使用' },
  { label: '1', name: '使用' }
];

//营销立项（介绍信申请）
export const MARKETMAIN_MODEL2 = {
  code: 'YingXiaoLiXiangJieShaoXinShenQing',
  parm: {
    isEnableAuthor: 0,
    data: [],
    isMulti: false
  }
}