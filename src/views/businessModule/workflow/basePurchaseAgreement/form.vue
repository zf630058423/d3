<template>
  <!-- 战略采购合同表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="155px"
    >
      <row-layout title="办理信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" label="办理类型：" prop="handleType">
          <el-radio-group v-model="dataForm.handleType" :disabled="disabledVal()">
            <el-radio label="1">新办</el-radio>
            <el-radio label="2">续签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="name" label="协议名称：">
          <el-input v-model="dataForm.name" size="small" placeholder="请输入" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="estimatedAmountCooperation" label="预估合作金额：">
          <!-- <el-input v-model="dataForm.estimatedAmountCooperation" size="small" placeholder="请输入保留两位小数的正数" :disabled="disabledVal()" @input="numInput" />  -->
          <amount-input v-model="dataForm.estimatedAmountCooperation" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="masterProtocolId" label="主协议编号：" :rules="[{required:isMenu,trigger:'blur'}]">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="dialogCode" @updateValue="codeUpdate" 
          :value="dataForm.masterProtocolId || msgTip.SELECT_PLACEHOLDER" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="masterProtocolName" label="主协议名称：">
          <el-input v-model="dataForm.masterProtocolName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="supplierName" label="乙方：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="dialogSupplier" @updateValue="supplierUpdate" :value="dataForm.supplierName || msgTip.SELECT_PLACEHOLDER" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="supplierContactPerson" label="乙方联系人：">
          <el-input v-model="dataForm.supplierContactPerson" size="small" placeholder="请输入" maxlength="30" :disabled="disabledVal()" />
        </el-form-item>
        <el-form-item slot="col_3" prop="supplierContactNumber" label="乙方联系电话：">
          <el-input type="number" v-model="dataForm.supplierContactNumber" size="small" placeholder="请输入" maxlength="20" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerName" label="甲方：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="dialogModel" @updateValue="usersUpdate($event)" :value="dataForm.customerName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="effectiveBeginDate" label="有效开始日期：">
          <el-date-picker v-model="dataForm.effectiveBeginDate" type="date" placeholder="选择日期时间" :disabled="disabledVal()" clearable></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="effectiveEndDate" label="有效结束日期：">
          <el-date-picker v-model="dataForm.effectiveEndDate" type="date" placeholder="选择日期时间" :disabled="disabledVal()" clearable></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="latestValidEndDate" label="最新有效结束日期：">
          <el-date-picker v-model="dataForm.latestValidEndDate" type="date" placeholder="" disabled></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="" label="">
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" clearable/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'附件'">
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
import {RADIO_GROUP} from '@/views/businessModule/enum/param';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import moment from 'moment'

import comMixin from '../minix';
import {
    FJiaFang_MODEL, CUSTOMER_MODEL, ZhanLueCaiGouCode_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['handleType', 'name', 'estimatedAmountCooperation', 'supplierName', 'supplierContactPerson',
  'supplierContactNumber','customerName', 'effectiveBeginDate', 'effectiveEndDate', 'fileInfoList'];
// const requiredArray = [];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      numVal:'100',
      loading: false,
      formVisible: false,
      dialogVisible: false,
      radioData: RADIO_GROUP,
      // dialogModel: FJiaFang_MODEL,  //跟进人 甲方弹窗
      dialogModel: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', 
        isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},// 甲方弹窗
      dialogSupplier: CUSTOMER_MODEL,  // 乙方弹窗
      dialogCode: ZhanLueCaiGouCode_MODEL, 
      checkedBoxGroup: [],
      otherGiveReasonStatus:false,
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        handleType:'',  // 办理类型
        name:'',  // 协议名称 
        estimatedAmountCooperation: '',  // 预估合作金额  
        masterProtocolId: '',  // 主协议编号 
        masterProtocolName: '',  // 主协议名称
        supplierId: '', // 乙方id  
        supplierName: '',  // 乙方 
        supplierContactPerson: '',  // 乙方联系人
        supplierContactNumber: '',  // 乙方联系电话
        customerId: '', // 甲方id  
        customerName: '',  // 甲方   
        effectiveBeginDate: '',  // 有效开始日期
        effectiveEndDate: '',  // 有效结束日期
        latestValidEndDate: '',  // 最新有效结束日期
        remark: '',  // 备注
        fileInfoList: [],  // 附件文件
        createUserId:'', 
        createUserName:'',  //编制人
        deptName:'',  //编制人部门
        createTime:'',  //编制时间
      },
      dateOrignalType:1,  //1 营销立项  2 预选承包商入库  3：投标文件评审  4： 标前评审
      bidEndDateLabelStatus: true,  //现投标截止时间是否显示
      isFollowupStatus: true,  //是否跟进状态显示和隐藏
      resultStateStatus: true,  //是否已出结果是否显示
      // estimateResultDateStatus: true,  //预计出结果日期 显示
      giveupReasonStatus: false,  //放弃原因是否显示 默认隐藏 'bidderRemark'
      reviewResultStatus: false,  //评审结果 默认不展示
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      isMenu: false,
    }
  },
  computed: {
    //预计出结果日期  是否已出结果显示并且为未出结果时 显示预计出结果日期 是否已出结果 为“未出结果”时显示否则隐藏，且审批环节“跟进人”必须填写
    estimateResultDateStatus() { 
      return (this.resultStateStatus && this.dataForm.resultState == 0) ? true : false; 
    }
  },
  watch: {  // 当 办理类型=新办，'主协议编号'非必填；当 办理类型=续签，'主协议编号'必填
    'dataForm.handleType':{
      handler(newValue){
        this.isMenu = (newValue == '2' ? true : false)
      },
      deep:true,
    }
  },
  methods: {
    // usersUpdate(data){    // 甲方弹窗
    //   this.dataForm.customerId = data[0].orgId;
    //   this.dataForm.customerName = data[0].realName;
    // },
    /**
     * 更新组织（甲方弹窗）
     */
    usersUpdate(data){
      if(data && data.length <= 0) return;
      const { value, text } = data[0];
      this.dataForm.customerId = value;
      this.dataForm.customerName = text;
    },
    supplierUpdate(data){   // 乙方弹窗
      console.log(data,'乙方data')
      this.dataForm.supplierId = data[0].id;
      this.dataForm.supplierName = data[0].customerName;
      this.dataForm.supplierContactPerson = data[0].contactPerson || '';
      this.dataForm.supplierContactNumber = data[0].phone || '';
    },
    // 主协议编号dialogCode
    codeUpdate(data){ 
      this.dataForm.masterProtocolId = data[0].code;
      this.dataForm.masterProtocolName = data[0].name;
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
    //  预估合作金额 保留两位小数
    numInput() {
      const {estimatedAmountCooperation} = this.dataForm;
      this.dataForm.estimatedAmountCooperation = estimatedAmountCooperation.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
    },
    disabledVal(){
      const { id, createUserId, procInstState} = this.dataForm;
      var type = Object.toQueryString('type') || '';
      if(!id){
        return false;
      }else{
        return (procInstState!=='3' && userId===createUserId) ? false : true;  // 流程表单(未审批完成时)查看状态可以编辑
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
    //选择设计立项专员意见时
    disignerIsAgreeChange(filed, filedRemark) {
        this.dataRule[`${filedRemark}`] = RuleRequired.curFiledRule((this.dataForm[filed] === '0')); //不同意原因
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
</style>
