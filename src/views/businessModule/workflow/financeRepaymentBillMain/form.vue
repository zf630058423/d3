<template>
  <!-- 还款单表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <row-layout title="还款信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <!-- <el-form-item slot="col_2" label="还款对象：" prop="repaymentTarget">
          <el-radio-group v-model="dataForm.repaymentTarget">
            <el-radio label="1">项目</el-radio>
            <el-radio label="2">员工</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item slot="col_2" prop="financeLoanMainCode" label="借款单号：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="dialogCode" @updateValue="codeUpdate" 
          :value="dataForm.financeLoanMainCode" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructArchiveMainCode" label="项目编号：">
          <el-input v-model="dataForm.constructArchiveMainCode" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructArchiveMainName" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructionUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="borrower" label="借款人：">
          <el-input v-model="dataForm.borrower" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
      </row-layout>
      <!-- <row-layout :cols="3" v-show="showConstruct">
        <el-form-item slot="col_1" prop="constructArchiveMainCode" label="项目编号：">
          <el-input v-model="dataForm.constructArchiveMainCode" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainName" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_3" prop="constructionUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
      </row-layout> -->
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="repaymentAmount" label="还款金额：">
          <amount-input v-model="dataForm.repaymentAmount" defaultValue placeholder="请输入" clearable :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInOrgName" label="收款财务组织：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="orgDialog" 
          :value="dataForm.payInOrgName" @updateValue="updateOrgValue($event)" dynamic-model="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="payInAccount" label="收款账号：">
          <select-dialog :btnDisabled="disabledVal()" :width="820" :height="360" :value="dataForm.payInAccount" :modelData="payeeBankModelData" @updateValue="payeeBankUpdateValue" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'附件'">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList" :disabled="disabledVal()"></update-files>
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
    JieKuanDanHaoHuaiKuanDan_MODEL, PAYEEBANK_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['repaymentTarget', 'financeLoanMainCode', 'repaymentAmount', 'payInOrgName'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      dialogCode: JieKuanDanHaoHuaiKuanDan_MODEL,   // 借款单号 弹窗
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      payeeBankModelData: PAYEEBANK_MODEL,  //收款账号弹框配置
      otherGiveReasonStatus:false,
      orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
      dataForm: {
        // currentPeriodYear: new Date().getFullYear().toString(), // 年份
        id:'', 
        code:'',  // 单据编号
        financeLoanMainId:'',  // 借款单号id 必传
        financeLoanMainCode:'',  // 借款单号
        repaymentTarget:'',  // 还款对象   
        repaymentAmount: '',  // 还款金额(元)
        constructArchiveMainId:'',  // 	项目档案主键id 必传
        constructArchiveMainCode:'',  // 项目编号
        constructArchiveMainName:'',  // 项目名称
        constructionUnitName:'',  // 管理部门
        borrower:'',  // 借款人
        payInAccountId:'',  // 	收款账号id 必传
        payInAccount:'',  // 收款账号
        payInOrgId:'',  // 	收款财务组织id 必传
        payInOrgName:'',  // 收款财务组织
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
      showConstruct: false,   // 是否显示项目编号
    }
  },
  computed: {
  },
  watch: {  // 当还款对象=项目时 显示，根据所选借款单号带出；否则隐藏
    'dataForm.repaymentTarget':{
      handler(newValue){
        this.showConstruct = (newValue == '1' ? true : false);
      },
    }
  },
  methods: {
    // 借款单号 弹窗update 
    codeUpdate(data){
      console.log(data, '借款单号'); 
      let {id, code, constructArchiveMainId, name} = data[0];
      this.dataForm.financeLoanMainId = id;   
      this.dataForm.financeLoanMainCode = code;
      this.dataForm.constructArchiveMainId = constructArchiveMainId;
      this.dataForm.constructArchiveMainCode = data[0].constructarchivemaincode;
      this.dataForm.constructArchiveMainName = data[0].constructarchivemainname;
      this.dataForm.constructionUnitName = data[0].constructionunitname;
      this.dataForm.borrower = data[0].payinname;
    },
    // 收款账号
    payeeBankUpdateValue(data) {
      if(data && data.length <= 0) return;
      // const { id, bank_account_no } = data[0];  // bank_account_no
      this.dataForm.payInAccount = data[0].accountNo;
      this.dataForm.payInAccountId = data[0].bankarchivemainid; // bankarchivemainid bankbranchid
    },
    // 更新组织（收款财务组织）
    updateOrgValue(data){
      if(data && data.length <= 0) return;
      const { value, text } = data[0];
      this.dataForm.payInOrgId = value;
      this.dataForm.payInOrgName = text;
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
      let { estimateResultDate, createTime } = this.dataForm; 
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
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
