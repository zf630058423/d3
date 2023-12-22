<template>
  <!-- 预缴完税凭证 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="form" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px">
      <row-layout :title="'项目信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketUnitId" label="项目编号：">
          <select-dialog :disabled="true" :width="800" :model-data="masterContractDialog" :height="360" :value="dataForm.constructArchiveMainCode" @updateValue="updateMasterContractValue" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3"  label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
        <el-form-item slot="col_3"  label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :title="'预缴信息'">
        <el-form-item slot="col_1"  label="税跨报号：" :prop="dataForm.isOperatePlace == 1?'taxAcross':''">
          <select-dialog :disabled="true" :width="800" :model-data="taxAcrossDialog" :height="360" :value="dataForm.taxAcross" @updateValue="updateTaxAcross" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="完税凭证号：" prop="taxPaymentVoucherNo">
          <el-input v-model="dataForm.taxPaymentVoucherNo" size="small" placeholder="请输入"  />
        </el-form-item>
        <el-form-item slot="col_3"  label="预缴所属期间：" prop="prepaidPeriodTime">
          <el-date-picker v-model="dataForm.prepaidPeriodTime" type="month" placeholder="请选择" size="small" value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="taxUnitOrgName" label="纳税单位：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="500" :height="360" @updateValue="deptUpdate" :value="dataForm.taxUnitOrgName || '请选择'" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="advancePaymentWay" label="预缴方式：">
          <el-select v-model="dataForm.advancePaymentWay" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in advancePaymentWayOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="whetherEnjoyExemptionPolicy" label="是否享受当地减免政策：" label-width="170px">
          <el-radio-group v-model="dataForm.whetherEnjoyExemptionPolicy">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" >
        <el-form-item slot="col_1"  label="缴纳税金：">
          <amount-input v-model="dataForm.payTaxesAmount" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="缴款人：" prop="paymentPeopleUsersName">
          <select-dialog :disabled="false" :btnDisabled="setting.readonly" :width="900" :height="360"  @updateValue="usersUpdate" :value="dataForm.paymentPeopleUsersName || '请选择'" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="paymentTime" label="缴款日期：">
          <el-date-picker v-model="dataForm.paymentTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="small">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" >
        <el-form-item slot="col_1" label="是否异地经营：">
          <el-radio-group v-model="dataForm.isOperatePlace" disabled>
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="账扣：">
          <el-radio-group v-model="dataForm.isAccountDeduct"  size="small">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3"  label="付款状态：">
          <el-select v-model="dataForm.paymentStatus" placeholder="请选择" style="width: 100%" disabled size="small">
            <el-option v-for="(item,index) in paymentStatusOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="是否推费用预提单：">
          <el-radio-group v-model="dataForm.accrualExpenseStatus" disabled  size="small">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="是否收到原件：">
          <el-radio-group v-model="dataForm.haveReceivedOriginalInvoice" disabled  size="small">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" >
        <el-form-item slot="col_1" label="备注：">
          <el-input type="textarea" style="width: 95.5%;" :rows="5" placeholder="请输入，内容长度不超过250个字符" v-model="dataForm.remark" size="small" maxlength="250">
          </el-input>
        </el-form-item>
      </row-layout>
      <form-title :title="activeName == 0?'税款信息':'扣除信息'"></form-title>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="税款信息" name="0"></el-tab-pane>
          <el-tab-pane label="扣除信息" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="f2bpm-online-subtable-divcontainer" v-show="activeName == 0">
        <el-table :key="subtableKey" :data="dataForm.voucherTaxDetailList" class="f2bpmui-datagrid-vuetable" border show-summary :summary-method="getSummaries3">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="预征栏目">
            <template slot-scope="scope">
              {{fomentTxtByValue(scope.row.hadColumns)}}
            </template>
          </el-table-column>
          <el-table-column label="税基(元)">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.taxBase" size="small" placeholder="请输入" @change="changeTaxBase($event,scope.$index)"/>
            </template>
          </el-table-column>
          <el-table-column label="扣除金额">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.deductAmount" size="small" placeholder="系统计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="预征率(%)">
            <template slot-scope="scope">
              <select-dialog2 :model-data="rateModel" :value="scope.row.taxRate" dynamicModel="customDialog" @updateValue="constructionRateUpdate($event,scope.$index)"></select-dialog2>
            </template>
          </el-table-column>
          <el-table-column label="应预缴税额">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.taxDueAdvance" size="small" placeholder="系统计算" disabled />
            </template>
          </el-table-column>
          <el-table-column label="实际预缴税额">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.actualAdvanceTax" size="small" placeholder="系统计算，可修改"/>
            </template>
          </el-table-column>
          <el-table-column label="OCR税金">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.ocrTaxes" size="small" placeholder="系统反写" disabled />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="f2bpm-online-subtable-divcontainer" v-show="activeName == 1">
        <div>
          <el-button type="primary" size="small" @click="addInvoiceList">新增</el-button>
        </div>
        <el-table :key="subtableKey1" :data="dataForm.voucherDeductDetailList" class="f2bpmui-datagrid-vuetable" border show-summary :summary-method="getSummaries1">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="发票号码">
            <template slot-scope="scope">
              <select-dialog :title="'发票选择'" :width="900" :model-data="invoiceDialog" :value="scope.row.invoiceNo" dynamicModel="selectInvoiceByVoucher" @updateValue="updateInvoiceNo($event,scope.$index)"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="发票代码">
            <template slot-scope="scope">
              <el-input v-model="scope.row.invoiceCode" size="small" placeholder="自动带出" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="销售方">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sellerName" size="small" placeholder="自动带出" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="本期扣除金额">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.currentDeductionAmount" size="small" placeholder="请输入" ></amount-input>
            </template>
          </el-table-column>
          <el-table-column label="累计扣除金额">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.accumulateDeductionAmount" size="small" placeholder="自动带出" disabled />
            </template>
          </el-table-column>
          <el-table-column label="发票金额(含税)">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.invoiceAmountTax" size="small" placeholder="自动带出"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteInvoice(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <form-title :title="'附加税费信息'"></form-title>
      <div class="f2bpm-online-subtable-divcontainer">
        <div>
          <el-button type="primary" size="small" @click="addAdditionTax">新增</el-button>
        </div>
        <el-table :key="subtableKey2" :data="dataForm.voucherAdditionTaxDetailList" class="f2bpmui-datagrid-vuetable" border show-summary :summary-method="getSummaries2">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="税种">
            <template slot-scope="scope">
              <select-dialog :model-data="rateModel" :value="scope.row.taxRateName" dynamicModel="customDialog" @updateValue="taxRateNameUpdate($event,scope.$index)"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="税基(元)">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.taxBase" size="small" placeholder="请输入" @change="changeTaxBaseFn($event,scope.$index)"/>
            </template>
          </el-table-column>
          <el-table-column label="税率(%)">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.taxRate" size="small" placeholder="自动带出" disabled></amount-input>
              <!--<select-dialog :model-data="rateModel" :value="scope.row.taxRate" dynamicModel="customDialog" @updateValue="taxRateUpdate($event,scope.$index)"></select-dialog>-->
            </template>
          </el-table-column>
          <el-table-column label="缴纳税金">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.taxes" size="small" placeholder="自动计算" disabled></amount-input>
            </template>
          </el-table-column>
          <el-table-column label="OCR税金">
            <template slot-scope="scope">
              <amount-input v-model="scope.row.ocrTaxes" size="small" placeholder="系统反写" disabled />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteAdditionTax(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <row-layout :offset="1" :title="'附件'" :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <uploaderFiles v-model="dataForm.fileInfoList" :isReadOnly="isRevise" :revise="isRevise"></uploaderFiles>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：">
          <span>{{dataForm.createUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：">
          <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：">
          <span>{{dataForm.createTime}}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import SelectDialog2 from '@/components/workflow/selector/selectorDialog2.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import uploaderFiles from '@/components/basic/uploaderFile/index.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import comMixin from '../minix';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import moment from 'moment'

  const requiredArray = ['advancePaymentWay', 'constructArchiveMainCode', 'taxPaymentVoucherNo', 'paymentPeopleUsersName','paymentTime','taxAcross',
    'fileInfoList','prepaidPeriodTime','taxUnitOrgName','advancePaymentWay','whetherEnjoyExemptionPolicy'];
  export default {
    components: { FormTitle, RowLayout, SelectDialog,NumberInput,uploaderFiles,CascSelect,amountInput,percentageInput,SelectDialog2 },
    mixins: [comMixin],
    data() {
      return {
        rowObject: {},
        numVal:'100',
        loading: false,
        formVisible: false,
        isAble: true,
        isRevise: false,
        subtableKey1:1,
        subtableKey:2,
        subtableKey2:3,
        activeName:'0',
        activeTitle:'税款信息',
        masterContractDialog: { code: 'XiangMuDangAnKaiPiaoShenQing', customDialog: 'XiangMuDangAnKaiPiaoShenQing', isSetHead: 1, isMulti: false, initailData: [] },
        invoiceModel: { code: 'invoice_collection_main', customDialog: 'invoice_collection_main', isSetHead: 1, isMulti: false, initailData: [] },
        taxAcrossDialog: { code: 'KuaShuiBaoHaoTongYong', customDialog: 'KuaShuiBaoHaoTongYong', isSetHead: 1, isMulti: false, initailData: [] },
        advancePaymentWayOptions:[], //预缴方式
        paymentStatusOptions:[], // 付款状态
        projectTaxMethod:'', // 计税方式
        hadColumnsOptions:'', // 预征栏目
        dataForm: {
          accrualExpenseStatus: '0',
          advancePaymentWay: '',
          taxRate:'',
          isOperatePlace:'',
          code: '',
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          deptId: '',
          deptName: '',
          fileInfoList: [],
          finishedTime: '',
          haveReceivedOriginalInvoice: '0',
          id: '',
          isAccountDeduct: '0',
          isDel: '',
          jsonData: '',
          lastModifyDeptId: '',
          lastModifyDeptName: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          payTaxesAmount: '',
          paymentPeopleUsersId: '',
          paymentPeopleUsersName: '',
          paymentStatus: '1',
          paymentTime: '',
          prepaidPeriodTime: '',
          procInstState: '',
          projectManagerName: '',
          remark: '',
          taxAcross: '',
          taxPaymentVoucherNo: '',
          taxUnitOrgId: '',
          taxUnitOrgName: '',
          voucherAdditionTaxDetailList: [],
          voucherCrossTaxReportId: '',
          voucherDeductDetailList: [],
          voucherTaxDetailList: [],
          whetherEnjoyExemptionPolicy: '',
          wiid:''
        },
        invoiceDialog: {
          code: '',
          customDialog: '',
          isSetHead: 1,
          isMulti: false,
          initailData: [],
          parm: {varParams: [{key: 'constructArchiveMainId', value: ''}],singleSelect:true}
        },
        dataRule: RuleRequired.dataRule(requiredArray),
        rateModel: {  //税率
          code: 'base_tax_rate_archive',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'tax_attribute',
                value: 4
              }
            ]
          }
        },
      };
    },
    computed: {
    },
    created(){
      var state = Object.toQueryString('isRevise');
      if(state) {
        this.isRevise = true;
      }

    },
    mounted() {
      this.beforeInit();
      this.afterInit();
    },
    methods: {
      beforeInit() {
        this.getDataDictByConfigType();

        const { realName, userId } = FUI.Sys.getAuthor();
        this.dataForm.paymentPeopleUsersId = userId;
        this.dataForm.paymentPeopleUsersName = decodeURIComponent(realName);
        this.dataForm.prepaidPeriodTime = moment(new Date()).format('YYYY-MM-DD');
        this.dataForm.paymentTime = moment(new Date()).format('YYYY-MM-DD');
      },
      afterInit() {
        var _this = this;
        console.log(_this.dataForm,'1234');
        _this.dataForm.createTime = Object.formatDates(_this.dataForm.createTime);

      },
      // 纳税单位
      deptUpdate(data){
        this.dataForm.taxUnitOrgId = data[0].value;
        this.dataForm.taxUnitOrgName = data[0].text;
      },
      // 缴款人
      usersUpdate(data){
        this.dataForm.paymentPeopleUsersId = data[0].userId;
        this.dataForm.paymentPeopleUsersName = data[0].realName;
      },
      /**
       * 预征税率
       * */
      constructionRateUpdate(data,index) {
        if(data && data.length > 0) {
          const {taxRate, id} = data[0];
          this.$set(this.dataForm.voucherTaxDetailList[index], 'baseTaxRateArchiveId', id);
          this.$set(this.dataForm.voucherTaxDetailList[index], 'taxRate', taxRate);
        }
      },
      /**
       *  税种
       * */
      taxRateNameUpdate(data,index){
        if(data && data.length > 0){
          const {name, taxRate, id} = data[0];
          this.$set(this.dataForm.voucherAdditionTaxDetailList[index],'baseTaxRateArchiveId',id);
          this.$set(this.dataForm.voucherAdditionTaxDetailList[index],'taxRate',taxRate);
          this.$set(this.dataForm.voucherAdditionTaxDetailList[index],'taxRateName',name);
          this.changeTaxBaseFn('',index)
        }
      },
      /**
       * 税率
       * */
      taxRateUpdate(data,index){
        if(data && data.length > 0){
          const {taxRate, id} = data[0];
          this.$set(this.dataForm.voucherAdditionTaxDetailList[index],'baseTaxRateArchiveId',id);
          this.$set(this.dataForm.voucherAdditionTaxDetailList[index],'taxRate',taxRate);
          this.changeTaxBaseFn('',index)
        }
      },
      /**
       * 项目编号
       */
      updateMasterContractValue(data) {
        if(data && data.length <= 0) return;
        const { projectManagerId, projectManagerName, constructionUnitName, constructionUnitId, code,name,id,differentPlaces,constructionrate,projectTaxMethod} = data[0];
        this.dataForm.constructArchiveMainCode = code;
        this.dataForm.constructArchiveMainName = name;
        this.dataForm.constructionUnitName = constructionUnitName;
        this.dataForm.constructionUnitId = constructionUnitId;
        this.dataForm.projectManagerName = projectManagerName;
        this.dataForm.projectManagerId = projectManagerId;
        this.dataForm.constructArchiveMainId = id;
        this.dataForm.taxRate = constructionrate;
        this.dataForm.isOperatePlace = differentPlaces;
        this.projectTaxMethod = projectTaxMethod;
        this.invoiceDialog.parm.varParams[0].value = id;
        if(this.dataForm.voucherTaxDetailList.length === 0) this.setVoucherTaxDetailList();
        if(this.dataForm.voucherAdditionTaxDetailList.length === 0) this.setVoucherAdditionTaxDetailList();
      },
      /**
       * 税跨报号
       * */
      updateTaxAcross(data){
        if(data && data.length <= 0) return;
        const {code} = data[0];
        this.dataForm.taxAcross = code;
      },
      /**
       * 发票号码
       * */
      updateInvoiceNo(data,index){
        if(data && data.length >0){
          const {invoiceNo,invoiceCode,id,sellerName,invoiceAmountTax,accumulateDeductionAmount} = data[0];
          this.$set(this.dataForm.voucherDeductDetailList[index],'invoiceCode',invoiceCode);
          this.$set(this.dataForm.voucherDeductDetailList[index],'invoiceNo',invoiceNo);
          this.$set(this.dataForm.voucherDeductDetailList[index],'invoiceCollectionMainId',id);
          this.$set(this.dataForm.voucherDeductDetailList[index],'sellerName',sellerName);
          this.$set(this.dataForm.voucherDeductDetailList[index],'invoiceAmountTax',invoiceAmountTax);
          this.$set(this.dataForm.voucherDeductDetailList[index],'accumulateDeductionAmount',accumulateDeductionAmount);
          var amount = Number(invoiceAmountTax)-Number(accumulateDeductionAmount);
          amount = Object.tofixed(amount,2);
          this.$set(this.dataForm.voucherDeductDetailList[index],'currentDeductionAmount',amount);


        }
      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({ params: { configTypes: '预缴方式,付款状态(3态),预征栏目' }});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '预缴方式':
                this.advancePaymentWayOptions = ele.dataDict;
                break;
              case '付款状态(3态)':
                this.paymentStatusOptions = ele.dataDict;
                break;
              case '预征栏目':
                this.hadColumnsOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        dataForm.prepaidPeriodTime = dataForm.prepaidPeriodTime+'-00';
        return dataForm;
      },
      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        if(_this.vaildOnlyTaxRateName() === false){
          return false
        }
        let parm = Object.toClone(_this.dataForm);
        parm.prepaidPeriodTime = parm.prepaidPeriodTime+'-00';
        return new Promise(resolve => {
          _this.$refs['form'].validate(valid => {
            if (valid) {
              return resolve(parm);
            } else {
              return resolve(false)
            }
          })
        });
      },
      handleClick(tab, event) {
        console.log(tab.index);
        if(tab.index == 0){
          var list = this.dataForm.voucherDeductDetailList;
          var list2 = this.dataForm.voucherTaxDetailList;
          var sumAmount = 0;
          if(list.length > 0 && list2.length >0){
            for(let i in list){
              sumAmount+= Number(list[i].currentDeductionAmount);
            }
          }
          for(let i=0;i<list2.length;i++){
            if(list2[i].hadColumns == '1'){
              list2[i].deductAmount = sumAmount;
            }
            this.changeTaxBase('',i)
          }
        }
      },
      // 设置 税款信息默认值
      setVoucherTaxDetailList(){
        var list = [
          {
            "actualAdvanceTax": '', // 实际预缴税额
            "baseTaxRateArchiveId": "", // 	预征率id
            "deductAmount": '', // 扣除金额
            "hadColumns": "1", // 预征栏目
            "id": "",
            "ocrTaxes": '', // 	OCR税金
            "taxBase": '',  // 税基(元)
            "taxDueAdvance": '', // 应预缴税额
            "taxRate": this.projectTaxMethod == 1?'0.02':this.projectTaxMethod == 2?'0.03':'' // 税率
        },
          {
            "actualAdvanceTax": '', // 实际预缴税额
            "baseTaxRateArchiveId": "", // 	预征率id
            "deductAmount": '', // 扣除金额
            "hadColumns": "2", // 预征栏目
            "id": "",
            "ocrTaxes": '', // 	OCR税金
            "taxBase": '',  // 税基(元)
            "taxDueAdvance": '', // 应预缴税额
            "taxRate": '' // 税率
          },
          {
            "actualAdvanceTax": '', // 实际预缴税额
            "baseTaxRateArchiveId": "", // 	预征率id
            "deductAmount": '', // 扣除金额
            "hadColumns": "3", // 预征栏目
            "id": "",
            "ocrTaxes": '', // 	OCR税金
            "taxBase": '',  // 税基(元)
            "taxDueAdvance": '', // 应预缴税额
            "taxRate": '' // 税率
          }
        ];
        this.dataForm.voucherTaxDetailList = [...list];
      },
      // 设置 默认的附加税费信息
      setVoucherAdditionTaxDetailList(){
        var list = [
          {
            "baseTaxRateArchiveId": "400000002",
            "id": "",
            "ocrTaxes": '',
            "taxBase": '',
            "taxRate": '0.07',
            "taxRateName": '城建税（7%）',
            "taxes": ''
          },
          {
            "baseTaxRateArchiveId": "400000010",
            "id": "",
            "ocrTaxes": '',
            "taxBase": '',
            "taxRate": '0.03',
            "taxRateName": '教育费附加（3%）',
            "taxes": ''
          },
          {
            "baseTaxRateArchiveId": "400000020",
            "id": "",
            "ocrTaxes": '',
            "taxBase": '',
            "taxRate": '0.02',
            "taxRateName": '地方教育费附加（2%）',
            "taxes": ''
          }
        ];
        this.dataForm.voucherAdditionTaxDetailList = [...list];
      },
      // 添加扣除信息
      addInvoiceList(){
        var that = this;
        if (!that.dataForm.voucherDeductDetailList) that.dataForm.voucherDeductDetailList = [];
        that.dataForm.voucherDeductDetailList.push({
          "accumulateDeductionAmount": '',
          "currentDeductionAmount": '',
          "id": "",
          "invoiceAmountTax": '',
          "invoiceCode": "",
          "invoiceCollectionMainId": "",
          "invoiceNo": "",
          "sellerName": ""
        });

      },
      // 删除扣除信息
      deleteInvoice(index){
        var that = this;
        that.dataForm.voucherDeductDetailList.splice(index, 1);
      },
      // 添加附加税费信息
      addAdditionTax(){
        var that = this;
        if (!that.dataForm.voucherAdditionTaxDetailList) that.dataForm.voucherAdditionTaxDetailList = [];
        that.dataForm.voucherAdditionTaxDetailList.push({
          "baseTaxRateArchiveId": "",
          "id": "",
          "ocrTaxes": '',
          "taxBase": '',
          "taxRate": '',
          "taxRateName": '',
          "taxes": ''
        });
      },
      // 删除附加扣除信息
      deleteAdditionTax(index){
        var that = this;
        that.dataForm.voucherAdditionTaxDetailList.splice(index, 1);
        this.getPayTaxesAmountFn();
      },
      // 税款信息--计算应预缴税额
      changeTaxBase(e,index){
        var amount1 = this.dataForm.voucherTaxDetailList[index].taxBase; // 税基
        var amount2 = this.dataForm.voucherTaxDetailList[index].deductAmount; // 扣除金额
        var taxRate = this.dataForm.voucherTaxDetailList[index].taxRate; // 预征率（%）
        var taxNum = this.dataForm.taxRate; // 税率（项目档案带出）
        if(amount1 && taxRate){
          var amount3 = ((Number(amount1)-Number(amount2))/(1+Number(taxNum)))*Number(taxRate); // 应预缴税额
          amount3 = Object.tofixed(amount3,2);
          this.$set(this.dataForm.voucherTaxDetailList[index],'taxDueAdvance',amount3);
          this.$set(this.dataForm.voucherTaxDetailList[index],'actualAdvanceTax',amount3);
          this.getPayTaxesAmountFn();
        }
      },
      // 附加税款信息
      changeTaxBaseFn(e,index){
        var amount1 = this.dataForm.voucherAdditionTaxDetailList[index].taxBase; // 税基
        var taxRate = this.dataForm.voucherAdditionTaxDetailList[index].taxRate; // 预征率（%）

        var amount2 = 0;
        if(amount1 && taxRate){
          amount2 = Number(amount1)*Number(taxRate);
          amount2 = Object.tofixed(amount2,2);
          this.$set(this.dataForm.voucherAdditionTaxDetailList[index],'taxes',amount2);
          this.getPayTaxesAmountFn();
        }
      },
      // 合计
      getSummaries1(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['currentDeductionAmount'])); //  金额(含税)
          if (!values.every(value => isNaN(value))) {
            sums[4] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[4] = Object.numberFixed(sums[4], 2);
          } else {
            sums[4] = '';
          }
        });

        return sums;
      },
      // 合计
      getSummaries2(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['taxes'])); //  金额(含税)
          if (!values.every(value => isNaN(value))) {
            sums[4] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[4] = Object.numberFixed(sums[4], 2);
          } else {
            sums[4] = '';
          }
        });

        return sums;
      },
      // 合计
      getSummaries3(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['actualAdvanceTax'])); //  实际预缴税额
          if (!values.every(value => isNaN(value))) {
            sums[6] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[6] = Object.numberFixed(sums[6], 2);
          } else {
            sums[6] = '';
          }
        });

        return sums;
      },
      // 获取缴纳金额（税款信息页签 实际预缴税额+ 附加税费信息页签 缴纳税金 的合计值）
      getPayTaxesAmountFn(){
        var list1 = this.dataForm.voucherTaxDetailList;
        var list2 = this.dataForm.voucherAdditionTaxDetailList;
        var amount1 = 0; // 实际预缴税额 合计
        var amount2 = 0; // 缴纳税金 合计
        if(list1 && list1.length >0){
          for(let i in list1){
            amount1+= Number(list1[i].actualAdvanceTax);
          }
        }
        if(list2 && list2.length >0){
          for(let i in list2){
            amount2+= Number(list2[i].taxes);
          }
        }
        var amount3 = Number(amount1) + Number(amount2);
        this.dataForm.payTaxesAmount = Object.tofixed(amount3,2);
      },
      // 校验附加税费税种名称唯一性
      vaildOnlyTaxRateName(){
        var list = this.dataForm.voucherAdditionTaxDetailList; //附加税费信息
        if(list && list.length>1){
          var arr = [];
          for(let i in list){
            arr.push(list[i].taxRateName);
          }
          var states = Object.isRepeat(arr);
          console.log(states, '23')
          if (states === true) {
            FUI.Window.showMsg2('附加税费信息中，税种名称存在不唯一，请检查重复数据');
            return false;
          }
        }

      },
      // 根据字典转换枚举值
      fomentTxtByValue(val){
        if(val){
          let arr = this.hadColumnsOptions;
          for(let i in arr){
            if(arr[i].configValue == val){
              return arr[i].configName
            }
          }
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
  .el-upload__prompt{
    color: #F56C6C;
    font-size: 14px;
    font-weight: normal;
    line-height: 25px;
  }
  .link-box{
    color: #409EFF;
    font-weight: normal;
    padding: 0 15px;
  }
</style>
