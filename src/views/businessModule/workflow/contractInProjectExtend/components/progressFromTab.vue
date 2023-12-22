<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules" :disabled="disabled">
      <div class="bthGround">
        <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      </div>
      <el-table :data="subFormData.detailList" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable"
        :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <el-table-column label="节点内容">
          <template slot-scope="scope">
            <el-form-item>
              <el-input type="text" v-model="scope.row.nodeContent" size="small" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="进度款比例（%）">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.progressPayment`" :rules="rules.progressPayment">
              <!-- <el-input type="text" v-model="scope.row.progressPayment" size="small"
                placeholder="请输入大于 0 小于 1 且大于前一条的两位小数" clearable @focus="focusInput('progressPayment', scope.$index)" /> -->
                <percentage-input v-model="scope.row.progressPayment" clearable></percentage-input>
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
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
export default {
  name: "progressFromTab",
  components: { d3Pagination, percentageInput },
  props: {
    value: {
      type: Array,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    advPayment: {
      type: [String, Number],
      default: ""
    },
    comPayment: {
      type: [String, Number],
      default: ""
    },
    proPayment: {
      type: [String, Number],
      default: ""
    },
  },
  data () {
    return {
      subFormData: {
        detailList: []
      },
      keepData: [],
      rules: {
        progressPayment: [
          { validator: this.validateNumber, trigger: 'blur' }
        ],
      },
      id: '',
      isValidate:true
    };
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
  updated () {
    const rowId = Object.toQueryString('rowId')
    if (rowId && this.subFormData.detailList[0].progressPayment && this.isValidate) {
      this.isValidate = false
      this.$nextTick(() => {
        this.$refs['subFrom'].validate(valid => valid)
        this.$refs['subFrom'].clearValidate()
      })
    }
  },
  methods: {
    validateNumber (rule, value, callback) {
      console.log(rule, value)
      
      const pattern = /(^[0-9]{1,2}$)|(^[0](\.[0-9]{1,2})?$)/
      const field = rule.field.split('.')
      console.log(field[1]-0 +1)
      const advPayment = this.toNumber2(this.advPayment) //预收款
      const comPayment = this.toNumber2(this.comPayment) //完工款
      const proPayment = this.toNumber2(this.proPayment) //进度款
      if(proPayment && value)return callback(new Error("收款条款-进度款与节点收款-进度款只能填写1个"))
      const _value = this.toNumber2(value)

      if (!value) return callback()
      if (value>1||value<0) {
        return callback(new Error("请输入0到100的数字"))
      }
      // if (!pattern.test(value)) return callback(new Error("请输入大于0小于1的两位小数"))

      // if (_value < advPayment && advPayment) return callback(new Error("进度款 需大于等于 预收款"))
      
    
      if ((field[1]-0 + 1)==this.subFormData.detailList.length&&(_value > comPayment && comPayment)) return callback(new Error("进度款 需小于等于 完工款"))

      // this.subFormData[field[0]][field[1]][field[2]] = this.toNumber2(_value) * 100 + '%'
      callback()
    },
    focusInput (code, index) {
      let value = this.subFormData.detailList[index][code]
      if (value && value.toString().split('%').length < 2) return
      this.subFormData.detailList[index][code] = this.toNumber2(value)
    },
    //百分比转两位小数
    toNumber2 (val) {
      if (!val) return ""
      return val
      let _val = val && val.toString().split('%')[0]
      if (isNaN(_val)) return val
      //转两位小数输出
      return Number(_val >= 1 && _val < 100 ? _val / 100 : _val)
    },
    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [];
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        id: rowId || "",
        contractInMainId: "",//收入类合同主键
        nodeContent: "",//节点内容
        progressPayment: "",//进度款比例(%)
      };
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
    validateForm () {
      //必填校验
      const validObj = {
      }
      const _keepData = Object.toDeepClone(this.keepData).map(item => {
        item.progressPayment = this.toNumber2(item.progressPayment)
        return item
      })
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        //进度款需大于前一条进度款
        if (index > 0 && _row.progressPayment < _keepData[index - 1].progressPayment) {
          this.$message.error(`收款信息：第 ${_currentPage} 页，第 ${(index + 1) % _pageSize} 行 进度款 需大于前一条 进度款 ${_keepData[index - 1].progressPayment}`)
          return false
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
  height: 50px;
  line-height: 50px;
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
