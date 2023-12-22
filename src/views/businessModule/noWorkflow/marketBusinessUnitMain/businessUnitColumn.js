import Vue from 'vue';
import VueRouter from 'vue-router';
let router = new VueRouter() // 初始化VueRouter

//如果文字过长 设置列的宽度
function fnTiteWidth(title) {
  return Number(title.length) * 16 || 120;
}

const selectData = [
  { id: 1, label: '详情' },
  { id: 2, label: '编辑' },
  { id: 3, label: '删除' }
]

export let businessUnitColumn = [
  {
    type: "seq",
    title: "序号",
    fixed: 'left',
    width: 35,
    align: "center",
  },
  {
    type: "operate",
    title: "操作",
    fixed: 'left',
    width: 135,
    align: "center",
    slots: {
      default: ({ row, column }, h) => {
        let defaultValue = selectData[0].label;
        return (
          <el-select v-model={defaultValue} onChange={(e) => onSelectChange(e, row)}>
            {
              selectData.map((item) => {
                return <el-option key={item.id} label={item.label} value={item.id}></el-option>
              })
            }
          </el-select>
        )
      },
    },
  },
  {
    field: "businessUnit",
    title: "业务单元",
    align: "left",
    fixed: 'left',
    width: 140,
    type: "html",
  },
  {
    field: "affiliatedBusinessCenter",
    title: "所属业务中心",
    align: "center",
    fixed: 'left',
    width: 140,
    type: "html",
  },
  {
    field: "organizationalCode",
    title: "组织编码",
    align: "center",
    type: "html",
  },
  {
    field: "businessUnitCodeOne",
    title: "1.0业务单元编码",
    align: "center",
    width: 120,
    type: "html",
  },
  {
    field: "associatedDept",
    title: `关联部门`,
    align: "center",
    width: 148,
    type: "html",
  },
  {
    field: "financialOrganizations",
    title: "财务组织",
    align: "center",
    width: 148,
    // width: fnTiteWidth('本年累计营销立项数'),
    type: "html",
  },
  {
    field: "enableState",
    title: `启用状态`,
    width: 120,
    align: "center",
    type: "html",
  }
]

function onSelectChange(e, row) {
  alert(10);
  console.log("e===:", e, row, Vue.router, router);
  if (e == 3) {  //删除
    // this.delRow(row.id);
  } else {
    let typeDetail = (e === 1) ? 'detail' : (e === 2 ? 'edit' : 'add');
    let params = {
      encode: 'businessUnit',
      type: typeDetail,
      formId: '',
      myId: row.id || '',  //新增没有myId  b254f88d-6119-4ecb-b75a-0daa299fb2cb
      formKey: 'OnlineForm_BusinessUnit20220829040542',
      formAction: 3,
      title: '业务单元'
    }
    router.push({ name: 'noWorkflowBusiness', params: params })
  }
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