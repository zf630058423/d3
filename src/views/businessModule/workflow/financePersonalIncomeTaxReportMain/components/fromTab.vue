<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules">
      <div class="bthGround">
        <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      </div>
      <el-table :data="subFormData.detailList" style="width: 100%" :summary-method="getSummaries" show-summary
        size="small" fit class="f2bpmui-datagrid-vuetable" :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <!-- <el-table-column label="类别" :class="'required'" >
          <template slot-scope="scope">
            <el-form-item>
              <el-radio-group v-model="scope.row.type">
                <el-radio :label="item.value" :key="item.value" v-for="item in typeOptions">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-table-column> -->
        <el-table-column label="姓名" :class="'required'" min-width="140">
          <template slot-scope="scope">
            <el-form-item>
              <select-dialog @updateValue="(val) => usersUpdate(val, scope.row)" :value="scope.row.name"
                dynamicModel="selectUsers" :btnDisabled="isConstruction"></select-dialog>
              <!-- <el-input type="text" v-model="scope.row.name" size="small" placeholder="请输入" /> -->
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" :class="'required'" min-width="180">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.idCard`" :rules="rules.idCard">
              <el-input type="text" v-model="scope.row.idCard" maxlength="18" size="small" placeholder="请输入"
                :disabled="isConstruction" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="岗位" min-width="140">
          <template slot-scope="scope">
            <el-form-item>
              <el-input type="text" v-model="scope.row.postion" size="small" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="实际发放工资" :class="'required'" min-width="140" prop="actualSalary" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.actualSalary`" :rules="rules.actualSalary">
              <amount-input type="text" v-model="scope.row.actualSalary" size="small" placeholder="请输入"
                @focus="getCopyAmount(scope.row, 'actualSalary')" :disabled="isConstruction" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="收入(计划报个税工资)(元)" min-width="140" prop="incomeTaxSalary" :align="'center'">
          <template slot-scope="scope">
            <el-form-item>
              <amount-input type="text" v-model="scope.row.incomeTaxSalary" size="small" placeholder="请输入"
                @focus="getCopyAmount(scope.row, 'incomeTaxSalary')" :disabled="!isConstruction || !isZhuanYuanApprove" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="开始申报日期" :class="'required'" min-width="160">
          <template slot-scope="scope">
            <el-form-item>
              <el-date-picker v-model="scope.row.startIncomeDate" value-format="yyyy-MM-dd" type="date"
                :disabled="isConstruction" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="结束申报日期" :class="'required'" min-width="160">
          <template slot-scope="scope">
            <el-form-item>
              <el-date-picker v-model="scope.row.endIncomeDate" value-format="yyyy-MM-dd" type="date"
                :disabled="isConstruction" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="固定扣除标准(元)" min-width="140" prop="fixedDeductionStandard" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.fixedDeductionStandard`" :rules="rules.actualSalary">
              <amount-input type="text" v-model="scope.row.fixedDeductionStandard" size="small" placeholder="请输入"
                @focus="getCopyAmount(scope.row, 'fixedDeductionStandard')" :disabled="!isConstruction || !isZhuanYuanApprove" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="专项附加扣除(元)" min-width="140" prop="addDeduction" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.addDeduction`" :rules="rules.actualSalary">
              <amount-input type="text" v-model="scope.row.addDeduction" size="small" placeholder="请输入"
                @focus="getCopyAmount(scope.row, 'addDeduction')" :disabled="!isConstruction || !isZhuanYuanApprove" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="社保及公积金可扣除(元)" min-width="140" prop="securityAndProvidentFund" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.securityAndProvidentFund`" :rules="rules.actualSalary">
              <amount-input type="text" v-model="scope.row.securityAndProvidentFund" size="small" placeholder="请输入"
                @focus="getCopyAmount(scope.row, 'securityAndProvidentFund')" :disabled="!isConstruction || !isZhuanYuanApprove" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="140">
          <template slot-scope="scope">
            <el-form-item>
              <el-input type="text" v-model="scope.row.memo" size="small" placeholder="请输入" :disabled="disabled" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination :sourceData="keepData" ref="d3Pagination" v-model="subFormData.detailList" />
    </el-form>
  </div>
</template>

<script>
import d3Pagination from "@/components/basic/pagination/index.vue";
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import MyFun from '@/utils/fun';
export default {
  name: "accountInfo",
  components: { d3Pagination, SelectDialog, AmountInput },
  props: {
    value: {
      type: Array,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    createUserName: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      subFormData: {
        detailList: []
      },
      keepData: [],
      typeOptions: [
        { label: "在职", value: "1" },
        { label: "输入", value: "2" }
      ],
      rules: {
        idCard: [
          { validator: this.validateIdCard, trigger: ['change', 'blur'] }
        ],
        actualSalary: [
          { validator: this.validateNumber2, trigger: ['blur'] }
        ],
        postion:[
          { required: false, message: '必填项不能为空', trigger: 'blur' }
        ],
        incomeTaxSalary:[
          { required: false, message: '必填项不能为空', trigger: 'blur' }
        ],
        fixedDeductionStandard:[
          { required: false, message: '必填项不能为空', trigger: 'blur' }
        ],
        addDeduction:[
          { required: false, message: '必填项不能为空', trigger: 'blur' }
        ],
        securityAndProvidentFund:[
          { required: false, message: '必填项不能为空', trigger: 'blur' }
        ]
      },
      //需要计数合计的列
      countArr: ['actualSalary', 'addDeduction', 'incomeTaxSalary', 'fixedDeductionStandard', 'securityAndProvidentFund'],
      id: ''
    };
  },
  computed: {
    //是否编制人
    isConstruction () {
      return this.createUserName !== WFContext.CurrentRealName
    },
    //是否审批阶段
    isProcInstCreatorRealName () {
      return WFContext.WorkflowInstinceState == 2
    },
    /**
     * 只有人力资源管理中心薪酬绩效经理
     */
     isZhuanYuanApprove() {
      const isRequired = ['人力资源管理中心薪酬绩效经理'].find(res=> {return WFContext.CurrentActivityName.indexOf(res) != -1 })?true:false;
      const arr = ['incomeTaxSalary','fixedDeductionStandard','addDeduction','securityAndProvidentFund']
      arr.forEach(item=>{
        this.rules[item][0].required = isRequired  
      })
      return isRequired;
    }
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) this.keepData = val
      },
      deep: true,
      immediate: true
    }
  },
  created(){
    /**
     * 只有工程管理中心综合经理审核时必须填写  岗位
     */
      const isRequired = ['工程管理中心综合经理'].find(res=> {return WFContext.CurrentActivityName.indexOf(res) != -1 })?true:false;
      
  },
  methods: {
    //身份证正则校验
    validateIdCard (rule, value, callback) {
      const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!value) return false
      if (!pattern.test(value)) {
        return callback(new Error("请输入正确格式的身份证号"))
      }
      callback()
    },
    //千分位保留2位小数
    validateNumber2 (rule, value, callback) {
      if (!value) return callback()
      let _val = value.toString().includes(",") ? MyFun.getCopyAmount(value) : value
      let pattern = /^[\d]+(.[\d]{1,2})*$/;
      let field = rule.field.split('.')
      if (!pattern.test(_val)) {
        return callback(new Error("请输入大于 0 的数字，最多保留2位小数"))
      } else {
        this.subFormData.detailList[field[1]][field[2]] = MyFun.getQianfenWeiStr(MyFun.getTofixed(_val, 2))
      }
      callback()
    },
    //千分位字符串转数字
    getCopyAmount (row, field) {
      if (!row[field]) return false
      row[field] = row[field].toString().includes(",") ? MyFun.getCopyAmount(row[field]) : row[field]
      return row[field]
    },
    //自定义合计
    getSummaries (param) {
      const { columns } = param;
      const data = this.keepData
      const sums = [];
      const countArr = ['actualSalary', 'addDeduction', 'incomeTaxSalary', 'fixedDeductionStandard', 'securityAndProvidentFund'];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(this.getCopyAmount(item, column.property)));
        if (!values.every(value => isNaN(value)) && countArr.includes(column.property)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          // sums[index] = 'N/A';
        }
      });
      return sums;
    },
    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [1, 2, 4, 6, 7]; //想要改变列的索引
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        actualSalary: "", //实际发放工资(元)
        addDeduction: "", //专项附加扣除(元)
        fixedDeductionStandard: "", //固定扣除标准
        id: "", //主键
        idCard: "", //身份证号
        incomeTaxSalary: "", //收入(计划报个税工资)(元)
        memo: "", //备注
        name: "", //姓名
        personalIncomeTaxReportMainId: rowId || "", //个税申报主表id
        postion: "", //岗位
        securityAndProvidentFund: "", //社保及公积金可扣除(元)
        startIncomeDate: "", //开始申报日期
        endIncomeDate: "", //结束申报日期
        type: "1", //类型
      }
      _keepData.push(obj)
    },
    handleDelete (index, row) {
      let _keepData = this.keepData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      if (_keepData.length === 1) {
        this.$message.info("至少保留一条数据");
        return false;
      }
      _keepData.splice(_sourceIndex, 1)

    },
    usersUpdate (data, row) {
      row.name = data[0].realName
      // row.id = data[0].userId
    },
    validateForm () {
      let validObj = {
        name: '姓名',
        idCard: '身份证',
        actualSalary: '实际发放工资',
        startIncomeDate: '开始申报日期',
        endIncomeDate: '结束申报日期',
      }
      //审批环节
      const procInstObj = {
        postion: '岗位',
        incomeTaxSalary: '收入(计划报个税工资)(元)',
        addDeduction: '专项附加扣除(元)',
        fixedDeductionStandard: '固定扣除标准',
        securityAndProvidentFund: '社保及公积金可扣除(元)',
      }
      //审批环节
      if (this.isProcInstCreatorRealName) {
        validObj = { ...validObj, ...procInstObj }
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((Number(index) + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key]) {
            this.$message.error(`项目实际管理人员信息第 ${_currentPage} 页，第 ${(parseInt(index) + 1) % _pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.keepData
    }
  }
};
</script>

<style scoped>
::v-deep .el-table td.el-table__cell div {
  overflow: initial;
  /* height: 50px;
  line-height: 50px; */
}

::v-deep .el-table td.el-table__cell .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 0;
  padding-top: 0px;
  position: absolute;
  top: 100%;
  left: 0;
}

.bthGround {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

::v-deep.el-table .is_required .cell::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}
</style>
