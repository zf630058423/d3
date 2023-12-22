<template>
  <!-- 收入类台账搜索 -->
  <div style="display: flex;position: relative;" class="grid-search-form">
    <el-popover placement="top-start" trigger="hover" content="显示/隐藏更多搜索条件">
      <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference" @click="handelIsOpen"></i>
    </el-popover>
    <el-form :model="formData" label-width="154px" inline ref="form">
      <div v-if="isOpen">
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目编号：" prop="constructCode" class="default-label">
            <el-input size="small" v-model="formData.constructCode" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目名称：" prop="constructName" class="default-label">
            <el-input size="small" v-model="formData.constructName" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="管理部门：" prop="managerDeptName" class="default-label">
            <el-input size="small" v-model="formData.managerDeptName" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="甲方：" prop="customerA" class="default-label">
            <el-input size="small" v-model="formData.customerA" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="乙方：" prop="supplierName" class="default-label">
            <el-input size="small" v-model="formData.supplierName" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="业务单元：" prop="businessUnit" class="default-label">
            <el-input size="small" v-model="formData.businessUnit" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="合同编号：" prop="contractCode" class="default-label">
            <el-input size="small" v-model="formData.contractCode" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="合同名称：" prop="contract" class="default-label">
            <el-input size="small" v-model="formData.contract" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="项目协议编号：" prop="schemeCode" class="default-label">
            <el-input size="small" v-model="formData.schemeCode" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </row-layout>
      </div>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="合同编制人：" prop="createUserName" class="default-label">
          <el-input size="small" v-model="formData.createUserName" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="合同编制时间：" prop="createTime" class="default-label">
          <el-date-picker size="small" v-model="createTime" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" label="合同审批通过时间：" prop="passTime" class="default-label">
          <el-date-picker size="small" v-model="passTime" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1">
          <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
          <el-button size="small" icon="el-icon-refresh-left" class="fa" @click="resetFn">重置</el-button>
        </el-form-item>
        <el-form-item slot="col_2" label="">
        </el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
// import { RADIO3_GROUP } from '@/views/businessModule/enum/param';
// import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  components: { SelectDialog, RowLayout },
  data () {
    return {
      marginStyle: 'margin:0;',
      formData: {
        constructCode: '',  //项目编号
        constructName: '',  //项目名称
        managerDeptName: '',  //管理部门
        customerA: '',  //甲方
        supplierName: '',  //乙方
        businessUnit: '',  //业务单元
        contractCode: '',  //合同编号
        contract: '',  //合同名称
        schemeCode: '',  //项目协议编号
        createUserName: '',  //合同编制人
        createTime: '',  //合同编制时间
        passTime: '',  //合同审批通过时间
        pageSize: 20,  //
        currentPage: 1,  //
      },
      createTime:[],
      passTime:[],
      isOpen: false,
      crossReportStateOptions: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date('2021-12-31').getTime()
        }
      }
    }
  },
  created () {
    // this.getDataDictByConfigType();
  },
  methods: {
    // 切换状态
    handelIsOpen () {
      this.isOpen = !this.isOpen;
    },
    getMomentDate(arr) {
      return (arr && arr.length > 0) ? `${arr[0]},${arr[1]}` : '';
    },
    searchFn () {
      //合同编制时间
      this.formData.createTime = this.getMomentDate(this.createTime);
      //合同审批通过时间
      this.formData.passTime = this.getMomentDate(this.passTime);
      let dataParams = {
        ...this.formData,
      }
      this.$emit('search', dataParams)
    },
    exportFn () {
      this.$emit('exportExcel', this.formData)
    },
    paramsData () {
      return this.formData;
    },
    resetFn () {
      this.formData = {};
      this.createTime = []
      this.passTime = []
      this.$emit('search', this.formData)
    },
    /**
   * 初始化字典
   */
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '税跨报状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '税跨报状态':
              this.crossReportStateOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
  }
}
</script>
<style scoped lang="scss">
@import url('../../../style/form.scss');

.expans-more {
  margin-left: 15px;
  cursor: pointer;
  font-size: 10px;
  color: #0D1126;
}

.el-form-item__content .el-input-group {
  vertical-align: middle;
}

::v-deep .el-form-item__label {
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576C;
}

.el-form-item {
  width: 100%;
}

::v-deep .el-form-item__content {
  width: calc(100% - 156px);
  text-align: left;
}

::v-deep .el-select {
  width: calc(100%);
}

::v-deep .el-select>.el-input {
  height: 32px;
}

::v-deep .el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 100%;
}

::v-deep.el-form-item {
  margin-bottom: 15px;
}</style>