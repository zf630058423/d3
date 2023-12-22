<template>
  <!-- 预选承包商入库 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="160px">
      <row-layout :title="'基本信息(修订)'" :cols="3">
        <el-form-item slot="col_1" prop="customerName" label="入户客户名称：">
          <el-input v-if="reviseState" v-model="dataForm.customerName" size="small" disabled/>
          <select-dialog v-else :disabled="true" :width="800" :model-data="customerConfig" :height="360"
                         :value="dataForm.customerName" @updateValue="handelCustomerName"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="入库名称：">
          <el-input v-model="dataForm.name" size="small" placeholder="请输入"/>
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
          <el-input v-if="reviseState" v-model="dataForm.marketUnitName" size="small" disabled/>
          <select-dialog v-else :disabled="true" :width="800" :model-data="marketUnitConfig" :height="360"
                         :value="dataForm.marketUnitName" @updateValue="handelMarketUnitName"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="projectType" label="立项类型：">
          <el-select v-model="dataForm.projectType" placeholder="请选择" size="small" style="width: 100%" :disabled="reviseState">
            <el-option v-for="(item,index) in projectTypeList" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="followerName" label="跟进人：">
          <el-input v-if="reviseState" v-model="dataForm.followerName" size="small" disabled/>
          <select-dialog v-else :disabled="true" :width="800" :height="360" :value="dataForm.followerName" :modelData="dialogModel"
                         @updateValue="updateFollowerName" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectLeaderName" label="项目介绍人：">
          <el-input v-if="reviseState" v-model="dataForm.projectLeaderName" size="small" disabled/>
          <select-dialog v-else :disabled="true" :width="800" :model-data="projectLeaderNameConfig" :height="360"
                         :value="dataForm.projectLeaderName" @updateValue="handelProjectLeaderName"
                         dynamicModel="customDialog"></select-dialog>

        </el-form-item>
        <el-form-item slot="col_3" prop="projectLeaderPhone" label="项目介绍人电话：">
          <el-input v-model="dataForm.projectLeaderPhone" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="productLineName" label="产品线：">
          <el-input v-model="dataForm.productLineName" size="small" placeholder="请输入" :disabled="reviseState"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="depositCategory" label="入库类别：">
          <template slot="label">
            入库类别：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText1">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <el-select v-model="dataForm.depositCategory" placeholder="请选择" size="small" style="width: 100%" clearable :disabled="reviseState">
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
          <el-input v-model="dataForm.depositBusiness" size="small" placeholder="请输入" :disabled="reviseState"/>
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
          <el-input v-model="dataForm.depositDistrict" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="districtScope" label="入库片区范围：">
          <template slot="label">
            入库片区范围：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText4">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <casc-select code="AddressCascade" v-model="dataForm.districtScope" ref="area1"
                       :defaultValue="dataForm.districtScope"></casc-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="predictDepositDate" label="预计入库完成日期：">
          <el-date-picker
            v-model="dataForm.predictDepositDate"
            @change="changeDepositData"
            :disabled="reviseState"
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
          <el-input type="textarea" style="width: 95.5%;" :autosize="{ minRows: 5}" placeholder="请输入" v-model="dataForm.remark" :disabled="reviseState" maxlength="64"
                    size="small" > <!--show-word-limit maxlength="64"-->
          </el-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'入库结果'"></form-title>
      <el-row>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <div v-show="activeName === 'first'">
              <row-layout :cols="1">
                <el-form-item slot="col_1" :prop="setProp2('firstParty')" label="网站/系统/甲方名称：">
                  <el-input v-model="dataForm.firstParty" size="small" placeholder="请输入" style="width: 95.5%" :disabled="reviseState"/>
                </el-form-item>
              </row-layout>
              <row-layout :cols="3">
                <el-form-item slot="col_1" :prop="setProp2('isDistrictSuccess')" label="是否入库成功：" >
                  <el-radio-group v-model="dataForm.isDistrictSuccess" :disabled="reviseState">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item slot="col_2" :prop="setProp('validPeriod')" label="入库有效期至：" >
                  <el-col :span="20">
                    <el-date-picker v-model="dataForm.validPeriod" :disabled="reviseState"
                                    value-format="yyyy-MM-dd" type="date"
                                    placeholder="选择日期" size="small"
                                    style="width: 100%">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox v-model="dataForm.isLongTerm" @change="changeValidPeriod" :disabled="reviseState">长期有效</el-checkbox>
                  </el-col>

                </el-form-item>
                <el-form-item slot="col_3" :prop="setProp2('isRegister')" label="是否注册账号：" >
                  <el-radio-group v-model="dataForm.isRegister" :disabled="reviseState">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </row-layout>
              <row-layout :cols="3">
                <el-form-item slot="col_1" :prop="setProp2('isLock')" label="是否办理CA锁：" >
                  <el-radio-group v-model="dataForm.isLock" :disabled="reviseState">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item slot="col_2" :prop="setProp('basicDistrictScope')" label="片区范围：" >
                  <el-input v-if="reviseState" type="text" v-model="dataForm.basicDistrictScope" size="small" placeholder="请输入" style="width: 95.5%" disabled></el-input>
                  <casc-select v-else code="AddressCascade" v-model="dataForm.basicDistrictScope" ref="area2" :defaultValue="dataForm.basicDistrictScope"></casc-select>
                </el-form-item>
              </row-layout>
              <row-layout :cols="1">
                <el-form-item slot="col_1" :prop="setProp('businessType')" label="入选业务类型：" >
                  <el-input type="textarea" style="width: 95.5%;" :rows="2" size="small" placeholder="请输入" v-model="dataForm.businessType" :disabled="reviseState">
                  </el-input>
                </el-form-item>
              </row-layout>
              <row-layout :cols="1">
                <el-form-item slot="col_1" :prop="setProp('businessDistrict')" label="入选片区：">
                  <el-input type="textarea" style="width: 95.5%;" :rows="2" placeholder="请输入内容,内容长度不超过100字" :disabled="reviseState"
                            v-model="dataForm.businessDistrict" size="small" maxlength="100">
                  </el-input>
                </el-form-item>
              </row-layout>
              <row-layout :cols="1">
                <el-form-item slot="col_1" prop="basicRemark" label="备注：" >
                  <el-input type="textarea" style="width: 95.5%;" :autosize="{ minRows: 5}" v-model="dataForm.basicRemark" size="small" placeholder="请输入" :disabled="reviseState" maxlength="64"/>
                </el-form-item>
              </row-layout>

            </div>
          </el-tab-pane>
          <el-tab-pane label="账号信息" name="second" v-if="dataForm.isRegister == 1">
            <div class="mb10">
              <account-info ref="account" @getAccountInfo="getAccountInfo"></account-info>
            </div>
          </el-tab-pane>
          <el-tab-pane label="CA锁信息" name="third" v-if="dataForm.isLock == 1">
            <div class="mb10">
              <ca-lock-info ref="lock"></ca-lock-info>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <row-layout :title="'附件'" :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件：">
          <UploadFile v-model="dataForm.fileInfo"></UploadFile>
        </el-form-item>
      </row-layout>
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
  </div>
</template>

<script>
  // 预选承包商入库
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import UploadFile from '@/components/basic/uploaderFile/index.vue';
  import AccountInfo from './components/accountInfo';
  import CaLockInfo from './components/ca_lockInfo';
  import comMixin from '../minix';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import { RADIO_GROUP,BUSINERSSUNIT_MODEL, FOLLOWER_MODEL, PROJECT_LEADER_MODEL }  from '@/views/businessModule/enum/param';
  import {checkProjectManager,getDateJumpInfo} from '@/Api/contract/index.js'


  export default {
    components: {FormTitle, RowLayout, SelectDialog, NumberInput, UploadFile, AccountInfo, CaLockInfo, CascSelect},
    mixins: [comMixin],
    data() {
      return {
        activeName: 'first',
        dialogModel: {
          singleSelect: true,
          resultFieldKey: "",
          data: []
        },
        rowObject: {},
        customerConfig: {
          code: 'KeShangDangAn',
          customDialog: 'KeShangDangAn',
          isSetHead: 1,
          isMulti: false,
          initailData: [],
          isShowLink:true, // 是否添加链接参数
          linkUrl:'' //跳转链接
        }, // 客商档案
        marketUnitConfig: {
          code: 'YeWuDanYuan',
          customDialog: 'YeWuDanYuan',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        }, // 业务单元
        projectLeaderNameConfig: {
          code: 'XiangMuJieShaoRen',
          customDialog: 'XiangMuJieShaoRen',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        }, // 项目介绍人

        numVal: '100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        isAble: true,
        isLongTime: false, // 是否长期有效
        reviseState: false, // 是否为修订状态
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
        personnelStatus:'', // 介绍人状态
        getExceptionLimitType:'', // 异常类型
        dialogModel: FOLLOWER_MODEL,
        dataForm: {
          basicDistrictScope: '',
          basicRemark: '',
          businessDistrict: '',
          businessKey: '',
          businessType: '',
          closeMemo: '',
          closeReason: '',
          closeState: '',
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
          noRequired: [{ required: false }],
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
          businessType:[
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          basicDistrictScope:[
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          businessDistrict:[
            {required: true, message: '必填项不能为空', trigger: 'blur'}
          ],
          fileInfo:[
            {required: false, message: '必填项不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {},
    mounted() {
      this.beforeInit();
    },
    created(){
      var code = Object.toQueryString('isRevise');
      if(code){
        this.reviseState = true;
      }
    },
    methods: {
      initDataForm(data){
        console.log(data,'1111111111111111111111111')

      },
      /**
       * 入户客户名称
       * */
      handelCustomerName(data) {
        if(data.length >0){
          this.dataForm.customerName = data[0].customerName;
          this.dataForm.customerId = data[0].id;
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
        }
      },
      /**
       * 根据项目介绍人的人员状态和异常限制类型
       * personnelStatus: [正常：'1',关注：'2',预警：'3']
       * getExceptionLimitType:[无：‘0’，施工：‘1’，设计施工一体化：‘2’，设计：‘3’]
       * */
      vaildProjectLeaderName(){
        var that = this;
        if(that.personnelStatus == 2){
          FUI.Window.showMsg('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请做好风险管控工作；');
        }else if(that.personnelStatus == 3 && (that.getExceptionLimitType !== 0 || that.getExceptionLimitType !== 3)){
          FUI.Window.showMsg('该项目介绍人已被市场综合部列为“预警名单”，预警名单内人员、单位的项目非必要、禁止承接，请做好风险管控工作；');
        }else if(that.personnelStatus == 3 && (that.getExceptionLimitType == 1 || that.getExceptionLimitType == 2)){
          FUI.Window.showMsg('该项目介绍人不能满足条件，不能提交');
          return false
        }


      },
      beforeInit() {
        this.getDataDictByConfigType()
      },
      afterInit() {
        console.log(this.dataForm,'2222222222222222');
        var type = this.dataForm.isLongTerm;
        type = JSON.parse(type);
        this.dataForm.isLongTerm = type;
        this.dataForm.isLock = JSON.parse(this.dataForm.isLock);
        this.dataForm.isRegister = JSON.parse(this.dataForm.isRegister);
        this.dataForm.isDistrictSuccess = JSON.parse(this.dataForm.isDistrictSuccess);
        console.log(type,'123');
        this.setlinkUrl()
      },
      // tab栏事件
      handleClick(tab, event) {
        console.log(tab.index, event);
        var that = this;
        if(tab.index == 1){
          that.$refs['account'].initTableData(this.dataForm);
        }else if(tab.index == 2){
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
        var dateArr = date.split('-');
        var year = dateArr[0]; //获取当前日期的年份
        var month = dateArr[1]; //获取当前日期的月份
        var day = dateArr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) + monthNum;
        if (month2 <= 0) {
          var absM = Math.abs(month2);
          year2 = parseInt(year2) - Math.ceil(absM / 12 == 0 ? 1 : parseInt(absM) / 12);
          month2 = 12 - (absM % 12);
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
      },
      // 是否长期有效
      changeValidPeriod(){
        let that = this;
        if(that.dataForm.isLongTerm){
          that.dataForm.validPeriod = '9999-12-31';
        }else{
          that.dataForm.validPeriod = ''
        }
        that.$forceUpdate();
      },
      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        if(_this.checkProjectManagerFn() == false){
          return false
        }
        if(WFContext.WorkflowInstinceState < 2){
          let arr1 = _this.$refs.area1.getResult();
          // let arr2 = _this.$refs.area2.getResult();
          _this.dataForm.districtScope = arr1.value;
          // _this.dataForm.basicDistrictScope = arr2.value;
          // 获取账号信息
          if(_this.$refs.account && _this.dataForm.isRegister == 1) {
            _this.dataForm.marketContractorAccountDetail = _this.$refs.account.getResult();
          }
          if(_this.dataForm.marketContractorAccountDetail.length > 0){
            _this.$refs.account.vaildTableData()
          }
          // 获取CA锁信息
          if(_this.$refs.lock && _this.dataForm.isLock == 1){
            _this.dataForm.marketLockDetail = _this.$refs.lock.getResult();
          }
          if(_this.dataForm.marketLockDetail.length > 0){
            _this.$refs.lock.vaildTableData()
          }
        }
        let parm = Object.toClone(_this.dataForm);
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
      /**
       * 入库类别为企业入库 且 是否入库成功为'是'时才为必填项
       * @param {*} fieldName
       */
      setProp(fieldName) {
        var that = this;
        if (that.dataForm.depositCategory == 1 && that.dataForm.isDistrictSuccess	 == 1) {
          return fieldName;
        }
        return 'noRequired'
      },
      /**
       * 入库类别为企业入库时才为必填项
       * @param {*} fieldName
       */
      setProp2(fieldName){
        var that = this;
        if (that.dataForm.depositCategory == 1) {
          return fieldName;
        }
        return 'noRequired'
      },
      getAccountInfo(data){
        this.dataForm.marketContractorAccountDetail = data;
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
            return true
          }else {
            FUI.Window.showMsg2('项目介绍人等级中状态为预警且异常限制类型为施工或施工设计一体化，不能提交');
            return false
          }
        }
      },
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
