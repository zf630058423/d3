<template>
  <!-- 项目保险购买登记表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="170px"
    >
      <row-layout title="项目信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="projectModel" :value="dataForm.constructArchiveMainCode" @updateValue="projectUpdate" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructArchiveMainName" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" placeholder="请输入" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectManagerName" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout title="保单信息" :cols="3">
        <el-form-item slot="col_1" label="办理类型：" prop="processingType">
          <el-radio-group v-model="dataForm.processingType" :disabled="disabledVal()">
            <el-radio label="1">新办</el-radio>
            <el-radio label="2">续签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="insureNo" label="保险单号：" v-if="renew">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="insureModel" :value="dataForm.insureNo" @updateValue="insureUpdate" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
         <el-form-item slot="col_2" prop="insureNo" label="保险单号：" v-else>
          <el-input v-model="dataForm.insureNo" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="policyStartDate" label="保单起始日期：">
          <el-date-picker v-model="dataForm.policyStartDate" type="date" placeholder="选择日期" :disabled="disabledVal()" clearable></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="premium" label="保费(元)：">
          <amount-input v-model="dataForm.premium" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="invoiceStatus" label="发票情况：">
          <el-select v-model="dataForm.invoiceStatus" placeholder="请选择" :disabled="disabledVal()" size="small" style="width:100%">
            <el-option v-for="(item,index) in invoiceStatusList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="policyEndDate" label="保单终止日期：">
          <el-date-picker v-model="dataForm.policyEndDate" type="date" placeholder="选择日期" :disabled="disabledVal()" clearable></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="insuranceAmount" label="保额(元)：" v-if="renew">
          <el-input type="number" v-model="dataForm.insuranceAmount" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_1" prop="insuranceAmount" label="保额(元)："  :rules="[{required:true,message:'必填项不能为空',trigger:'blur'}]" v-else>
          <amount-input v-model="dataForm.insuranceAmount" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="purchaseInsuranceDocuments" label="购买保险文书：" v-if="renew">
          <el-input v-model="dataForm.purchaseInsuranceDocuments" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="purchaseInsuranceDocuments" label="购买保险文书：" :rules="[{required:true,message:'必填项不能为空',trigger:'blur'}]" v-else>
          <el-input v-model="dataForm.purchaseInsuranceDocuments" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="policyRenewalExpirationDate" label="保单到期日：" v-show="dataForm.processingType==='1'">
          <el-date-picker v-model="dataForm.policyRenewalExpirationDate" type="date" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="medicalExpenses" label="住院医疗(元)：" v-if="renew">
          <el-input type="number" v-model="dataForm.medicalExpenses" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_1" prop="medicalExpenses" label="住院医疗(元)：" :rules="[{required:true,message:'必填项不能为空',trigger:'blur'}]" v-else>
          <amount-input v-model="dataForm.medicalExpenses" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="insuranceCompanyName" label="保险公司名称：" v-if="renew">
          <el-input v-model="dataForm.insuranceCompanyName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="insuranceCompanyName" label="保险公司名称：" :rules="[{required:true,message:'必填项不能为空',trigger:'blur'}]" v-else>
          <el-input v-model="dataForm.insuranceCompanyName" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="policyStatus" label="保单状态：" v-show="dataForm.processingType==='1'">
          <el-select v-model="dataForm.policyStatus" size="small" style="width:100%" disabled>
            <el-option v-for="(item,index) in policyStatusList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="renew">
        <el-form-item slot="col_1" prop="insuranceContact" label="保险联系人：">
          <el-input v-model="dataForm.insuranceContact" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled maxlength="30"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="insuranceContactPhone" label="保险联系人电话：">
          <el-input type="number" v-model="dataForm.insuranceContactPhone" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled maxlength="20"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-else>
        <el-form-item slot="col_1" prop="insuranceContact" label="保险联系人：">
          <el-input v-model="dataForm.insuranceContact" :disabled="disabledVal()" size="small" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_2" prop="insuranceContactPhone" label="保险联系人电话：">
          <el-input type="number" v-model="dataForm.insuranceContactPhone" :disabled="disabledVal()" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" v-if="renew">
        <el-form-item slot="col_1" prop="purchaseInsuranceType" label="购买险种：">
          <el-checkbox-group v-model="purchaseInsuranceType" disabled>
            <el-checkbox v-for="(item,index) in purchaseInsuranceList" :key="index" :label="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3" v-else>
        <el-form-item slot="col_1" prop="purchaseInsuranceType" label="购买险种：" class="insuranceType">
          <el-checkbox-group v-model="purchaseInsuranceType" @change="changeInsuranceType" :disabled="disabledVal()">
            <el-checkbox v-for="(item,index) in purchaseInsuranceList" :key="index" :label="item.value">{{item.name}}</el-checkbox>
            <el-input type="text" v-show="purchaseInsuranceType.includes('7')" v-model="dataForm.purchaseInsuranceTypeContent" class="other-give-reason" :disabled="disabledVal()" size="small" placeholder="至少输入4个汉字"/>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="reportRecord" label="报案记录：">
          <el-input v-model="dataForm.reportRecord" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
        <div class="form-text">
        <form-title :title="'关联发票'">
        </form-title>
          <div class="export-text">
            <el-button type="primary" size="small" @click="addContractInsure" :disabled="disabledVal()||dataForm.invoiceStatus==='3'">新增</el-button>
            <el-button type="primary" size="small" @click="importContractInsure" :disabled="disabledVal()">导入</el-button>
            <el-button type="primary" size="small" @click="exportContractInsure" v-if="dataForm.id">导出</el-button>
          </div>
          <!-- <el-button type="primary" size="small" class="export-text" @click="exportContractInsure">导出</el-button> -->
        </div>
        <el-table :data='tableData' class="f2bpmui-datagrid-vuetable" border>
          <el-table-column type="selection" width="55" fixed="left"></el-table-column>
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="发票号码" :render-header="addRedStar" prop="invoiceNo">
            <template slot-scope="scope">
              <select-dialog :isLinkBtn="true" :btnDisabled="disabledVal()" :model-data="invoiceDialog" :value="scope.row.invoiceNo" dynamic-model="customDialog" @updateValue="updateInvoiceNo($event,scope.$index)" class="specialStyle"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="发票代码" prop="invoiceCode">
            <template slot-scope="scope">
              <el-input v-model="scope.row.invoiceCode" size="small" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="开票日期" prop="billingDate">
            <template slot-scope="scope">
              <el-input v-model="scope.row.billingDate" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="发票类型" prop="invoiceType">
            <template slot-scope="scope">
              <el-select v-model="scope.row.invoiceType" placeholder="请选择" size="small" style="width:100%" disabled>
              <el-option v-for="(item,index) in invoiceTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column label="销售方名称" prop="sellerName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sellerName" size="small" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="发票金额(含税)" prop="invoiceAmountTax">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.invoiceAmountTax" defaultValue :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
            </template>
          </el-table-column>
          <el-table-column label="税额" prop="tax">
            <template slot-scope="scope">
              <el-input v-model="scope.row.tax" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="发票金额(无税)" prop="invoiceAmountUntax">
            <template slot-scope="scope">
              <el-input v-model="scope.row.invoiceAmountUntax" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
            </template>
          </el-table-column>
          <!-- <el-table-column label="发票">
            <template slot-scope="scope">
              <update-files v-model="scope.row.fileInfoList" 
              :uploadDisabled="(scope.row.fileInfoList&&scope.row.fileInfoList.length)||readOnlyfiles() ? true : false">
              </update-files>
            </template>
          </el-table-column> -->
          <el-table-column label="发票" prop="fileInfoList">
            <template slot-scope="scope">
              <update-files class="scope1" v-if="scope.row.fileInfoList&&scope.row.fileInfoList.length"
                v-model="scope.row.fileInfoList" :isReadOnly="true">
              </update-files>
              <update-files v-else v-model="scope.row.fileInfoList" 
                :isReadOnly="disabledVal()"
              >
              </update-files>
              <el-input v-if="disabledVal()&&!scope.row.fileInfoList.length" v-model="scope.row.fileInfoList[0]" size="small" placeholder="暂无数据" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <!-- <el-button type="primary" size="small" @click="addContractInsure" :disabled="disabledVal()">新增</el-button> -->
              <el-button type="text" @click="delContractInsure(scope.$index)" :disabled="disabledVal() || dataForm.invoiceStatus==='3'">删除</el-button>
            </template>
          </el-table-column>
        </el-table> 
        <d3Pagination :sourceData="dataForm.contractInsureDetailList" ref="d3Pagination" v-model="tableData" />
      <row-layout :cols="1" :title="'附件'" class="required-tag">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList" :isReadOnly="disabledVal()"></update-files>
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
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key" :uploaderUrl="importData.url" @importSuccess="importSuccess"></uploader-details>
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
import moment from 'moment';
import service from "@/utils/services";
import LinkInput from '@/components/basic/elInput/linkInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue'; //清除空格组件
import d3Pagination from "@/components/basic/pagination/index.vue";
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';

import comMixin from '../minix';
import {
    CUSTOMER_MODEL, ZhanLueCaiGouCode_MODEL,contractInsureMainCode_MODEL,XiangMuBaoXianDan_MODEL
  } from '@/views/businessModule/enum/param';

//必填字段 先全部加载
const requiredArray = ['constructArchiveMainCode', 'processingType', 'insureNo', 'invoiceStatus', 
'policyStartDate', 'premium', 'policyEndDate', 'currentPeriod', 'nextMonthEstimateAmount', 
'fileInfoList', 'insuranceContact', 'purchaseInsuranceType','purchaseInsuranceTypeContent'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
// const date = new Date();
const currentDate = moment(new Date()).format('YYYY-MM-DD'); 
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles, LinkInput, TextInput, d3Pagination, UploaderDetails },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      projectModel: contractInsureMainCode_MODEL,  // 项目编号 弹窗
      dialogSupplier: CUSTOMER_MODEL,  // 乙方弹窗
      dialogCode: ZhanLueCaiGouCode_MODEL, 
      // insureModel: XiangMuBaoXianDan_MODEL, // 项目保险购买登记-保险单号(项目保险单)
      insureModel:  {
        code: 'XiangMuBaoXianDan',
        customDialog: 'XiangMuBaoXianDan',
        isShowLink:true,
        isSetHead: 1,
        isMulti: false,
        initailData: [],
        parm: {varParams:[{key:'constructArchiveMainId',value:''}]}
      },
      invoiceDialog: {
        code: 'FaPiaoHaoMaXiangMuBaoXianGouMaiDengJi',
        customDialog: 'FaPiaoHaoMaXiangMuBaoXianGouMaiDengJi',
        isShowLink:true,
        isSetHead: 1,
        isMulti: false,
        initailData: []
      },
      importData: {
        visible: false,
        url: '/contract/contractInsureMain/importDetailData',
        key:'contractInsureMainDetail'
      },
      tableData: [],
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        constructArchiveMainId:'',  // 项目编号id 必传
        constructArchiveMainCode:'',  // 项目编号
        constructArchiveMainName:'',  // 项目名称
        // constructId:'',  // 项目id  
        constructionUnitName:'',  // 管理部门
        projectManagerName:'',  // 项目负责人
        processingType:'',  // 办理类型
        insureNo:'',  // 保险单号
        policyStartDate:'',  // 保单起始日期
        premium:'',  // 保费(元)
        invoiceStatus:'',  // 发票情况
        policyEndDate:'',  // 保单终止日期
        insuranceAmount:'',  // 保额(元)
        purchaseInsuranceDocuments:'',  // 购买保险文书
        policyRenewalExpirationDate:'',  // 保单续保到期日
        medicalExpenses:'',  // 住院医疗(元)
        insuranceCompanyName:'',  // 保险公司名称
        policyStatus:'',  // 保单状态
        insuranceContact:'',  // 保险联系人
        insuranceContactPhone:'',  // 保险联系人电话
        purchaseInsuranceType: '',  // 购买险种
        purchaseInsuranceTypeContent:'', // 购买险种文本框内容
        reportRecord:'',  // 报案记录
        remark: '',  // 备注
        contractInsureDetailList: [],  // 关联发票-项目保险购买登记明细
        fileInfoList: [],  // 附件文件
        createUserId:'', 
        createUserName:'',  // 编制人
        deptName:'',  // 编制人部门
        createTime:'',  // 编制时间
      },
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      renew: false,
      // policyStatus:'',  // 保单状态
      purchaseInsuranceType: [],  // 购买险种
      // currentMonth: new Date().getMonth()+1,  // 当前月份 
      invoiceStatusList: [
        {name:'有票', value:'1'},
        {name:'后补票', value:'2'},
        {name:'无票', value:'3'}
      ],
      policyStatusList: [
        {name:'生效中', value:'1'},
        {name:'延期生效中', value:'2'},
        {name:'已到期', value:'3'}
      ],
      purchaseInsuranceList: [
        {name:'工程一切险', value:'1'},
        {name:'建筑工程团体意外伤害保险', value:'2'},
        {name:'建筑工程安装一切险', value:'3'},
        {name:'第三者责任险', value:'4'},
        {name:'安全责任险', value:'5'},
        {name:'工伤险', value:'6'},
        {name:'其他', value:'7'},
      ],
      invoiceTypeList: [
        {name:'纸质增值税专用发票', value:'1'},
        {name:'纸质增值税普通发票', value:'2'},
        {name:'电子增值税专用发票', value:'3'},
        {name:'电子增值税普通发票', value:'4'},
        {name:'机动车发票', value:'5'},
        {name:'路桥费', value:'6'},
        {name:'火车票', value:'7'},
        {name:'电子行程单', value:'8'},
        {name:'汽车票', value:'9'},
        {name:'定额发票', value:'10'},
        {name:'境外单据', value:'11'},
        {name:'卷式发票', value:'12'},
        {name:'行政事业单位收据', value:'13'},
        {name:'捐赠发票', value:'14'},
        {name:'二手车发票', value:'15'},
      ],
      // text: 'text',
    }
  },
  computed: {
    policyStatus(){ 
      // return this.compareDate(currentDate, this.dataForm.policyEndDate);
      let formatDate1 = new Date(currentDate);
      let formatDate2 = new Date(this.dataForm.policyEndDate);
      let formatDate3 = new Date(this.dataForm.policyRenewalExpirationDate);
      let momentDate2 = moment(this.dataForm.policyEndDate).format("YYYY-MM-DD");
      let momentDate3 = moment(this.dataForm.policyRenewalExpirationDate).format("YYYY-MM-DD");
      console.log('policyEndDate',currentDate,momentDate2,formatDate2,formatDate1);
      if(formatDate1<formatDate2 || currentDate===momentDate2){
        return '1';
      }else if(formatDate2<formatDate1){
        return '3';
      }
      else if(formatDate2<formatDate1 && (formatDate1<formatDate3||currentDate===momentDate3)){
        return '2';
      }
      else{
        return '';
      }
    },
  },
  watch: { 
    'dataForm.constructArchiveMainCode':{
      handler(newValue){
        if(newValue){
          this.getAutomaticData();
        }
      },
      deep:true,
    },
    'dataForm.processingType':{
      handler(newValue){
        if(newValue){
          this.renew = (newValue == '2' ? true : false);
        }
      }
    },
    policyStatus:{
      handler(newValue){
        this.dataForm.policyStatus = newValue;
      },
    },
    'dataForm.policyStartDate':{
      handler(newValue){
        if(newValue){
          this.dataForm.policyStartDate = newValue ? moment(newValue).format('YYYY-MM-DD') : '';
        }
      }
    },
    'dataForm.policyEndDate':{
      handler(newValue){
        if(newValue){
          this.dataForm.policyEndDate = newValue ? moment(newValue).format('YYYY-MM-DD') : '';
        }
      }
    },
    // // 当发票情况=有票，关联发票必填；当发票情况=后补票，流程审核通过后可补关联操作；当发票情况=无票，不可编辑
    // 'dataForm.invoiceStatus':{ 
    //   handler(newValue){
    //     if(newValue){
    //       this.dataForm.contractInsureDetailList;
    //     }
    //   }
    // },
  },
  created(){
    // console.log('currentMonth', this.currentMonth) // 2023-09
  },
  methods: {
    // 项目编号 update
    projectUpdate(data){ 
      console.log(data,'项目编号');
      this.dataForm.constructArchiveMainCode = data[0].code;
      this.dataForm.constructArchiveMainName = data[0].name;
      this.dataForm.constructArchiveMainId = data[0].id;
      this.insureModel.parm.varParams[0].value = data[0].id;
    },
    // 项目保险购买登记-保险单号(项目保险单)update
    insureUpdate(data){ 
      console.log(data,'保险单号');  //  insuranceContact:'',  // 保险联系人
      this.dataForm.insureNo = data[0].code;
      this.dataForm.insuranceAmount = data[0].insuranceAmount;
      this.dataForm.purchaseInsuranceDocuments = data[0].purchaseInsuranceDocuments;
      this.dataForm.medicalExpenses = data[0].medicalExpenses;
      this.dataForm.insuranceCompanyName = data[0].insuranceCompanyName;
      this.dataForm.insuranceContact = data[0].insuranceContact;
      this.dataForm.insuranceContactPhone = data[0].insuranceContactPhone;
      this.dataForm.purchaseInsuranceType = data[0].purchaseInsuranceType;
      this.purchaseInsuranceType = this.dataForm.purchaseInsuranceType.split(',');
    },
    getAutomaticData(){
      let params = {constructArchiveMainId: this.dataForm.constructArchiveMainId}
      // const params = this.dataForm.constructId;
      service.post(`/contract/outputValueMain/getAutomaticData`, params).then(res => {
        const {code, data} = res;
        if (code === 200) {
          this.dataForm.constructionUnitName = data.constructionUnitName || '';
          this.dataForm.projectManagerName = data.projectManagerName || '';
        }
      }).catch(err=>{
        FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    // 转换状态
    getStatus(status) {
      switch (status) {
        case '1':
          return '未开工'
          break
        case '2':
          return '在建中'
          break
        case '3':
          return '停工中'
          break
        case '4':
          return '施工终止'
          break
        case '5':
          return '合格'
          break
        case '6':
          return '已完工'
          break
        case '7':
          return '已竣工'
          break
        case '8':
          return '已审定'
          break
        case '9':
          return '已关闭'
          break
      }
      return ''
    },
    changeInsuranceType() {
      if(this.dataForm.processingType!=='2'){  // 办理类型为“续签”时，购买险种不可编辑
        this.dataForm.purchaseInsuranceType = this.purchaseInsuranceType.join(','); // 购买险种
      }
      this.$nextTick(() => {   // 当“其他” 由勾选到取消勾选后，需隐藏不合格输入的错误信息
        const errorDom = document.querySelector('.insuranceType').querySelector('.el-form-item__error');
        let includesOther = this.dataForm.purchaseInsuranceType.includes('7');
        if(!includesOther){
          errorDom && (errorDom.style.display = 'none');
          // errorDom && errorDom.remove();
        }else{
          errorDom && (errorDom.style.display = 'block');
        }
      })
      //  this.dataForm.purchaseInsuranceType.includes('7') && this.giveInsuranceTypeContent();
    },
    // 给关联发票表头加必填符号*
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    // 导出关联发票表
    async exportContractInsure(){
      const {id, contractInsureDetailList} = this.dataForm;
      if(!contractInsureDetailList || !contractInsureDetailList.length){
        FUI.Window.showMsg('导出数据时表格不能为空');
      }
      // 查看时记录产值填报完成情况主键id，作为导出关联发票表的参数
      let params = {contractInsureMainId: id || (contractInsureDetailList[0].invoiceCollectionMainId)};
      await this.exportInsureComplete(params);
    },
    // 项目保险购买登记 导出关联发票表
    exportInsureComplete(params){
      return service.download(`/contract/contractInsureMain/exportDetailData`, {
        type: 'post',
        isLoading: true,  //是否有加载提示
        loadingMsg: '导出中', //提示信息
        params,  //传的参数
        "Content-Type":"application/json; charset=utf-8"
      })
    },
    importContractInsure() {
      this.importData.visible = true;
    },
    //导入成功
    importSuccess(data) {
      this.tableData = (data && data.length > 0) ? data.map((item,index) => ({
        ...item,
        rowIndex: index + 1
      })) : [];
      this.importData.visible = false;
    },
    getDataList() {
      return this.tableData;
    },
    // 添加关联发票
    addContractInsure() {
      if (!this.dataForm.contractInsureDetailList){
        this.dataForm.contractInsureDetailList = [];
      } 
      this.dataForm.contractInsureDetailList.push({
        contractInsureMainId: '',  // 项目保险购买登记主表id
        id: '',  // 主键
        billingDate: '',  // 开票日期
        invoiceAmountTax: '',  // 发票金额(含税)(元)
        invoiceAmountUntax: '',  // 发票金额(无税)(元)
        invoiceCode: '',  // 发票代码
        invoiceCollectionMainId: '',  //	发票信息采集主表id
        invoiceNo: '',  // 发票号码
        invoiceType: '',  // 发票类型(数据字典 - 发票类型)
        isDel: '',  // 是否删除（0否;1是）
        sellerName: '',  // 销售方名称
        tax: '',  // 税额
        fileInfoList: [],  //	附件
      })
    },
    // 删除关联发票
    delContractInsure(index) {
      this.dataForm.contractInsureDetailList.splice(index, 1)
    },
    // 发票号码
    updateInvoiceNo(data,index){
      // console.log('发票data', data)
      if(data && data.length >0){
        const {invoiceNo,invoiceCode,invoiceType,id,invoiceCreateTime,sellerName,invoiceamounttax,tax,invoiceamountuntax,fileInfoList} = data[0];
        this.$set(this.dataForm.contractInsureDetailList[index],'invoiceCode',invoiceCode);
        this.$set(this.dataForm.contractInsureDetailList[index],'invoiceNo',invoiceNo);
        this.$set(this.dataForm.contractInsureDetailList[index],'invoiceType',invoiceType);
        this.$set(this.dataForm.contractInsureDetailList[index],'invoiceCollectionMainId',id);
        this.$set(this.dataForm.contractInsureDetailList[index],'billingDate',invoiceCreateTime);
        this.$set(this.dataForm.contractInsureDetailList[index],'sellerName',sellerName);
        this.$set(this.dataForm.contractInsureDetailList[index],'invoiceAmountTax',invoiceamounttax);
        this.$set(this.dataForm.contractInsureDetailList[index],'tax',tax);
        this.$set(this.dataForm.contractInsureDetailList[index],'invoiceAmountUntax',invoiceamountuntax);
        // this.$set(this.dataForm.contractInsureDetailList[index],'fileInfoList',fileInfoList);// 发票
      }
    },
    beforeInit() {
      // this.dataRule['purchaseInsuranceTypeContent'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
      //   let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
      //   let len = escape(value).replace(/%u\w{2}/g, "").length;
      //   if (len >= 8 && len <= 800 && pattern.test(value)) {
      //     callbacak();
      //   } else {
      //     callbacak(new Error('至少输入4个字，最多400字'));
      //   }
      // });
      this.giveupReasonRemarkStatus();
    },
    // 至少输入4个汉字判断 purchaseInsuranceType
    giveupReasonRemarkStatus() {
      let _this = this;
      this.dataRule['purchaseInsuranceType'] = [
        ...RuleRequired.curFiledRule(true),
        ...RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
          let val = _this.dataForm.purchaseInsuranceTypeContent;
          const reg = /[\u4E00-\u9FA5]/g;
          let chinaLen = 0;
          if (val.match(reg)) { 
            chinaLen = val.match(reg).length;  // 中文的个数 汉字的个数
          }
          if (chinaLen >= 4) {
            callbacak();
          } else {
            callbacak(new Error('购买险种文本框内容,至少输入4个汉字'));
          }
        },'blur')
      ]
    },
    // 获取详情后的赋值情况
    afterInit() {
      this.purchaseInsuranceType = this.dataForm.purchaseInsuranceType.split(',');
      // console.log('contractInsureDetailList', this.dataForm.contractInsureDetailList[0].fileInfoList);
    },
    disabledVal(){
      const { id, createUserId, procInstState} = this.dataForm;
      var type = Object.toQueryString('type') || '';
      if(!id){
        return false;
      }else{
        // 审批中2，审批人才可以编辑 
        // 草稿状态时1，创建人能编辑；审批中查看表单，也不能编辑; 提交后被驳回到了提交人环节时，创建人可以;
        return (procInstState !=='3' && procInstState !=='2' && userId === createUserId) ? false : true; 
      }
    },
    // 点击上传按钮 状态判断
    readOnlyfiles(){
      const { id, createUserId, procInstState} = this.dataForm;
      return (['2','3'].includes(procInstState)) || (userId!==createUserId);
    },
    validateForm() {
      const _this = this;
      // 当发票情况=有票，关联发票必填；当发票情况=后补票，流程审核通过后可补关联操作；当发票情况=无票，不可编辑
      if(this.dataForm.invoiceStatus==='1'){
        let flag = this.dataForm.contractInsureDetailList && this.dataForm.contractInsureDetailList.length;
        if(!flag){
          FUI.Window.showMsg('关联发票表格不能为空');
          return;
        }
        for (let key in this.dataForm.contractInsureDetailList) {
          if(!this.dataForm.contractInsureDetailList[key].invoiceNo) {
            FUI.Window.showMsg('发票号码不能为空');
            return;
          }
        };
      }
      // if(this.dataForm.purchaseInsuranceTypeContent){  // 购买险种文本框内容，文案提示了最少输入4个字
      //   this.giveInsuranceTypeContent();
      // }
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
      let { createTime, policyStartDate, policyEndDate } = this.dataForm; 
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.policyStartDate = policyStartDate ? moment(policyStartDate).format('YYYY-MM-DD') : '';
      this.dataForm.policyEndDate = policyEndDate ? moment(policyEndDate).format('YYYY-MM-DD') : '';
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
  margin-left: 10px;
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
.form-text{
  position: relative;
}
.export-text{
  position: absolute;
  right: 30px;
  top: 0px;
}
/* 隐藏发票点击上传前面的icon */
.f2bpmui-datagrid-vuetable{  
  ::v-deep .cell .el-upload>span{
    display: none !important;
  }
  ::v-deep .cell .el-upload-list .my-el-upload-list__item-status-label{
    display: none !important;
  }
} 

.f2bpmui-datagrid-vuetable th {
  padding: 1px 0 !important;
  height: 34px;
  line-height: 34px;
  background: #F7F8FA;
  border: 0;
  font-weight: bold;
  border:0;
  color: #0D1126;
}
.f2bpmui-datagrid-vuetable td {
  border-right: 0;
  border-left: 0;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576C;
}
.specialStyle{
  padding-bottom: 7px !important;
}
::v-deep .el-input.el-date-editor .el-input__inner {
  font-size: 12px;   // 日期控件字体
}
.scope1{
  ::v-deep .el-upload-list__item:first-child {
    margin-top: 0px !important;  // 关联发票-发票文件样式
  }
}

</style>
