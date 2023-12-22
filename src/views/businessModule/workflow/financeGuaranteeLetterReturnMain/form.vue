<template>
  <!-- 保函收回申请表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <row-layout title="保函信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="guaranteeLetterApplyCode" label="保函申请单号：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="dialogCode" @updateValue="codeUpdate" 
          :value="dataForm.guaranteeLetterApplyCode" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <!-- <el-form-item slot="col_3" label="保函对象：" prop="guaranteeObject">
          <el-radio-group v-model="dataForm.guaranteeObject">
            <el-radio label="1">营销项目</el-radio>
            <el-radio label="2">施工项目</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item slot="col_3" prop="guaranteeType" label="保函类型：">
          <el-input v-model="dataForm.guaranteeType" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="guaranteeAmount" label="保函金额(含税)(元)：">
          <amount-input v-model="dataForm.guaranteeAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="是否退回保函原件：" prop="isReturn">
          <el-radio-group v-model="dataForm.isReturn" :disabled="disabledVal()">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout title="项目信息" :cols="3" v-if="showMarket">
        <el-form-item slot="col_1" prop="marketCode" label="立项编号：" >
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="marketCode" 
          :value="dataForm.marketCode" @updateValue="marketCodeUpdate" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketName" label="立项名称：">
          <el-input v-model="dataForm.marketName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_3" prop="marketUnitName" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
      </row-layout>
       <row-layout title="项目信息" :cols="3" v-else>
        <el-form-item slot="col_1" prop="constructCode" label="项目编号：">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="constructCode" 
          :value="dataForm.constructCode" @updateValue="constructCodeUpdate" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="constructName" label="项目名称：">
          <el-input v-model="dataForm.constructName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_3" prop="constructUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payInName" label="收款方：">
          <el-input v-model="dataForm.payInName" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInAccountName" label="收款账号：">
          <el-input v-model="dataForm.payInAccountName" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="payInBankName" label="收款银行：">
          <!-- <el-input v-model="dataForm.payInBankName" size="small" placeholder="请输入" maxlength="20" :disabled="disabledVal()"/> -->
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="baseBank" 
          :value="dataForm.payInBankName" @updateValue="updateBaseBankValue" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="invoiceBillNo" label="票据号：">
          <el-input v-model="dataForm.invoiceBillNo" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'附件'" class="required-tag">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList" :disabled="disabledVal()"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="createUserDeptName" label="编制人部门：">
            <label class="label-style">{{dataForm.createUserDeptName}}</label>
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
    BaoHanShenQingDanHao_MODEL, LiXiangBianHao_MODEL, XiangMuDangAnProjectSubmission_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['guaranteeLetterApplyCode', 'isReturn', 'constructCode', 'marketCode', 'payInName', 'fileInfoList'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      dialogCode: BaoHanShenQingDanHao_MODEL, 
      marketCode: LiXiangBianHao_MODEL,  // 立项编号 弹窗
      // marketCode:{ code: 'ShouRuLeiHeTongBianHaoProjectSubmission', customDialog: 'ShouRuLeiHeTongBianHaoProjectSubmission', isSetHead: 1, isShowLink:true, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      constructCode: XiangMuDangAnProjectSubmission_MODEL,    // 项目编号 弹窗
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      otherGiveReasonStatus:false,
      dataForm: {
        // currentPeriodYear: new Date().getFullYear().toString(), // 年份
        id:'', 
        code:'',  // 单据编号
        guaranteeLetterApplyMainId:'',  // 保函开具申请主键id
        guaranteeLetterApplyCode:'',  // 保函申请单号
        guaranteeObject:'',  //  保函对象
        guaranteeType:'',  //  保函类型
        guaranteeAmount: '',  // 保函金额(含税)(元)
        isReturn:'',     // 是否退回保函原件
        marketCode:'',  // 立项编号
        marketMainId:'',  // 营销立项主键id 必传
        marketName:'',  // 立项名称
        marketUnitName:'',  // 业务单元
        marketCenterId:'',  // 业务中心id
        constructArchiveMainId:'',  // 	项目档案主键id
        constructCode:'',  // 项目编号
        constructName:'',  // 项目名称
        constructUnitName:'',  // 管理部门
        constructionUnitId:'',  // 管理部门id
        market_main:'',  // 选择立项
        construct_archive_main:'',  // 选择项目档案
        payInName:'',  // 收款方
        payInAccountName:'',  // 收款账号
        payInBankName:'',  // 收款银行
        invoiceBillNo:'',  // 票据号
        // approvalDate: moment(new Date()).format('YYYY-MM-DD'),  // 审定日期 默认当天  
        remark: '',  // 备注
        fileInfoList: [],  // 附件文件
        createUserId:'', 
        createUserName:'',  //编制人
        createUserDeptName:'',  //编制人部门
        createTime:'',  //编制时间
      },
      dateOrignalType:1,  //1 营销立项  2 预选承包商入库  3：投标文件评审  4： 标前评审
      resultStateStatus: true,  //是否已出结果是否显示
      // estimateResultDateStatus: true,  //预计出结果日期 显示
      reviewResultStatus: false,  //评审结果 默认不展示
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      showMarket: false,   // 是否营销项目
    }
  },
  computed: {
  },
  watch: {  
  },
  methods: {
    // 保函申请单号update 
    codeUpdate(data){
      console.log(data, '保函申请单号'); 
      let {id, code, name, guaranteeType, guaranteeAmount} = data[0];
      this.dataForm.guaranteeLetterApplyMainId = id; 
      this.dataForm.guaranteeLetterApplyCode = code;
      // this.dataForm.guaranteeObject = name;
      this.showMarket = guaranteeType=='1' ? true : false; // 显示立项编号||项目编号
      this.dataForm.guaranteeType = this.getGuaranteeType(guaranteeType);
      this.dataForm.guaranteeAmount = guaranteeAmount;
      // this.dataForm.isReturn = this.isReturnState(isReturn);
    },
    // 立项编号update 
    marketCodeUpdate(data){ 
      console.log(data, '立项编号');
      this.dataForm.marketMainId = data[0].id;
      this.dataForm.market_main = data[0].id; // 选择立项
      this.getAutomaticData(this.dataForm.marketMainId);
      this.dataForm.constructArchiveMainId = null;
    },
    // 项目编号update 
    constructCodeUpdate(data){ 
      console.log(data, '项目编号');
      this.dataForm.constructArchiveMainId = data[0].id;
      this.dataForm.construct_archive_main = data[0].id;    // 选择项目档案 
      this.dataForm.constructCode = data[0].code;
      this.dataForm.constructName = data[0].name;
      this.dataForm.constructUnitName = data[0].marketcentername;  // 管理部门
      this.dataForm.constructionUnitId = data[0].constructionUnitId;  // 管理部门id
      this.dataForm.marketMainId = null;
    },
    // 根据立项项目或者项目档案自动带出数据
    getAutomaticData(marketMainId){
      let params = {marketMainId};
      // const headers = {"Content-Type": "application/json; charset=utf-8"};
      service.post(`/finance/financeGuaranteeLetterReturnMain/getAutomaticData`, params).then(res => {
        const {code, data} = res;
        if (code === 200) {
          this.dataForm.marketCode = data.marketCode;
          this.dataForm.marketName = data.marketName;
          this.dataForm.marketUnitName = data.marketUnitName; // 业务单元
          this.dataForm.marketCenterId = data.marketCenterId; // 业务中心id
        }
      }).catch(err=>{
        // FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    // 转换保函类型
    getGuaranteeType(guaranteeType){
      switch (guaranteeType) {
        case '1':
          return '投标保函' // 营销项目
          break
        case '2':
          return '履约保函'
          break
        case '3':
          return '预付款保函'
          break
        case '4':
          return '其他保函'
          break
      }
      return ''
    },
    // // 是否退回保函原件
    // isReturnState(status) {
    //   return status=='1' ? '是' : '否';
    // },
    // 银行类别
    updateBaseBankValue(data) {
      // this.$set(this.dataForm, 'bankId', data[0].id);
      this.dataForm.payInBankName = data[0].name;
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
      // console.log(this.dataForm,this.dataForm.createUserId,userId,'createUserId','userId')
      let { guaranteeType } = this.dataForm;
      this.showMarket = guaranteeType=='1' ? true : false;
      this.dataForm.guaranteeType = this.getGuaranteeType(guaranteeType);
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
