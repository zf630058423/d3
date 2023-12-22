<template>
  <div>
    <el-input v-model="value" placeholder="请选择" :disabled="disabled" size="small">
      <el-button slot="append" icon="el-icon-search" @click="openDialog()" size="small" :disabled="btnDisabled"></el-button>
    </el-input>
    <FuiDialog width="800px" :title="dialogTitle" :visible="dialogTableVisible" @on-cancel="onCancel" @on-confirm="onConfirm">
      <div class="f2bpm-page-layout">
        <el-container style="height:500px">
          <el-main class="f2bpm-page-right" style="overflow: hidden">
            <div style="flex: 1;display: flex;padding:10px">
              <el-form class="search-form" label-position="right" style="flex:1">
                <el-row :gutter="20" style="display: flex;flex-wrap: wrap;">
                  <el-col v-for="(item,index) in tableConfig.searchParams" :key="index" :span="12">
                    <el-form-item v-show="item.label" :label="item.label+'：'" label-width="90px">
                      <el-input size="small" v-model="item.value" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div>
                <el-button size="small" type="primary" class="search-btn" @click="search" ><i class="fa fa-search"></i>搜索</el-button>
                <el-button size="small" @click="reset"><i class="fa fa-undo"></i>重置</el-button>
              </div>
            </div>
            <el-table :data="tableData" :height="397" 
              class="f2bpmui-datagrid-vuetable"
              size="small">
              <!--单选-->
              <el-table-column v-if="!tableConfig.isMulti" fixed="left" dir="" width="40" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-radio v-model="radioVal" style="margin-left: 3px" :label="scope.row" name="radio" @change="radioChange"><span /></el-radio>
                </template>
              </el-table-column>
              <!--多选-->
              <el-table-column v-if="tableConfig.isMulti" type="selection" fixed="left" align="center" width="45" @click="rowClick" />
              <el-table-column v-for="(item,index) in tableConfig.columns" :key="index" :property="item.property" :label="item.label" min-width="120" show-overflow-tooltip></el-table-column>
            </el-table>
            <div style="padding: 10px;text-align:center">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.currentPage"
                :page-sizes="pageSizes" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next" v-bind="$attrs" :total="pageInfo.total" background>
              </el-pagination>
            </div>
          </el-main>
          <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
            <el-table :data="selTableData" :height="460"
              class="f2bpmui-datagrid-vuetable"
              size="small">
              <el-table-column :prop="selLabel.property" :label="selLabel.label" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <button class="btn btn-minier btn-grey mr2 fa fa-trash" @click="deleteRow(scope.$index)"></button>
                </template>
              </el-table-column>
            </el-table>
          </el-aside>
        </el-container>
      </div>
    </FuiDialog>
  </div>
</template>
<script>
import { customDialogApi } from '@/Api/workflowBusssion/index.js';
import FuiDialog from '@/components/basic/FuiDialog/index.vue'; // 公共弹框
export default {
  components: { FuiDialog },
  props: {
    dialogTitle: {
      type: String,
      default: '选择'
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    btnDisabled: {
      type: Boolean,
      default: false
    },
    dialogParams: {
      type: Object,
      default: ()=> { return {} }
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      pageSizes: [5, 10, 20, 50],
      tableConfig: {
        apiUrl: '', // 接口
        searchParams: [], // 请求参数
        isMulti: false, //是否多选
        columns: [], // 字段
      },
      selLabel: {property:'',label:''}, // 选中的标签
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 单选间距的行数据
      radioVal: '',
      tableData: [],
      selTableData: []
    }
  },
  watch: {
    dialogParams: {
      handler(val,old){
        if(val) {
          this.tableConfig = val;
          if(val.columns && val.columns.length>0) {
            this.selLabel = val.columns[0]
          }
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    handleSizeChange (val) {
      this.pageInfo.pageSize = val
      this.initData()
    },
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      this.initData()
    },
    /**
     * 确定更新数据
     */
    onConfirm() {
      this.$emit('updateValue',this.selTableData);
      this.dialogTableVisible = false;
    },
    onCancel() {
      this.dialogTableVisible = false;
    },
    openDialog() {
      this.dialogTableVisible = true;
      this.selTableData = []
      this.radioVal = '';
      this.tableData = [];
      this.initData()
    },
    /**
     * 单选选中事件
     */
    radioChange() {
      this.selTableData = [this.radioVal];
    },
    /**
     * 多行选中
     */
    rowClick(row) {
      var that = this;
      if (that.tableConfig.isMulti) {
        const selected = that.multipleSelection.some(item => item._selectedkey === row._selectedkey); // 是取消选择还是选中
        if (!selected) { // 不包含   代表选择
          this.multipleSelection.push(row);
          that.$refs.f2bpmuiVuetable.toggleRowSelection(row, true);
        } else { // 取消选择
          var finalArr = that.multipleSelection.filter((item) => {
            return item.id !== row.id
          });
          that.multipleSelection = finalArr; // 取消后剩余选中的
          that.$refs.f2bpmuiVuetable.toggleRowSelection(row, false);
        }
        that.selTableData.push(...row)
      } else if (!that.tableConfig.isMulti) {
        that.radioVal = row;
      }
    },
    /**
     * 删除选中行
     */
    deleteRow(index) {
      this.selTableData.splice(index,1)
    },
    /**
     * 初始化列表
     */
    async initData() {
      const params = {
        ...this.pageInfo
      }
      this.tableConfig.searchParams.forEach(e=>{
        if(!e.label && e.value) params[e.property] = e.value;
      })
      const res = await customDialogApi(this.tableConfig.apiUrl, params);
      if (res.code == 200){
        this.tableData = res.data.list;
        this.pageInfo.total = res.data.pagination.total;
      }
    },
    /**
     * 搜索
     */
    search() {
      this.pageInfo.currentPage = 1;
      this.initData();
    },
    /**
     * 重置
     */
    reset() {
      this.tableConfig.searchParams.forEach(e=>{
        e.value = ''
      });
      this.pageInfo.currentPage = 1;
      this.initData();
    },
  }
}
</script>
<style scoped>

</style>
