<template>
  <!-- 预选承包商入库 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="160px">
      <row-layout :title="'基本信息'" :cols="3">
        <el-form-item slot="col_1" prop="customerName" label="入库客户名称：">
          <select-dialog :disabled="true" :width="800" :model-data="customerConfig" :height="360"
                         :value="dataForm.customerName" @updateValue="handelCustomerName"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="入库名称：">
          <text-input v-model="dataForm.name" size="small" placeholder="请输入" maxlength="64"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="code" label="入库编号：">
          <el-input v-model="dataForm.code" size="small" disabled placeholder="自动生成"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="marketCenterName" label="业务中心：">
          <el-input v-model="dataForm.marketCenterName" size="small" disabled placeholder="自动生成"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketUnitId" label="业务单元：">
          <select-dialog :disabled="true" :width="800" :model-data="marketUnitConfig" :height="360"
                         :value="dataForm.marketUnitName" @updateValue="handelMarketUnitName"
                         dynamicModel="customDialog"></select-dialog>

        </el-form-item>
        <el-form-item slot="col_3" prop="projectType" label="立项类型：" v-if="isShowView">
          <el-select v-model="dataForm.projectType" placeholder="请选择" size="small" style="width: 100%">
            <el-option v-for="(item,index) in projectTypeList" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="followerName" label="跟进人：">
          <select-dialog :disabled="true" :width="800" :height="360" :value="dataForm.followerName"
                         :modelData="dialogModel"
                         @updateValue="updateFollowerName" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectLeaderName" label="项目介绍人：">
          <select-dialog :disabled="true" :width="800" :model-data="projectLeaderNameConfig" :height="360"
                         :value="dataForm.projectLeaderName" @updateValue="handelProjectLeaderName"
                         dynamicModel="customDialog"></select-dialog>

        </el-form-item>
        <el-form-item slot="col_3" prop="projectLeaderPhone" label="项目介绍人电话：">
          <el-input v-model="dataForm.projectLeaderPhone" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="productLineName" label="产品线：">
          <select-dialog :disabled="true" :width="800" :model-data="productLineNameConfig" :height="360"
                         :value="dataForm.productLineName" @updateValue="handelProductLineName"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="depositCategory" label="入库类别：">
          <template slot="label">
            入库类别：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText1">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <el-select v-model="dataForm.depositCategory" placeholder="请选择" size="small" style="width: 100%"
                     @change="changeCategory" clearable>
            <el-option v-for="(item,index) in depositCategoryList" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="depositBusiness" label="入库业务类型：">
          <template slot="label">
            入库业务类型：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText2">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <text-input v-model="dataForm.depositBusiness" size="small" placeholder="请输入"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="depositDistrict" label="入库片区：">
          <template slot="label">
            入库片区：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText3">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <text-input v-model="dataForm.depositDistrict" size="small" placeholder="请输入" maxlength="64"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="districtScope" label="入库片区范围：">
          <template slot="label">
            入库片区范围：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText4">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <casc-select code="AddressCascade" v-model="dataForm.districtScope" ref="area1" @change-select="changeAreaId"
                       :defaultValue="dataForm.districtScope"></casc-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="predictDepositDate" label="预计入库完成日期：">
          <el-date-picker
            v-model="dataForm.predictDepositDate"
            @change="changeDepositData"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            size="small"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <text-input type="textarea" style="width: 95.5%;" :autosize="{ minRows: 5}" placeholder="请输入"
                      v-model="dataForm.remark" maxlength="64"
                      size="small"> <!--show-word-limit maxlength="64"-->
          </text-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'入库结果'" v-if="isShowBasic"></form-title>
      <el-row v-if="isShowBasic">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form label-width="160px" :model="dataForm" :disabled="isAble" ref="dataForm" :rules="dataRule">
              <div v-show="activeName === 'first'">
                <row-layout :cols="1">
                  <el-form-item slot="col_1" :prop="setProp2('firstParty')" label="网站/系统/甲方名称：">
                    <el-input v-model="dataForm.firstParty" size="small" placeholder="请输入" style="width: 95.5%"
                              maxlength="64"/>
                  </el-form-item>
                </row-layout>
                <row-layout :cols="3">
                  <el-form-item slot="col_1" :prop="setProp2('isDistrictSuccess')" label="是否入库成功：">
                    <el-radio-group v-model="dataForm.isDistrictSuccess">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item slot="col_2" :prop="setProp('validPeriod')" label="入库有效期至：">
                    <el-col :span="20">
                      <el-date-picker v-model="dataForm.validPeriod" value-format="yyyy-MM-dd" type="date"
                                      placeholder="选择日期" size="small"
                                      style="width: 100%" :disabled="dataForm.isLongTerm ">
                      </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-model="dataForm.isLongTerm" @change="changeValidPeriod">长期有效</el-checkbox>
                    </el-col>

                  </el-form-item>
                  <el-form-item slot="col_3" :prop="setProp2('isRegister')" label="是否注册账号：">
                    <el-radio-group v-model="dataForm.isRegister">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </row-layout>
                <row-layout :cols="3">

                  <el-form-item slot="col_1" :prop="setProp2('isLock')" label="是否办理CA锁：">
                    <el-radio-group v-model="dataForm.isLock">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item slot="col_2" :prop="setProp('basicDistrictScope')" label="片区范围：">
                    <casc-select code="AddressCascade" v-model="dataForm.basicDistrictScope" ref="area2"
                                 :defaultValue="dataForm.basicDistrictScope"></casc-select>
                  </el-form-item>
                </row-layout>
                <row-layout :cols="1">
                  <el-form-item slot="col_1" :prop="setProp('businessType')" label="入选业务类型：">
                    <el-input type="textarea" style="width: 95.5%;" :autosize="{ minRows: 5}" placeholder="请输入"
                              maxlength="250"
                              v-model="dataForm.businessType">
                    </el-input>
                  </el-form-item>
                </row-layout>
                <row-layout :cols="1">
                  <el-form-item slot="col_1" :prop="setProp('businessDistrict')" label="入选片区：">
                    <el-input type="textarea" style="width: 95.5%;" :autosize="{ minRows: 5}"
                              placeholder="请输入内容"
                              v-model="dataForm.businessDistrict" size="small" maxlength="250">
                    </el-input>
                  </el-form-item>
                </row-layout>
                <row-layout :cols="1">
                  <el-form-item slot="col_1" prop="basicRemark" label="备注：">
                    <el-input type="textarea" style="width: 95.5%;" :autosize="{ minRows: 5}"
                              v-model="dataForm.basicRemark" maxlength="250"
                              size="small" placeholder="请输入"/>
                  </el-form-item>
                </row-layout>

              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="账号信息" name="second" v-if="dataForm.isRegister == 1">
            <div class="mb10">
              <el-form label-width="160px" :model="dataForm" :disabled="isAble" ref="dataForm"
                       :rules="isAble?'':dataRule">
                <account-info ref="account" @getAccountInfo="getAccountInfo"></account-info>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="CA锁信息" name="third" v-if="dataForm.isLock == 1">
            <div class="mb10">
              <el-form label-width="160px" :model="dataForm" :disabled="isAble" ref="dataForm"
                       :rules="isAble?'':dataRule">
                <ca-lock-info ref="lock"></ca-lock-info>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <el-form label-width="160px" :model="dataForm" :disabled="isAble" ref="dataForm" :rules="isAble?'':dataRule">
        <row-layout :title="'附件'" :cols="1">
          <el-form-item slot="col_1" prop="fileInfo" label="附件：">
            <updateFiles v-model="dataForm.fileInfo" :isReadOnly="setting.readonly || isShowFile" :revise="isAble"></updateFiles>
          </el-form-item>
        </row-layout>
      </el-form>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：" label-width="160px">
          <span>{{dataForm.createUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：" label-width="160px">
          <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：" label-width="160px">
          <span>{{dataForm.createTime}}</span>
        </el-form-item>
      </row-layout>
    </el-form>
    <el-dialog title="温馨提示" :visible.sync="centerDialogVisible" width="30%">
      <div><span style="font-weight: bold">企业类型：</span>在总部备案、立项、客户负责人审核完成后，申请人还需填写入库结果模块内容，并附上相关证明文件，由备案负责人审核通过后，在公司方能认定为入库成功；
      </div>
      <div><span style="font-weight: bold">投标入库：</span>申请人需在“开标结果及总结分析流程”中填写入库结果模块内容，由备案负责人审核通过后，在公司方能认定为入库成功；</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">我已知悉</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  // 预选承包商入库
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import TextInput from '@/components/basic/elInput/textInput.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import AccountInfo from './components/accountInfo';
  import CaLockInfo from './components/ca_lockInfo';
  import comMixin from '../minix';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import {checkProjectManager,getDateJumpInfo} from '@/Api/contract/index.js'
  import {
    RADIO_GROUP,
    BUSINERSSUNIT_MODEL,
    FOLLOWER_MODEL,
    PROJECT_LEADER_MODEL,
    PRODUCTLINE_MODEL,
    CUSTOMER_MODEL
  } from '@/views/businessModule/enum/param';

  export default {
    components: {
      FormTitle,
      RowLayout,
      SelectDialog,
      NumberInput,
      updateFiles,
      AccountInfo,
      CaLockInfo,
      CascSelect,
      TextInput
    },
    mixins: [comMixin],
    data() {
      return {
        activeName: 'first',
        oIndex: 0, // 计数
        oIndex2: 0, // 计数2
        rowObject: {},
        customerConfig: {
          code: 'KeShangDangAn',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false
          },
          isShowLink:true, // 是否添加链接参数
          linkUrl:'' //跳转链接
        }, // 客商档案
        marketUnitConfig: BUSINERSSUNIT_MODEL, // 业务单元
        projectLeaderNameConfig: PROJECT_LEADER_MODEL, // 项目介绍人
        productLineNameConfig: PRODUCTLINE_MODEL, // 产品线
        numVal: '100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        centerDialogVisible: false, // 提示dialog
        isAble: false,
        isLongTime: false, // 是否长期有效
        isShowView: true, // 是否显示字段
        isShowBasic: false, // 是否显示入库结果
        tableKey: '',
        noteText1: '1、企业入库：我司提供企业资料，对方审核入库；\n' +
          '\n' +
          '2、投标入库：我司通过投标、竞价、报价承诺等形式进入对方长期或年度库；\n' +
          '\n' +
          '3、设计投标入库：指要入库的业务范围为设计且需要走保证金或需签署框架协议等情况的入库，如仅需单独企业入库请走企业入库；',
        noteText2: '指您所入选的预选承包商在甲方体系内的业务划分，例如：精装修、批量精装修、门窗、幕墙等；',
        noteText3: '指您所入选的预选承包商在甲方体系内的地区划分，例如：粤东地区、北方大区等；',
        noteText4: '指您所填的入库片区包含哪些省市，例如：广东省、湖南省、深圳市、惠州市等；',
        depositCategoryList: [], // 入库类别
        isTrueList: [], // 是否
        projectTypeList: [], // 立项类型
        personnelStatus: '', // 介绍人状态
        getExceptionLimitType: '', // 异常类型
        isShowFile:false,
        dialogModel: FOLLOWER_MODEL,
        wfContext:'',
        dataForm: {
          basicDistrictScope: '',
          basicRemark: '',
          businessDistrict: '',
          businessKey: '',
          businessType: '',
          closeMemo: '',
          closeReason: '',
          closeState: 1,
          closeTime: '',
          code: '',
          customerName: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerId: '',
          depositBusiness: '',
          depositCategory: '',
          depositDistrict: '',
          deptId: '',
          deptName: '',
          districtScope: '',
          fileInfo: [],
          firstParty: '',
          followerId: '',
          formId: '',
          id: '',
          isDistrictSuccess: '',
          isLock: '',
          isLongTerm: false,
          isRegister: '',
          jsonData: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          marketCenterId: '',
          marketContractorAccountDetail: [],
          marketLockDetail: [],
          marketStatus: '',
          marketUnitId: '',
          name: '',
          predictDepositDate: '',
          procInstState: '',
          productLineId: '',
          projectLeaderId: '',
          projectType: '',
          remark: '',
          validPeriod: '',
          projectLeaderPhone: '',
          projectLeaderName: '',
          marketCenterName: '',
          productLineName: '',
          followerName: '',
          wiid: ''
        },
        dataRule: {
          noRequired: [{required: false}],
          customerName: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          marketUnitId: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          followerName: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          projectLeaderName: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          depositCategory: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          depositDistrict: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          districtScope: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          predictDepositDate: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          firstParty: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          isDistrictSuccess: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          validPeriod: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          isRegister: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          isLock: [
            {required: true, message: '必填项不能为空', trigger: 'change'}
          ],
          businessType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          basicDistrictScope: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          businessDistrict: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          projectType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {},
    mounted() {
      this.beforeInit();
      console.log(this.setting.readonly,'12341234123')
      this.wfContext = WFContext;
    },
    methods: {
      initDataForm(data) {
        console.log(data, '1111111111111111111111111')

      },
      /**
       * 入户客户名称
       * */
      handelCustomerName(data) {
        if (data.length > 0) {
          const {id, customerName} = data[0];
          this.dataForm.customerName = customerName;
          this.dataForm.customerId = id;
          this.setlinkUrl();
        }
      },
      /**
       * 业务单元(要改)
       */
      handelMarketUnitName(data) {
        var that = this;
        console.log(data, '111');
        if (data.length > 0) {
          that.dataForm.marketUnitId = data[0].id;
          that.dataForm.marketUnitName = data[0].businessUnit;
          that.dataForm.marketCenterName = data[0].affiliatedBusinessCenterName;
          that.dataForm.marketCenterId = data[0].affiliatedBusinessCenterId;
          that.$forceUpdate();
        }
      },
      /**
       * 跟进人
       * */
      updateFollowerName(data) {
        let that = this;
        if (data.length > 0) {
          that.dataForm.followerName = data[0].realName;
          that.dataForm.followerId = data[0].userId;
        }

      },
      /**
       * 项目介绍人
       * */
      handelProjectLeaderName(data) {
        let that = this;
        if (data.length > 0) {
          that.dataForm.projectLeaderName = data[0].personName;
          that.dataForm.projectLeaderId = data[0].id;
          that.dataForm.projectLeaderPhone = data[0].telephoneOne;
          that.personnelStatus = data[0].projectIntroducerStatus; // 介绍人状态
          that.getExceptionLimitType = data[0].exceptionLimitType; // 异常限制类型
          if (that.personnelStatus) {
            that.vaildProjectLeaderName();
          }
        }
      },
      /**
       * 产品线
       * */
      handelProductLineName(data) {
        let that = this;
        if (data.length > 0) {
          that.dataForm.productLineName = data[0].name;
          that.dataForm.productLineId = data[0].id;
        }
      },
      /**
       * 根据项目介绍人的人员状态和异常限制类型
       * personnelStatus: [正常：'1',关注：'2',预警：'3']
       * getExceptionLimitType:[无：‘0’，施工：‘1’，设计施工一体化：‘2’，设计：‘3’]
       * */
      vaildProjectLeaderName() {
        var that = this;
        if (that.personnelStatus == 2) {
          FUI.Window.showMsg('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请做好风险管控工作；');
        } else if (that.personnelStatus == 3 && (that.getExceptionLimitType !== 0 || that.getExceptionLimitType !== 3)) {
          FUI.Window.showMsg('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请做好风险管控工作；');
        } else if (that.personnelStatus == 3 && (that.getExceptionLimitType == 1 || that.getExceptionLimitType == 2)) {
          FUI.Window.showMsg('该项目介绍人不能满足条件，不能提交');
          that.oIndex = 0
          return false
        }else if (that.personnelStatus == 4) {
          FUI.Window.showMsg('该项目介绍人已被禁用，不能提交');
          that.oIndex = 0
          return false
        }


      },
      beforeInit() {
        this.getDataDictByConfigType();
      },
      afterInit() {
        console.log(this.dataForm, '2222222222222222');
        var type = this.dataForm.isLongTerm;
        type = type ? JSON.parse(type) : false;
        this.dataForm.isLongTerm = type;
        this.dataForm.isLock = this.dataForm.isLock ? JSON.parse(this.dataForm.isLock) : '';
        this.dataForm.isRegister = this.dataForm.isRegister ? JSON.parse(this.dataForm.isRegister) : '';
        this.dataForm.isDistrictSuccess = this.dataForm.isDistrictSuccess ? JSON.parse(this.dataForm.isDistrictSuccess) : '';
        var obj = Object.toClone(this.dataForm);
        this.dataForm.createTime = Object.formatDates(obj.createTime); // 时间格式化
        var workState = WFContext.WorkflowInstinceState; // 流程状态
        var category = this.dataForm.depositCategory; // 入库类别
        var currentName = WFContext.CurrentActivityName; // 节点名称
        if (workState === 3 && (category == 1 || category == 2 || category == 3)) {
          this.isShowBasic = true;
          this.isAble = true;
        } else if (category == 1 && currentName == '编制人（反馈结果）') {
          this.isShowBasic = true;
          this.isAble = false;
        }
        this.setlinkUrl();
        this.changeCategory();
      },
      // tab栏事件
      handleClick(tab, event) {
        console.log(tab.index, event);
        var that = this;
        if (tab.index == 1) {
          that.$refs['account'].initTableData(this.dataForm);
        } else if (tab.index == 2) {
          that.$refs['lock'].initTableData(this.dataForm);
        }
      },
      // 接收上传文件
      showFile(arr) {
        console.log(arr, '文件');
        this.fileData = arr;
        this.setFormIframeHeight();
      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({params: {configTypes: '入库类别,是否,立项类型'}});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '入库类别':
                this.depositCategoryList = ele.dataDict;
                break;
              case '是否':
                this.isTrueList = ele.dataDict;
                break;
              case '立项类型':
                this.projectTypeList = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 判断预计入库完成日期
       * */
      changeDepositData() {
        let that = this;
        let value = that.dataForm.predictDepositDate;
        let date1 = that.getNowTime();
        let date2 = that.getPreMonthDay(date1, 3);
        let date1Time = new Date(date1).getTime();
        let date2Time = new Date(date2).getTime();
        let valueTime = new Date(value).getTime();
        if (valueTime < date1Time || valueTime > date2Time) {
          that.$message({
            message: '预计入库完成日期要大于等于今天，并小于三个月后的今天!',
            type: 'warning'
          });
          that.dataForm.predictDepositDate = '';
        }
        that.$forceUpdate();
      },
      //获取当前日期
      getNowTime() {
        let newDate = new Date();
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
        var date = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
        return year + "-" + month + "-" + date;
      },
      //获取当前日期后的指定月后的日期
      getPreMonthDay(date, monthNum) {
        var txt = new Date(Date.parse(date)); //字符串转化为date类型
        txt.setMonth(txt.getMonth() + monthNum);
        var yy1 = txt.getFullYear();
        var mm1 = txt.getMonth() + 1; //因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
        var dd1 = txt.getDate();
        if (mm1 < 10) {
          mm1 = "0" + mm1;
        }
        if (dd1 < 10) {
          dd1 = "0" + dd1;
        }
        var res =
          yy1 +
          "-" +
          mm1 +
          "-" +
          dd1 +
          " " +
          txt.getHours() +
          ":" +
          txt.getMinutes() +
          ":" +
          txt.getSeconds();
        return new Date(Date.parse(res));
      },
      // 是否长期有效
      changeValidPeriod() {
        let that = this;
        if (that.dataForm.isLongTerm) {
          that.dataForm.validPeriod = '9999-12-31';
        } else {
          that.dataForm.validPeriod = ''
        }
        that.$forceUpdate();
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        var _this = this;
        if (WFContext.WorkflowInstinceState < 2 || !_this.isAble) {
          if (_this.$refs.area1) {
            let arr1 = _this.$refs.area1.getResult();
            _this.dataForm.districtScope = arr1.value;
          }
          if (_this.$refs.area2) {
            let arr2 = _this.$refs.area2.getResult();
            _this.dataForm.basicDistrictScope = arr2.value;
          }
          // 获取账号信息
          if (_this.$refs.account && _this.dataForm.isRegister == 1) {
            var list1 = _this.$refs.account.getResult();
            _this.dataForm.marketContractorAccountDetail = list1;

          }
          // 获取CA锁信息
          if (_this.$refs.lock && _this.dataForm.isLock == 1) {
            var list2 = _this.$refs.lock.getResult();
            _this.dataForm.marketLockDetail = list2
          }
        }
        const dataForm = JSON.parse(JSON.stringify(_this.dataForm));

        return dataForm;
      },
      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        if(_this.checkProjectManagerFn() == false){
          return false
        }
        if (_this.oIndex == 0) {
          _this.vaildProjectLeaderName();
          _this.oIndex = 1;
        }
        if (WFContext.WorkflowInstinceState < 2 || !_this.isAble) {
          if (_this.$refs.area1) {
            let arr1 = _this.$refs.area1.getResult();
            _this.dataForm.districtScope = arr1.value;
          }
          if (_this.$refs.area2) {
            let arr2 = _this.$refs.area2.getResult();
            _this.dataForm.basicDistrictScope = arr2.value;
          }
          // 获取账号信息
          if (_this.$refs.account && _this.dataForm.isRegister == 1) {
            var list1 = _this.$refs.account.getResult();
            if (list1.length === 0) {
              FUI.Window.showMsg2('账号信息必须填写一条！');
              return false
            }
            _this.dataForm.marketContractorAccountDetail = list1;

          }
          if (_this.dataForm.marketContractorAccountDetail.length > 0) {
            _this.$refs.account.vaildTableData()
          }
          // 获取CA锁信息
          if (_this.$refs.lock && _this.dataForm.isLock == 1) {
            var list2 = _this.$refs.lock.getResult();
            if (list2.length === 0) {
              FUI.Window.showMsg2('CA锁信息必须填写一条！');
              return false
            }
            _this.dataForm.marketLockDetail = list2
          }
          if (_this.dataForm.marketLockDetail.length > 0) {
            _this.$refs.lock.vaildTableData()
          }
        }
        // if(_this.oIndex > 0){
        //   return false
        // }
        let parm = Object.toClone(_this.dataForm);
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate((valid,obj) => {
            if(_this.oIndex2 == 0 && JSON.stringify(obj) === '{}' && WFContext.WorkflowInstinceState < 2){
                _this.centerDialogVisible = true;
                return false
              }else {
                _this.centerDialogVisible = false;
              }
            console.log(valid, 'valid', obj);
            if (valid) {
              return resolve(parm);
            } else {
              return resolve(false)
            }
          })
        });
      },
      /**
       * 入库类别为企业入库 且 是否入库成功为'是'时才为必填项
       * @param {*} fieldName
       */
      setProp(fieldName) {
        var that = this;
        if (that.dataForm.depositCategory == 1 && that.dataForm.isDistrictSuccess == 1) {
          return fieldName;
        }
        return 'noRequired'
      },
      /**
       * 入库类别为企业入库时才为必填项
       * @param {*} fieldName
       */
      setProp2(fieldName) {
        var that = this;
        var name = WFContext.CurrentActivityName; // 节点名称
        if (that.dataForm.depositCategory == 1 && name == '编制人（反馈结果）') {
          return fieldName;
        }
        return 'noRequired'
      },
      setProp3() {
        var that = this;
        var name = WFContext.CurrentActivityName; // 节点名称
        var state = WFContext.WorkflowInstinceState;// 流程状态
        var type = that.dataForm.depositCategory; // 入库类别
        if(type == 1 && state < 2){
          that.isShowFile = true
        } else if (type == 1 && state == 2 && name == '编制人（反馈结果）') {
          that.isShowFile = false
        }else if((type == 2 || type == 3) && state < 2){
          that.isShowFile = false
        }if(type == 1 && state == 5){
          that.isShowFile = true
        }
      },

      getAccountInfo(data) {
        this.dataForm.marketContractorAccountDetail = data;
      },
      /**
       * 入库类别
       * */
      changeCategory() {
        var that = this;
        if (that.dataForm.depositCategory == 1) {
          that.isShowView = false;
          that.dataForm.projectType = '';
        } else {
          that.isShowView = true;
        }
        this.setProp3();
      },
      /**
       * 切换地址
       */
      changeAreaId(data) {
        this.dataForm.districtScope = data.value;
        this.$refs['dataForm'].clearValidate('districtScope')
      },
      // 超链接拼接方法（无流程）
      async setlinkUrl() {
        let code = 'customerSupplierArchiveMain'; // 菜单code
        let path = 'customerSupplierArchiveMain/customerSupplierList'; //路由地址
        let encode = 'customerSupplierArchiveMain';//业务code
        let myId = this.dataForm.customerId;//主表id
        let modelName = 'customer'; // 模块code
        let formAction = 3; // 表单状态 默认 3
        let title= '客商档案-详情';
        let isInterface=true;
        let fullDev = true;
        let url = __webpath + '/noWorkflowForm?code=' + code + '&encode=' + encode + '&myId=' + myId + '&modelName=' + modelName + '&formAction=' + formAction + '&path=' + path + '&title=' + title+ '&isInterface=' + isInterface+ '&fullDev=' + fullDev;
        this.customerConfig.linkUrl = url

      },
      // 校验项目介绍人
      async checkProjectManagerFn(){
        let that = this;
        let id = that.dataForm.projectLeaderId;
        if(id){
          const res = await checkProjectManager(id);
          if(res.code === 200){
            return ''
          }else {
            FUI.Window.showMsg2('项目介绍人等级中状态为预警且异常限制类型为施工或施工设计一体化，不能提交');
            return false
          }
        }
      },
      // 关闭model
      closeDialog(){
        var that = this;
        that.oIndex2 = 2;
        that.validateForm();
        that.centerDialogVisible = false;
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

  .btnClass {
    font-size: 25px;
    color: #ed4014;
  }

  .bthGround {
    float: right;
    padding: 5px 10px;
    clear: both;
  }
</style>
