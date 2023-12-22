<template>
  <div>
    <!-- <el-input v-model="value" placeholder="请选择" :disabled="disabled" size="small">
      <el-button slot="append" icon="el-icon-search" @click="openDialog()" size="small" :disabled="btnDisabled"></el-button>
    </el-input> -->
    <FuiDialog width="810px" :title="dialogTitle" :visible="visible" @on-cancel="onCancel" @on-confirm="onConfirm">
      <div class="f2bpm-page-layout">
        <el-container style="height:520px">
          <el-main class="f2bpm-page-right" style="overflow: hidden">
            <div style="flex: 1;display: flex;padding:10px">
              <el-form class="search-form" label-position="right" style="flex:1">
                <el-row :gutter="20" style="display: flex;flex-wrap: wrap;">
                  <el-col v-for="(item,index) in tableConfig.searchParams" :key="index" :span="12">
                    <el-form-item v-show="item.label" :label="item.label+'：'" label-width="90px">
                      <el-input size="small" v-model="item.value" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="search-btns">
                <el-button size="small" type="primary" class="search-btn" @click="search" ><i class="fa fa-search"></i>搜索</el-button>
                <el-button size="small" @click="reset"><i class="fa fa-undo"></i>重置</el-button>
              </div>
            </div>
            <el-table 
              :data="tableData" 
              :height="397" 
              class="f2bpmui-datagrid-vuetable"
              @selection-change="handleSelectionChange"
              ref="vueTableRef"
              size="small">
              <!--单选-->
              <el-table-column v-if="!tableConfig.isMulti" fixed="left" dir="" width="40" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-radio v-model="radioVal" style="margin-left: 3px" :label="scope.row" name="radio" @change="radioChange"></el-radio>
                </template>
              </el-table-column>
              <!--多选-->
              <el-table-column v-if="tableConfig.isMulti" type="selection" fixed="left" align="center" width="45">
              </el-table-column>
              <el-table-column v-for="(item,index) in tableConfig.columns" :key="index" :property="item.property" :label="item.label" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ columnsVal(scope.row, item) }}</span>
                </template>
              </el-table-column>
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
              ref="f2bpmuiVuetable"
              size="small">
              <el-table-column :prop="selLabel.property" :label="selLabel.label" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <button class="btn btn-minier btn-grey mr2 fa fa-trash" @click="deleteRow(scope.$index, scope.row)"></button>
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
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  name:'popTableDialog',
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
      default: () => { }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // dialogTableVisible: false,
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
      selTableData: [],
      multipleSelection: [],
      dictData: {}
    }
  },
  watch: {
    dialogParams: {
      handler(val, old) {
        if(val) {
          this.tableConfig = val;
          if(val.columns && val.columns.length>0) {
            this.selLabel = val.columns[0];
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    //列的数据字典 根据列的数据字典标识展示对应的文字状态
    columnsVal() { 
      return (row, obj) => { 
        if (obj.dict && this.dictData[obj.dict]) {
          return this.dictData[obj.dict].find(item => item.configValue === row[obj.property])?.configName || '';
        }
        return row[obj.property];
      }
    }
  },
  created() {
  },
  methods: {
    //弹框列数据字典对应显示问题 根据传过来的dict请求对应的数据字典
    async getDataDictByConfigType(configTypes) {
      const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        if (configTypes.includes(',')) { 
          let configTypeArry = configTypes.split(',');
          configTypeArry.forEach(name => { 
            this.dictData[`${name}`] = data.find(item => item.dataDictType === name)?.dataDict || [];
          })
        }
      }
    },
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
    },
    onCancel() {
      this.$emit('update:visible', false);
    },
    openDialog() {
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
    handleSelectionChange(selectData) {
      this.multipleSelection = selectData;
      this.multipleSelection.forEach(obj => { 
        this.$refs.f2bpmuiVuetable.toggleRowSelection(obj, true);
      })
      if (this.tableConfig.isMulti) {
        this.selTableData = this.multipleSelection;
      } else if (!this.tableConfig.isMulti) {
        this.radioVal = this.multipleSelection;
      }
    },
    /**
     * 多行选中
     */
    rowClick(row, status) {
      if (this.tableConfig.isMulti) {
        if (status) {
          const selected = this.multipleSelection.some(item => item.id === row.id); // 是取消选择还是选中
          if (!selected) {
            this.multipleSelection.push(row);
            this.$refs.f2bpmuiVuetable.toggleRowSelection(row, true);
          }
        } else {
          this.multipleSelection = this.multipleSelection.filter(item => item.id !== row.id);
          this.$refs.f2bpmuiVuetable.toggleRowSelection(row, false);
        }
        this.selTableData.push(row)
      } else if (!this.tableConfig.isMulti) { 
        this.radioVal = row;
      }
    },
    /**
     * 删除选中行
     */
    deleteRow(index, row) {
      if (this.tableConfig.isMulti) {
        this.multipleSelection.forEach((item, mIndex) => {
          if (row.id === item.id) {
            this.multipleSelection.splice(mIndex, 1);
            this.selTableData.splice(mIndex, 1);
            this.$refs.vueTableRef.toggleRowSelection(item);
          }
        })
      } else { 
        this.selTableData.splice(index, 1);
      }
    },
    /**
     * 初始化列表
     */
    async initData() {
      const params = {
        ...this.pageInfo
      }
      this.tableConfig.searchParams.forEach(e=>{
        if(e.isSearch) params[e.property] = e.value;
      })
      const res = await customDialogApi(this.tableConfig.apiUrl, params);
      if (res.code == 200){
        this.tableData = res.data.list;
        const status = this.tableData.some(item => item._selectedkey);
        if (!status) { 
          this.tableData = this.tableData.map(item => ({
          ...item,
          _selectedkey:item.id
        }))
        }
        
        this.pageInfo.total = res.data.pagination.total;
      }
    },
    /**
     * 搜索
     */
    search() { 
      this.pageInfo.currentPage = 1;
      this.initData();
      if (this.tableConfig && this.tableConfig.columns) { 
        let configTypes = this.tableConfig.columns.filter(col => col.dict).map(m => m.dict).join(',');
        if(configTypes) this.getDataDictByConfigType(configTypes);
      }
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
<style scoped lang="scss">
::v-deep .el-form-item{
  margin-bottom: 0;
}

.search-btns{
  height: 40px;
  line-height: 40px;
  margin-right: 8px;
}
</style>
