<template>
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="200px"
      class="new-data-form-css"
    >
      <row-layout :title="'填报情况汇总'" :cols="3">
        <el-form-item slot="col_1" prop="constructUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="currentPeriod" label="所属月份：">
            <el-date-picker v-model="dataForm.currentPeriod" value-format="yyyy-MM" type="month" placeholder="选择月份" clearable></el-date-picker>
          </el-form-item>
        <el-form-item slot="col_3" :prop="setProp('requireReportProjectNum')" label="需报产值项目数：">
          <el-input v-model="dataForm.requireReportProjectNum" size="small" placeholder="请输入" :disabled="disableStatus('requireReportProjectNum')" maxlength="18" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="reportedProjectNum" label="已报产值项目数：">
          <el-input v-model="dataForm.reportedProjectNum" size="small" placeholder="请输入" :disabled="disableStatus('reportedProjectNum')" maxlength="18" />
        </el-form-item>
        <el-form-item slot="col_2" prop="reportRate" label="产值填报率：">
          <el-input v-model="dataForm.reportRate" size="small" placeholder="请输入" :disabled="disableStatus('reportRate')" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_3" :prop="setProp('reportInNum')" label="填报中项目数：">
          <el-input v-model="dataForm.reportInNum" size="small" placeholder="请输入" :disabled="disableStatus('reportInNum')" maxlength="18" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" :prop="setProp('unreportedProjectNum')" label="未报产值项目数：">
          <el-input v-model="dataForm.unreportedProjectNum" size="small" placeholder="请输入" :disabled="disableStatus('unreportedProjectNum')" maxlength="18" />
        </el-form-item>    
        <el-form-item slot="col_2" prop="" label="">
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout>
      <div class="form-text">
        <form-title :title="'项目填报明细'">
        </form-title>
        <el-button type="primary" size="small" class="export-text" @click="exportOutputValue">导出</el-button>
      </div>
      <!-- <el-button type="primary" size="small" class="export-text" @click="exportOutputValue">导出</el-button> -->
      <!-- <div>
        <el-button type="primary" size="small" @click="addOutputValue" :disabled="type!=='detail'?false:true">新增</el-button>
      </div> -->

      <el-table :data="tableData" class="f2bpmui-datagrid-vuetable" border :disabled="disableStatus('outputValueCompleteDetailList')">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="项目编号">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.constructCode" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.constructName" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="产值填报单号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.contractOutputCode" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="编制人">
          <template slot-scope="scope">
            <el-input v-model="scope.row.createUserName" :disabled="type!=='detail'?false:true"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单据状态">
          <template slot-scope="scope">
            <el-input v-model="scope.row.procInstState" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="type!=='detail'?false:true" @click="delOutputValue(scope.$index)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table> 
      <d3Pagination :sourceData="dataForm.outputValueCompleteDetailList" ref="d3Pagination" v-model="tableData" />
      <!-- <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList" :disabled="disableStatus('fileInfoList')"></update-files>
        </el-form-item>
      </row-layout> -->
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：">
          <span>{{ dataForm.createUserName }}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：">
          <span>{{ dataForm.deptName }}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：">
          <span>{{ dataForm.createTime }}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { saveOutputValue, updateOutputValue, getOutputDetail, exportOutputComplete } from '@/Api/supplier/index';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import d3Pagination from "@/components/basic/pagination/index.vue";
//编辑  不可以修改的字段
let readonlyFiled = {
  createUserName: true, // 编制人
  deptName: true, // 编制人部门
  createTime: true, // 编制时间
};
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();  // 用户信息
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput, cascSelect, updateFiles, d3Pagination },
  mixins: [comMixin],
  props: {
    type: {
      type: String,
      default: ""
    },
    rowData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      tableData: [], 
      dataForm: {
        constructUnitName: '',   // 管理部门 
        currentPeriod: '',   // 所属月份
        requireReportProjectNum: '',  // 需报产值项目数
        reportedProjectNum: '',  // 已报产值项目数
        reportRate: '',  // 产值填报率
        reportInNum: '',  // 填报中项目数
        unreportedProjectNum: '',  // 未报产值项目数
        outputValueCompleteDetailList: [],  // 项目填报明细数据
        // contractOutputValueCompleteMainId: '',  // 产值填报完成情况主键id
        fileInfoList: [], // 附件文件
        createUserName: true, // 编制人
        deptName: true, // 编制人部门
        createTime: true, // 编制时间
      },
      keepData: [],   
      // keepData: [{id: "1701510079726542849", isDel: 0, contractOutputValueCompleteMainId: "1701510079500050434"}],
      companyType: '',
      remark:'',
      industryCategory: { code: 'customer_type', customDialog: 'customer_type', isSetHead: 1, isMulti: false, initailData: [] },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: {
        constructUnitName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
      },
      form: {
        modifyReason: ''
      }
    };
  },
  watch: {
  },
  computed: {
    //判断状态
    disableStatus({ type }) { 
      return (text) => {
        if (type === 'add' && !readonlyFiled[text]) {
          return false;
        } else if (type == 'edit') {
          return readonlyFiled[text] ? readonlyFiled[text] : false;
        } else if (type == 'detail') { 
          return true;
        }
      }
    },
    //判断是否是编辑状态
    isEdit({ type }) {
      return type == 'edit' ? true : false;
    },
    isRequired() {
      if (this.dataForm.companyType === '1') {
        return [{ required: false }]
      }
      return [{ required: true, message: '必填项不能为空', trigger: ['blur', 'change'] }];
    },
  },
  mounted() {
    const {outputValueCompleteDetailList} = this.dataForm;
    if(outputValueCompleteDetailList.length){
      this.dataForm.outputValueCompleteDetailList.forEach(el => {  // getRowStatus(scope.row.procInstState)
        el.procInstState = this.getRowStatus(el.procInstState) || '';
      })
    }
  },
  methods: {
    beforeInit() {
    },
    afterInit(){
    },
    handleClick(val) {
      console.log('xxx', val)
    },
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'corporateName', 'customerStatus'])
    },
    openDialogVisible() {
      this.dialogVisible = true;
      this.form.modifyReason = ''
    },
    handleClose() {
    },
    submitForm() {
      this.dataForm.modifyReason = this.form.modifyReason;
      this.dialogVisible = false;
    },
    /**
     * 切换地址
     */
    changeAreaId(data) {
      this.dataForm.areaId = data.value
      this.$refs['dataForm'].clearValidate('areaId')
    },
    // 导出项目填报明细
    async exportOutputValue(){
      const {id, outputValueCompleteDetailList} = this.dataForm;
      // 查看时记录产值填报完成情况主键id，作为导出项目填报明细的参数
      let params = {contractOutputValueCompleteMainId: id || (outputValueCompleteDetailList[0].contractOutputValueCompleteMainId)};
      await exportOutputComplete(params);
    },
    // 项目填报明细表，行数据状态
    getRowStatus(status) {
      switch (status) {
        case '1':
          return '草稿'
          break
        case '2':
          return '审批中'
          break
        case '3':
          return '已完成'
          break
        case '5':
          return '驳回发起人'
          break
        case '99':
          return '已作废'
          break
      }
      return ''
    },
    /**
     * 删除项目填报明细
     */
    delOutputValue(index) {
      this.dataForm.outputValueCompleteDetailList.splice(index, 1)
    },
    /**
     * 行业类别
     */
    updateValue(data) {
      if (data.length > 0) {
        this.dataForm.industryCategoryId = data[0].id;
        this.dataForm.industryCategory = data[0].name;
      }
    },
    /**
     * 企业类型为-政府机构/国有事业时，不必填，否则编制人必填
     * @param {*} fieldName
     */
    setProp(fieldName) {
      if (this.dataForm.companyType === '1' || this.dataForm.companyType === '2') {
        return 'noRequired'
      }
      return fieldName;
    },
    afterInit() {
    },
    validateForm() {
      const _this = this
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
           _this.saveForm(_this.dataForm);
          }
        })
    },
    async saveForm(dataForm) {
      dataForm.id = this.isEdit ? this.rowData.id : '';
      let { code } =  this.isEdit ? await updateOutputValue(dataForm) : await saveOutputValue(dataForm);
      if (code === 200) {
        this.$message.success(`${this.isEdit ? '修改' : '新增'}成功`);
        this.$router.go(-1)
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}
.form-text{
  position: relative;
}
.export-text{
  position: absolute;
  right: 30px;
  top: 0px;
}
</style>
