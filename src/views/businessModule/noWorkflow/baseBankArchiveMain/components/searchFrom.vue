<template>
  <div style="display: flex;position: relative;padding-right:10px" class="grid-search-form">
    <el-popover
        placement="top-start"
        trigger="hover" 
        content="显示/隐藏更多搜索条件">
        <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference"  @click="handelIsOpen"></i>
      </el-popover>
    <el-form :model="formData" label-width="150px" inline ref="form"  class="dataForm">
      <row-layout row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="单据编号：" prop="code">
          <el-input  class="business-input"v-model="formData.code" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="银行账号：" prop="bankAccountNo">
          <el-input class="business-input" v-model="formData.bankAccountNo" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_3" label="启用状态：" prop="enableStatus">
          <el-radio-group v-model="formData.enableStatus">
            <el-radio v-for="item in isDisableData" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="核算财务组织：" prop="financeOrgName">
          <select-dialog :width="600" :height="360" :value="formData.financeOrgName"  @updateValue="selectDialogfinanceOrg" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="账户属性：" prop="accountProp">
          <el-select v-model="formData.accountProp" placeholder="请选择" size="small" style="width:100%"  @change="(val) => changeOptions('accountProp', val)">
            <el-option v-for="(item) in accountPropOptions" :key="item.configName" :label="item.configName"  :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="账户状态：" prop="accountStatus">
          <el-select v-model="formData.accountStatus" placeholder="请选择" size="small" style="width:100%"  @change="(val) => changeOptions('accountStatus', val)">
            <el-option v-for="(item) in accountStatusOptions" :key="item.configName" :label="item.configName"  :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="开户类型：" prop="openAccountType">
          <el-select v-model="formData.openAccountType" placeholder="请选择" size="small" style="width:100%"  @change="(val) => changeOptions('openAccountType', val)">
            <el-option v-for="(item) in openAccountTypeOptions" :key="item.configName" :label="item.configName"  :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="开户日期：" prop="openAccountTime">
          <el-date-picker  clearable v-model="formData.openAccountTime" value-format="yyyy-MM-dd HH:mm:ss"  type="datetimerange" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" label="销户时间：" prop="closeAccountTime">
          <el-date-picker  clearable v-model="formData.closeAccountTime" value-format="yyyy-MM-dd HH:mm:ss"  type="datetimerange" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="账户名称：" prop="bankAccountName">
          <el-input class="business-input" v-model="formData.bankAccountName" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="开户银行：" prop="bankBranchName">
          <select-dialog :width="600" :height="360" :value="formData.bankBranchName"  @updateValue="selectDialogBankName" :modelData="bankNameModelData" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="出纳：" prop="cashierName">
          <select-dialog :width="600" :height="360" :value="formData.cashierName"  @updateValue="selectDialogCashier" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="扣税户：" prop="isTaxDeductionAccount">
          <el-radio-group v-model="formData.isTaxDeductionAccount">
            <el-radio v-for="item in disableData" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
    </el-form>

    <div class="buttonGroup">
      <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
      <el-button size="small" class="el-btn fa fa-undo" @click="resetFn">重置</el-button>
         <!--  <el-button type="primary" size="small" class="fa" @click="addFn">新增</el-button>
          <el-button type="primary" size="small" class="fa" @click="exportFn">导出</el-button>
          <el-button type="primary" size="small" class="fa" @click="importCommonExcel">更新信息</el-button> -->
      </div>
    <!-- 导入弹框 -->
    <CommonImpotDilog :visible.sync="commonImportData.visible" :title="commonImportData.title" :type="commonImportData.type" :tableName="commonImportData.tableName" @onCancel="() => this.commonImportData.visbile = false"></CommonImpotDilog>
  </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import CommonImpotDilog from '@/components/basic/commonImportDialog/index.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
export default {
  name: "searchFrom",
  components: { RowLayout,CommonImpotDilog,SelectDialog },
  props: {
    openAccountTypeOptions: {
      type: Array,
      default: () => {}
    },
    accountStatusOptions: {
      type: Array,
      default: () => {}
    },
    accountPropOptions: {
      type: Array,
      default: () => {}
    },
  },
  data() {
    return {
      marginStyle: 'margin:0;',
      isOpen: false,
      formData: {
        code: "", //单据编号
        bankAccountNo: "", //银行账号
        financeOrgName: "", //核算财务组织
        financeOrgId: "", //核算财务组织
        bankAccountName: "", //	账户名称
        accountProp: "", //	账户属性
        accountStatus: "", //	账户状态
        bankBranchName: "", //	开户银行
        bankBranchId: "", //	开户银行
        openAccountType: "", //	开户类型
        openAccountTime: "", //	开户日期
        closeAccountTime: "", //	销户时间
        enableStatus: "", //	启用状态
        isTaxDeductionAccount: "", //	扣税户
        cashierId: "", //	出纳
        cashierName: "" //出纳
      },
      isDisableData: [
        { label: "1", name: "启用" },
        { label: "2", name: "禁用" },
        { label: "", name: "全部" },
      ],
      disableData: [
        { label: "1", name: "是" },
        { label: "0", name: "否" },
        { label: "", name: "全部" },
      ],
      bankNameModelData: {
        code: "bank_branch",
        parm: {
          isEnableAuthor: 0,
          data: [],
          isMulti: false
        }
      },
      commonImportData: {
          title: '数据导入',
          visible: false,
          cancelText: '取消',
          type: '',
          tableName: ''
        },
    };
  },
  methods: {
    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },
     //核算财务组织
     selectDialogfinanceOrg(data) {
      this.formData.financeOrgName = data[0].text;
      this.formData.financeOrgId = data[0].value;
    },
    //开户银行
    selectDialogBankName(data) {
      console.log(this.formData,data)
      this.formData.bankBranchName = data[0].name;
      this.formData.bankBranchId = data[0].id;
    },
    //出纳
    selectDialogCashier(data) {
      this.formData.cashierName = data[0].realName;
      this.formData.cashierId = data[0].userId;
    },
    //查询
    searchFn() {
      let searchData = this.dellNull(this.formData);
      this.$emit("search", searchData);
    },
    //重置
    resetFn() {
      this.clearFormData();
      this.$emit("search", this.formData);
    },
    clearFormData() {
      this.formData = {};
    },
    //新增
    addFn() {
      let queryData = {
        code: "baseBankArchiveMain",
        path: "/baseBankArchiveMain/list",
        encode: "baseBankArchiveMain",
        myId: "",
        formAction: "add",
        title: "银行档案",
        fullDev: true //全开发页面
      };
      this.$router.push({ path: "/noWorkflowForm", query: queryData });
    },
    //导出
    exportFn() {
      this.$emit("exportExcel", this.formData);
    },
    importCommonExcel(type, tableName) {
        // 导入前置事件
        this.commonImportData.visible = true;
        this.commonImportData.type = 'customDataGrid';
        this.commonImportData.title = '数据导入';
        this.commonImportData.tableName = 'base_bank_archive_main';

      },
    //对象去空值
    dellNull(obj) {
      let newObj = {};
      const dateArr = ['openAccountTime', 'closeAccountTime']
      Object.keys(obj).forEach(key => {
        let value = obj[key]
        if (value !== null && value !== "" && value !== undefined) {
          newObj[key] = value;
        }
        if (dateArr.includes(key) && value && value.length > 0) {
          newObj[key] = value.join();
        }
      });
      return newObj;
    },
    changeOptions(type, val) {
      this.formData[type] = val
    }
  }
};
</script>

<style lang="scss" scoped>
/* .search-form {
  width: auto;
  min-width: 100%;
}


::v-deep .el-date-editor .el-range-separator {
  line-height: 24px;
}

::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
  width: 100%;
}

.el-form-item {
  margin-bottom: 10px;
  margin-right: 15px;
}

.el-form-item__content .el-input-group {
  vertical-align: middle;
}

::v-deep .el-form-item__label {
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576c;
} */
@import url('../../../style/form.scss');
  .dataForm {
    flex: 1;
  }
  .expans-more {
    margin-left: 15px;
    cursor: pointer;
    font-size: 10px;
    color: #0D1126;
  }

  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-form-item__label{
    font-family: PingFang SC;
    font-weight: 500;
    color: #56576C;
  }

  .el-form-item{
   width: 100%;
   margin-bottom: 15px;
  }

  ::v-deep .el-form-item__content{
    width: calc(100% - 156px);
    text-align: left;
  }

  ::v-deep .el-select {
    width: calc(100%);
  }

  ::v-deep .el-select>.el-input{
    height: 32px;
  }

  ::v-deep .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
    width:100%;
  }
</style>
