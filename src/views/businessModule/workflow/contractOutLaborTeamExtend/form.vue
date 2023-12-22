<template>
  <!--班组合同-->
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px"
             class="new-data-form-css">
      <row-layout :title="'项目信息'" :cols="3">
        <el-form-item slot="col_1" label="合同编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode"
                           dynamicModel="customDialog" @updateValue="updateMasterContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :title="'合同信息'">
        <el-form-item slot="col_1" prop="contractCategory" label="合同类别：">
          <el-radio-group v-model="dataForm.contractCategory" @change="changeContractCategory">
            <el-radio v-for="(item,index) in contractCategoryOptions" :key="index" :label="item.configValue">{{
              item.configName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同编号：" :prop="setRules('masterContractCode')">
          <el-input v-model="dataForm.masterContractCode" v-if="dataForm.contractCategory == 1" disabled size="small"
                    placeholder="自动填写"/>
          <selector-dialog :model-data="mainContractDialog" v-else :value="dataForm.masterContractCode"
                           dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="主合同名称：">
          <el-input v-model="dataForm.masterContractName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" :prop="dataForm.contractCategory == 1?'laborSubContractCode':''" label="劳务分包合同编号：">
          <el-input v-model="dataForm.laborSubContractCode" v-if="dataForm.contractCategory == 2" disabled size="small"
                    placeholder="自动填写"/>
          <selector-dialog v-else :model-data="customerSupplierArchiveDialog" :value="dataForm.laborSubContractCode"
                           dynamic-model="customDialog" @updateValue="updateCustomerValue"
                           :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="laborSubContractName" label="劳务分包合同名称：">
          <el-input v-model="dataForm.laborSubContractName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_3"  label="劳务分包商：">
          <el-input v-model="dataForm.contractPartyBName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="canBeSignedAmount" label="可签订金额(元)：">
          <amount-input v-model="dataForm.canBeSignedAmount" size="small" placeholder="请输入" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="班组合同名称：">
          <el-input size="small"  placeholder="请输入" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" :prop="dataForm.contractCategory == 1?'paymentMethod':''" label="支付方式：">
          <el-select v-model="dataForm.paymentMethod" placeholder="请选择"
                     :disabled="dataForm.contractCategory == 2?true:false">
            <el-option v-for="(item,index) in paymentMethodOptions" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="copies" label="合同份数：">
          <numberInput v-model="dataForm.copies" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item slot="col_2" :prop="dataForm.contractCategory == 1?'teamLeader':''" label="班组长：">
          <el-input v-model="dataForm.teamLeader" size="small" placeholder="自动带出" disabled v-if="dataForm.contractCategory == 2"/>
          <selector-dialog :model-data="teamLeaderDialog" :value="dataForm.teamLeader" v-else
                           dynamicModel="customDialog" @updateValue="updateTeamLeader"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="合同金额(元)：">
          <amount-input v-model="dataForm.contractAmountTax" disabled size="small" placeholder="自动计算"/>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="signDate" label="合同签订日期：">
          <el-date-picker v-model="dataForm.signDate" type="date" placeholder="请选择" size="small"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="effectiveDate" label="合同生效日期：">
          <el-date-picker v-model="dataForm.effectiveDate" type="date" placeholder="请选择" size="small"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="endDate" label="合同结束日期：">
          <el-date-picker v-model="dataForm.endDate" type="date" placeholder="请选择" size="small"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="2-1">
        <el-form-item slot="col_1" label="合同是否归档：" v-if="wfContext.WorkflowInstinceState == 3">
          <el-radio-group v-model="dataForm.archivist" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName
              }}
            </el-radio>
          </el-radio-group>
          <el-button type="primary" size="small" style="margin: 0 15px" v-if="dataForm.archivist == 0">进行归档</el-button>
          <el-button type="primary" size="small" v-else>查看归档</el-button>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入"
                    maxlength="250"/>
        </el-form-item>
      </row-layout>
      <form-title :title="'合同明细信息'"></form-title>
      <sub-table :tableData="rowDatas" ref="detail" @sumAmount="sumAmount"></sub-table>
      <form-title :title="'支付条款'"></form-title>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="advPayment" label="预付款(%)：">
          <percentage-input v-model="dataForm.advPayment" size="small" placeholder="请输入" @change="change_AdvPayment"
                            :disabled="dataForm.contractCategory == 2?true:false"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="proPayment" label="进度款(%)：">
          <percentage-input v-model="dataForm.proPayment" size="small" placeholder="请输入"
                            :disabled="dataForm.contractCategory == 2?true:false" @change="change_ProPayment"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_3" label="完工款(%)：" prop="comPayment">
          <percentage-input v-model="dataForm.comPayment" size="small" placeholder="请输入" @change="change_ComPayment"
                            :disabled="dataForm.contractCategory == 2?true:false"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="settlement" label="结算款(%)：">
          <percentage-input v-model="dataForm.settlement" size="small" placeholder="请输入" @change="change_Settlement"
                            :disabled="dataForm.contractCategory == 2?true:false"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="retMoney" label="质保金(%)：">
          <percentage-input v-model="dataForm.retMoney" size="small" placeholder="请输入" @change="change_RetMoney"
                            :disabled="dataForm.contractCategory == 2?true:false"></percentage-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：">
          <span>{{ dataForm.createUserName }}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：">
          <span>{{ dataForm.deptName }}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：">
          <span>{{ dataForm.createTime }}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>

  import comMixin from '../minix';
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
  import SelectDialog2 from '@/components/workflow/selector/selectorDialog2.vue';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import {getCanBeSignedAmount} from '@/Api/contract/index.js'
  import {getRealTimeData} from '@/Api/workflowBusssion/construct.js'
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import cascSelect from '@/components/basic/cascSelect/index.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import numberInput from '@/components/basic/numberInput/index.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import {ISUSEDOPTIONS_GROUP, CUSTOMER2_MODEL, BASE_LABOR_TEAM_MAIN_MODEL} from '@/views/businessModule/enum/param';
  import subTable from './components/subtable'
  import moment from 'moment'

  const requiredArray = ['constructArchiveMainCode', 'contractCategory', 'masterContractCode', 'laborSubContractCode', 'name', 'copies', 'paymentMethod', 'signDate', 'archivist', 'proPayment', 'comPayment', 'settlement', 'retMoney', 'fileInfoList','advPayment','teamLeader'];
  export default {
    components: {
      FormTitle,
      selectorDialog,
      RowLayout,
      amountInput,
      numberInput,
      percentageInput,
      cascSelect,
      updateFiles,
      SelectDialog2,
      subTable
    },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        isReadOnly: false,
        isUsedOptions: ISUSEDOPTIONS_GROUP, //是否使用
        rowDatas: [],
        dataForm: {
          advPayment: '',
          archivist: '0',
          code: '',
          comPayment: '',
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          contractAmountTax: '',
          contractAmountTaxFree: '',
          contractCategory: '1',
          contractOutMainId: '',
          contractPartyBId: '',
          contractPartyBName: '',
          contractVersion: '',
          copies: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          deptId: '',
          deptName: '',
          detailList: [],
          effectiveDate: '',
          electronContractStatus: '',
          endDate: '',
          extendId: '',
          fileInfoList: [],
          id: '',
          laborSubContractCode: '',
          laborSubContractId: '',
          laborSubContractName: '',
          masterContractCode: '',
          masterContractId: '',
          masterContractName: '',
          name: '',
          paymentMethod: '',
          prepaymentDeductionMethod: '',
          proPayment: '',
          progress: '',
          projectManagerName: '',
          remark: '',
          retMoney: '',
          settleTypeId: '',
          settlement: '',
          signDate: '',
          teamLeader: '',
          teamLibraryId: '',
          canBeSignedAmount: '',
          wiid: '',
          constructionUnitId:'',
          projectManagerId:''
        },
        wfContext: null,
        purchaseTypeOptions: [],
        contractCategoryOptions: [],
        contractVersionOptions: [],
        purchaseMaterialsTypeOptions: [],
        stampModeOptions: [],
        stampSortOptions: [],
        paymentMethodOptions: [],
        radioOptions: [],
        prepaymentDeductionMethodOptions: [],
        teamLeaderDialog: {
          code: 'BanZuKu',
          customDialog: 'BanZuKu',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        }, // 班组长
        customerSupplierArchiveDialog: {
          code: 'ZhuHeTongLaoWuFenBaoHeTong',
          customDialog: 'ZhuHeTongLaoWuFenBaoHeTong',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        masterContractDialog: {
          code: 'XiangMuDangAnLaoWuFenBaoHeTong',
          customDialog: 'XiangMuDangAnLaoWuFenBaoHeTong',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        mainContractDialog: {
          code: 'ZhuHeTongBanZuHeTong',
          customDialog: 'ZhuHeTongBanZuHeTong',
          isSetHead: 1,
          isMulti: false,
          initailData: [],
          parm: {varParams: [{key: 'constructArchiveMainId', value: ''}]}
        },
        orgDialog: {
          resultFieldKey: 'groupId',
          code: 'selectOrg',
          customDialog: 'selectOrg',
          isSetHead: 1,
          isMulti: false,
          initailData: [],
          parm: {singleSelect: true}
        },
        taxRateDialog: {
          code: 'base_tax_rate_archive',
          customDialog: 'base_tax_rate_archive',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    computed: {
      /**
       * 合同类别=增补合同，根据主合同带出，不可修改
       *
       */
      isMainContract() {
        var val = this.dataForm.contractCategory; //合同类别
        if (val == 1) {
          return false
        } else {
          return true
        }

      }
    },
    mounted() {
      this.wfContext = window.WFContext; // 流程信息
    },
    created() {
    },
    methods: {
      setRules(code) {
        if (this.dataForm.contractCategory == 1) {
          return ''
        } else {
          return code
        }
      },
      /**
       * 税率
       * */
      constructionRateUpdate(data) {
        const {taxRate, id} = data[0];
        this.dataForm.constructionRate = taxRate;
      },
      /**
       * 项目编号
       */
      updateMasterContractValue(data) {
        if (data && data.length <= 0) return;
        const { constructarchivemainid,constructionUnitId,projectManagerId, constructarchivemaincode, constructarchivemainname, projectmanagername, customersupplierarchivemainname,customersupplierarchivemainid,constructionunitname} = data[0];
        this.dataForm.constructArchiveMainCode = constructarchivemaincode;
        this.dataForm.constructArchiveMainName = constructarchivemainname;
        this.dataForm.constructArchiveMainId = constructarchivemainid;
        this.dataForm.name = constructarchivemainname;
        this.dataForm.constructionUnitName = constructionunitname;
        this.dataForm.projectManagerName = projectmanagername;
        this.mainContractDialog.parm.varParams[0].value = constructarchivemainid;
        this.dataForm.customerSupplierArchiveMainId = customersupplierarchivemainid;
        this.dataForm.customerSupplierArchiveMainName = customersupplierarchivemainname;
        this.dataForm.constructionUnitId = constructionUnitId;
        this.dataForm.projectManagerId = projectManagerId;
      },
      /**
       * 主合同名称(控件)
       */
      updateMainContractValue(data) {
        if (data && data.length <= 0) return;
        const {
          advpayment,basetaxratearchiveid,compayment,constructarchivemainid,contractpartyaid,contractpartyaname,customerSupplierArchiveMainId,customersupplierarchivemainid,customersupplierarchivemainname,
          laborsubcontractcode,laborsubcontractid,laborsubcontractname,mastercontractcode,mastercontractid,mastercontractname,paymentmethod,propayment,retmoney,settlement,taxrate,teamleader,
          teamlibraryid
        } = data[0];
        this.dataForm.masterContractId = mastercontractid;
        this.dataForm.masterContractCode = mastercontractcode;
        this.dataForm.masterContractName = mastercontractname;
        this.dataForm.laborSubContractCode = laborsubcontractcode;
        this.dataForm.laborSubContractId = laborsubcontractid;
        this.dataForm.laborSubContractName = laborsubcontractname;
        this.dataForm.contractPartyBName = customersupplierarchivemainname;
        this.dataForm.contractPartyBId = customersupplierarchivemainid;
        this.dataForm.paymentMethod = paymentmethod;
        this.dataForm.teamLeader = teamleader;
        this.dataForm.teamLibraryId = teamlibraryid;
        this.dataForm.advPayment = advpayment;
        this.dataForm.comPayment = compayment;
        this.dataForm.proPayment = propayment;
        this.dataForm.retMoney = retmoney;
        this.dataForm.settlement = settlement;
        this.dataForm.taxRate = taxrate;
        this.dataForm.teamLibraryId = teamlibraryid;
        this.$forceUpdate()
      },
      /**
       *  合同类别
       * */
      changeContractCategory() {
        var val = this.dataForm.contractCategory;
        this.dataForm.masterContractCode = '';
        this.dataForm.masterContractId = '';
        this.dataForm.masterContractName = '';
        this.dataForm.taxRate = '';
        if (val == 1) {
          this.dataForm.noAppointSupplier = '0'
        }
        this.$forceUpdate();
      },
      /**
       * 劳务分包商
       * */
      updateCustomerValue(data) {
        if (data.length > 0) {
          const {mastercontractcode, mastercontractid,mastercontractname,customersupplierarchivemainid,customersupplierarchivemainname} = data[0];
          this.dataForm.laborSubContractCode = mastercontractcode;
          this.dataForm.laborSubContractId = mastercontractid;
          this.dataForm.laborSubContractName = mastercontractname;
          this.dataForm.contractPartyBName = customersupplierarchivemainname;
          this.dataForm.contractPartyBId = customersupplierarchivemainid;
          // 获取可签订金额
          if(mastercontractid){
            this.getCanBeSignedAmountFn();
          }
        }
      },
      /**
       * 班组长
       * */
      updateTeamLeader(data) {
        if (data.length > 0) {
          const {teamleader, baselaborteammainid} = data[0];
          this.dataForm.teamLeader = teamleader;
          this.dataForm.teamLibraryId = baselaborteammainid;
        }
      },
      beforeInit() {
        this.getDataDictByConfigType()
        if (this.dataForm.constructArchiveMainId) this.getRealTimeData()
      },
      afterInit() {
        var that = this;
          if(that.dataForm.detailList){
            that.dataForm.detailList = that.dataForm.detailList;
            that.$nextTick(()=>{
              that.rowDatas = that.dataForm.detailList;
              that.$refs.detail.setRows(that.rowDatas);
            });
          }
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        this.dataForm.detailList = this.$refs.detail.getResult(); // 子表信息
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        return dataForm;
      },
      /**
       * 表单校验
       */
      validateForm() {
        const _this = this;
        var state = _this.wfContext.WorkflowInstinceState; // 流程状态
        _this.dataForm.detailList = _this.$refs.detail.getResult(); // 子表信息
        if (state < 2) {
          // 校验子表数据唯一性
          if (_this.vaildOnlyTableData() === false) {
            return false
          }
        }
        if (_this.change_AdvPayment() === false) {
          return false
        }
        if (_this.change_ProPayment() === false) {
          return false
        }
        if (_this.change_ComPayment() === false) {
          return false
        }
        if (_this.change_Settlement() === false) {
          return false
        }
        if (_this.change_RetMoney() === false) {
          return false
        }
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              return resolve(_this.getDataForm());
            } else {
              return resolve(false)
            }
          })
        });
      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({params: {configTypes: '合同类别,是或否,预付款扣除方式,结算方式'}})
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '合同类别':
                this.contractCategoryOptions = ele.dataDict;
                break;
              case '是或否':
                this.radioOptions = ele.dataDict;
                break;
              case '结算方式':
                this.paymentMethodOptions = ele.dataDict;
                break;
              case '预付款扣除方式':
                this.prepaymentDeductionMethodOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },

      // 校验 同一表单内 根据 项目名称+单位+单价  校验唯一性，不允许重复
      vaildOnlyTableData() {
        var that = this;
        var arr = that.dataForm.detailList;
        // 判断是否唯一性
        if (arr && arr.length > 1) {
          var a2 = [];
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var FileName = (arr[j].fileName).toString(); // 项目名称
              var Unit = (arr[j].unit).toString(); // 单位
              var TaxUnitPrice = (arr[j].unitPriceTax).toString(); // 单价（含税）
              var obj = FileName + '-' + Unit + '-' + '-' + TaxUnitPrice;
              a2.push(obj);

            }
          }
          var states = Object.isRepeat(a2); // 校验是否相同
          console.log(states, '23');
          if (states === true) {
            FUI.Window.showMsg('合同明细信息中，项目名称+单位+单价存在不唯一，请检查重复数据');
            return false;
          }
        }else if(arr && arr.length === 1){
          var a1 = arr[0];
          var FileName = a1.fileName; // 项目名称
          var Unit = a1.unit; // 单位
          var Number = a1.number; // 数量
          var TaxUnitPrice = a1.unitPriceTax; // 单价（含税）
          if (FileName && Unit && Number && TaxUnitPrice) {
            return true
          } else {
            FUI.Window.showMsg('合同明细信息数据至少有一条时，行内数据必填');
            return false;
          }
        }else{
          FUI.Window.showMsg('合同明细信息数据，至少要有一条');
          return false;
        }
      },
      //**********************************支付条款信息校验********************************************************************

      change_AdvPayment() {
        //预付款（%）
        var value = this.dataForm.advPayment;
        var isOk = false;
        value = Number(value);
        var getProPayment = this.dataForm.proPayment; // 进度款
        if (getProPayment && value) {
          if (Number(getProPayment) > value || Number(getProPayment) == value) {
            return !isOk
          } else {
            FUI.Window.showMsg('预付款不能大于进度款');
            return isOk
          }
        }
      },
      change_ProPayment() {
        //进度款（%）
        var isOk = false;
        var oIndex = 0;
        var value = this.dataForm.proPayment;
        value = Number(value);
        var getAdvPayment = this.dataForm.advPayment; // 预付款
        var comPayment = this.dataForm.comPayment;
        if (getAdvPayment && value) {
          if (Number(getAdvPayment) < value || Number(getAdvPayment) == value) {
            oIndex = 0
          } else {
            FUI.Window.showMsg('进度款需要大于等于预付款');
            oIndex = 1
          }
        }
        if(comPayment && value){
          if (Number(comPayment) > value || Number(comPayment) == value) {
            oIndex = 0
          } else {
            FUI.Window.showMsg('进度款需要小于等于完工款');
            oIndex = 2
          }
        }
        if(oIndex>0){
          return false
        }
      },
      change_ComPayment() {
        //完工款（%）
        var isOk = false;
        var oIndex = 0;
        var value = this.dataForm.comPayment;
        var settlement = this.dataForm.settlement;
        value = Number(value);
        var proPayment = this.dataForm.proPayment;
        if (proPayment && value) {
          if (Number(proPayment) < value || Number(proPayment) == value) {
            oIndex = 0
          } else {
            FUI.Window.showMsg('完工款需要大于等于进度款');
            oIndex = 1
          }
        }
        if (settlement && value) {
          if (Number(settlement) > value || Number(settlement) == value) {
            oIndex = 0
          } else {
            FUI.Window.showMsg('完工款需要小于等于结算款');
            oIndex = 1
          }
        }
        if(oIndex>0){
          return false
        }
      },

      change_Settlement() {
        //结算款（%）
        var isOk = false;
        var oIndex = 0;
        var value = this.dataForm.settlement;
        var retMoney = this.dataForm.retMoney;
        value = Number(value);
        var comPayment = this.dataForm.comPayment;
        if (comPayment && value) {
          if (Number(comPayment) < value || Number(comPayment) === value) {
            oIndex = 0
          } else {
            FUI.Window.showMsg('结算款需要大于等于完工款');
            oIndex = 1
          }
        }
        if (retMoney && value) {
          if (Number(retMoney) + value == 1) {
            oIndex = 0
          } else {
            FUI.Window.showMsg('结算款和质保金相加需要为100%');
            oIndex = 1
          }
        }
        if(oIndex>0){
          return false
        }
      },

      change_RetMoney() {
        //质保金（%）
        var isOk = false;
        var value = this.dataForm.retMoney;
        value = Number(value);
        var getSettlement = this.dataForm.settlement;
        if (getSettlement && value) {
          if (Number(getSettlement) + value == 1) {
            return !isOk
          } else {
            FUI.Window.showMsg('结算款和质保金相加需要为100%');
            return isOk
          }
        }
      },
      // 获取合同明细金额汇总
      sumAmount(row){
        var arr = row; //明细表
        var amount = 0;
        if(arr && arr.length > 0){
          for(let i in arr){
            amount+= Number(arr[i].amountTax);
          }
        }
        // this.dataForm.contractAmountTax = Object.tofixed(amount,2);
        this.dataForm.detailList = row;
        this.$set(this.dataForm,'contractAmountTax',amount);
        this.$forceUpdate()
      },
      // 获取可签订金额
      async getCanBeSignedAmountFn(){
        let id = this.dataForm.laborSubContractId;
        const res = await getCanBeSignedAmount(id);
        if(res.code === 200){
            this.dataForm.canBeSignedAmount = res.data;
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
</style>
