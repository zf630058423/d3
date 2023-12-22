<template>
  <!-- 项目送审表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <row-layout title="项目信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="dialogCode" @updateValue="codeUpdate" 
          :value="dataForm.constructArchiveMainCode" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructArchiveMainName" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_2" prop="projectManagerName" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_3" prop="submissionTotalAmount" label="送审金额(元)：">
          <amount-input v-model="dataForm.submissionTotalAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout title="送审信息" :cols="3">
        <el-form-item slot="col_1" prop="contractInMainCode" label="收入类合同编号：">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="incomeCode" 
          :value="dataForm.contractInMainCode" @updateValue="incomecodeUpdate" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="contractInMainName" label="收入类合同名称：">
          <el-input v-model="dataForm.contractInMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_3" prop="contractTotalAmount" label="合同总金额(元)：">
          <el-input type="number" v-model="dataForm.contractTotalAmount" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="expectedApprovalDate" label="预计审定日期：">
          <el-date-picker v-model="dataForm.expectedApprovalDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="getDisabledField('expectedApprovalDate')"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="actualCommencementDate" label="实际开工日期：">
          <el-date-picker v-model="dataForm.actualCommencementDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="actualCompletionDate" label="实际竣工日期：">
          <el-date-picker v-model="dataForm.actualCompletionDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionSubmissionAmount" label="施工送审金额(元)：" :rules="[{required:dataForm.moduleType==='1',trigger:'blur'}]">
          <amount-input v-model="dataForm.constructionSubmissionAmount" defaultValue placeholder="请输入" :disabled="disabledVal()" clearable></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="salesSubmissionAmount" label="销售送审金额(元)：" :rules="[{required:dataForm.moduleType==='3',trigger:'blur'}]">
          <amount-input v-model="dataForm.salesSubmissionAmount" defaultValue placeholder="请输入" :disabled="disabledVal()" clearable></amount-input>
        </el-form-item>
        <!-- <el-form-item slot="col_3" prop="otherSubmissionAmount" label="其他送审金额(元)：">
          <el-input v-model="dataForm.otherSubmissionAmount" size="small" placeholder="请输入" maxlength="20" @input="numInput('otherSubmissionAmount')" :disabled="dataForm.id?true:false"/>
        </el-form-item> -->
        <el-form-item slot="col_3" prop="designSubmissionAmount" label="设计送审金额(元)：" :rules="[{required:dataForm.moduleType==='2',trigger:'blur'}]">
          <amount-input v-model="dataForm.designSubmissionAmount" defaultValue placeholder="请输入" :disabled="disabledVal()" clearable></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="是否变更过金额：" prop="isChangeAmount">
          <el-radio-group v-model="dataForm.isChangeAmount" :disabled="disabledVal()">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item slot="col_3" prop="afterChangeAmount" label="变更后金额(元)：" v-show="dataForm.isChangeAmount==='1'">
          <el-input type="number" v-model="dataForm.afterChangeAmount" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item> -->
        <el-form-item slot="col_2" prop="afterChangeAmount" label="变更后金额(元)：" :rules="[{required:isMust,trigger:'blur'}]">
          <!-- <el-input type="number" v-model="dataForm.afterChangeAmount" size="small" placeholder="请输入" maxlength="20" :disabled="dataForm.isChangeAmount!=='1'"/> -->
          <amount-input v-model="dataForm.afterChangeAmount" defaultValue placeholder="请输入" :disabled="dataForm.isChangeAmount!=='1'"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="warrantyStartDate" label="质保期起始日期：">
          <el-date-picker v-model="dataForm.warrantyStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="warrantyEndDate" label="质保期结束日期：">
          <el-date-picker v-model="dataForm.warrantyEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'附件'" class="required-tag">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
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
import service from "@/utils/services";
import moment from 'moment'

import comMixin from '../minix';
import {
    XiangMuDangAnProjectSubmission_MODEL, ShouRuLeiHeTongBianHaoProjectSubmission_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['constructArchiveMainCode', 'submissionTotalAmount', 'expectedApprovalDate', 'actualCommencementDate',
  'actualCompletionDate', 'isChangeAmount', 'warrantyStartDate', 'warrantyEndDate', 'fileInfoList'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor(); 
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      dialogCode: XiangMuDangAnProjectSubmission_MODEL, 
      // incomeCode: ShouRuLeiHeTongBianHaoProjectSubmission_MODEL,  // 收入类合同编号 弹窗
      incomeCode:{ code: 'ShouRuLeiHeTongBianHaoProjectSubmission', customDialog: 'ShouRuLeiHeTongBianHaoProjectSubmission', isSetHead: 1, isShowLink:true, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      otherGiveReasonStatus:false,
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        constructArchiveMainCode:'',  // 项目编号
        constructArchiveMainId:'',  // 项目编号主表id 必传
        constructArchiveMainName:'',  // 项目名称
        constructionUnitName:'',  // 管理部门
        projectManagerName:'',  // 项目负责人
        submissionTotalAmount: this.submissionTotalAmount,  // 送审金额(元)
        contractInMainCode:'',  // 收入类合同编号
        contractInMainId:'',  // 	收入类合同主表id 必传
        contractInMainName:'',  // 收入类合同名称
        contractTotalAmount:'',  // 合同总金额(元)
        moduleType:'',  // 合同类型
        expectedApprovalDate: moment(new Date()).format('YYYY-MM-DD'), // 预计审定日期 默认当天 
        actualCommencementDate:'',  // 实际开工日期
        actualCompletionDate:'',  // 实际竣工日期
        constructionSubmissionAmount:'',  // 施工送审金额(元)
        salesSubmissionAmount:'',  // 销售送审金额(元)
        // otherSubmissionAmount:'',  // 其他送审金额(元)
        designSubmissionAmount:'',  // 设计送审金额(元)
        isChangeAmount:'',  // 是否变更过金额
        afterChangeAmount:'',  // 变更后金额(元)
        warrantyStartDate: moment(new Date()).format('YYYY-MM-DD'),  // 质保期起始日期 默认当天
        warrantyEndDate:'',  // 质保期结束日期
        remark: '',  // 备注
        fileInfoList: [],  // 附件文件
        createUserId:'', 
        createUserName:'',  //编制人
        deptName:'',  //编制人部门
        createTime:'',  //编制时间
      },
      dateOrignalType:1,  //1 营销立项  2 预选承包商入库  3：投标文件评审  4： 标前评审
      resultStateStatus: true,  //是否已出结果是否显示
      // estimateResultDateStatus: true,  //预计出结果日期 显示
      reviewResultStatus: false,  //评审结果 默认不展示
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      // isMenu: false,
      isMust: false,
      disabledFiled: {
        // 'bidDateOriginal':true,  // 原预估投标时间 营销立项
        'expectedApprovalDate': false, // 预计审定日期
        'actualCommencementDate': false,  // 实际开工日期
        'actualCompletionDate': false, // 实际竣工日期
        'constructionSubmissionAmount': false,  // 施工送审金额(元)
        'salesSubmissionAmount': false,  // 销售送审金额(元)
        'designSubmissionAmount': false, // 设计送审金额(元)
        'isChangeAmount': false, // 是否变更过金额
        'warrantyStartDate': false, // 质保期起始日期
        'warrantyEndDate': false, // 质保期结束日期
        'remark': false, // 备注
      },
      nodeId: '',  //当前节点名称
      nodeName: '',  //当前节点名称
      // nodeStatus: 0,  //当前节点状态
    }
  },
  computed: {
    //预计出结果日期  是否已出结果显示并且为未出结果时 显示预计出结果日期 是否已出结果 为“未出结果”时显示否则隐藏，且审批环节“跟进人”必须填写
    estimateResultDateStatus() { 
      return (this.resultStateStatus && this.dataForm.resultState == 0) ? true : false; 
    },
    submissionTotalAmount() {  // 送审金额(元)
      const {constructionSubmissionAmount, salesSubmissionAmount, designSubmissionAmount} = this.dataForm;
      return Number(constructionSubmissionAmount)+Number(salesSubmissionAmount)+Number(designSubmissionAmount);
    }, 
    getDisabledField() { 
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    }, 
  },
  watch: {  
    'dataForm.isChangeAmount':{  // 当是否变更过金额=是时，变更后金额显示，编制人必填；当是否变更过金额=否时，不显示；
      handler(newValue){
        this.isMust = (newValue === '1' ? true : false);
        if(newValue==='1'){
          this.dataForm.afterChangeAmount = '';
        }
        if(newValue==='2'){
          this.dataForm.afterChangeAmount = 0;
        }
      },
      deep:true,
    },
    'submissionTotalAmount':{
      handler(newValue){
        this.dataForm.submissionTotalAmount = newValue;
      },
    },
    // 'dataForm.constructArchiveMainId':{  
    //   handler(newValue){
    //     if(newValue){
    //       this.queryContractInMain(newValue);
    //     }
    //   },
    // },
  },
  methods: {
    // 项目编号update 
    codeUpdate(data){ 
      this.dataForm.constructArchiveMainId = data[0].id; // id
      this.dataForm.constructArchiveMainCode = data[0].code;
      this.dataForm.constructArchiveMainName = data[0].name;
      this.dataForm.constructionUnitName = data[0].constructionunitname;
      this.dataForm.projectManagerName = data[0].projectmanagername;
      // updateMasterContractValue 根据项目编号过滤 收入类合同编号 弹框数据
      this.incomeCode.parm.varParams[0].value = data[0].id;
      this.queryContractInMain(this.dataForm.constructArchiveMainId);
    },
    // 收入类合同编号update 
    incomecodeUpdate(data){ 
      this.dataForm.contractInMainId = data[0].id; // constructArchiveMainId
      this.dataForm.contractInMainCode = data[0].code;
      this.dataForm.contractInMainName = data[0].name;
      this.dataForm.contractTotalAmount = data[0].contracttotalamount;
      this.dataForm.moduleType = data[0].moduleType; // 合同类型
    },
    // 根据项目id查询收入类主合同 
    queryContractInMain(constructArchiveMainId){
      let params = {constructArchiveMainId: constructArchiveMainId};
      const headers = {"Content-Type": "application/json; charset=utf-8"};
      service.post(`/contract/contractProjectAuthorizeMain/queryContractInMain`, params, headers).then(res => {
        const {code, data} = res;
        if (code === 200) {
          if(data.length){
            console.log(data[0], 'data[0]')
            this.dataForm.contractInMainId = data[0].id;
            this.dataForm.contractInMainCode = data[0].code;
            this.dataForm.contractInMainName = data[0].name;
            this.dataForm.contractTotalAmount = data[0].contracttotalamount;
            this.dataForm.moduleType = data[0].moduleType; // 合同类型
            // 日期自动带出
            this.dataForm.actualCommencementDate = data[0].actualCommencementDate; 
            this.dataForm.actualCompletionDate = data[0].actualCompletionDate; 
            this.dataForm.warrantyStartDate = data[0].warrantyStartDate; 
            this.dataForm.warrantyEndDate = data[0].warrantyEndDate; 
          }
        }
      }).catch(err=>{
        // FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    beforeInit() {
      this.dataRule['restartReason'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
        let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
        let len = escape(value).replace(/%u\w{2}/g, "").length;
        if (len >= 8 && len <= 800 && pattern.test(value)) {
          callbacak();
        } else {
          callbacak(new Error('至少输入4个字，最多400字'));
        }
       });
    },
    //获取详情后的赋值情况
    afterInit() {
      // console.log(this.dataForm,this.dataForm.createUserId,userId,'createUserId','userId')
      console.log(WFContext,'WFContext');
      //如果不是提单环节 不可编辑
      if (WFContext.CurrentActivityName !== '提单') {
        //是否跟进非必填
        Object.keys(this.disabledFiled).forEach(key => { 
          this.disabledFiled[key] = true;
        })
      }
      // 流程状态判断
      // this.nodeStatus = WFContext.WorkflowInstinceState; // 0：拟稿  1：草稿 2：审批中 3：审批完成
      //获取当前审批节点
      this.nodeId = WFContext.CurrentActivityId;
      // this.nodeName = WFContext.CurrentActivityName;  // CurrentActivityName: 提单"/"项目负责人"
      //判断是否有审批按钮
      const approveStatus = (this.pageBaseInfo && (this.pageBaseInfo.buttons||[]).some(btn => btn.buttonName === '审批'));
      if (approveStatus && (this.nodeId === userId)) {  // 审批中2，审批人才可以编辑
        this.disabledFiled['expectedApprovalDate'] = false; 
        this.disabledFiled['actualCommencementDate'] = false; 
      }
      
    },
    // 送审金额 保留两位小数
    numInput(field) {
      if (!this[field]) {
        this[field] = '';
        return
      }
      this[field] = this[field].replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
    },
    disabledVal(){
      const { id, createUserId, procInstState} = this.dataForm;
      var type = Object.toQueryString('type') || '';
      if(!id){
        return false;
      }else{
        // 审批中2，审批人才可以编辑 
        // 草稿状态时1，创建人能编辑；审批中查看表单，也不能编辑; 提交后被驳回到了提交人环节时，创建人可以;
        // let IsApproval = (procInstState==='2'&&createUserId);
        return (procInstState!=='3'&&procInstState!=='2'&&userId===createUserId) ? false : true;  // 流程表单(未审批完成时)查看状态可以编辑
      }
    },
    //校验至少输入4个汉字
    checkValidateInput(rule, value, callbacak) {
      let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
      let len = escape(value).replace(/%u\w{2}/g, "").length;
      if (len >= 8 && pattern.test(value)) {
        callbacak();
      } else {
        callbacak(new Error('至少输入4个汉字'));
      }
    },
    //其他 至少输入4个汉字判断
    giveupReasonRemarkStatus() { 
      let status = (this.dataForm.isFollowup == 1) ? false : true;
      if (status && this.otherGiveReasonStatus) { //如果是否跟进为放弃，并且点击了其他
        let _this = this;
        _this.dataRule['giveupReason'] = [
          ...RuleRequired.curFiledRule(true),
          ...RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
            let val = _this.dataForm.giveupReasonRemark;
            let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
            let len = escape(val).replace(/%u\w{2}/g, "").length;
            if (len >= 8 && pattern.test(val)) {
              callbacak();
            } else {
              callbacak(new Error('至少输入4个汉字'));
            }
           }, 'blur')
        ]
      }
    },
    checkboxGroupChange(e) {
      this.dataForm.giveupReason = e ? e.join(',') : '';
      this.otherGiveReasonStatus = e.includes('其他') ? true : false;
      this.giveupReasonRemarkStatus();
    },
    
    validateForm() {
        const _this = this;
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              _this.dataFromDate();
              return resolve(_this.dataForm);
            } else {
              return resolve(false)
            }
          })
        });
    },
    dataFromDate() { 
      // 项目送审 日期格式转换 
      const { createTime, expectedApprovalDate, actualCommencementDate, actualCompletionDate, warrantyStartDate, warrantyEndDate} = this.dataForm;
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.expectedApprovalDate = expectedApprovalDate ? moment(expectedApprovalDate).format('YYYY-MM-DD') : '';
      this.dataForm.actualCommencementDate = actualCommencementDate ? moment(actualCommencementDate).format('YYYY-MM-DD') : '';
      this.dataForm.actualCompletionDate = actualCompletionDate ? moment(actualCompletionDate).format('YYYY-MM-DD') : '';
      this.dataForm.warrantyStartDate = warrantyStartDate ? moment(warrantyStartDate).format('YYYY-MM-DD') : '';
      this.dataForm.warrantyEndDate = warrantyEndDate ? moment(warrantyEndDate).format('YYYY-MM-DD') : '';
      this.dataForm.createUserId = !this.dataForm.id ? userId : this.dataForm.createUserId;
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
.required-tag {
  ::v-deep .form-title {
    &::after {
      content: '*';
      color: #F56C6C;
      margin-left: 4px;
      transform: translateY(4px);
      font-size: 18px;
    }
  } 
  ::v-deep .is-required{
    .el-form-item__label{
      &::before{
        display: none;
      }
    }
  } 
}
</style>
