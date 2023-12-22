<template>
  <!-- 班组库表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="155px"
    >
      <row-layout title="班组基础信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" label="班组长：" prop="teamLeader">
          <el-input class="business-input" v-model="dataForm.teamLeader" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="contactTel" label="联系电话：">
          <el-input type="number" v-model="dataForm.contactTel" size="small" placeholder="请输入" :disabled="disableStatus('contactTel')" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="身份证号：" prop="idCard">
          <el-input class="business-input" v-model="dataForm.idCard" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="籍贯：" prop="nativePlace">
          <el-input class="business-input" v-model="dataForm.nativePlace" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="payrollAccountNumber" label="代发工资账号：">
          <el-input type="number" v-model="dataForm.payrollAccountNumber" size="small" placeholder="请输入" :disabled="type!=='detail'?false:true" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="是否实名：" prop="whetherRealName">
          <el-radio-group v-model="dataForm.whetherRealName" :disabled="type!=='detail'?false:true">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="recordTime" label="登记日期：">
          <el-date-picker v-model="dataForm.recordTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="type!=='detail'?false:true" placeholder="选择日期时间"></el-date-picker>
          <!-- <el-date-picker v-model="dataForm.recordTime" value-format="yyyy-MM-dd" type="date" :disabled="type!=='detail'?false:true" placeholder="选择日期"></el-date-picker> -->
        </el-form-item>
        <!-- <el-form-item slot="col_3" prop="payrollAccountBank" label="代发工资开户行：">
          <template slot-scope="scope">
            <selector-dialog :model-data="payrollAccountBank" :value="dataForm.payrollAccountBank || msgTip.SELECT_PLACEHOLDER" dynamic-model="customDialog" :disabled="type!=='detail'?false:true" @updateValue="updateBaseBankValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-form-item> -->
        <el-form-item slot="col_3" prop="payrollAccountBank" label="代发工资开户行：">
          <el-input v-model="dataForm.payrollAccountBank" size="small" placeholder="请输入" :disabled="disableStatus('payrollAccountBank')" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="teamGrade" label="班组评级：">
          <el-radio-group v-model="dataForm.teamGrade" :disabled="type!=='detail'?false:true">
            <el-radio label="0">A优秀</el-radio>
            <el-radio label="1">B合格</el-radio>
            <el-radio label="2">C预警</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="isblacklist" label="是否进入黑名单：">
          <el-radio-group v-model="dataForm.isblacklist" :disabled="type!=='detail'?false:true">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="家庭住址：" prop="familyAddress">
          <el-input class="business-input" v-model="dataForm.familyAddress" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="emergencyContactpsn" label="紧急联系人：">
          <el-input v-model="dataForm.emergencyContactpsn" :disabled="disableStatus('emergencyContactpsn')" size="small" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_2" prop="relation" label="关系：">
          <el-input v-model="dataForm.relation" size="small" placeholder="请输入" :disabled="disableStatus('relation')" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" prop="emergencyContactpsnPhone" label="紧急联系人电话：">
          <el-input type="number" v-model="dataForm.emergencyContactpsnPhone" :disabled="disableStatus('emergencyContactpsnPhone')" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
      </row-layout><row-layout :cols="3">
        <el-form-item slot="col_1" prop="capitalCushionCapacity" label="垫资能力(元)：">
          <!-- <el-input v-model="capitalCushionLow" size="small" placeholder="请输入" :disabled="disableStatus('capitalCushionLow')" class="advanceFund" @input="numInput('capitalCushionLow')"/>&nbsp;——&nbsp; -->
          <!-- <el-input v-model="capitalCushionHigh" size="small" placeholder="请输入" :disabled="disableStatus('capitalCushionHigh')" class="advanceFund" @input="numInput('capitalCushionHigh')"/> -->
          <amount-input v-model="capitalCushionLow" defaultValue placeholder="请输入" class="advanceFund" :disabled="disableStatus('capitalCushionLow')"></amount-input>&nbsp;——&nbsp;
          <amount-input v-model="capitalCushionHigh" defaultValue placeholder="请输入" class="advanceFund" :disabled="disableStatus('capitalCushionHigh')"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="underTakeProjectCostRange" label="承接项目造价范围(元)：">
          <!-- <el-input v-model="projectCostLow" size="small" placeholder="请输入" :disabled="disableStatus('projectCostLow')" class="advanceFund" @input="numInput('projectCostLow')"/>&nbsp;——&nbsp; -->
          <!-- <el-input v-model="projectCostHigh" size="small" placeholder="请输入" :disabled="disableStatus('projectCostHigh')" class="advanceFund" @input="numInput('projectCostHigh')"/> -->
          <amount-input v-model="projectCostLow" defaultValue placeholder="请输入" class="advanceFund" :disabled="disableStatus('projectCostLow')"></amount-input>&nbsp;——&nbsp;
          <amount-input v-model="projectCostHigh" defaultValue placeholder="请输入" class="advanceFund" :disabled="disableStatus('projectCostHigh')"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="depositpa" label="已交保证金(元)：">
          <!-- <el-input type="number" v-model="dataForm.depositpa" size="small" placeholder="请输入" :disabled="disableStatus('contactPersonTel')" maxlength="20" /> -->
          <amount-input v-model="dataForm.depositpa" defaultValue placeholder="请输入" :disabled="disableStatus('depositpa')"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="excelOrSimilarProject" label="擅长或类似项目：">
          <el-input class="business-input" v-model="dataForm.excelOrSimilarProject" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="班组工种：" prop="teamWorkType">
          <el-input class="business-input" v-model="dataForm.teamWorkType" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
        <el-form-item slot="col_3" label="启用状态：" prop="enableState">
          <el-radio-group v-model="dataForm.enableState" :disabled="disableStatus('enableState')">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="recommendedUnit" label="推荐单位：">
          <el-radio-group v-model="dataForm.recommendedUnit" :disabled="type!=='detail'?false:true">
            <el-radio label="0">项目</el-radio>
            <el-radio label="1">外部</el-radio>
            <el-radio label="2">内部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2"  prop="referrer" label="推荐人：">
          <el-input v-model="dataForm.referrer" :disabled="disableStatus('referrer')" size="small" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_3" prop="referrerPhone" label="推荐人电话：">
          <el-input type="number" v-model="dataForm.referrerPhone" :disabled="disableStatus('referrerPhone')" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="blacklistStatus" label="黑名单状态：">
          <el-checkbox v-model="dataForm.blacklistStatus" true-label='1' false-label='0' :disabled="disableStatus('blacklistStatus')"></el-checkbox>
        </el-form-item>
        <el-form-item slot="col_2" prop="confirmTeamGrade" label="确认班组评级：" :disabled="type!=='detail'?false:true">
          <el-radio-group v-model="dataForm.confirmTeamGrade">
            <el-radio label="0">A优秀</el-radio>
            <el-radio label="1">B合格</el-radio>
            <el-radio label="2">C黑名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="confirmTeamWorkType" label="确认班组工种：">
          <el-input class="business-input" v-model="dataForm.confirmTeamWorkType" :disabled="type!=='detail'?false:true" clearable></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="memo" label="备注：">
          <el-input v-model="dataForm.memo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="type!=='detail'?false:true" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'身份证正反面'">
        <el-form-item slot="col_1" prop="fileInfoList" label="身份证文件：">
          <update-files v-model="dataForm.fileInfoList" :accept="accept" :tip="tip" :isReadOnly="type!=='detail'?false:true"></update-files>
        </el-form-item>
      </row-layout>
      <form-title :title="'工人列表'"></form-title>
      <div>
        <el-button type="primary" size="small" :disabled="type!=='detail'?false:true" @click="addTeamList">新增</el-button>
      </div>
      <el-table :data="dataForm.baseLaborTeamEmployeeList" class="f2bpmui-datagrid-vuetable" border> 
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="工人姓名" prop="workerName">
          <template slot-scope="scope">
            <el-input v-model="scope.row.workerName" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="人员类型" prop="personnelType">
          <template slot-scope="scope">
            <el-input v-model="scope.row.personnelType" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="工种" prop="workType">
          <template slot-scope="scope">
            <el-input v-model="scope.row.workType" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idCard">
          <template slot-scope="scope">
            <el-input v-model="scope.row.idCard" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="type!=='detail'?false:true" @click="delTeamList(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制人部门：">
            <label class="label-style">{{dataForm.deptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <label class="label-style">{{ dataForm.createTime}}</label>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="type!=='add'">
        <el-form-item slot="col_1" prop="lastModifyUserId" label="修改人：">
          <label class="label-style">{{dataForm.lastModifyUserId}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="lastModifyDeptName" label="修改人部门：">
            <label class="label-style">{{dataForm.lastModifyDeptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="lastModifyTime" label="修改时间：">
          <label class="label-style">{{ dataForm.lastModifyTime}}</label>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import CascSelect from '@/components/basic/cascSelect/index.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';   // 上传附件
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { saveTeam, updateTeam, getTeamDetail } from '@/Api/supplier/index';
import moment from 'moment'

import comMixin from '../minix';
import {
    FJiaFang_MODEL
  } from '@/views/businessModule/enum/param';

//必填字段 先全部加载
const requiredArray = ['teamLeader', 'contactTel'];
//编辑  不可以修改的字段
let readonlyFiled = {
  createUserName: true, //编制人
  deptName: true, //编制人部门
  operateUser: true, //操作人
  lastModifyUserId: true, //修改人
  lastModifyDeptName: true, //修改人部门
  lastModifyTime: true //修改时间
};
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();  // 用户信息
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
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
      dialogModel: FJiaFang_MODEL,  //跟进人 甲方弹窗
      checkedBoxGroup: [],
      otherGiveReasonStatus:false,
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        teamLeader:'',  // 班组长
        contactTel:'',  // 联系电话
        idCard:'',  // 身份证号 
        nativePlace:'',  // 籍贯
        payrollAccountNumber:'',  // 代发工资账号
        whetherRealName:'',   // 是否实名
        recordTime:'',   // 登记日期
        payrollAccountBank:'',   // 代发工资开户行
        teamGrade:'',   // 班组评级
        isblacklist:'',   // 是否进入黑名单
        familyAddress:'',   // 家庭住址
        emergencyContactpsn:'',   // 紧急联系人
        relation:'',   // 关系
        emergencyContactpsnPhone:'',   // 紧急联系人电话
        capitalCushionCapacity:'',   // 垫资能力(元)
        underTakeProjectCostRange: '',   // 承接项目造价范围(元)
        depositpa: '',   // 已交保证金(元)
        excelOrSimilarProject:'',   // 擅长或类似项目
        teamWorkType:'',   // 班组工种
        recommendedUnit:'',  // 推荐单位
        referrer:'',  // 推荐人
        referrerPhone:'',  // 推荐人电话
        blacklistStatus: '0',  // 黑名单状态
        memo:'',  // 备注
        fileInfoList:[],  // 身份证文件
        baseLaborTeamEmployeeList: [], // 班组库 工人列表
        createUserName:'',  // 编制人
        deptName:'',  // 编制人部门
        createTime:'',  // 编制时间
        lastModifyUserId:'',  // 修改人
        lastModifyDeptName:'',  // 修改人部门
        lastModifyTime:'',  // 修改时间
        confirmTeamGrade: '', // 确认班组评级
        confirmTeamWorkType: '', // 确认班组工种 
      },
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      capitalCushionLow: '',    // 垫资能力(元) - 最低
      capitalCushionHigh: '',   // 垫资能力(元) - 最高
      projectCostLow: '',    // 承接项目造价范围(元) - 最低
      projectCostHigh: '',   // 承接项目造价范围(元) - 最高
      payrollAccountBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      // 文件格式限制
      accept: {
        type: String,
        default: '.ppt,.jpg,.png,.jpeg'
      },
      // 提示语
      tip: {
        type: String,
        default: '只支持.ppt,.jpg,.png,.jpeg'
        // default: '只支持.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql,.ofd文件格式'
      },
    }
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
  },
  mounted() {
    if (this.type === 'add'){
      this.getUserInfo(); 
    } 
  },
  methods: {
    getUserInfo() {
      // this.dataForm.createUserId = userId;
      this.dataForm.createUserName = decodeURIComponent(realName);
      // this.dataForm.deptId = orgId;
      this.dataForm.deptName = decodeURIComponent(orgName);
      this.dataForm.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    beforeInit() {
    },
    afterInit() {
      if (this.dataForm.capitalCushionCapacity){   // 垫资能力范围
        this.capitalCushionLow= this.dataForm.capitalCushionCapacity.split('-')[0];
        this.capitalCushionHigh= this.dataForm.capitalCushionCapacity.split('-')[1];
      }
      if (this.dataForm.underTakeProjectCostRange){   // 承接项目造价范围
        this.projectCostLow= this.dataForm.underTakeProjectCostRange.split('-')[0];
        this.projectCostHigh= this.dataForm.underTakeProjectCostRange.split('-')[1];
      }
      // if(this.isEdit){    // 修改人
      if(this.type !== 'add'){
        this.dataForm.lastModifyUserId = decodeURIComponent(realName);  
        this.dataForm.lastModifyDeptName = decodeURIComponent(orgName);
        this.dataForm.lastModifyTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    //  垫资能力-最低值
    numInput(field) {
      if (!this[field]) {
        this[field] = '';
        return
      }
      this[field] = this[field].replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
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
     * 添加班组库 工人列表
     */
    addTeamList() {
      if (!this.dataForm.baseLaborTeamEmployeeList){
        this.dataForm.baseLaborTeamEmployeeList = [];
      } 
      this.dataForm.baseLaborTeamEmployeeList.push({
        workerName: '',  // 工人姓名
        personnelType: '',  // 人员类型
        workType: '',  // 工种
        idCard: '',  //	身份证号
      })
    },
    /**
     * 删除工人列表
     */
    delTeamList(index) {
      this.dataForm.baseLaborTeamEmployeeList.splice(index, 1)
    },
    /**
     * 银行类别
     */
    updateBaseBankValue(data, index) {
      this.$set(this.dataForm.detailPOList[index], 'bankId', data[0].id)
      this.$set(this.dataForm.detailPOList[index], 'bankName', data[0].name)
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
      if(this.capitalCushionLow && this.capitalCushionHigh){  // 垫资能力范围
        dataForm.capitalCushionCapacity = [this.capitalCushionLow,this.capitalCushionHigh].join('-'); 
      }
      if(this.projectCostLow && this.projectCostHigh){  // 承接项目造价范围
        dataForm.underTakeProjectCostRange = [this.projectCostLow,this.projectCostHigh].join('-'); 
      }
      let { code } =  this.isEdit ? await updateTeam(dataForm) : await saveTeam(dataForm);
      if (code === 200) {
        this.$message.success(`${this.isEdit ? '修改' : '新增'}成功`);
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import url('../../style/form.scss');

.commponent-height{
   height: 32px;
   line-height: 32px;
}

.el-upload__prompt{
    color: #F56C6C;
    font-size: 14px;
    font-weight: normal;
    line-height: 25px;
  }

::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}

.other-give-reason{
  width: 350px;
  margin-left: 8px;
}
.el-input.advanceFund{
  width: 45%;
}
</style>
