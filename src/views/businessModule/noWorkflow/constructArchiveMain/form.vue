<template>
  <!-- 项目档案 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="isReadOnly?'':dataRule" :disabled="isReadOnly" label-width="140px">
      <row-layout title="项目信息" :cols="3">
        <el-form-item slot="col_1" label="项目编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"  disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="项目名称：">
          <el-input v-model="dataForm.name" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_3" label="项目状态：">
          <el-select v-model="dataForm.projectStatusId" placeholder="请选择" size="small" style="width: 100%" disabled>
            <el-option v-for="(item,index) in projectStatusIdList" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="differentPlaces" label="是否异地经营：">
          <el-radio-group v-model="dataForm.differentPlaces">
            <el-radio v-for="(item,index) in radioArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="categoryId" label="项目分类：">
          <el-select v-model="dataForm.categoryId" placeholder="请选择" size="small" style="width: 100%">
            <el-option v-for="(item,index) in categoryIdList" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="targetProfitRate" label="投标利润率(%)：">
          <percentage-input v-model="dataForm.targetProfitRate"
                            :placeholder="msgTip.ENTER_PLACEHOLDER"></percentage-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="projectTaxMethod" label="项目计税方式：">
          <el-radio-group v-model="dataForm.projectTaxMethod" id="exception" @change="changeProjectTaxMethod">
            <el-radio v-for="(item,index) in projectTaxMethodList" :key="index" :label="item.configValue">
              {{item.configName}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="客户：" prop="customerName">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :modelData="customerModel" :width="900"
                         :height="360" @updateValue="customerUpdate"
                         :value="dataForm.customerName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="产品线：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :modelData="productLineModel" :width="900"
                         :height="360" @updateValue="productLineUpdate"
                         :value="dataForm.productLineName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="施工税率(%)：">
          <select-dialog2 :disabled="true" :btnDisabled="isReadOnly" :modelData="rateModel" :width="900"
                          :height="360" @updateValue="constructionRateUpdate"
                          :value="dataForm.constructionRate || msgTip.SELECT_PLACEHOLDER"
                          dynamicModel="customDialog"></select-dialog2>
        </el-form-item>
        <el-form-item slot="col_2" label="预征率(%)：">
          <select-dialog2 :disabled="true" :btnDisabled="isReadOnly" :modelData="rateModel2" :width="900"
                          :height="360" @updateValue="prevalenceRateUpdate"
                          :value="dataForm.prevalenceRate"
                          dynamicModel="customDialog"></select-dialog2>
        </el-form-item>
        <el-form-item slot="col_3" prop="projectAddress" label="项目地址：">
          <casc-select code="AddressCascade" v-model="dataForm.projectAddress" ref="area" :setPlaceholder="'省-市-区'"
                       :defaultValue="dataForm.projectAddress"></casc-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="2-1">
        <el-form-item slot="col_1" prop="address" label="详细地址：">
          <el-input v-model="dataForm.address" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" label="是否特殊项目：" v-show="true">
          <el-radio-group v-model="dataForm.isSpecialProject">
            <el-radio v-for="(item,index) in radioArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3" :title="'工程信息'">
        <el-form-item slot="col_1" prop="marketUnitName" label="业务单元：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :modelData="marketUnitModel" :width="900"
                         :height="360" @updateValue="marketUnitUpdate"
                         :value="dataForm.marketUnitName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="constructionUnitName" label="管理部门：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :width="500" :modelData="dialogModel"
                         :height="360" @updateValue="constructionUnitUpdate"
                         :value="dataForm.constructionUnitName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="projectDepartmentName" label="项目部：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :width="500" :modelData="dialogModel"
                         :height="360" @updateValue="projectDepartmentUpdate"
                         :value="dataForm.projectDepartmentName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="marketCenterName" label="业务中心：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :width="500"
                         :height="360" @updateValue="marketCenterUpdate" :modelData="dialogModel"
                         :value="dataForm.marketCenterName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="isOldProject" label="是否老项目：">
          <el-radio-group v-model="dataForm.isOldProject">
            <el-radio v-for="(item,index) in radioArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="itemTypeId" label="立项类型：">
          <el-select v-model="dataForm.itemTypeId" :placeholder="msgTip.ENTER_PLACEHOLDER" size="small"
                     style="width: 100%">
            <el-option v-for="(item,index) in itemTypeList" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="projectManagerName" label="项目负责人：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :width="900" :modelData="dialogModel"
                         :height="360" @updateValue="projectManagerNameUpdate"
                         :value="dataForm.projectManagerName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectManagerTel" label="项目负责人电话：">
          <el-input v-model="dataForm.projectManagerTel" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="supplierInvoiceClearance" label="供应商发票解控：">
          <el-radio-group v-model="dataForm.supplierInvoiceClearance">
            <el-radio v-for="(item,index) in radioArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="projectInvoiceClearance" label="项目发票解控：">
          <el-radio-group v-model="dataForm.projectInvoiceClearance">
            <el-radio v-for="(item,index) in radioArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="laborPaymentClearance" label="劳务付款解控：">
          <el-radio-group v-model="dataForm.laborPaymentClearance">
            <el-radio v-for="(item,index) in radioArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>

      <form-title :title="'项目管理部人员'" :text="'提示：施工类项目必须维护执行经理！'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addBaseBank">新增</el-button>
      </div>
      <el-row style="padding: 10px 0">
        <el-table :key="tableKey" :data="dataForm.constructArchiveManageDetailList" class="f2bpmui-datagrid-vuetable" border header-cell-class-name="data-table-header">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="岗位">
            <template slot-scope="scope">
              <el-select v-model="scope.row.post" placeholder="请选择" size="small" style="width: 100%">
                <el-option v-for="(item,index) in postList" :key="index" :label="item.configName"
                           :value="item.configValue">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <select-dialog :disabled="true" :btnDisabled="isReadOnly" :modelData="dialogModel" :width="900"
                             :height="360" @updateValue="nameUpdate($event,scope.$index)"
                             :value="scope.row.name || msgTip.SELECT_PLACEHOLDER"
                             dynamicModel="selectUsers"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              <el-input v-model="scope.row.phone" size="small" placeholder="请输入"/>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="delCustomerBank(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <form-title :title="'项目数据权限'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addDataRole">新增</el-button>
      </div>
      <el-row  style="padding: 10px 0">
        <el-table :key="tableKey2" :data="dataForm.constructArchiveDataPermissionsDetailList" class="f2bpmui-datagrid-vuetable" border header-cell-class-name="data-table-header">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <select-dialog :disabled="true" :btnDisabled="isReadOnly" :modelData="dialogModel" :width="900"
                             :height="360" @updateValue="nameUpdate2($event,scope.$index)"
                             :value="scope.row.name || msgTip.SELECT_PLACEHOLDER"
                             dynamicModel="selectUsers"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              <el-input v-model="scope.row.phone" size="small" placeholder="请输入"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="delDataRole(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-row>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <select-dialog :disabled="true" :btnDisabled="isReadOnly" :modelData="dialogModel" :width="900"
                         :height="360" @updateValue="nameUpdate3"
                         :value="dataForm.createUserName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制部门：">
          <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <span>{{dataForm.createTime}}</span>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="lastModifyUserName" label="修改人：">
          <span>{{dataForm.lastModifyUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" prop="lastModifyDeptName" label="修改人部门：">
          <span>{{dataForm.lastModifyDeptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" prop="lastModifyTime" label="修改时间：">
          <span>{{dataForm.lastModifyTime}}</span>
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
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import {getSerialNumber} from '@/Api/workflowBusssion/index.js'
  import {saveForm, updateForm, getForm} from '@/Api/constructArchive/index';
  import {
    RADIO3_GROUP,
    RADIO2_GROUP,
    V_MARKET_MAIN_DOCUMENT_MODEL,
    BASE_BID_TEAM_LIBRARY_MODEL,
    CUSTOMER_MODEL,
    PRODUCTLINE_MODEL,
    BUSINERSSUNIT_MODEL,
    BASE_TAX_RATE_ARCHIVE_MODEL
  } from '@/views/businessModule/enum/param';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import moment from 'moment'
  import comMixin from '../minix';
  export default {
    components: {
      FormTitle,
      RowLayout,
      SelectDialog,
      NumberInput,
      CascSelect,
      PercentageInput,
      SelectDialog2
    },
    mixins: [comMixin],
    data() {
      return {
        dialogModel: {
          singleSelect: true,
          resultFieldKey: "",
          data: []
        },
        radioArray: RADIO3_GROUP,
        customerModel: CUSTOMER_MODEL, // 客户
        productLineModel: PRODUCTLINE_MODEL, // 产品线
        marketUnitModel: BUSINERSSUNIT_MODEL, // 业务单元
        //rateModel: BASE_TAX_RATE_ARCHIVE_MODEL, //税率
        rateModel: {  //施工税率
          code: 'base_tax_rate_archive',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'tax_attribute',
                value: 6
              }
            ]
          }
        },
        rateModel2: {  //预征率(%)
          code: 'base_tax_rate_archive',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'tax_attribute',
                value: 7
              }
            ]
          }
        },
        rowObject: {},
        msgTip: RuleRequired.tipMsg,
        fileList: [],
        categoryIdList: [], // 项目分类
        projectTaxMethodList: [], // 项目计税方式
        itemTypeList: [], // 立项类型
        projectStatusIdList: [], // 项目状态
        customerStatusList: [], // 客商状态
        enableStatusList: [], // 启用状态
        postList: [], // 岗位
        numVal: '100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        isAble: false,
        isReadOnly: false,
        tableKey: Object.toGuid(),
        tableKey2: Object.toGuid(),
        dataForm: {
          address: '',
          categoryId: '',
          code: '',
          constructArchiveDataPermissionsDetailList: [],
          constructArchiveManageDetailList: [],
          constructCode: '',
          constructionRate: '',
          constructionRateId: '',
          constructionUnitId: '',
          constructionUnitName: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerId: '',
          customerMainId: '',
          customerName: '',
          deptId: '',
          deptName: '',
          differentPlaces: '',
          finishedTime: '',
          id: '',
          isDel: '',
          isOldProject: '',
          isSpecialProject:'',
          itemTypeId: '',
          jsonData: '',
          lastModifyDeptId: '',
          lastModifyDeptName: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          marketCenterId: '',
          marketCenterName: '',
          marketMainId: '',
          marketUnitId: '',
          marketUnitName: '',
          moduleType: '',
          name: '',
          prevalenceRate: '',
          prevalenceRateId: '',
          procInstState: '',
          productLineId: '',
          productLineName: '',
          projectAddress: '',
          projectDepartmentId: '',
          projectDepartmentName: '',
          projectInvoiceClearance: '0',
          projectManagerId: '',
          projectManagerName: '',
          projectManagerTel: '',
          projectStatusId: '1',
          projectTaxMethod: '',
          remark: '',
          supplierInvoiceClearance: '0',
          targetProfitRate: '',
          laborPaymentClearance: '0',
          wiid: ''
        },
        // 必填校验
        dataRule: RuleRequired.dataRule(['name', 'customerName', 'address', 'projectTaxMethod', 'marketUnitName', 'constructionUnitName', 'projectDepartmentName', 'projectManagerName', 'supplierInvoiceClearance', 'projectInvoiceClearance','laborPaymentClearance', 'differentPlaces', 'categoryId'])
      };
    },
    watch: {
      // 监听,当路由发生变化的时候执行
      $route: {
        handler: function(val, oldVal){
          console.log(val);
          if(val.name == 'form'){
            this.beforeInit();
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    computed: {},
    created() {
      this.beforeInit();
      this.dataRule['projectAddress'] =  [{ required: true, message: '必填项不能为空', trigger: 'blur' }];
    },
    mounted() {
      this.beforeInit();
    },
    methods: {
      /**
       * 初始化详情
       * @param {*} data
       */
      inits() {
        var that = this;
        let id = Object.toQueryString('rowId') || '';
        if (that.$refs['dataForm']) that.$refs['dataForm'].resetFields();
        if (id) {
          try {
            that.loading = true;
            getForm(id).then(res => {
              if (res.code === 200) {
                that.dataForm = res.data;
              }
            });
            this.loading = false
          } catch (error) {
            this.loading = false
          }
        } else {
          this.initUserInfo();

        }
      },
      /**
       * 初始化用户信息
       */
      initUserInfo() {
        const {orgName, orgId, realName, userId} = FUI.Sys.getAuthor();
        this.dataForm.createUserId = userId;
        this.dataForm.createUserName = decodeURIComponent(realName);
        this.dataForm.deptId = orgId;
        this.dataForm.deptName = decodeURIComponent(orgName);
        this.dataForm.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      updateValue(data) {
        this.dataForm.name = data[0].text;
      },
      beforeInit() {
        let formAction = Object.toQueryString('formAction') || '';
        if (formAction > 2) {
          this.isReadOnly = true;
        }else {
          this.isReadOnly = false;
        }
        this.getDataDictByConfigType();
      //  this.inits();
      },
      afterInit() {
        console.log(this.dataForm,'123123')
        // this.clearForm()
      },
      handleChange() {
      },
      /**
       * 施工税率
       * */
      constructionRateUpdate(data) {
        const {taxRate, id} = data[0];
        this.dataForm.constructionRate = taxRate;
        this.dataForm.constructionRateId = id;
      },
      /**
       * 预征率
       * */
      prevalenceRateUpdate(data) {
        const {taxRate, id} = data[0];
        this.dataForm.prevalenceRate = taxRate;
        this.dataForm.prevalenceRateId = id;
      },
      /**
       * 项目计税方式
       * */
      changeProjectTaxMethod() {
        var val = this.dataForm.projectTaxMethod;
        if (val == 1) {
          this.dataForm.prevalenceRate = 0.02;
          this.dataForm.prevalenceRateId = '400000005';
        } else if (val == 2) {
          this.dataForm.prevalenceRate = 0.03;
          this.dataForm.prevalenceRateId = '400000035';
        } else {
          this.dataForm.prevalenceRate = 0.00;
          this.dataForm.prevalenceRateId = '1694553306133950464';
        }
        this.$forceUpdate();
      },
      /**
       * 客户
       * */
      customerUpdate(data) {
        const {customerName, id} = data[0];
        this.dataForm.customerName = customerName;
        this.dataForm.customerId = id;
      },
      /**
       * 产品线
       * */
      productLineUpdate(data) {
        const {name, id} = data[0];
        this.dataForm.productLineName = name;
        this.dataForm.productLineId = id;
      },
      /**
       * 业务单元
       * */
      marketUnitUpdate(data) {
        const {businessUnit, id} = data[0];
        this.dataForm.marketUnitName = businessUnit;
        this.dataForm.marketUnitId = id;
      },
      /**
       * 管理部门
       * */
      constructionUnitUpdate(data) {
        const {text, value} = data[0];
        this.dataForm.constructionUnitName = text;
        this.dataForm.constructionUnitId = value;

      },
      /**
       * 项目部
       * */
      projectDepartmentUpdate(data) {
        const {text, value} = data[0];
        this.dataForm.projectDepartmentName = text;
        this.dataForm.projectDepartmentId = value;

      },
      /**
       * 业务中心
       * */
      marketCenterUpdate(data) {
        const {text, value} = data[0];
        this.dataForm.marketCenterName = text;
        this.dataForm.marketCenterId = value;
      },
      /**
       *项目负责人
       */
      projectManagerNameUpdate(data) {
        const {realName, userId, mobile} = data[0];
        this.dataForm.projectManagerName = realName;
        this.dataForm.projectManagerId = userId;
        this.dataForm.projectManagerTel = mobile;

      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({params: {configTypes: '项目分类,项目计税方式,项目状态,岗位,立项类型'}});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '项目分类':
                this.categoryIdList = ele.dataDict;
                break;
              case '项目计税方式':
                this.projectTaxMethodList = ele.dataDict;
                break;
              case '项目状态':
                this.projectStatusIdList = ele.dataDict;
                break;
              case '岗位':
                this.postList = ele.dataDict;
                break;
              case '立项类型':
                this.itemTypeList = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 添加项目管理部人员
       */
      addBaseBank() {
        if (!this.dataForm.constructArchiveManageDetailList) this.dataForm.constructArchiveManageDetailList = []
        this.dataForm.constructArchiveManageDetailList.push({
          id: "",
          name: "",
          nameId: "",
          phone: "",
          post: ""
        })
      },
      /**
       * 添加数据权限
       * */
      addDataRole(){
        if (!this.dataForm.constructArchiveDataPermissionsDetailList) this.dataForm.constructArchiveDataPermissionsDetailList = []
        this.dataForm.constructArchiveDataPermissionsDetailList.push({
          id: "",
          name: "",
          nameId: "",
          phone: ""
        })

      },
      /**
       * 删除项目管理部人员
       */
      delCustomerBank(index) {
        this.dataForm.constructArchiveManageDetailList.splice(index, 1)
      },
      /**
       * 删除数据权限
       */
      delDataRole(index) {
        this.dataForm.constructArchiveDataPermissionsDetailList.splice(index, 1)
      },

      /**
       * 子表1--姓名
       * */
      nameUpdate(data, index) {
        this.$set(this.dataForm.constructArchiveManageDetailList[index], 'nameId', data[0].userId);
        this.$set(this.dataForm.constructArchiveManageDetailList[index], 'name', data[0].realName);
        this.$set(this.dataForm.constructArchiveManageDetailList[index], 'phone', data[0].mobile);
      },

      /**
       * 子表2--姓名
       * */
      nameUpdate2(data, index) {
        this.$set(this.dataForm.constructArchiveDataPermissionsDetailList[index], 'nameId', data[0].userId);
        this.$set(this.dataForm.constructArchiveDataPermissionsDetailList[index], 'name', data[0].realName);
        this.$set(this.dataForm.constructArchiveDataPermissionsDetailList[index], 'phone', data[0].mobile);
      },

      /**
       * 编制人
       * */
      nameUpdate3(data){
        const {userId,realName} = data[0];
        this.dataForm.createUserName=realName;
        this.dataForm.createUserId = userId;
      },



      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        var arr = _this.$refs.area.getResult();
        _this.dataForm.projectAddress = arr.value;
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
       * 校验子表信息完整
       * */
      vaildTableList() {
        //提交时前置事件  务必要有返回值true/false; 返回false：校验不通过， 返回true校验通过继续执行
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.customerSupplierArchiveBankDetailList;
        if (arr.length > 0) {
          for (var j = 0; j <= arr.length; j++) {
            if (arr[j]) {
              var accountName = arr[j].accountName;
              var bankName = arr[j].bankName;
              var account = arr[j].account;

              if (accountName && bankName && account) {
                return !isOk;
              } else {
                FUI.Window.showMsg2('银行信息中，所有表格行都需补充完整！');
                return isOk
              }
            }
          }

        }
      },
      clearForm() {
        this.$refs['dataForm'].resetFields();
        this.dataForm.constructArchiveDataPermissionsDetailList = []
        this.dataForm.constructArchiveManageDetailList = [];
      }
    }
  };
</script>

<style scoped lang="scss">

  .commponent-height {
    height: 32px;
    line-height: 32px;
  }

  ::v-deep .designPrice {
    .el-input-group__append {
      padding: 0 12px;
    }
  }
  .data-table-header{
    font-size: 14px;
    font-weight: 500;
  }
</style>
