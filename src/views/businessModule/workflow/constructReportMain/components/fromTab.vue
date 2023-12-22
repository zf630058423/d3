<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules" :disabled="disabled">
      <div class="bthGround">
        <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus" :disabled="isConstruction">新增</el-button>
      </div>
      <el-table :data="subFormData.detailList" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable"
        :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <el-table-column label="岗位">
          <template slot-scope="scope">
            <el-form-item>
              <el-select v-model="scope.row.post" placeholder="请选择" :disabled="isConstruction" size="small" style="width:100%">
                <el-option v-for="(item) in postOptions" :key="item.configValue" :label="item.configName"
                  :value="item.configValue"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <el-form-item>
              <select-dialog v-model="scope.row.name" @updateValue="(val) => selectDialogApplicantName(val, scope.$index)"
                dynamicModel="selectUsers" :disabled="isConstruction"></select-dialog>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">
            <el-form-item>
              <el-input type="text" v-model="scope.row.phone" size="small" placeholder="请输入" :disabled="isConstruction"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)" :disabled="isConstruction">删除</el-button>
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
import { BUSINERSSUNIT_MODEL } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  name: "accountInfo",
  components: { d3Pagination, SelectDialog },
  props: {
    value: {
      type: Array,
      default: () => { }
    },
    createUserName: {
      type: String,
      default: ''
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
      },
      id: '',
      postOptions: [],
      businessUnitModelData: BUSINERSSUNIT_MODEL,

    };
  },
  created () {
    this.getDataDictByConfigType()
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) this.keepData = val
      },
      deep: true,
      immediate: true
    },
  },
  computed: {
    //是否编制人
    isConstruction () {
      return this.createUserName !== WFContext.CurrentRealName
    },
  },
  methods: {
    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [1, 2, 3]; //想要改变列的索引
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    selectDialogApplicantName (data, index) {
      this.subFormData.detailList[index].name = data[0].realName
      this.subFormData.detailList[index].nameId = data[0].userId
      this.subFormData.detailList[index].phone = data[0].mobile
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        constructReportMainId: rowId || "",//项目开工报告主键
        id: "", //Id
        name: "", //姓名
        nameId: "", //姓名id
        phone: "", //联系电话
        post: "" //岗位
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
      const validObj = {
        name: '姓名',
        post: '岗位',
        phone: '联系电话'
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      let postArr = [] //存放岗位
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((Number(index) + 1) / _pageSize) + 1
        postArr.push(_row.post)
        //校验是否存在必要岗位
        if (index == _keepData.length - 1 && !this.validatePost(postArr)) return false
        //检查单行必填项
        for (let key in validObj) {
          if (!_row[key]) {
            this.$message.error(`项目管理部人员信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.keepData
    },
    validatePost (postArr) {
      // ['10', '2', '7']//执行经理，仓管，安全员
      if (!postArr.includes('10')) {
        this.$message.error(`项目管理部人员信息：必须存在 执行经理 岗位`)
        return false
      }
      if (!postArr.includes('2')) {
        this.$message.error(`项目管理部人员信息：必须存在 仓管 岗位`)
        return false
      }
      if (!postArr.includes('7')) {
        this.$message.error(`项目管理部人员信息：必须存在 安全员 岗位`)
        return false
      }
      return true
    },
    //初始化字典
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '岗位' } })
      if (res.success) {
        res.data.forEach(ele => {
          this.postOptions = ele.dataDict;
        });

      }
    },
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
