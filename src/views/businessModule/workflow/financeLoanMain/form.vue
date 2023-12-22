<template>
  <!-- 项目借款表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <row-layout title="借款信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="借款类型：" prop="loanType">
          <el-radio-group v-model="dataForm.loanType" :disabled="disabledVal()">
            <el-radio label="1">项目借款</el-radio>
            <el-radio label="2">税金备用金</el-radio>
            <el-radio label="3">额度备用金</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructArchiveMainCode" label="项目编号：">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="constructCode" 
          :value="dataForm.constructArchiveMainCode" @updateValue="constructCodeUpdate" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructArchiveMainName" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructionUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="loanAmount" label="借款金额：">
          <amount-input v-model="dataForm.loanAmount" defaultValue placeholder="请输入" clearable :disabled="disabledVal()"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="expectedRepaymentDate" label="预计还款日期：">
          <el-date-picker v-model="dataForm.expectedRepaymentDate" type="date" :disabled="disabledVal()" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="settlementMethod" label="结算方式：">
          <el-select v-model="dataForm.settlementMethod" placeholder="请选择" :disabled="disabledVal()" size="small" style="width:100%" @change="changeCompanyType">
            <el-option v-for="(item,index) in settlementMethodList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="payOutOrgName" label="付款财务组织：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="payOutOrgData" 
          :value="dataForm.payOutOrgName" @updateValue="fOrgUpdateValue" dynamic-model="selectOrg"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <!-- <el-form-item slot="col_1" prop="payOutAccount" label="付款账号：" :rules="[{required:isMust,trigger:'blur'}]">
           <select-dialog :model-data="baseBankDialog" :value="dataForm.payOutAccount"
            dynamic-model="customDialog" @updateValue="updatePaymentAccountValue" :btnDisabled="disabledVal()"></select-dialog>
        </el-form-item> -->
        <el-form-item slot="col_1" prop="payOutAccount" label="付款账号：">
          <!-- <el-input v-model="dataForm.payOutAccount" size="small" placeholder="请输入" :disabled="disabledVal()"/> -->
           <select-dialog :model-data="baseBankDialog" :value="dataForm.payOutAccount"
            dynamic-model="customDialog" @updateValue="updatePaymentAccountValue" :btnDisabled="disabledVal()"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInName" label="收款方：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="dialogModel" @updateValue="followerUpdate" :value="dataForm.payInName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="payInPhone" label="收款方电话：" :rules="[{required:isRequired,trigger:'blur'}]">
          <el-input type="number" v-model="dataForm.payInPhone" :disabled="disabledVal()" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">                                 
        <el-form-item slot="col_1" prop="payInAccount" label="收款账号：" :rules="[{required:isMust,message:'必填项不能为空',trigger:'blur'}]">
          <el-input v-model="dataForm.payInAccount" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInBankName" label="收款银行：" :rules="[{required:isMust,trigger:'blur'}]">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="baseBank" 
          :value="dataForm.payInBankName" @updateValue="updatePayInBank" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="interBankNo" label="收款银行联行号：">
          <el-input v-model="dataForm.interBankNo" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" :disabled="disabledVal()"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="invoiceBillCode" label="票据号：" v-if="false">
          <el-input v-model="dataForm.invoiceBillCode" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="refundAmountTax" label="退款金额(含税)（元）：">
          <amount-input v-model="dataForm.refundAmountTax" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
      </row-layout>
       <row-layout :cols="1">
        <el-form-item slot="col_1" prop="borrowingCause" label="借款原因：">
          <el-input v-model="dataForm.borrowingCause" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <!-- <form-title :title="'委托收款'"></form-title>
      <div>
        <el-button type="primary" :disabled="disabledVal()" size="small" @click="addBaseBank">新增</el-button>
      </div>
      <el-table :data="dataForm.detailPOList" class="f2bpmui-datagrid-vuetable" border :header-cell-class-name="headerCell">
        <el-table-column label="银行账号" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.accountId" :disabled="disabledVal()" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="账户名称" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input v-model="scope.row.accountName" :disabled="disabledVal()" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="开户银行" :render-header="addRedStar">
          <template slot-scope="scope">
            <selector-dialog :model-data="baseBank" :value="scope.row.bankName" dynamic-model="customDialog" :disabled="disabledVal()" @updateValue="updateBaseBankValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="币种">
          <template slot-scope="scope">
            <el-select v-model="scope.row.currencyTypeId" placeholder="请选择" :disabled="disabledVal()">
              <el-option v-for="(item,index) in currencyOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="disabledVal()" @click="delCustomerBank(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
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
    XiangMuDangAnProjectSubmission_MODEL, FuKuanCaiWuZuZhi_MODEL, FOLLOWER_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['constructArchiveMainCode', 'settlementMethod', 'payOutAccount',
'loanType', 'financeLoanMainCode', 'loanAmount', 'payOutOrgName', 'borrowingCause', 'fileInfoList'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      constructCode: XiangMuDangAnProjectSubmission_MODEL,    // 项目编号 弹窗
      payOutOrgData: FuKuanCaiWuZuZhi_MODEL,   // 付款财务组织 弹窗
      dialogModel: FOLLOWER_MODEL,  //跟进人
      baseBankDialog: { code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      otherGiveReasonStatus:false,
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        financeLoanMainId:'',  // 借款单号id 必传
        financeLoanMainCode:'',  // 借款单号
        loanType:'',  // 借款类型  
        constructArchiveMainId:'',  // 	项目档案主键id 必传
        constructArchiveMainCode:'',  // 项目编号
        constructArchiveMainName:'',  // 项目名称
        constructionUnitName:'',  // 管理部门
        constructionUnitId:'',  // 管理部门id
        guaranteeType:'',  //  保函类型
        loanAmount: '',  // 借款金额(元)
        expectedRepaymentDate: '',  // 预计还款日期
        settlementMethod: '',  // 结算方式
        payOutOrgId:'',     // 付款财务组织id 必传
        payOutOrgName:'',  // 付款财务组织
        payOutAccountId:'',  // 付款账号id 必传
        payOutAccount:'',  // 付款账号
        payInId:'',  // 收款方id/员工id
        payInName:'',  // 收款方
        payInPhone:'',  // 收款方电话
        payInAccount:'',  // 收款账号
        payInBankId:'',  // 收款银行id  必传
        payInBankName:'',  // 收款银行
        interBankNo:'',  // 收款银行联行号
        refundAmountTax:'',  // 退款金额(含税)（元）
        invoiceBillCode:'',  // 票据号
        borrowingCause:'',  // 借款原因
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
      settlementMethodList: [
        {configName:'网银(银行转账)', configValue:'1'},
        {configName:'中装支付', configValue:'30'}
      ],
      isMust: false,
      isRequired: false,
    }
  },
  computed: {
  },
  watch: {  // 当 办理类型=新办，'主协议编号'非必填；当 办理类型=续签，'主协议编号'必填
    'dataForm.settlementMethod':{
      handler(newValue){
        this.isMust = (newValue == '1' ? true : false);
        this.isRequired = (newValue == '2' ? true : false);
      },
      deep:true,
    }
  },
  methods: {
    // 借款单号 弹窗update 
    codeUpdate(data){
      console.log(data, '借款单号'); 
      let {id, code, name, guaranteeType, loanAmount} = data[0];
      this.dataForm.financeLoanMainId = id;   
      this.dataForm.financeLoanMainCode = code;
      this.dataForm.guaranteeType = this.getGuaranteeType(guaranteeType);
      this.dataForm.loanAmount = loanAmount;
    },
    // 项目编号update 
    constructCodeUpdate(data){ 
      console.log(data, '项目编号');
      this.dataForm.constructArchiveMainId = data[0].id;
      this.dataForm.constructArchiveMainCode = data[0].code;
      this.dataForm.constructArchiveMainName = data[0].name;
      this.dataForm.constructionUnitName = data[0].marketcentername;
      this.dataForm.constructionUnitId = data[0].marketUnitId;
      this.getPayOutAccountNo();
    },
    // 付款财务组织 update
    fOrgUpdateValue(data){ 
      console.log(data, '付款财务组织');
      this.dataForm.payOutOrgName = data[0].text; // 财务组织
      this.dataForm.payOutOrgId = data[0].value;  // 财务组织id
      this.getPayOutAccountNo();
    },
    // 选择跟进人
    followerUpdate(data) { 
      this.dataForm.payInName = data[0].realName;   //跟进人
      this.dataForm.payInId = data[0].userId;  //跟进人Id
    },
    // 付款账号（更新）
    updatePaymentAccountValue(data) {
      if(data && data.length <= 0) return;
      const { bank_account_no, id } = data[0];
      this.dataForm.payOutAccount = bank_account_no;
      this.dataForm.payOutAccountId = id;
    },
    // 收款银行
    updatePayInBank(data) {
      console.log(data, '银行类别'); 
      this.dataForm.payInBankId = data[0].id;
      this.dataForm.payInBankName = data[0].name;
      this.dataForm.interBankNo = data[0]["combine_num"];
    },
    // 自动获取付款账号配置中的付款账号
    getPayOutAccountNo(){
      let params = {
        constructArchiveMainId: this.dataForm.constructArchiveMainId,
        constructionUnitId: this.dataForm.constructionUnitId,
        menuName: '11',  // menuName 菜单名(取数据字典-付款菜单配置)  项目借款-'11';
        payOutOrgId: this.dataForm.payOutOrgId,
      };
      service.post(`/finance/financeLoanMain/getPayOutAccountNo`, params).then(res => {
        const {code, data} = res;
        if (code === 200) {
          this.dataForm.payOutAccount = data.payOutAccountNo;
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
    /**
     * 添加委托收款
     */
    addBaseBank() {
      if (!this.dataForm.detailPOList) this.dataForm.detailPOList = []
      this.dataForm.detailPOList.push({
        accountId: '',
        accountName: '',
        bankId: '',
        bankName: '',
        currencyTypeId: '人民币',  // 币种显示名称，默认显示人民币
        supplierMainId: '',	  // 供应商主表主键
      })
    },
    /**
     * 删除委托收款
     */
    delCustomerBank(index) {
      this.dataForm.detailPOList.splice(index, 1)
    },
    /**
     * 银行类别
     */
    updateBaseBankValue(data, index) { 
      this.$set(this.dataForm.detailPOList[index], 'bankId', data[0].id)
      this.$set(this.dataForm.detailPOList[index], 'bankName', data[0].name)
    },
    // 给委托收款表头加必填符号*
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    headerCell({columnIndex}){
      if(columnIndex < 4){
        return 'wu-header-cell'
      } else {
        return ''
      }
    },
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'corporateName', 'customerStatus'])
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
::v-deep .el-table__header{
  // padding: 0 15px;
  .wu-header-cell {
    transform: translateX(15px);
  }
}
</style>
