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
        <el-table-column label="资料分类" :align="'center'">
          <template slot-scope="scope">
            <treeselect v-model="scope.row.baseDataClassificationId" append-to-body z-index="9999" :limit="1"
              :default-expanded-keys="defaultExpandedKeys" :default-expand-level="3" placeholder="请选择" :options="treeData"
              :multiple="true" :normalizer="normalizer" />
          </template>
        </el-table-column>
        <el-table-column label="附件" :align="'center'">
          <template slot-scope="scope">
            <update-files v-model="scope.row.fileInfoList"></update-files>
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
import service from "@/utils/services";
export default {
  name: "subFromTab",
  components: { d3Pagination, SelectDialog, updateFiles },
  props: {
    value: {
      type: Array,
      default: () => { return [] }
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
      treeData: [],
      defaultExpandedKeys: [],
      rules: {
        number4: [
        ],
      },
    };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) this.keepData = val
        console.log(val,this.keepData)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.queryDataClassification()
  },
  methods: {

    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [1, 2];
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        baseDataClassificationId: [], //资料分类ID
        contractProjectDataMainId: rowId || "", //项目资料主表ID
        fileInfoList: [], //附件
        baseDataClassificationName: "", //	资料分类
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
      const validObj = {
        baseDataClassificationId: '资料分类',
        fileInfoList: '附件',
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key] || _row[key].length === 0) {
            this.$message.error(`资料信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1) % _pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.keepData
    },
    queryDataClassification () {
      service.post(`/construct/baseProjectDataStore/queryDataClassification`, {}, {
        action: "查询收入合同"
      }).then(res => {
        this.treeData = res.data
        // this.loadDefaultExpandedKeys()
      })
    },
    loadDefaultExpandedKeys () {
      var that = this;
      that.defaultExpandedKeys = ['2000000010'];
      //默认展开到第几级
      var level = 3;
      Object.toTreeCollection(that.treeData, 'id', that.defaultExpandedKeys, level);
    },
    normalizer (node) {
      return {
        id: node.id, //   （这里是选中时的值）
        label: node.name, //   （这里是选中时你要展示的文本）
      };
    },
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
