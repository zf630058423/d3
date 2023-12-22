<template>
  <!-- 投标保证金支付申请表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <row-layout title="立项信息" :cols="3">
        <!-- <el-form-item slot="col_1" label="是否预选承包商：" prop="guaranteeObject">
          <el-radio-group v-model="dataForm.guaranteeObject">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketCode" label="立项编号：" >
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="marketCode" 
          :value="dataForm.marketCode" @updateValue="marketCodeUpdate" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="marketName" label="立项名称：">
          <el-input v-model="dataForm.marketName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="followerName" label="跟进人：">
          <el-input v-model="dataForm.followerName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled />
        </el-form-item>
        <el-form-item slot="col_2" prop="marketUnitName" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="customerName" label="客户：">
          <el-input v-model="dataForm.customerName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout title="付款信息" :cols="3">
        <el-form-item slot="col_1" prop="applyAmount" label="本次申请金额(元)：">
          <amount-input v-model="dataForm.applyAmount" defaultValue placeholder="请输入" clearable :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="settlementMethod" label="结算方式：">
          <el-select v-model="dataForm.settlementMethod" placeholder="请选择" :disabled="disabledVal()" size="small" style="width:100%" @change="changeCompanyType">
            <el-option v-for="(item,index) in settlementTypeList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="payOutOrgName" label="付款财务组织：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="payOutOrgData" 
          :value="dataForm.payOutOrgName" @updateValue="fOrgUpdateValue" dynamic-model="selectOrg"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payOutAccountNo" label="付款账号：" :rules="[{required:isMust,trigger:'blur'}]">
           <select-dialog :model-data="baseBankDialog" :value="dataForm.payOutAccountNo"
            dynamic-model="customDialog" @updateValue="updatePaymentAccountValue" :btnDisabled="disabledVal()"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInName" label="收款方：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="customerModel" @updateValue="customerUpdate" :value="dataForm.payInName || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="payInAccountNo" label="收款账号：" :rules="[{required:isMust,trigger:'blur'}]">
          <!-- <el-input v-model="dataForm.payInAccountNo" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="disabledVal()"/> -->
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="payInAccountModel" @updateValue="payInAccountUpdate" :value="dataForm.payInAccountNo || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <!-- <el-form-item slot="col_3" prop="payInAccountNo" label="收款账号：" :rules="[{required:isMust,trigger:'blur'}]">
          <el-input v-model="dataForm.payInAccountNo" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item> -->
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payInBankName" label="收款银行：">
          <!-- <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="baseBank" 
          :value="dataForm.payInBankName" @updateValue="updatePayInBank" dynamic-model="customDialog"></select-dialog> -->
          <el-input v-model="dataForm.payInBankName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="subBankNo" label="收款银行联行号：">
          <el-input v-model="dataForm.subBankNo" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="expectRecoverDate" label="预计收回日期：">
          <el-date-picker v-model="dataForm.expectRecoverDate" type="date" value-format="yyyy-MM-dd" :disabled="disabledVal()" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="actualRecoverDate" label="实际收回日期：">
          <el-date-picker v-model="dataForm.actualRecoverDate" type="date" value-format="yyyy-MM-dd" :disabled="disabledVal()" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="refundAmount" label="退款金额(元)：">
          <amount-input v-model="dataForm.refundAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="recoverAmount" label="收回金额(元)：">
          <amount-input v-model="dataForm.recoverAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="recoverType" label="收回方式：">
          <el-input v-model="dataForm.recoverType" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <!-- <el-form-item slot="col_2" prop="invoiceBillNo" label="票据号：">
          <el-input v-model="dataForm.invoiceBillNo" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item> -->
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="bankRemark" label="银行回单备注：">
          <el-input v-model="dataForm.bankRemark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="事项备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <!-- <form-title :title="'关联中装支付流水'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addOutputValue" :disabled="type!=='detail'?false:true">新增</el-button>
      </div>
      <el-table :data="tableData" class="f2bpmui-datagrid-vuetable" border :disabled="disabledVal()">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="流水号">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.constructCode" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">
            <el-input v-model="scope.row.constructName" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="使用人">
          <template slot-scope="scope">
            <el-input v-model="scope.row.createUserName" :disabled="type!=='detail'?false:true"></el-input>
          </template>
        </el-table-column> 
        <el-table-column label="本方付款账户">
          <template slot-scope="scope">
            <el-input v-model="scope.row.contractOutputCode" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="收款方名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.createUserName" :disabled="type!=='detail'?false:true"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="收款方账户">
          <template slot-scope="scope">
            <el-input v-model="scope.row.contractOutputCode" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="摘要">
          <template slot-scope="scope">
            <el-input v-model="scope.row.createUserName" :disabled="type!=='detail'?false:true"></el-input>
          </template>
        </el-table-column> 
        <el-table-column label="付款金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.procInstState" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="type!=='detail'?false:true" @click="delOutputValue(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>  -->
      <!-- <d3Pagination :sourceData="dataForm.outputValueCompleteDetailList" ref="d3Pagination" v-model="tableData" /> -->
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
import { checkBidGuaranteeApplyApi } from '@/Api/workflowBusssion/financePayoutBidGuaranteeExtend';


import comMixin from '../minix';
import {
    BaoHanShenQingDanHao_MODEL, LiXiangBianHaoTouBiaoBaoZhengJinZhiFu_MODEL, XiangMuDangAnProjectSubmission_MODEL, 
    FuKuanCaiWuZuZhi_MODEL, CUSTOMER_MODEL, CUSTOMER2_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['constructCode', 'marketCode', 'applyAmount', 'settlementMethod', 'payOutOrgName', 'payInName', 'bankRemark', 'expectRecoverDate', 'fileInfoList' ];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      dialogCode: BaoHanShenQingDanHao_MODEL, 
      marketCode: LiXiangBianHaoTouBiaoBaoZhengJinZhiFu_MODEL,  // 立项编号 弹窗
      // marketCode:{ code: 'ShouRuLeiHeTongBianHaoProjectSubmission', customDialog: 'ShouRuLeiHeTongBianHaoProjectSubmission', isSetHead: 1, isShowLink:true, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      constructCode: XiangMuDangAnProjectSubmission_MODEL,    // 项目编号 弹窗
      payOutOrgData: FuKuanCaiWuZuZhi_MODEL,   // 付款财务组织 弹窗
      baseBankDialog: { code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      customerModel: CUSTOMER_MODEL,  // 客户 客商档案弹框
      // 收款账号 客户 客商档案弹框
      payInAccountModel:{
        code: 'ShouKuanZhangHao',
        isSetHead: 1, 
        // isShowLink:true,
        isMulti: false,
        data: [],
        parm: {varParams:[{key:'customerSupplierArchiveMainId',value:''}]}
      },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      otherGiveReasonStatus:false,
      dataForm: {
        // currentPeriodYear: new Date().getFullYear().toString(), // 年份
        id:'', 
        code:'',  // 单据编号
        marketCode:'',  // 立项编号
        marketMainId:'',  // 营销立项主键id 必传
        marketName:'',  // 立项名称
        followerName:'',  // 跟进人
        marketUnitName:'',  // 业务单元
        customerName:'',  // 客户
        applyAmount: '',  // 本次申请金额(元)
        settlementMethod: '',  // 结算方式
        payOutOrgId: '',  // 付款财务组织id
        payOutOrgName: '',  // 付款财务组织
        payOutAccountId: '',  // 付款账号id
        payOutAccountNo: '',  // 付款账号
        payInId:'',  //	收款方id
        payInName:'',  // 收款方
        payInAccountId:'',  //收款账号id
        payInAccountNo:'',  // 收款账号
        payInBankName:'',  // 收款银行
        subBankNo:'',  // 收款银行联行号
        expectRecoverDate:'',  // 预计收回日期
        actualRecoverDate:'',  // 实际收回日期
        refundAmount:'',  // 退款金额(元)
        recoverAmount:'',  // 收回金额(元)
        recoverType: '否',  // 收回方式
        invoiceBillNo:'',  // 票据号
        bankRemark:'',  // 银行回单备注
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
      settlementTypeList: [
        {configName:'现金', configValue:'1'},
        {configName:'转账支票', configValue:'2'},
        {configName:'网银(银行转账)', configValue:'3'},
        {configName:'中装支付', configValue:'4'},
        {configName:'银行汇票', configValue:'5'},
        {configName:'银行电汇', configValue:'6'},
        {configName:'后补流程不付款', configValue:'7'},
        {configName:'网上银行(电子商务订单)', configValue:'8'}
      ],
      isMust: false,
      showMarket: false,   // 是否营销项目
    }
  },
  computed: {
  },
  watch: {  
    'dataForm.settlementMethod':{
      handler(newValue){
        this.isMust = (newValue == '3' ? true : false);
      },
      deep:true,
    },
    'dataForm.payInId':{   // 默认带出收款方【客户】对应的默认银行 弹框数据
      handler(newValue){
        this.payInAccountModel.parm.varParams[0].value = newValue;
      }
    },
  },
  mounted(){
    if(!this.dataForm.id){
      this.dataForm.createUserDeptName = decodeURIComponent(orgName);
    }
  },
  methods: {
    // 立项编号update 
    marketCodeUpdate(data){ 
      // console.log(data, '立项编号');
      this.dataForm.marketMainId = data[0].id;
      this.dataForm.marketCode = data[0].code;
      this.getAutomaticData(this.dataForm.marketMainId);
    },
    // 根据立项项目或者项目档案自动带出数据
    getAutomaticData(marketMainId){   
      let params = {marketMainId};   // marketMainId
      // const headers = {"Content-Type": "application/json; charset=utf-8"};
      service.post(`/finance/financePayoutBidGuaranteeExtend/getAutomaticData`, params).then(res => {
        const {code, data} = res;
        if (code === 200) {
          this.dataForm.marketCode = data.marketCode;
          this.dataForm.marketName = data.marketName;
          this.dataForm.followerName = data.followerName;
          this.dataForm.marketUnitName = data.marketUnitName;
          this.dataForm.customerName = data.customerName;
        }
      }).catch(err=>{
        // FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    // 根据收款方 客商档案自动带出收款信息
    getCustomerOrSupplierData(payInId){   
      let params = {payInId};   // marketMainId
      service.post(`/finance/financePayoutBidGuaranteeExtend/getCustomerOrSupplierData`, params).then(res => {
        const {code, data} = res;
        if (code === 200) {
          this.dataForm.payInAccountId = data.payInAccountId;
          this.dataForm.payInAccountNo = data.payInAccountNo;
          this.dataForm.payInBankName = data.payInBankName;
          this.dataForm.subBankNo = data.subBankNo;
        }
      }).catch(err=>{
        // FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    // 付款财务组织 update
    fOrgUpdateValue(data){ 
      console.log(data, '付款财务组织');
      this.dataForm.payOutOrgName = data[0].text; // 财务组织
      this.dataForm.payOutOrgId = data[0].value;  // 财务组织id
    },
    // 付款账号（更新）
    updatePaymentAccountValue(data) {
      console.log(data, '付款账号');
      if(data && data.length <= 0) return;
      const { id, bank_account_no } = data[0];
      this.dataForm.payOutAccountNo = bank_account_no;
      this.dataForm.payOutAccountId = id;
    },
    // 收款方update 
    customerUpdate(data) {
      console.log(data, '收款方');
      let _this = this;
      if (data && data[0].customerStatus == 2) { //为预警状态时
        _this.confirmTip('该客户已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要禁止承接，请做好风险管控工作', function () {
          _this.dataForm.payInName = data[0].customerName;
          _this.dataForm.payInId = data[0].id;
        })
      } else { 
        _this.dataForm.payInName = data[0].customerName;
        _this.dataForm.payInId = data[0].id;
      }
      // 默认带出收款方【客户】对应的默认银行 弹框数据
      this.payInAccountModel.parm.varParams[0].value = data[0].id;
      this.getCustomerOrSupplierData(data[0].id);
    },
    confirmTip(msg,callbacak) { 
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          callbacak()
        }).catch(() => {
          callbacak()        
        });
    },
    // 收款账号
    payInAccountUpdate(data) {
      console.log(data, '收款账号');  // payInAccountNo
      // this.dataForm.payInBankId = data[0].id;
      this.dataForm.payInAccountId = data[0].id;
      this.dataForm.payInAccountNo = data[0].account;
      this.dataForm.payInBankName = data[0].accountName;
      this.dataForm.subBankNo = data[0]["bankId"];
    },
    // 银行类别
    updateBaseBankValue(data) {
      // this.$set(this.dataForm, 'bankId', data[0].id);
      this.dataForm.payInBankName = data[0].name;
    },
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'corporateName'])
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
              if(_this.checkBidGuaranteeApply(_this.dataForm)){
                return resolve(_this.dataForm);
              }
              // return resolve(_this.dataForm);  //改错表单了试试这个返回是什么
            } else {
              return resolve(false)
            }
          })
        });
    },
    dataFromDate() { 
      let { bidEndDate, expectRecoverDate, createTime, storeDateOriginal, bidEndDateOriginal, bidDate, storeDate } = this.dataForm; 
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
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
      this.dataForm.expectRecoverDate = expectRecoverDate ? moment(expectRecoverDate).format('YYYY-MM-DD HH:mm:ss'): '';
      this.dataForm.createUserId = !this.dataForm.id ? userId : this.dataForm.createUserId;
    },
    // 校验投标保证金支付申请
    async checkBidGuaranteeApply(params){
      // const headers = {"Content-Type": "application/json; charset=utf-8"};
      let { data, code } = await checkBidGuaranteeApplyApi(params);
      if(code === 200){
        return true;
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
