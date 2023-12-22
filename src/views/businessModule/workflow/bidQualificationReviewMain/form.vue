<template>
  <!-- 资格预审文件评审 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="150px">
      <row-layout title="立项信息" :cols="3">
        <el-form-item slot="col_1" prop="isContractor" label="是否预选承包商：">
          <el-radio-group v-model="dataForm.isContractor" @change="changeIsContractor">
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketMainCode" label="入库编号：" v-if="dataForm.isContractor == 1">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="marketModel" @updateValue="marketUpdate" :value="dataForm.marketMainCode || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketMainCode" label="立项编号：" v-else>
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :modelData="marketModel" :width="900" :height="360" @updateValue="marketUpdate" :value="dataForm.marketMainCode || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="marketMainName" label="立项名称：">
          <el-input v-model="dataForm.marketMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="立项类型：">
          <el-select v-model="dataForm.projectType" :placeholder="msgTip.AUTO_PLACEHOLDER" style="width: 100%" disabled size="small">
            <el-option v-for="(item,index) in marketCategoryArray" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="marketUnitName" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="业务中心：">
          <el-input v-model="dataForm.marketCenterName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" label="客户：">
          <el-input v-model="dataForm.customerMainName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_3" label="工程造价(元)：" v-if="dataForm.isContractor == 0">
          <amount-input v-model="dataForm.projectCost" defaultValue :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="dataForm.isContractor == 0">
        <el-form-item slot="col_1"  label="产品线：" >
          <el-input v-model="dataForm.productLineName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2"  label="招投标形式：">
          <el-select v-model="dataForm.bidForm" :placeholder="msgTip.AUTO_PLACEHOLDER" style="width: 100%" disabled size="small">
            <el-option v-for="(item,index) in bidFormArray" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="项目地址：">
          <el-input v-model="dataForm.projectAddress" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="bidDeadLine" label="投标截止时间：">
          <el-date-picker v-model="dataForm.bidDeadLine" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" size="small" :placeholder="msgTip.SELECT_PLACEHOLDER"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" label="入库片区：" v-if="dataForm.isContractor == 1">
          <el-input v-model="dataForm.depositdistrict" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="详情地址：" v-else>
          <el-input v-model="dataForm.detailAddress" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="totalDesignPrice" label="设计总价(元)：">
          <amount-Input v-model="dataForm.totalDesignPrice"  :placeholder="msgTip.ENTER_PLACEHOLDER" ></amount-Input>
        </el-form-item>
          <el-form-item slot="col_2" label="投标保证金(元)：">
            <amount-Input v-model="dataForm.payForBid"  :placeholder="msgTip.ENTER_PLACEHOLDER" ></amount-Input>
          </el-form-item>
          <el-form-item slot="col_3" label="履约保证金(元)：">
            <amount-Input v-model="dataForm.performanceBond"  :placeholder="msgTip.ENTER_PLACEHOLDER" ></amount-Input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="bidAgency" label="招标代理机构：">
          <el-input v-model="dataForm.bidAgency" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="applicantTenderPreparaUserId" label="标书制作申请人：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="dialogModel" @updateValue="usersUpdate" :value="dataForm.applicantTenderPreparaUserName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectUsers"></select-dialog>

        </el-form-item>
        <el-form-item slot="col_3" prop="applicantTenderPreparaDeptId" label="标书制作申请人所在部门：" label-width="170px">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="500" :height="360" @updateValue="deptUpdate" :value="dataForm.applicantTenderPreparaDeptName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectOrg"></select-dialog>

        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isBudgetGroupBidSeal" label="是否预算组封标：">
          <el-radio-group v-model="dataForm.isBudgetGroupBidSeal" >
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="isOnlinePublicity" label="是否网上公示：">
          <el-radio-group v-model="dataForm.isOnlinePublicity" >
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="bondSecurity" label="履约保函：">
          <number-input v-model="dataForm.bondSecurity" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" >
        <el-form-item slot="col_1" prop="isGuarantee" label="是否押证：">
          <el-radio-group v-model="dataForm.isGuarantee" >
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" :prop="dataForm.isGuarantee == 1?'pledgeDuration':''" label="押证时长（天）：">
          <el-input type="number" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.pledgeDuration"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="duration" label="工期（天）：">
          <el-input type="number" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER"  v-model="dataForm.duration"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" >
        <el-form-item slot="col_1" prop="isLock" label="是否锁证：">
          <el-radio-group v-model="dataForm.isLock" >
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" :prop="dataForm.isLock == 1?'lockingtime':''" label="锁证时长（天）：">
          <el-input type="number" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER"  v-model="dataForm.lockingtime"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="periodWarranty" label="保质期（天）：">
          <el-input type="number" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.periodWarranty"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="isagainbid" label="投标/回标：">
          <el-radio-group v-model="dataForm.isagainbid">
            <el-radio v-for="(item,index) in isagainbidArray" :label="item.configValue" :key="index">{{item.configName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="2-1" :offset="1">
        <el-form-item slot="col_1" prop="tenderDocumentDrawProvid" label="招标文件及图纸资料情况：" label-width="180px">
          <el-radio-group v-model="dataForm.tenderDocumentDrawProvid">
            <el-radio v-for="(item,index) in tenderDocumentDrawProvidArray" :label="item.configValue" :key="index">{{item.configName}}</el-radio>
          </el-radio-group>
          <el-form-item label=" " label-width="10px" :prop="dataForm.tenderDocumentDrawProvid == -1?'tenderDocumentDrawProvidOther':''" v-show="dataForm.tenderDocumentDrawProvid == -1">
            <el-input size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.tenderDocumentDrawProvidOther"></el-input>
          </el-form-item>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="relevantClauseRemark" label="备注：">
          <el-input type="textarea" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}" v-model="dataForm.relevantClauseRemark" maxlength="250"></el-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'相关条款'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="qualitystandard" label="重点要求及违约责任：">
          <el-input type="textarea" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}" v-model="dataForm.qualitystandard" maxlength="250"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="relevantPrice" label="相关计价条款：">
          <el-input type="textarea" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}" v-model="dataForm.relevantPrice" maxlength="250"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout title="附件" :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件：">
          <uploader-file v-model="dataForm.fileInfo"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-1-1">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <span>{{dataForm.createUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制部门：">
          <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
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
  import AmountInput from '@/components/basic/numberInput/amountInput.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import UploaderFile from '@/components/basic/uploaderFile/index.vue';
  import {
    RADIO_GROUP,
    BUSINERSSUNIT_MODEL,
    FOLLOWER_MODEL,
    PROJECT_LEADER_MODEL,
    CUSTOMER_MODEL,
    PRODUCTLINE_MODEL,
    MARKETMAIN_MODEL,
    MARKETCONTRACTOR_MODEL
  } from '@/views/businessModule/enum/param';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import { checkBidQualificationReviewInfo } from '@/Api/contract/index.js'
  import moment from 'moment'

  import comMixin from '../minix';
  /*资格预审文件评审*/
  export default {
    components: { FormTitle, RowLayout, SelectDialog, NumberInput, CascSelect, UploaderFile,AmountInput },
    mixins: [comMixin],
    data() {
      return {
        // marketModel: MARKETMAIN_MODEL,  //营销立项
        marketModel: {},
        customerModel: CUSTOMER_MODEL,  //客户 客商档案弹框
        productLineModel:PRODUCTLINE_MODEL,  //产品线弹框
        marketContractorModel: MARKETCONTRACTOR_MODEL, // 预选承包商入库
        dialogModel: FOLLOWER_MODEL,  //跟进人
        rowObject: {},
        fileList: [],
        numVal:'100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        radioData: RADIO_GROUP,
        marketModelData: BUSINERSSUNIT_MODEL,
        dataForm: {
          applicantTenderPreparaDeptId: '',
          applicantTenderPreparaUserId: '',
          bidAgency: '',
          bidDeadLine: '',
          bidForm: '',
          bondSecurity: '',
          breachDuty: '',
          businessKey: '',
          code: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerMainName: '',
          depositdistrict: '',
          deptId: '',
          deptName: '',
          detailAddress: '',
          dscode: '',
          duration: '',
          fileInfo: [],
          formid: '',
          id: '',
          isBudgetGroupBidSeal: '',
          isContractor: '1',
          isDel: '',
          isGuarantee: '',
          isLock: '',
          isOnlinePublicity: '',
          isagainbid: '',
          jsonData: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lockingtime: '',
          marketCenterName: '',
          marketMainCode: '',
          marketMainId: '',
          marketMainName: '',
          marketUnitName: '',
          memo: '',
          name: '',
          otherRisk: '',
          payForBid: '',
          performanceBond: '',
          periodWarranty: '',
          pledgeDuration: '',
          procInstState: '',
          productLineName: '',
          projectAddress: '',
          projectCost: '',
          projectType: '',
          qualificationScope: '',
          qualificationScopeId: '',
          qualitystandard: '',
          relevantClauseRemark: '',
          relevantPrice: '',
          reviewResult: '',
          tenderDocumentDrawProvid: '',
          tenderDocumentDrawProvidOther: '',
          totalDesignPrice: '',
          applicantTenderPreparaDeptName: '',
          applicantTenderPreparaUserName: '',
          wiid:''
        },
        marketTypeArray: [],  //立项类型
        bidFormArray: [],  //招投标形式
        isagainbidArray: [],  //投标/回标
        marketCategoryArray:[],  //立项类别
        tenderDocumentDrawProvidArray:[],  //招标文件及图纸资料
        constructorRequirementArray: [
          { id: 0, label: '无' },
          { id: 1, label: '一级' },
          { id: 2, label: '二级'}
        ],  //建造师要求
        marketStatusArray: [],  //项目当前状态
        msgTip: RuleRequired.tipMsg,
        setPromptText:'允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx',
        //添加必填项 字段
        //必填项字段
        dataRule: RuleRequired.dataRule(['totalDesignPrice', 'marketMainCode','bidAgency', 'isBudgetGroupBidSeal', 'isOnlinePublicity', 'isGuarantee','isLock',
          'isagainbid', 'tenderDocumentDrawProvid', 'qualitystandard', 'relevantPrice','pledgeDuration','lockingtime','tenderDocumentDrawProvidOther',
          'fileInfo', 'bidDeadLine'])
      }
    },
    computed: {
      //索证时长
      lockTimeDisStatus({ dataForm }) {
        return dataForm.isLock === 0 || dataForm.isLock === '';
      },
    },
    mounted() {

    },
    methods: {
      beforeInit(){
        this.isLockChange(this.dataForm.isLock);
        this.getDataDictByConfigType("立项类型,招投标形式,是否投标/回标,立项类别,招标文件及图纸资料");
        this.marketModel = {
          //营销立项
          code: 'market_main_CP145',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'is_contractor',
                value: this.dataForm.isContractor
              }
            ]
          }
        }
      },
      afterInit() {
        let { isLock, isGuarantee, isOnlinePublicity,isBudgetGroupBidSeal,isContractor,totalDesignPrice,payForBid,performanceBond,projectCost,projectType } = this.dataForm;
        this.dataForm.isLock = (isLock !== '') ? (isLock).toString() : '';
        this.dataForm.isGuarantee = (isGuarantee !== '') ? (isGuarantee).toString() : '';
        this.dataForm.isOnlinePublicity = (isOnlinePublicity !== '') ? (isOnlinePublicity).toString() : '';
        this.dataForm.isBudgetGroupBidSeal = (isBudgetGroupBidSeal !== '') ? (isBudgetGroupBidSeal).toString() : '';
        this.dataForm.isContractor = (isContractor !== '') ? (isContractor).toString() : '';
        this.dataForm.totalDesignPrice = (totalDesignPrice !== '') ? (totalDesignPrice).toString() : '';
        this.dataForm.payForBid = (payForBid !== '') ? (payForBid).toString() : '';
        this.dataForm.performanceBond = (performanceBond !== '') ? (performanceBond).toString() : '';
        this.dataForm.projectCost = projectCost ? (projectCost).toString() : '';
        this.dataForm.projectType = projectType ? (projectType).toString() : '';

      },
      // 是否预选承包商
      changeIsContractor(){
        var val = this.dataForm.isContractor;
        this.marketModel = {
          //营销立项
          code: 'market_main_CP145',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'is_contractor',
                value: val
              }
            ]
          }
        };
        const arr = ['marketMainCode','marketMainName','marketMainId','projectType','marketUnitName','marketCenterName','projectAddress','productLineName','customerMainName', 'bidForm','projectCost','detailAddress','depositdistrict'];
        for(let i in arr){
          this.$set(this.dataForm,arr[i], '')
        }
        this.$forceUpdate();
      },
      //是否索证 为是时 索证时长为必填 否则取消必填
      isLockChange(e) {
        let status = (e == 1) ? true : false;
        this.dataRule['lockTime'] = RuleRequired.curFiledRule(status);
      },
      //选择立项类型
      marketTypeChange(e) {
        this.$set(this.qualificationScopeModel.parm, 'varParams', [{ key:'project_type',value:e}]);
      },
      //招投标形式
      bidFormChange(e) {
        this.dataForm.bidForm = e;
      },
      //选择营销立项
      marketUpdate(data) {
        this.dataForm.marketMainCode = data[0].code;
        this.dataForm.marketMainName = data[0].name;
        this.dataForm.marketMainId = data[0].id;
        this.dataForm.projectType = data[0].projectType;
        this.dataForm.marketUnitName = data[0].marketunitname;
        this.dataForm.marketCenterName = data[0].marketcentername;
        this.dataForm.projectAddress = data[0].address;
        this.dataForm.productLineName = data[0].productlinename;
        this.dataForm.customerMainName = data[0].customerName;
        // this.dataForm.customerId
        this.dataForm.bidForm = data[0].bidForm;
        this.dataForm.projectCost = (data[0].projectAmount)?(data[0].projectAmount).toString():'';
        this.dataForm.detailAddress = data[0].detailAddress;
        this.dataForm.depositdistrict = data[0].depositDistrict;
      },
      // 标书制作申请人
      usersUpdate(data){
        this.dataForm.applicantTenderPreparaUserId = data[0].userId;
        this.dataForm.applicantTenderPreparaUserName = data[0].realName;
      },
      // 标书制作申请人所在部门
      deptUpdate(data){
        this.dataForm.applicantTenderPreparaDeptId = data[0].id;
        this.dataForm.applicantTenderPreparaDeptName = data[0].text;
      },
      //项目地址
      changeAdressSelect(data) {
        this.dataForm.address = data.value || '';
      },
      //项目介绍人
      projectleaderNameUpdate(data) {
        this.dataForm.projectLeaderName = data[0].personName;  //项目介绍人
        this.dataForm.projectLeaderId = data[0].id;  //项目介绍人id
      },
      customerUpdate(data) {
        this.dataForm.customerName = data[0].customerName;
        this.dataForm.customerId = data[0].id;
      },
      //资质范围
      qualificationScopeUpdate(data) {
        this.dataForm.qualificationScope = data[0].id;
        this.dataForm.qualificationScopeName = data[0].name;
      },
      marketUnitUpdateValue(data) {
        this.dataForm.marketUnitName = data[0].businessUnit;  //业务单元
        this.dataForm.marketUnitId = data[0].superiorBusinessUnitId;  //业务单元Id
        this.dataForm.marketCenterName = data[0].affiliatedBusinessCenterName;  //业务中心
        this.dataForm.marketCenterId = data[0].affiliatedBusinessCenterId;  //业务中心Id
        this.dataForm.code = data[0].code;  //立项编号
      },
      //产品线弹框 返回数据
      productLineUpdate(data) {
        this.dataForm.productlinename = data[0].name;
        this.dataForm.productLineId = data[0].id;
      },
      //项目当前状态
      marketStatusChange(e) {
        console.log("项目当前状态===：", e);
      },
      async getDataDictByConfigType(configTypes) {
        const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
        if (success) {
          if (data && data.length > 0) {
            this.marketTypeArray = data.find(item => item.dataDictType === '立项类型')?.dataDict || [];
            this.bidFormArray = data.find(item => item.dataDictType === '招投标形式')?.dataDict || [];
            this.isagainbidArray = data.find(item => item.dataDictType === '是否投标/回标')?.dataDict || [];
            this.marketStatusArray = data.find(item => item.dataDictType === '项目当前状态')?.dataDict || [];
            this.marketCategoryArray = data.find(item => item.dataDictType === '立项类型')?.dataDict || [];
            this.tenderDocumentDrawProvidArray = data.find(item => item.dataDictType === '招标文件及图纸资料')?.dataDict || [];
          }
        }
      },
      updateValue(data) {
        this.dataForm.name = data[0].text;
      },
      //建造师要求
      constructorChange(e) {
        this.dataForm.constructorRequirement = e;
      },
      //立项类别
      marketCategoryChange(e) {
        this.dataForm.marketCategory = e;
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        dataForm.bidDeadLine = dataForm.bidDeadLine?moment(new Date(dataForm.bidDeadLine)).format('YYYY-MM-DD HH:mm:ss'):'';
        dataForm.bondSecurity = Number(dataForm.bondSecurity);
        return dataForm;
      },
      validateForm() {
        const _this = this;
        let parm = Object.toClone(_this.dataForm);
        parm.bidDeadLine =parm.bidDeadLine?moment(new Date(parm.bidDeadLine)).format('YYYY-MM-DD HH:mm:ss'):'';
        parm.bondSecurity = Number(parm.bondSecurity);
        if(_this.checkBidQualificationReviewInfoFn() === false){
          return false
        }
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              return resolve(parm);
            } else {
              return resolve(false)
            }
          })
        });
      },
      // 投标验证
      async checkBidQualificationReviewInfoFn(){
        var that = this;
        var isagainbid = that.dataForm.isagainbid;
        var marketMainId = that.dataForm.marketMainId;
        if(marketMainId && isagainbid) {
          let params = {
            id: that.dataForm.id,
            isAgainBid: isagainbid,
            marketMainId: marketMainId
          };
          const res = await checkBidQualificationReviewInfo(params);
          if (res.code === 200) {
            if (res.data) {
              return true
            } else {
              let msg = '';
              if (isagainbid == 1) msg = '“投标” 只能有一条审批通过的数据';
              if (isagainbid == 2) msg = '“回标/询标” 要在“投标”流程审批通过后才能发起';
              FUI.Window.showMsg2(msg);
              return false
            }

          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">

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

</style>
