<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules" :disabled="disabled">
      <el-form>
        <div class="bthGround">
          <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus" :disabled="disabled">新增</el-button>
        </div>
      </el-form>
      <el-table :data="subFormData.detailList" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable"
        :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <el-table-column label="姓名" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.realName`" :rules="rules.realName">
              <select-dialog :width="800" :height="360" :value="scope.row.realName"
              :modelData="marketModel"
                @updateValue="(val) => selectDialogCashier(scope.$index, val)" dynamicModel="selectUsers"></select-dialog>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="人员类型" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.userType`" :rules="rules.userType">
              <el-select v-model="scope.row.userType" placeholder="请选择" size="small">
                <el-option v-for="(item) in selectOptions" :key="item.value" :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </template>
        </el-table-column>
        <el-table-column label="部门" :align="'center'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.userDeptName" disabled placeholder="自动带出" />
          </template>
        </el-table-column>
        <el-table-column label="岗位" :align="'center'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.position" />
          </template>
        </el-table-column>
        <el-table-column label="电话" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.phone`" :rules="rules.phone">
              <el-input v-model="scope.row.phone" placeholder="自动带出" />
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
import updateFiles from '@/components/basic/uploaderFile/index.vue';
export default {
  name: "subFromTab",
  components: { d3Pagination, SelectDialog, updateFiles },
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    },
    dataClassificationOptions: {
      type: Array,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      subFormData: {
        detailList: []
      },
      keepData: [],
      rules: {
        realName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        userType: [{ required: true, message: "必填项不能为空", trigger: "change" }],
        phone: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
      },
      selectOptions: [{ value: '0', name: '组长' }, { value: '1', name: '组员' }],
      marketModel: {
          singleSelect: true,
          resultFieldKey: "",
          data: [],
          parm: {singleSelect: true}
      }
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
  methods: {

    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [1, 2, 5];
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        phone: "",//
        userDeptName: "",//部门
        position: "",//岗位
        projectInspectionMainId: "",//项目巡检主键id
        userId: "",//用户id
        realName: "",//用户
        userType: "",//人员类型
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
      if (this.disabled) return this.keepData
      const { detailList } = this.subFormData
      let result = []
      result = detailList.filter(item=>{
        return item.userType === '0'
      })
      if(result.length!==1){
        FUI.Window.showMsg2('本次集团公司抽巡检参与人员中必须要有一个组长,且只能有一个组长');
        return
      }
      const validObj = {
        realName: '名称',
        userType: '人员类型',
        phone: '电话',
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key]) {
            this.$message.error(`本次集团公司抽巡检参与人员：第 ${_currentPage} 页，第 ${(parseInt(index) + 1) % _pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.keepData
    },
    selectDialogCashier (index, data) {
      let _keepData = this.keepData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      _keepData[_sourceIndex].realName = data[0].realName;
      _keepData[_sourceIndex].userId = data[0].userId;
      _keepData[_sourceIndex].phone = data[0].mobile;
      _keepData[_sourceIndex].userDeptName = data[0].orgName;
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .el-table td.el-table__cell div {
  overflow: initial;
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

  ::v-deep.el-button {
    margin-left: 5px;
  }
}

::v-deep.el-table .is_required .cell::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}
</style>
