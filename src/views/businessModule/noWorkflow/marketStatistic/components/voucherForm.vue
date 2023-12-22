<template>
  <!-- 跨税社区台账搜索 -->
  <div style="display: flex;position: relative;" class="grid-search-form">
    <el-popover placement="top-start" trigger="hover" content="显示/隐藏更多搜索条件">
      <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference" @click="handelIsOpen"></i>
    </el-popover>
    <el-form :model="formData" label-width="154px" inline ref="form">
      <div v-if="isOpen">
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目编号：" prop="constructCode" class="default-label">
            <el-input size="small" v-model="formData.constructCode" clearable placeholder="请输入项目编号"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目名称：" prop="constructName" class="default-label">
            <el-input size="small" v-model="formData.constructName" clearable placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="管理部门：" prop="managerDeptName" class="default-label">
            <el-input size="small" v-model="formData.managerDeptName" clearable placeholder="请输入管理部门"></el-input>
          </el-form-item>
        </row-layout>
      </div>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="税跨报状态：" prop="crossReportState" class="default-label">
          <el-select v-model="formData.crossReportState" clearable placeholder="请选择" size="small">
            <el-option v-for="item in crossReportStateOptions" :key="item.configId" :label="item.configName"
              :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="税跨报号：" prop="taxAcross" class="default-label">
          <el-input size="small" v-model="formData.taxAcross" clearable placeholder="请输入税跨报号"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" label="纳税单位：" prop="taxUnitName" class="default-label">
          <el-input size="small" v-model="formData.taxUnitName" clearable placeholder="请输入纳税单位"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="个税是否需要申报：" prop="incomeDetailedDeclaration" class="default-label">
          <el-select v-model="formData.incomeDetailedDeclaration" clearable placeholder="请选择" size="small">
            <el-option v-for="item in radioOptions" :key="item.label" :label="item.name" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="">
          <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
          <el-button size="small" icon="el-icon-refresh-left" class="fa" @click="resetFn">重置</el-button>
        </el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import { RADIO3_GROUP } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  components: { SelectDialog, RowLayout },
  data () {
    return {
      marginStyle: 'margin:0;',
      formData: {
        constructCode: '',  //项目编号
        constructName: '',  //项目名称
        crossReportState: '',  //税跨报状态
        incomeDetailedDeclaration: '',  //个税全额全员明细申报
        managerDeptName: '',  //管理部门
        taxAcross: '',  //税跨报号
        taxUnitName: '',  //纳税单位
        pageSize: 20,  //
        currentPage: 1,  //
      },
      isOpen: false,
      crossReportStateOptions: [],
      radioOptions: RADIO3_GROUP,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date('2021-12-31').getTime()
        }
      }
    }
  },
  created () {
    this.getDataDictByConfigType();
  },
  methods: {
    productLineUpdate (data) {
      this.formData.productLine = data[0].name;
    },
    // 切换状态
    handelIsOpen () {
      this.isOpen = !this.isOpen;
    },
    searchFn () {
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
::v-deep.el-form-item{
  margin-bottom: 15px;
}
</style>