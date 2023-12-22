<template>
  <!-- 项目审定表单 -->
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
        <el-form-item slot="col_3" prop="authorizeTotalAmount" label="审定金额(元)：">
          <amount-input v-model="dataForm.authorizeTotalAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
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
        <el-form-item slot="col_1" prop="approvalDate" label="审定日期：">
          <el-date-picker v-model="dataForm.approvalDate" type="date" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="actualCommencementDate" label="实际开工日期：">
          <el-date-picker v-model="dataForm.actualCommencementDate" type="date" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="actualCompletionDate" label="实际竣工日期：">
          <el-date-picker v-model="dataForm.actualCompletionDate" type="date" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionAuthorizeAmount" label="施工审定金额(元)：" :rules="[{required:dataForm.moduleType==='1',trigger:'blur'}]">
          <amount-input v-model="dataForm.constructionAuthorizeAmount" defaultValue placeholder="请输入" :disabled="disabledVal()" clearable></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="salesAuthorizeAmount" label="销售审定金额(元)：" :rules="[{required:dataForm.moduleType==='3',trigger:'blur'}]">
          <amount-input v-model="dataForm.salesAuthorizeAmount" defaultValue placeholder="请输入" :disabled="disabledVal()" clearable></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="designAuthorizeAmount" label="设计审定金额(元)：" :rules="[{required:dataForm.moduleType==='2',trigger:'blur'}]">
          <amount-input v-model="dataForm.designAuthorizeAmount" defaultValue placeholder="请输入" :disabled="disabledVal()" clearable></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="warrantyStartDate" label="质保期起始日期：">
          <el-date-picker v-model="dataForm.warrantyStartDate" type="date" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="warrantyEndDate" label="质保期结束日期：">
          <el-date-picker v-model="dataForm.warrantyEndDate" type="date" placeholder="选择日期" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" label="后补项目送审：" prop="isMakeAmendsApproval">
          <el-radio-group v-model="dataForm.isMakeAmendsApproval" :disabled="dataForm.isMakeAmendsApproval!='1' ? disabledVal() : isMakeApproval">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">已走项目送审</el-radio>
          </el-radio-group>
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
import moment from 'moment';

import comMixin from '../minix';
import {
    XiangMuDangAnProjectAuthorizeMain_MODEL, ShouRuLeiHeTongBianHaoProjectSubmission_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['constructArchiveMainCode', 'authorizeTotalAmount', 'approvalDate', 'actualCommencementDate',
  'actualCompletionDate', 'warrantyStartDate', 'warrantyEndDate', 'fileInfoList'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      dialogCode: XiangMuDangAnProjectAuthorizeMain_MODEL, 
      // incomeCode: ShouRuLeiHeTongBianHaoProjectSubmission_MODEL,  // 收入类合同编号 弹窗
      incomeCode:{ code: 'ShouRuLeiHeTongBianHaoProjectSubmission', customDialog: 'ShouRuLeiHeTongBianHaoProjectSubmission', isSetHead: 1, isShowLink:true, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      otherGiveReasonStatus:false,
      dataForm: {
        // currentPeriodYear: new Date().getFullYear().toString(), // 年份
        id:'', 
        code:'',  // 单据编号
        constructArchiveMainCode:'',  // 项目编号
        constructArchiveMainId:'',  // 项目编号主表id 必传
        constructArchiveMainName:'',  // 项目名称
        constructionUnitName:'',  // 管理部门
        projectManagerName:'',  // 项目负责人
        authorizeTotalAmount: this.authorizeTotalAmount,  // 审定金额(元)
        contractInMainCode:'',  // 收入类合同编号
        contractInMainId:'',  // 	收入类合同主表id 必传
        contractInMainName:'',  // 收入类合同名称
        contractTotalAmount:'',  // 合同总金额(元)
        moduleType:'',  // 合同类型
        approvalDate: moment(new Date()).format('YYYY-MM-DD'),  // 审定日期 默认当天  
        actualCommencementDate:'',  // 实际开工日期
        actualCompletionDate:'',  // 实际竣工日期
        constructionAuthorizeAmount:'',  // 施工审定金额(元)
        salesAuthorizeAmount:'',  // 销售审定金额(元)
        designAuthorizeAmount:'',  // 设计审定金额(元)
        isMakeAmendsApproval:'',  //  后补项目送审
        // isChangeAmount:'',  // 是否变更过金额
        // afterChangeAmount:'',  // 变更后金额(元)
        warrantyStartDate:'',  // 质保期起始日期
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
      isMakeApproval: false,   // 是否已走项目送审
    }
  },
  computed: {
    authorizeTotalAmount() {  // 审定金额(元)
      const {constructionAuthorizeAmount, salesAuthorizeAmount, designAuthorizeAmount} = this.dataForm;
      return Number(constructionAuthorizeAmount)+Number(salesAuthorizeAmount)+Number(designAuthorizeAmount); 
    }, 
  },
  watch: {  
    'authorizeTotalAmount':{
      handler(newValue){
        this.dataForm.authorizeTotalAmount = newValue;
      },
    },
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
      console.log(data, '收入类合同编号');
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
      // 后补项目送审-状态判断
      this.queryContractProjectApprovalMain(this.dataForm.contractInMainId);
    },
    // 根据项目id查询收入类主合同  constructArchiveMainId
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
     // 根据收入类合同id查询是否有项目送审数据
    queryContractProjectApprovalMain(contractInMainId){
      let params = {contractInMainId: contractInMainId};
      const headers = {"Content-Type": "application/json; charset=utf-8"};
      service.post(`/contract/contractProjectAuthorizeMain/queryContractProjectApprovalMain`, params, headers).then(res => {
        const {code, data} = res;
        if (code === 200) {
          // 1-有审核通过的数据 0-没有  返回1就选中已走项目送审
          if( data=="1"){
            this.dataForm.isMakeAmendsApproval = "1";
            this.isMakeApproval = true;
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
      //根据预警阶段判断日期文字 及  校验状态
      this.bidDateLabelStatus();
      this.reviewResultJudage();  //是否显示评审结果
      console.log(this.dataForm,this.dataForm.createUserId,userId,'createUserId','userId')
    },
    disabledVal(){
      const { id, createUserId, procInstState} = this.dataForm; // procInstState: "3"  已完成
      var type = Object.toQueryString('type') || '';
      if(!id){
        return false;
      }else{
        // 审批中2，审批人才可以编辑 
        // 草稿状态时1，创建人能编辑；审批中查看表单，也不能编辑; 提交后被驳回到了提交人环节时，创建人可以;
        return (procInstState!=='3'&&procInstState!=='2'&&userId===createUserId) ? false : true;
      }
    },
    //是否显示评审结果
    reviewResultJudage() {
      const status = WFContext.WorkflowInstinceState;  //状态判断 0：拟稿  1：草稿 2：审批中 3：审批完成
      this.reviewResultStatus = (status == 3) ? true : false;  //审批完成了显示 评审结果
      this.dataRule['designerIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //设立项专员意见 必填
      this.dataRule['leaderIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //总部立项专员意见 必填
      this.dataRule['manageLeaderIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //设立项专员意见 必填
      this.dataRule['bidderIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //总部立项专员意见 必填
      this.juadgeAgree();
    },
    bidDateLabelStatus() {
      //followupStage: 预警阶段
      let { followupStage } = this.dataForm;
      this.dataFromDate();
      this.resultStateStatus = false;  //是否已出结果 默认隐藏
      if (followupStage == '营销立项') {
        this.dateOrignalType = 1;
        this.resultStateStatus = true;  //是否已出结果 仅投标文件评审显示 
        this.dataRule['bidDate'] = [  //新预估投标时间 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      } else if (followupStage == '预选承包商入库') {
        this.dateOrignalType = 2;
        this.dataRule['storeDate'] = [  //新预计入库完成日期 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      } else if (followupStage == '投标文件评审') {
        this.dateOrignalType = 3;
        this.resultStateStatus = true;  //是否已出结果 仅投标文件评审显示
      } else if (followupStage == '标前评审') {
        this.dateOrignalType = 4;
        this.dataRule['bidEndDate'] = [ //新投标截止日期 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      }
      //其他 至少输入4个汉字判断  根据是否跟进来判断
      this.giveupReasonRemarkStatus();
    },
    //新预计投标日期/预计入库完成日期，如果该项目在营销立项或者预选承包商阶段，默认展示，“是否跟进”为“跟进”时需校验不可早于当前时间
    //bidDateOriginal: 原预计投标日期, 原预计入库完成日期,原投标截止日期
    //bidEndDate: 新预计投标日期 预计入库完成日期 新投标截止日期 
    judgeDate(rule, value, callback) {
      let valDate = value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
      let { followupStage,  bidDateOriginal, storeDateOriginal, bidEndDateOriginal } = this.dataForm;  //bidEndDate： 新预计投标日期 新(现)投标截止日期
      const nowTime = myFun.getCurrentDateTimeString();  //当前时间
      //新投标截止日期
      if (followupStage == '营销立项') {
        if (valDate < nowTime) {
          callback(new Error("新预计投标日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(bidDateOriginal, valDate, 3)) {
          callback(new Error("新预计投标日期不可超过原预计投标日期后三个月"));
        }
      } else if (followupStage == '预选承包商入库') {
        if (valDate < nowTime) {
          callback(new Error("新预计入库完成日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(storeDateOriginal, valDate, 3)) {
          callback(new Error("新预计投标日期不可超过原预计入库完成日期后三个月"));
        }
       }
      else if (followupStage == '标前评审') {
        if (valDate < nowTime) {
          callback(new Error("现投标截止日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(bidEndDateOriginal, valDate, 3)) {
          callback(new Error("新投标截止日期不可超过原投标截止日期后三个月"));
        }
      }
      callback();
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
    juadgeAgree() {
      let { designerIsAgree, leaderIsAgree, manageLeaderIsAgree, bidderIsAgree } = this.dataForm;
      this.dataRule['designerRemark'] = RuleRequired.curFiledRule((designerIsAgree === '0' && this.reviewResultStatus)); //不同意原因
      this.dataRule['leaderRemark'] = RuleRequired.curFiledRule((leaderIsAgree === '0' && this.reviewResultStatus)); //总部立项专员 意见原因
      this.dataRule['manageLeaderRemark'] = RuleRequired.curFiledRule((manageLeaderIsAgree === '0' && this.reviewResultStatus)); //综合管理 不同意原因
      this.dataRule['bidderRemark'] = RuleRequired.curFiledRule((bidderIsAgree === '0'&& this.reviewResultStatus)); //投标管理 意见原因
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
      let { bidDateOriginal, bidEndDate, estimateResultDate, createTime, storeDateOriginal, bidEndDateOriginal, bidDate, storeDate } = this.dataForm; 
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      //原预估投标日期
      this.dataForm.bidDateOriginal = bidDateOriginal ? moment(bidDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //原预计入库完成日期 
      this.dataForm.storeDateOriginal = storeDateOriginal ? moment(storeDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //原投标截止日期 
      this.dataForm.bidEndDateOriginal = bidEndDateOriginal ? moment(bidEndDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //新预估投标时间 
      this.dataForm.bidDate = bidDate ? moment(bidDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //预计入库完成日期 
      this.dataForm.storeDate = storeDate ? moment(storeDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //新投标截止日期 bidEndDate
      this.dataForm.bidEndDate = bidEndDate ? moment(bidEndDate).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.estimateResultDate = estimateResultDate ? moment(estimateResultDate).format('YYYY-MM-DD HH:mm:ss') : '';
      // 项目送审 日期格式转换 
      const { approvalDate, actualCommencementDate, actualCompletionDate, warrantyStartDate, warrantyEndDate} = this.dataForm;
      this.dataForm.approvalDate = approvalDate ? moment(approvalDate).format('YYYY-MM-DD') : '';
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
