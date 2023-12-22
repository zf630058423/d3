<template>
  <!-- 营销立项修订表单 -->
  <div v-loading="loading" class="flow-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <row-layout title="业务单元信息" :cols="3">
        <el-form-item slot="col_1" prop="marketUnitName" label="业务单元：">
          <select-dialog :disabled="true" :btnDisabled="reviseDisabe('marketUnitName')" :width="800" :modelData="marketModelData" :height="360" :value="dataForm.marketUnitName" @updateValue="marketUnitUpdateValue" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
          <el-form-item slot="col_2" prop="marketCenterName" label="业务中心：">
            <el-input v-model="dataForm.marketCenterName" :disabled="reviseDisabe('marketCenterName')" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
          </el-form-item>
          <el-form-item slot="col_3" prop="followerName" label="跟进人：">
            <select-dialog :disabled="true" :btnDisabled="reviseDisabe('followerName')" :width="900" :height="360" :modelData="dialogModel" @updateValue="followerUpdate" :value="dataForm.followerName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout title="立项信息" :cols="3">
        <el-form-item slot="col_1" prop="name" label="立项名称：">
            <text-input v-model="dataForm.name" size="small" :disabled="reviseDisabe('name')" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="code" label="立项编号：">
            <el-input v-model="dataForm.code" :disabled="reviseDisabe('code')" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_3" prop="productLineName" label="产品线：">
            <select-dialog :disabled="true" :btnDisabled="reviseDisabe('productLineName')" :width="900" :height="360" :modelData="productLineModel" @updateValue="productLineUpdate" :value="dataForm.productLineName || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :offset="0" :cols="3">
        <el-form-item slot="col_1" prop="projectAmount" label="工程造价(元)：">
            <amount-input v-model="dataForm.projectAmount" @change="projectAmountChagne" :disabled="reviseDisabe('projectAmount')" defaultValue clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
          </el-form-item>
        <el-form-item slot="col_2" prop="projectLeaderName" label="项目介绍人：">
            <select-dialog :disabled="true" :btnDisabled="reviseDisabe('projectLeaderName')" :width="900" :height="360" :modelData="projectLeaderModel" @updateValue="projectleaderNameUpdate" :value="dataForm.projectLeaderName || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="projectType" label="立项类型：">
            <el-select v-model="dataForm.projectType" :disabled="reviseDisabe('projectType')" :placeholder="msgTip.SELECT_PLACEHOLDER" @change="marketTypeChange">
            <el-option
              v-for="item in marketTypeArray"
              :key="item.configValue"
              :label="item.configName"
              :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerName" label="客户：">
          <select-dialog :disabled="true" :btnDisabled="reviseDisabe('customerName')" :width="900" :height="360" :modelData="customerModel" @updateValue="customerUpdate" :value="dataForm.customerName || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="qualificationScopeName" label="资质范围：">  
          <select-dialog :disabled="true" :btnDisabled="reviseDisabe('qualificationScopeName')" :width="900" :height="360" :modelData="qualificationScopeModel" @updateValue="qualificationScopeUpdate" :value="dataForm.qualificationScopeName || msgTip.SELECT_PLACEHOLDER" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="marketCategory" label="立项类别：">
            <el-select v-model="dataForm.marketCategory" :disabled="reviseDisabe('marketCategory')" @change="marketCategoryChange" :placeholder="msgTip.SELECT_PLACEHOLDER">
            <el-option
              v-for="item in marketCategoryArray"
              :key="item.configValue"
              :label="item.configName"
              :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerContact" label="客户联系人：">
          <el-input v-model="dataForm.customerContact" :disabled="reviseDisabe('customerContact')" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="customerPhone" label="客户联系电话：">
            <el-input v-model="dataForm.customerPhone" :disabled="reviseDisabe('customerPhone')" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_3" prop="marketStatus" label="项目当前状态：">
            <el-select v-model="dataForm.marketStatus" :disabled="reviseDisabe('marketStatus')" @change="marketStatusChange" :placeholder="msgTip.SELECT_PLACEHOLDER">
            <el-option
                v-for="item in marketStatusArray"
                :key="item.configValue"
                :label="item.configName"
                :value="item.configValue">
                {{ item.configName }}
              </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="address" label="项目地址（省-市）：">
            <casc-select code="AddressCascade" :disabled="reviseDisabe('address')" :defaultValue="dataForm.address" @change-select="changeAdressSelect"></casc-select>
          </el-form-item>
        <el-form-item slot="col_2" label="详细地址：">
          <el-input v-model="dataForm.detailAddress" :disabled="reviseDisabe('detailAddress')" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item slot="col_1" prop="remark" label="备注：">
            <el-input type="textarea" :placeholder="msgTip.ENTER_PLACEHOLDER" :disabled="reviseDisabe('remark')" rows="2" v-model="dataForm.remark"></el-input>
          </el-form-item>
      </row-layout>
      <row-layout title="招标内容及要求" :cols="3">
        <el-form-item slot="col_1" prop="estimateBidDate" label="预估投标日期：">
          <el-date-picker v-model="dataForm.estimateBidDate" :disabled="reviseDisabe('estimateBidDate')" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="bidForm" label="招投标形式：">
           <el-select v-model="dataForm.bidForm" @change="bidFormChange" :disabled="reviseDisabe('bidForm')" :placeholder="msgTip.SELECT_PLACEHOLDER">
            <el-option
              v-for="item in bidFormArray"
              :key="item.configValue"
              :label="item.configName"
              :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="isPublicInternet" label="网上公示：">
          <el-radio-group v-model="dataForm.isPublicInternet" :disabled="reviseDisabe('isPublicInternet')">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioData">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
         <el-form-item slot="col_1" prop="isLocalFilingRequired" label="是否要求当地备案：">
           <el-radio-group v-model="dataForm.isLocalFilingRequired" :disabled="reviseDisabe('isLocalFilingRequired')">
              <el-radio :label="item.label" :key="item.label" v-for="item in radioData">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_2" prop="isLock" label="是否索证：">
          <el-radio-group v-model="dataForm.isLock" @change="isLockChange" :disabled="reviseDisabe('isLock')">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioData">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="lockTime" label="锁证时长(天)：">
          <amount-input type="text" :disabled="lockTimeDisStatus" :decimalNum="0" v-model="dataForm.lockTime"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
         <el-form-item slot="col_1" prop="isLocalConstructionRequired" label="是否要求当地报建：">
          <el-radio-group v-model="dataForm.isLocalConstructionRequired" :disabled="reviseDisabe('isLocalConstructionRequired')">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioData">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="constructorRequirement" label="建造师要求：">
           <el-select v-model="dataForm.constructorRequirement" :disabled="reviseDisabe('constructorRequirement')" @change="constructorRequirementChange">
            <el-option
              v-for="item in constructorRequirementArray"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructorAbnormal" label="建造师要求是否异常：">
          <el-radio-group v-model="dataForm.constructorAbnormal" :disabled="reviseDisabe('constructorAbnormal')">
            <el-radio :label="item.label" :key="item.value" v-for="item in radioData">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout title="附件" :cols="3" cell="3">
         <el-form-item slot="col_1" prop="fileInfo" label="附件：">
          <uploader-file v-model="dataForm.fileInfo" :revise="revise" :isReadOnly="isReadOnlyStatus" :disabled="reviseDisabe('fileInfo')"></uploader-file>
          <!-- <p class="el-upload__prompt">{{setPromptText}}</p> -->
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-1-1">
         <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
             <!-- <el-input type="text" disabled placeholder="编制人" v-model="dataForm.createUserName"></el-input> -->
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制部门：">
          <label class="label-style">{{dataForm.deptName}}</label>
          <!-- <el-input type="text" disabled placeholder="编制人" v-model="dataForm.deptName"></el-input> -->
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <label class="label-style">{{dataForm.createTime}}</label>
          <!-- <el-date-picker class="commponent-height" :disabled="reviseDisabe('createTime')" v-model="dataForm.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import myFun from '@/utils/fun.js';
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import CascSelect from '@/components/basic/cascSelect/index.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import {
  RADIO_GROUP,
  BUSINERSSUNIT_MODEL,
  FOLLOWER_MODEL,
  PROJECT_LEADER_MODEL,
  CUSTOMER_MODEL,
  PRODUCTLINE_MODEL
} from '@/views/businessModule/enum/param';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { getDataDictByConfigType, getCheckProjectManager } from '@/Api/dataDict.js'
import moment from 'moment'

import comMixin from '../minix';

export default {
  components: { FormTitle, RowLayout, TextInput, SelectDialog, AmountInput, CascSelect, UploaderFile },
  mixins: [comMixin],
  data() {
    return {
      dialogModel: FOLLOWER_MODEL,  //跟进人
      projectLeaderModel: PROJECT_LEADER_MODEL,  //项目介绍人
      qualificationScopeModel: {  //资质范围
       code: 'ZiZhiFanWei',
        parm: {
          isEnableAuthor: 0,
          data: [],
          isMulti: true,
          varParams: [
            {
              key: 'project_type',
              value: 1
            }
          ]
        }
      },
      customerModel: CUSTOMER_MODEL,  //客户 客商档案弹框
      productLineModel:PRODUCTLINE_MODEL,  //产品线弹框
      rowObject: {},
      fileList: [],
      numVal:'100',
      loading: false,
      formVisible: false,
      dialogVisible: false,
      radioData: RADIO_GROUP,
      marketModelData: BUSINERSSUNIT_MODEL,
      reviseState: false, // 是否为修订状态
      revise: false,
      dataForm: {
        marketUnitId:'',  //业务单元Id
        marketUnitName: '',  //业务单元
        marketCenterId: '',  //业务中心id
        marketCenterName: '',  //业务中心
        followerId: '',  //跟进人id
        followerName: '',  //跟进人
        name: '',  //立项名称
        code: '',  //立项编号
        productLineId:'',  //产品线id
        productLineName: '',  //产品线
        projectAmount: '',  //工程造价
        projectLeaderId:'',  //项目介绍人id
        projectLeaderName: '',  //项目介绍人
        projectType: '', //立项类型 立项
        marketCategory:'',  //立项类别
        customerContact: '',  //客户联系人
        customerPhone: '', //客户联系电话
        customerId:'',  //客户名称
        customerName: '',  //客户
        // marketStatus: '',   //项目当前状态  
        qualificationScope: '',  //资质范围 Id
        qualificationScopeName:'', //资质范围 Name
        address: '',  //项目地址（省-市）
        detailAddress: '',  //详细地址
        remark: '',  //备注
        estimateBidDate: '',  //预估投标日期
        bidForm: '', //招投标形式
        isPublicInternet: '',  //网上公示
        isLocalFilingRequired: '',  //是否要求当地备案
        isLocalConstructionRequired: '',//是否要求当地报建
        isLock:'',  //是否锁证
        lockTime: '',  //锁证时长(天)
        constructorRequirement: '', //建造师要求
        constructorAbnormal: '',  //建造师要求是否异常
        fileName: '',  //附件
        createUserName: '', //编制人
        deptName: '',  //编制部门
        createTime: '',  //编制时间
        fileInfo:[]
      },
      marketTypeArray: [],  //立项类型
      bidFormArray: [],  //招投标形式
      qualificationScopeArray: [],  //资质范围
      marketCategoryArray:[],  //立项类别
      constructorRequirementArray: [
        { id: '0', label: '无' },
        { id: '1', label: '一级' },
        { id: '2', label: '二级'}
      ],  //建造师要求
      marketStatusArray: [],  //项目当前状态
      nodeStatus: 0,
      nodeName: '',
      cpmStatus: false,
      isCurApprove: false,  //是否是当前审批人
      msgTip: RuleRequired.tipMsg,
      setPromptText:'允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx',
      //添加必填项 字段
      //必填项字段
      dataRule: RuleRequired.dataRule(['marketUnitName', 'followerName','name', 'productLineName', 'projectAmount', 'marketType','lockTime',
        'customerName', 'qualificationScopeName', 'marketCategory', 'customerContact',
        'customerPhone', 'detailAddress','address','estimateBidDate', 'bidForm', 'isPublicInternet',
        'isLocalFilingRequired', 'isLocalConstructionRequired', 'constructorRequirement'])
    }
  },
  computed: {
    //索证时长
    lockTimeDisStatus({ dataForm }) {
      return dataForm.isLock === 0 || dataForm.isLock === '';
    },
    //如果是修订状态 必填项字段 
    reviseDisabe({ reviseState, setting }) { 
      return (fieldText) => { 
        //fileInfo
        let fieldArray = ['name','followerName', 'qualificationScopeName', 'isLocalConstructionRequired', 'isLocalFilingRequired',
          'isLock', 'lockTime', 'isPublicInternet', 'constructorRequirement', 'customerName', 'address', 'projectType', 'projectAmount',
          'bidForm','productLineName','estimateBidDate'];  //存放可选字段
        if (reviseState) { 
          return fieldArray.includes(fieldText) ? false : true;
        }
        return setting.readonly;
      }
    },
    isReadOnlyStatus({ nodeStatus, dataForm }) {
      const { fileInfo } = dataForm;
      let status = (nodeStatus === 1 || nodeStatus === 5 || nodeStatus === 0) ? false : true;
      this.dataForm.fileInfo = fileInfo && fileInfo.length > 0 ? fileInfo.map(item => ({
        ...item,
        isReadOnly: !status
      })) : [];
      return status;
    }
  },
  created() { 
    const code = Object.toQueryString('reviseCode');
    this.reviseState = code ? true : false;
    this.reviseRequired();
  },
  methods: {
    beforeInit() { 
      this.isLockChange(this.dataForm.isLock);
      this.getDataDictByConfigType("立项类型,招投标形式,资质范围,立项类别,项目当前状态");
      // this.initData();
    },
    //修订状态时字段判断
    reviseRequired() { 
      this.setting.readonly = this.reviseState;
      this.dataRule['projectLeaderName'] = RuleRequired.curFiledRule(true);  //项目介绍人
      // this.dataRule['fileInfo'] = RuleRequired.curFiledRule(true);  //附件
    },
    //获取详情后的赋值情况
    afterInit() { 
      
      this.nodeStatus = WFContext.WorkflowInstinceState; //节点状态 //0:拟稿 1:新增  2：审批中  3：审批完成  5:驳回
      this.nodeName = WFContext.CurrentActivityName;  //节点名称
      const currUserId = FUI.Sys.getAuthor().userId;
      this.isCurApprove = currUserId === this.dataForm.createUserId;  
      // this.initData();
      if (this.reviseState) { 
        this.revise = true;
        this.dataRule['estimateBidDate'] = [
          { required: true, validator:this.validateEstimateBidDate, trigger:'blur'}
        ]
      }
      this.checkProjectManager();
    },
    validateEstimateBidDate(rule, value, callback) { 
      let dateTime = moment(value).format('YYYY-MM-DD');
      if (dateTime) { 
        let flag = myFun.getCurrentDateMonth(dateTime, 3);
        if (flag == 1) { 
          callback(new Error("不能超过当前日期3个月"));
        }
        callback();
      }
    },
    initData() {
      let { isLocalFilingRequired, isLock,isPublicInternet, isLocalConstructionRequired, constructorAbnormal } = this.dataForm;
      this.dataForm.isLocalFilingRequired = (isLocalFilingRequired !== '') ? Number(isLocalFilingRequired) : '';
      this.dataForm.isLock = (isLock !== '') ? Number(isLock) : ''; 
      this.dataForm.isPublicInternet = (isPublicInternet !== '') ? Number(isPublicInternet) : '';
      this.dataForm.isLocalConstructionRequired = (isLocalConstructionRequired !== '') ? Number(isLocalConstructionRequired) : '';
      this.dataForm.constructorAbnormal = (constructorAbnormal !== '') ? Number(constructorAbnormal) : ''; 
    },
    
    //是否索证 为是时 索证时长为必填 否则取消必填
    isLockChange(e) {
      let status = (e == 1) ? true : false;
      this.dataRule['lockTime'] = RuleRequired.curFiledRule(status);
     },
    //选择立项类型
    marketTypeChange(e) {
      this.$set(this.qualificationScopeModel.parm, 'varParams', [{ key: 'project_type', value: e }]);
      const { code } = this.dataForm;
      // let SJLXArray = [2, 3, 6];  //2:设计 3:设计施工一体化 6:园林设计
      const codeArray = code.split("_");
      if (Number(e) === 2 || Number(e) === 6) {
        this.dataForm.code = `SJLX_${codeArray[1]}`;
      } else { 
        this.dataForm.code = `SGLX_${codeArray[1]}`;
      }
      //清空资质范围
      this.dataForm.qualificationScope = '';
      this.dataForm.qualificationScopeName = '';
    },
    //招投标形式
    bidFormChange(e) {
      this.dataForm.bidForm = e;
      this.constructorAbnormalJudge()
    },
     //选择跟进人
    followerUpdate(data) { 
      this.dataForm.followerName = data[0].realName;   //跟进人
      this.dataForm.followerId = data[0].userId;  //跟进人Id
    },
    //项目地址
    changeAdressSelect(data) {
      this.dataForm.address = data.value || '';
    },
      //工程造价
    projectAmountChagne(e) {
      this.constructorAbnormalJudge()
     },
    //项目介绍人
    projectleaderNameUpdate(data) {
      if (data && data.length > 0) { 
        this.dataForm.projectLeaderName = data[0].personName;  //项目介绍人
        this.dataForm.projectLeaderId = data[0].id;  //项目介绍人id
        this.projectIntroducerStatus = data[0].projectIntroducerStatus;  //项目介绍人预警状态
        this.checkProjectManager();
      }
    },
    customerUpdate(data) {
      let _this = this;
      if (data && data[0].customerStatus == 2) { //为预警状态时
        _this.confirmTip('该客户已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要禁止承接，请做好风险管控工作', function () {
          _this.dataForm.customerName = data[0].customerName;
          _this.dataForm.customerId = data[0].id;
        })
      } else { 
        _this.dataForm.customerName = data[0].customerName;
        _this.dataForm.customerId = data[0].id;
      }
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
    //资质范围
    qualificationScopeUpdate(data) {
      if (data && data.length > 0) {
        this.dataForm.qualificationScope = data.map(item => item.id).join(',');
        this.dataForm.qualificationScopeName = data.map(item => item.name).join(',');
       }
    },
    marketUnitUpdateValue(data) { 
      this.dataForm.marketUnitName = data[0].businessUnit;  //业务单元
      this.dataForm.marketUnitId = data[0].superiorBusinessUnitId;  //业务单元Id
      this.dataForm.marketCenterName = data[0].affiliatedBusinessCenterName;  //业务中心
      this.dataForm.marketCenterId = data[0].affiliatedBusinessCenterId;  //业务中心Id
      // this.dataForm.code = data[0].code;  //立项编号
    },
    //产品线弹框 返回数据
    productLineUpdate(data) {
      this.dataForm.productLineName = data[0].name;
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
          this.qualificationScopeArray = data.find(item => item.dataDictType === '资质范围')?.dataDict || [];
          this.marketStatusArray = data.find(item => item.dataDictType === '项目当前状态')?.dataDict || [];
          this.marketCategoryArray = data.find(item => item.dataDictType === '立项类别')?.dataDict || [];
        }
      }
    },
    updateValue(data) { 
      this.dataForm.name = data[0].text;
    },
    //建造师要求
    constructorRequirementChange(e) {
      this.dataForm.constructorRequirement = e;
      this.constructorAbnormalJudge()
    },
    //立项类别
    marketCategoryChange(e) { 
      this.dataForm.marketCategory = e;
    },
    validateForm() {
      const _this = this;
      const shigongArr = ['1', '3']; //为施工、设计施工一体化时
      if (!_this.cpmStatus) {
       if (shigongArr.includes(_this.dataForm.projectType)) {
         _this.confirmTip('该介绍人状态异常，请联系市场综合部', function () {
           return false;
         })
         return false;
       }else if (_this.isCurApprove) { //审批人 预警状态
        _this.confirmTip('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请审批人做好风险管控工作', function () {
          return false;
        })
        return false;
      }
     }
      //  if ((Number(_this.nodeStatus) === 1 || Number(_this.nodeStatus) === 0) && !_this.cpmStatus && shigongArr.includes(_this.dataForm.projectType)) {
      //   _this.confirmTip('该介绍人状态异常，请联系市场综合部', function () {
      //     return false;
      //   })
      //   return false;
      //  }else if (Number(_this.nodeStatus) === 2 && Number(_this.projectIntroducerStatus) === 3) { //审批中
      //    _this.confirmTip('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请审批人做好风险管控工作', function () {
      //     return false;
      //   })
      //   return false;
      //  }
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              let { createTime, estimateBidDate} = _this.dataForm;
              _this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
              _this.dataForm.estimateBidDate = estimateBidDate ? moment(estimateBidDate).format('YYYY-MM-DD HH:mm:ss') : '';
              //如果是审批中 状态为关注2时 弹框提醒
              if (Number(_this.projectIntroducerStatus) === 2) { 
                _this.confirmTip('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请审批人做好风险管控工作', function () {
                  return resolve(_this.dataForm);
                })
              }
              return resolve(_this.dataForm);
            } else {
              return resolve(false)
            }
          })
        });
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const { createTime, estimateBidDate } = this.dataForm;
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.estimateBidDate = estimateBidDate ? moment(estimateBidDate).format('YYYY-MM-DD HH:mm:ss') : '';
      return this.dataForm;
    },
    async checkProjectManager() { 
      if (this.dataForm.projectLeaderId) {
        let { data } = await getCheckProjectManager(this.dataForm.projectLeaderId);
        this.cpmStatus = data;
      }
    },
    //建造师要求是否异常 判断
    //constructorRequirement:建造师要求 bidForm:招投标形式 projectAmount:工程造价
    constructorAbnormalJudge() {
      let { constructorRequirement, projectAmount,bidForm } = this.dataForm;
      let num = 10000000;//1000万
      if (bidForm == 1 || bidForm == 2) { //招标投标为政府公开或其他公开
        if (Number(projectAmount) < num) { //工程造价小于1000万
          ////建造师要求为一级时 显示为是 无或二级显示否
          this.dataForm.constructorAbnormal = (constructorRequirement == '1') ? '1' : '0';
        } else {
          this.dataForm.constructorAbnormal = '0';
        }
      } else if (bidForm == 3 || bidForm == 4 || bidForm == 5) { //招标投标为'邀请'、'议标'或'其他'
        this.dataForm.constructorAbnormal = '0';
      }
     }
  }
};
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

</style>
