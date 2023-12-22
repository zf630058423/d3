// import { CLOSE_STATE_LIST, PROJECT_STATUS_LIST } from '../../../enum/index';
import { CLOSE_STATE_LIST, PROJECT_STATUS_LIST, APPROVAL_TYPE, ATTRACT_TENDER_LIST } from '../../enum/param';

let sUnit = '(元)';   //元单位
let sTenUnit = '(万元)';    //万元单位
let sNumUnit = '(数量)';    //数量单位
let sPriceUnit = '(金额)';  //金额单位

//如果文字过长 设置列的宽度
function fnTiteWidth(title) {
  return Number(title.length) * 16 || 120;
}

export let detailColumn = [
  {
    type: "seq",
    title: "序号",
    fixed: 'left',
    width: 35,
    align: "center",
  },
  {
    field: "marketCode",
    title: "立项编号",
    align: "left",
    fixed: 'left',
    width: 150,
    type: "html",
  },
  {
    field: "constructCode",
    title: "项目编号",
    align: "center",
    fixed: 'left',
    width: 150,
    type: "html",
  },
  {
    field: "contractCode",
    title: "合同编号",
    align: "center",
    width: 150,
    type: "html",
  },
  {
    field: "marketName",
    title: "项目名称",   //立项名称
    align: "center",
    width: 120,
    type: "html",
  },
  {
    field: "customer",
    title: `客户`,
    align: "center",
    width: 148,
    type: "html",
  },
  {
    field: "marketCenter",
    title: "业务中心",
    align: "center",
    width: 148,
    // width: fnTiteWidth('本年累计营销立项数'),
    type: "html",
  },
  {
    field: "marketUnit",
    title: `业务单元`,
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "isContractor",
    title: "是否预选承包商",
    align: "center",
    width: fnTiteWidth('是否预选承包商'),
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '否',
          1: '是'
        }
        let text = textData[row.isContractor] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "follower",
    title: "跟进人",
    align: "center",
    width: 95,
    type: "html",
  },
  {
    field: "projectLeader",
    title: "项目负责人",
    align: "center",
    width: 110,
    type: "html",
  }, {
    field: "marketType",
    title: "立项类型",
    width: 110,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let text = APPROVAL_TYPE[row.marketType] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "productLine",
    title: `产品线`,
    width: 140,
    align: "center",
    type: "html",
  },
  {
    field: "bidForm",
    title: "招投标形式",
    width: 100,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let text = row.bidForm ? ATTRACT_TENDER_LIST.find(item => item.id == row.bidForm).name : '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "address",
    title: "项目地址(省-市)",
    width: fnTiteWidth('项目地址(省-市)'),
    align: "center",
    type: "html",
  },
  {
    field: "marketCost",
    title: `工程造价${sUnit}`,
    width: fnTiteWidth(`工程造价${sUnit}`),
    align: "center",
    type: "html",
  },
  {
    field: "marketAmountTwo",
    title: `预估投标金额`,
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "actualBidAmount",
    title: `实际投标报价${sUnit}`,
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "singleBidAmount",
    title: `单标段投标金额${sUnit}`,
    width: fnTiteWidth(`单标段投标金额${sUnit}`),
    align: "center",
    type: "html",
  },
  {
    field: "licence",
    title: "建造师",
    align: "center",
    width: 110,
    type: "html",
  },
  {
    field: "bidProfitRate",
    title: `投标利润率(%)`,
    width: fnTiteWidth(`投标利润率(%)`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let rate = row.targetProfitRate ? row.targetProfitRate * 100 + '%' : (row.targetProfitRate == 0 ? 0 : '');
        return (
          <span>{rate}</span>
        )
      },
    },
  },
  {
    field: "bidDeadline",
    title: "投标截止时间",
    width: 120,
    // width: fnTiteWidth(`投标截止时间`),
    align: "center",
    type: "html",
  },
  {
    field: 'marketStatus',
    title: `项目当前状态`,
    width: fnTiteWidth(`项目当前状态`),
    align: 'center',
    type: 'html',
    slots: {
      default: ({ row, column }, h) => {
        let itemData = PROJECT_STATUS_LIST.find(item => Number(item.id) === Number(row.itemStatus));
        let text = (row.itemStatus && itemData) ? PROJECT_STATUS_LIST.find(item => Number(item.id) === Number(row.itemStatus)).name : '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "closeState",
    title: `跟进状态`,  //关闭状态
    align: "center",
    width: 110,
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let closeData = CLOSE_STATE_LIST.find(item => Number(item.id) === Number(row.closeState));
        let text = (row.closeState && closeData) ? CLOSE_STATE_LIST.find(item => Number(item.id) === Number(row.closeState)).name : '';
        return (
          <span>{text}</span>
        )
      }
    }
  },
  {
    field: "closeReason",
    title: "关闭原因",
    align: "center",
    width: 120,
    type: "html",
  },
  {
    field: "closeTime",
    title: "关闭时间",
    width: 150,
    align: "center",
    type: "html",
  },
  {
    field: "isWinBid",
    title: `是否中标`,
    width: 90,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '否',
          1: '是'
        }
        let text = textData[row.winTheBid] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "winBidPrice",
    title: `中标价${sTenUnit}`,
    width: fnTiteWidth(`中标价${sTenUnit}`),
    align: "center",
    type: "html",
  },
  {
    field: "loseBidReason",
    title: `未中标原因分析`,
    width: fnTiteWidth(`未中标原因分析`),
    align: "center",
    type: "html",
  },
  {
    field: "marketFinishTime",
    title: `营销立项/预选承包商入库流程审批通过时间`,
    width: fnTiteWidth(`营销立项/预选承包商入库流程审批通过时间`),
    align: "center",
    type: "html",
  },
  {
    field: "preBidFinishTime",
    title: `标前评审流程审批结束时间`,
    width: fnTiteWidth(`标前评审流程审批结束时间`),
    align: "center",
    type: "html",
  },
  {
    field: "bidFinishTime",
    title: "投标文件评审/资格预审文件评审流程审批通过时间",
    width: fnTiteWidth(`投标文件评审/资格预审文件评审流程审批通过时间`),
    align: "center",
    type: "html",
  },
  {
    field: "bidResultFinishTime",
    title: `开标结果流程审批通过时间`,
    width: fnTiteWidth(`开标结果流程审批通过时间`),
    align: "center",
    type: "html",
  },
  {
    field: "isAfterProcess",
    title: "是否后补流程",
    // width: fnTiteWidth(`是否后补流程`),
    width: 120,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '否',
          1: '是'
        }
        let text = textData[row.isMakeAmendsFlowPath] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "currentNode",
    title: `当前流程`,
    // width: fnTiteWidth(`当前流程`),
    align: "center",
    width: 160,
    type: "html",
  },
  {
    field: "currentNodeState",
    title: "单据状态",
    width: 130,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let spanStyle = `font-size:12px;line-height:1.15;height:20px;padding: 0.3em 0.6em 0.3em;border-radius:0.15em;color:#fff;`;

        let statusData = {
          1: '草稿',
          2: '审批中',
          3: '已完成',
          5: '驳回申请人',
          99: '已作废'
        }
        let statusStyle = {
          1: 'label-grey',
          2: 'label-success',
          3: 'label-info',
          5: 'label-danger',
          99: 'label-grey'
        }
        let iData = {
          1: 'fa-file-text-o',
          2: 'fa-random',
          3: 'fa-stop-circle',
          5: '',
          99: 'fa-trash'
        }
        let iClassStyle = `fa bigger-120 ${iData[row.currentProcInstState]}`;

        let classStyle = `label ${statusStyle[row.currentProcInstState]}`;

        return (
          <span style={spanStyle} class={classStyle}>
            <i class={iClassStyle}></i>
            {statusData[row.currentProcInstState]}
          </span>
        )
      }
    }
  },
  {
    field: "preBidReview",
    title: `标前评审结果`,
    width: 120,
    // width: fnTiteWidth(`标前评审结果`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '不同意投标',
          1: '同意投标'
        }
        let text = textData[row.preBidResult] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "bidQualificationReview",
    title: "资格预审文件评审结果",
    width: fnTiteWidth(`资格预审文件评审结果`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '不同意投标',
          1: '同意投标'
        }
        let text = textData[row.qualificateResult] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "bidDocumentReview",
    title: `投标文件评审结果`,
    width: fnTiteWidth(`投标文件评审结果`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '不同意投标',
          1: '同意投标'
        }
        let text = textData[row.bidResult] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  }
]

export function getCurrentDateTime(arr) {
  return (arr && arr.length > 0) ? `${arr[0]},${arr[1]}` : ``;
}

/**
 * 获取当前的开始时间
 * @param {*} dateTime 
 * @returns 
 */
export function getStartDateTime(dateTime) {
  return (dateTime && dateTime.length > 0) ? dateTime[0] : '';
}

/**
 * 获取当前的结束时间
 * @param {*} dateTime 
 * @returns 
 */
export function getEndDateTime(dateTime) {
  return (dateTime && dateTime.length > 0) ? dateTime[1] : '';
}