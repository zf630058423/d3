<!--班组工资确认单-->
<template>
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px" class="new-data-form-css">
      <row-layout :title="'项目信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode" dynamicModel="customDialog" @updateValue="updateMasterContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :title="'合同信息'">
        <el-form-item slot="col_1" label="劳务分包合同：" prop="laborSubContractCode">
          <!--<el-input v-model="dataForm.laborSubContractCode" disabled size="small" placeholder="自动填写" />-->
          <selector-dialog :model-data="mainContractDialog" :value="dataForm.laborSubContractCode" dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="劳务分包合同名称：">
          <el-input v-model="dataForm.laborSubContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3"  label="劳务分包商：">
          <el-input v-model="dataForm.customerSupplierArchiveMainName" size="small" placeholder="自动带出" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="teconciliationDate" label="对账日期：">
          <el-date-picker v-model="dataForm.teconciliationDate" type="date" placeholder="请选择" size="small" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" label="本次确认金额(元)：">
          <amount-input v-model="dataForm.confirmedAmount" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="工盟考勤机：">
          <el-radio-group v-model="dataForm.isUseAttendance" disabled placeholder="自动带出">
            <el-radio v-for="(item,index) in isUsedOptions" :key="index" :label="item.label">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isAutoPay" label="是否自动发起付款：">
          <el-radio-group v-model="dataForm.isAutoPay" >
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="付款状态：">
          <el-select v-model="dataForm.paymentStatus" placeholder="请选择" size="small" disabled>
            <el-option v-for="(item,index) in paymentStatusOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.memo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'确认单信息'" :text="'提示：子公司项目在未使用工盟考勤机时，需点击【做工资单】按钮创建工资单，再关联该工资单！'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addDetail">新增</el-button>
        <el-button type="primary" size="small" @click="handelOpenPayroll">做工资单</el-button>
      </div>
      <el-table :data="dataForm.detailList" fit class="f2bpmui-datagrid-vuetable" border show-summary  :summary-method="getSummaries1" width="100%">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="班组合同" width="150px">
          <div slot="header"><span style="color: #ed4014">*</span> 班组合同</div>
          <template slot-scope="scope">
            <selector-dialog :model-data="laborTeamMainNameDialog" :value="scope.row.laborTeamMainName" dynamicModel="customDialog" @updateValue="updatelaborTeamMainName($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="合同金额" width="150px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.contractAmount" size="small" placeholder="请输入" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" width="150px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.settlementAmount" size="small" placeholder="请输入" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="累计核量金额" width="150px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.accumulatedAmount" size="small" placeholder="请输入" disabled></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="累计已确认金额(元)" width="150px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.accumulatedConfirmedAmount" size="small" placeholder="请输入" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="付款性质" width="150px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.payNature" placeholder="请选择" size="small" @change="changePayNature($event,scope.$index)">
              <el-option v-for="(item,index) in payNatureOptions" :key="index" :label="item.configName" :value="item.configValue">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="剩余可确认金额(元)" width="150px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.remainingConfirmableAmount" size="small" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="工资单" width="150px">
          <div slot="header"><span style="color: #ed4014">*</span> 工资单</div>
          <template slot-scope="scope">
            <selector-dialog :model-data="teamWageNameDialog" :value="scope.row.teamWageName" dynamicModel="customDialog" @updateValue="updateTeamWageName($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="工资总额(元)" width="150px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountTax" size="small" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="班组长" width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.teamLeader" size="small" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="发放时间段" width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amountTax" size="small" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="工资单类型" width="150px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.payrollType" placeholder="请选择" size="small" disabled>
              <el-option v-for="(item,index) in payrollTypeOptions" :key="index" :label="item.configName" :value="item.configValue">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="delCustomer(scope.$index)">删除 </el-button>
            <el-button type="text" @click="handelTeamWageDetail(scope.row)" :disabled="false"> 工资单详情</el-button>
          </template>
        </el-table-column>

      </el-table>

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
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import { getContractTeamAmount } from '@/Api/contract/index.js'
  import { getRealTimeData } from '@/Api/workflowBusssion/construct.js'
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import multipleDecimalsInput from '@/components/basic/numberInput/multipleDecimalsInput.vue'
  import cascSelect from '@/components/basic/cascSelect/index.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import numberInput from '@/components/basic/numberInput/index.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import {ISUSEDOPTIONS_GROUP,CUSTOMER2_MODEL} from '@/views/businessModule/enum/param';
  import moment from 'moment'
  const requiredArray = ['fileInfoList','constructArchiveMainCode','laborSubContractCode','isAutoPay'];
  export default {
    components: { FormTitle, selectorDialog, RowLayout, amountInput,numberInput,percentageInput, cascSelect, updateFiles,SelectDialog2,multipleDecimalsInput },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        isReadOnly: false,
        isUsedOptions: ISUSEDOPTIONS_GROUP, //是否使用
        dataForm: {
          annex: '',
          businessKey: '',
          code: '',
          confirmedAmount: '',
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          contractOutMainId: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerSupplierArchiveMainName: '',
          deptId: '',
          deptName: '',
          detailList: [],
          fileInfoList: [],
          formId: '',
          id: '',
          isAutoPay: '',
          isDel: 0,
          isUseAttendance: '',
          jsonData: '',
          laborSubContractCode: '',
          laborSubContractName: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          memo: '',
          paymentStatus: '1',
          procInstState: '',
          processFinishedTime: '',
          projectManagerName: '',
          supplierId: '',
          teconciliationDate: moment(new Date()).format('YYYY-MM-DD'),
          wiid: '',
          constructionUnitId:'',
          projectManagerId:''
        },
        payNatureOptions: [], // 付款性质
        radioOptions: [],
        paymentStatusOptions: [], // 付款状态
        payrollTypeOptions:[],// 工资单类型
        wfContext: null,
        rateModel: {  //税率
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
        customerSupplierArchiveDialog: CUSTOMER2_MODEL,
        masterContractDialog: { code: 'XiangMuDangAnLaoWuFenBaoHeTong', customDialog: 'XiangMuDangAnLaoWuFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [] },
        mainContractDialog: { code: 'ZhuHeTongLaoWuFenBaoHeTong', customDialog: 'ZhuHeTongLaoWuFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
        laborTeamMainNameDialog: { code: 'ZhuHeTongBanZuHeTong', customDialog: 'ZhuHeTongBanZuHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructarchivemainid',value:''}]} },
        orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
        taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
        teamWageNameDialog: { code: 'GongZiDan', customDialog: 'GongZiDan', isSetHead: 1, isMulti: false, initailData: [] },
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    watch:{
      'dataForm.contractAmountTax':{
        handler(n, o) {
          console.log(n,o,'new value');
          if(n){
            let val = Number(n)*0.05;
            this.dataForm.measureFee = Object.numberFixed(val,2); // 其中措施费
          }else {
            this.dataForm.measureFee = 0;
          }
        }
      }
    },
    computed: {
      /**
       * 合同类别=增补合同，根据主合同带出，不可修改
       * 非指定分包商,是可以编辑，否不可编辑
       */
      isMainContract() {
        var val1 = this.dataForm.noAppointSupplier; // 非指定分包商
        var val2 = this.dataForm.contractCategory; //合同类别
        if(val1 == 1 && val2 == 1){
          return false
        }else{
          return true
        }

      }
    },
    mounted() {
      this.wfContext = window.WFContext; // 流程信息
    },
    methods: {
      setRules(code) {
        if (this.dataForm.contractCategory == 1) {
          return code
        }else{
          return ''
        }
      },
      /**
       * 项目编号
       */
      updateMasterContractValue(data) {
        if(data && data.length <= 0) return;
        const { constructarchivemainid,constructionUnitId,projectManagerId, constructarchivemaincode, constructarchivemainname, projectmanagername,constructionunitname} = data[0];
        this.dataForm.constructArchiveMainCode = constructarchivemaincode;
        this.dataForm.constructArchiveMainName = constructarchivemainname;
        this.dataForm.constructionUnitName = constructionunitname;
        this.dataForm.projectManagerName = projectmanagername;
        this.dataForm.constructArchiveMainId = constructarchivemainid;
        this.dataForm.constructionUnitId = constructionUnitId;
        this.dataForm.projectManagerId = projectManagerId;
        this.mainContractDialog.parm.varParams[0].value = constructarchivemainid;
      },
      /**
       * 主合同名称(控件)
       */
      updateMainContractValue(data) {
        if(data && data.length <= 0) return;
        const { mastercontractid, mastercontractcode, mastercontractname,isusedgmattendancemachine,customersupplierarchivemainid,customersupplierarchivemainname} = data[0];
        this.dataForm.contractOutMainId = mastercontractid;
        this.dataForm.laborSubContractCode = mastercontractcode;
        this.dataForm.laborSubContractName = mastercontractname;
        this.dataForm.customerSupplierArchiveMainName = customersupplierarchivemainname;
        this.dataForm.supplierId = customersupplierarchivemainid;
        this.dataForm.isUseAttendance = isusedgmattendancemachine.toString();
        this.$forceUpdate()
      },
      /**
       * 班组合同
       * */
      updatelaborTeamMainName(data,index){

        if(data.length > 0){
          const {mastercontractname,mastercontractid,constructarchivemainid} = data[0];
          this.$set(this.dataForm.detailList[index],'laborTeamMainName',mastercontractname);
          this.$set(this.dataForm.detailList[index],'laborTeamMainId',mastercontractid);
          this.$set(this.dataForm.detailList[index],'contractOutMainId',mastercontractid);


          // this.$set(this.dataForm.detailList[index],'teamLeader',teamleader);
          this.getContractTeamAmountFn(index,mastercontractid)
        }
      },
      /**
       * 获取班组合同金额
       * */
      async getContractTeamAmountFn(index,laborTeamMainId){
        var payNature = this.dataForm.detailList[index].payNature;
        var params = {
          "contractOutMainId": this.dataForm.id,
          "contractTeamPayrollCheckMainId": laborTeamMainId,
          "payNature": payNature
        };
        const res = await getContractTeamAmount(params);
        if(res.code === 200){
          const {accumulatedAmount, accumulatedConfirmedAmount, contractAmount, remainingConfirmableAmount, settlementAmount} = res.data;
          this.$set(this.dataForm.detailList[index],'contractAmount',contractAmount);
          this.$set(this.dataForm.detailList[index],'settlementAmount',settlementAmount);
          this.$set(this.dataForm.detailList[index],'accumulatedAmount',accumulatedAmount);
          this.$set(this.dataForm.detailList[index],'accumulatedConfirmedAmount',accumulatedConfirmedAmount);
          this.$set(this.dataForm.detailList[index],'remainingConfirmableAmount',remainingConfirmableAmount);
        }
      },
      /**
       * 工资单
       *  */
      updateTeamWageName(data,index){
        if(data && data.length >0){
          const {teamwageid,code,teamleader,totalamount,releasetimebegin,attendanceway,laborteammainid} = data[0];
          this.$set(this.dataForm.detailList[index],'teamWageName',code);
          this.$set(this.dataForm.detailList[index],'teamWageId',teamwageid);
          this.$set(this.dataForm.detailList[index],'amountTax',totalamount);
          this.$set(this.dataForm.detailList[index],'payrollType',attendanceway);
          this.$set(this.dataForm.detailList[index],'teamLeader',teamleader);
        }

      },
      beforeInit() {
        this.getDataDictByConfigType()
      },
      afterInit() {
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        return dataForm;
      },
      /**
       * 表单校验
       */
      validateForm() {
        const _this = this;
        var state = WFContext.WorkflowInstinceState; // 流程状态
        if(state < 2){
          // 校验子表数据完整性
          if(_this.vaildTableList() === false){
            return false
          }
          // 校验子表数据唯一性
          if(_this.vaildOnlyTableData() === false){
            return false
          }
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
        const res = await getDataDictByConfigType({ params: { configTypes: '合同类别,是或否,预付款扣除方式,付款状态(3态),付款性质,工资单类型' }})
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '是或否':
                this.radioOptions = ele.dataDict;
                break;
              case '付款状态(3态)':
                this.paymentStatusOptions = ele.dataDict;
                break;
              case '付款性质':
                this.payNatureOptions = ele.dataDict;
                break;
              case '工资单类型':
                this.payrollTypeOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 添加合同明细信息
       */
      addDetail(){
        if (!this.dataForm.detailList) this.dataForm.detailList = [];
        this.dataForm.detailList.push({
          accumulatedAmount: '',
          accumulatedConfirmedAmount: '',
          contractAmount: '',
          contractOutMainId: '',
          contractTeamPayrollCheckMainId: '',
          id: '',
          isDel: '',
          laborTeamMainId: '',
          payNature: '',
          payrollType: '',
          remainingConfirmableAmount: '',
          settlementAmount: '',
          teamLeader: '',
          teamWageId: '',
          wiid: ''
        });
        this.dataForm.contractAmountTax = this.sumTableData();

      },
      /**
       * 删除信息
       */
      delCustomer(index){
        this.dataForm.detailList.splice(index, 1);
        this.dataForm.contractAmountTax = this.sumTableData();
      },
      /**
       * 自动计算 子表--单价(无税)
       *          子表--金额(含税)
       *          金额（无税）
       *          税额
       * */
      changeAmountCount(e,index){
        console.log(e,index);
        var that = this;
        var num = that.dataForm.detailPOList[index]['number']; // 数量
        var price = that.dataForm.detailPOList[index]['unitPriceTax']; // 单价(含税)
        var rate = that.dataForm.taxRate; // 税率
        // 单价(无税)
        var amount = Number(price)/(1+Number(rate)); // 单价(含税)/(1+税率)
        amount = Object.numFixed(amount,2);
        that.$set(that.dataForm.detailPOList[index], 'unitPriceUntax', amount);
        // 金额(含税)
        var amount2 = Number(price) * Number(num); // 单价(含税)*数量
        amount2 = Object.numFixed(amount2,2);

        that.$set(that.dataForm.detailPOList[index], 'amountTax', amount2);
        // 金额（无税）
        var amountTax = that.dataForm.detailPOList[index]['amountTax'];  // 金额(含税)
        var amount3 = Number(amountTax)/(1+Number(rate)); //金额(含税)/(1+税率)
        amount3 = Object.numFixed(amount3,2);
        that.$set(that.dataForm.detailPOList[index], 'amountUntax', amount3);
        // 税额
        var amountUntax = that.dataForm.detailPOList[index]['amountUntax'];  // 金额(无税)
        var amount4 = Number(amountTax)-Number(amountUntax); // 金额(含税)- 金额(无税)
        amount4 = Object.numFixed(amount4,2);
        that.$set(that.dataForm.detailPOList[index], 'taxAmount', amount4);
        that.dataForm.contractAmountTax = that.sumTableData();
      },
      // 校验 同一表单内 根据 名称+说明+单位+单价(含税)  校验唯一性，不允许重复
      vaildOnlyTableData(){
        var that = this;
        var arr = that.dataForm.detailPOList;
        // 判断是否唯一性
        if (arr) {
          var a2 = [];
          for (var j = 0; j <arr.length; j++) {
            if (arr[j]) {
              var FileName = arr[j].fileName; // 名称
              var Unit = arr[j].unit; // 单位
              var Memo = arr[j].memo; // 说明
              var TaxUnitPrice = arr[j].unitPriceTax; // 单价（含税）
              var obj = FileName + '-' + Unit + '-'+'-'+Memo + TaxUnitPrice;
              a2.push(obj);

            }
          }
          var states = Object.isRepeat(a2); // 校验是否相同
          console.log(states, '23');
          if ( states === true) {
            FUI.Window.showMsg(myvm, '合同明细信息中， 名称+说明+单位+单价(含税)存在不唯一，请检查重复数据');
            return false;
          }
        }
      },
      // 合计
      getSummaries1(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['amountTax'])); //  金额(含税)
          if (!values.every(value => isNaN(value))) {
            sums[9] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[9] = Object.numberFixed(sums[9],2);
          } else {
            sums[9] = '';
          }
        });

        return sums;
      },
      // 校验子表信息完整
      vaildTableList(){
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.detailList;
        if (arr.length > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var laborTeamMainId = (arr[j].laborTeamMainId).toString(); //班组合同
              var payNature = (arr[j].payNature).toString(); //付款性质
              var teamWageId = (arr[j].teamWageId).toString(); // 工资单

              if (laborTeamMainId && payNature && teamWageId) {
                return !isOk;
              } else {
                var msg = '';
                var oIndex = j+1; // 行号
                if(!laborTeamMainId) msg = '确认单信息中，第'+oIndex+'行的班组合同不能为空';
                if(!payNature) msg = '确认单信息中，第'+oIndex+'行的付款性质不能为空';
                if(!teamWageId) msg = '确认单信息中，第'+oIndex+'行的工资单不能为空';

                FUI.Window.showMsg2(msg);
                return isOk
              }
            }
          }

        }else{

          FUI.Window.showMsg2('确认单信息至少要有一条');
          return isOk
        }
      },
      // 取合同明细信息的金额（含税）总和
      sumTableData(){
        var arr = this.dataForm.detailList; //明细表
        var sumAmount = 0;
        if(arr && arr.length > 0){
          for(let i in arr){
            sumAmount+= Number(arr[i].amountTax);
          }
        }
        return sumAmount
      },
      // 打开工资单页面
      handelOpenPayroll(){
        var that = this;
        var projectId = this.dataForm.constructArchiveMainId;
        let url = '/contractTeamPayrollForm?formAction=0&projectId='+projectId;
        that.$router.push({ path: url});
      },
      // 打开工资单详情
      handelTeamWageDetail(row){
        var that = this;
        var id = row.teamWageId; //工资单id
        if(!id){
          FUI.Window.showMsg2('请选择工资单');
          return false
        }
        let url = '/contractTeamPayrollForm?formAction=1&id='+id;
        that.$router.push({ path: url});
      },
      // 付款性质
      async changePayNature(e,index){
        var laborTeamMainId = this.dataForm.detailList[index].laborTeamMainId;
        var params = {
          "contractOutMainId": this.dataForm.id,
          "contractTeamPayrollCheckMainId": laborTeamMainId,
          "payNature": e
        };
        const res = await getContractTeamAmount(params);
        if(res.code === 200){
          const {accumulatedAmount, accumulatedConfirmedAmount, contractAmount, remainingConfirmableAmount, settlementAmount} = res.data;
          this.$set(this.dataForm.detailList[index],'contractAmount',contractAmount);
          this.$set(this.dataForm.detailList[index],'settlementAmount',settlementAmount);
          this.$set(this.dataForm.detailList[index],'accumulatedAmount',accumulatedAmount);
          this.$set(this.dataForm.detailList[index],'accumulatedConfirmedAmount',accumulatedConfirmedAmount);
          this.$set(this.dataForm.detailList[index],'remainingConfirmableAmount',remainingConfirmableAmount);
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
