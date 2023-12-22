/**
 * 开票申请 常量定义v
 */


export default {

  //开票分类
  INVOICE_CLASSIFY: [
    { configValue: '1', configName: '施工' },
    { configValue: '2', configName: '设计' },
    { configValue: '3', configName: '销售' },
    { configValue: '4', configName: '其他' },
  ],

  //是否预付款
  IS_PREPAY: {
    1: '是',
    0: '否'
  },

  // radio 是否选中状态
  IS_CHECKED: {
    1: '是',
    0: '否'
  },

  //预缴情况
  PREPAYMENT_SITUATION: [
    { configValue: '1', configName: '已预缴' },
    { configValue: '2', configName: '未预缴' },
    { configValue: '3', configName: '无需预缴' }
  ],

  //预缴情况 是否异地经营 = 是
  PREPAYMENT_SITUATION_YES: [
    { configValue: '1', configName: '已预缴' },
    { configValue: '2', configName: '未预缴' },
  ],

  //百望开票
  BAIWAN_INVOICE: [
    { configValue: '1', configName: '线下开票' },
    { configValue: '2', configName: '直连开票' },
    { configValue: '3', configName: '流水单开票' }
  ],

  //百望开票
  BAIWAN_INVOICE_NO: [
    { configValue: '1', configName: '线下开票' },
    { configValue: '2', configName: '直连开票' },
  ],

  //对接状态
  CONNECT_STATUS: [
    { configValue: '1', configName: '直联对接成功' },
    { configValue: '2', configName: '直联对接失败' },
    { configValue: '3', configName: '流水单对接成功' },
    { configValue: '4', configName: '流水单对接失败' },
    { configValue: '5', configName: '流水单删除' },
  ],

  //发票类型
  INVOICETYPE_SELECT: [
    { configValue: '6', configName: '增值税电子普通发票' },
    { configValue: '11', configName: '增值税专用发票' },
    { configValue: '12', configName: '增值税普通发票' },
    { configValue: '16', configName: '全电发票(增值税专用发票)' },
    { configValue: '17', configName: '全电(普通发票)' },
  ],

  //折扣类型
  DISCOUNT_TYPE_RADIO: {
    1: '价外',
    2: '价内'
  },

  //快递方式
  FATMAILWAY_SELECT: [
    { configValue: '1', configName: '到付' },
    { configValue: '2', configName: '寄付' },
    { configValue: '3', configName: 'OFD\PDF\XML下载' },
    { configValue: '4', configName: '邮箱交付' },
    { configValue: '5', configName: '二维码交付' }
  ],

  //开票状态
  INVOICE_STATUS: [
    { configValue: '1', configName: '已开票' },
    { configValue: '2', configName: '部分开票' },
    { configValue: '3', configName: '未开票' },
  ],

  //优惠政策
  PREFERENTIAL_POLICY: [
    { configValue: '1', configName: '出口免税和其他免税优惠政策' },
    { configValue: '2', configName: '普通零税率' },
    { configValue: '3', configName: '不征增值税' },
    { configValue: '4', configName: '简易征收' },
    { configValue: '5', configName: '按3%简易征收' }
  ]
}