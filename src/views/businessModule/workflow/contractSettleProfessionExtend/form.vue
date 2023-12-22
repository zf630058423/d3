<!--专业分包结算-->
<template>
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="160px" class="new-data-form-css">
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
        <el-form-item slot="col_1" label="主合同编号：" prop="masterContractCode">
          <selector-dialog :model-data="mainContractDialog" :value="dataForm.masterContractCode" dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同名称：">
          <el-input v-model="dataForm.masterContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="税率：">
          <amount-input v-model="dataForm.taxRate" disabled size="small" placeholder="自动带出" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="合同客户：">
          <el-input v-model="dataForm.contractPartyAName" disabled size="small" placeholder="自动带出" />
        </el-form-item>
        <el-form-item slot="col_2" label="合同供应商：">
          <amount-input v-model="dataForm.contractPartyBName" disabled size="small" placeholder="自动带出" />
        </el-form-item>
        <el-form-item slot="col_3"  label="结算金额(含税)(元)：">
          <amount-input v-model="dataForm.settlementAmountTax" disabled size="small" placeholder="自动带出" />
        </el-form-item>

      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1"  label="结算金额(无税)(元)：">
          <amount-input v-model="dataForm.settlementAmountUntax" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_2"  label="累计核量金额(含税)(元)：">
          <amount-input v-model="dataForm.cumulativeOfAuditAmount" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_3"  label="合同总金额(含税)(元)：">
          <amount-input v-model="dataForm.totalContractAmount" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="质保金(元)：">
          <amount-input v-model="dataForm.retentionMoney" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="retentionMoneyDueDate" label="质保金到期日期：">
          <el-date-picker v-model="dataForm.retentionMoneyDueDate" type="date" placeholder="开始时间" size="small" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入，内容长度不超过250个字符" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'结算信息'"></form-title>
      <table-detail :tableData="rowDatas" ref="settle" @getTableDetail="getTableDetail"></table-detail>

      <form-title :title="'增减项'"></form-title>
      <table-item ref="item" @getTableItem="getTableItem"></table-item>

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
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import { getRealTimeData } from '@/Api/workflowBusssion/construct.js'
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import numberInput from '@/components/basic/numberInput/index.vue';
  import {ISUSEDOPTIONS_GROUP,BASE_LABOR_TEAM_MAIN_MODEL} from '@/views/businessModule/enum/param';
  import {getTeamContractSettleDetail,getTeamContractSettleAmount,getProjectOutputValue,getProfessionSettleAmount} from '@/Api/contract/index.js'
  import tableDetail from './components/tableDetail'
  import tableItem from './components/tableItem'
  import moment from 'moment'
  const requiredArray = ['constructArchiveMainCode', 'masterContractCode', 'retentionMoneyDueDate', 'fileInfoList','confirmTeamGrade'];
  export default {
    components: { FormTitle, selectorDialog, RowLayout, amountInput,numberInput, updateFiles,tableDetail,tableItem },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        isReadOnly: false,
        isUsedOptions: ISUSEDOPTIONS_GROUP, //是否使用
        projectStatusOptions: [], // 项目状态
        teamGradeRadio:[],// 班组评级
        getRetMoney:'', // 质保金（%）
        rowDatas:[],
        dataForm: {
          baseTaxRateArchiveId: '',
          businessType: '',
          code: '',
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          contractOutMainId: '',
          contractPartyAName: '',
          contractPartyBName: '',
          contractSettleMainId: '',
          contractType: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          cumulativeOfAuditAmount: '',
          deptId: '',
          deptName: '',
          detailList: [],
          fileInfoList: [],
          finishedTime: '',
          id: '',
          isDel: '',
          jsonData: '',
          lastModifyDeptId: '',
          lastModifyDeptName: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          masterContractCode: '',
          masterContractName: '',
          procInstState: '',
          projectManagerName: '',
          remark: '',
          retentionMoney: '',
          retentionMoneyDueDate: '',
          sectionDetailList: [],
          settlementAmountTax: '',
          settlementAmountUntax: '',
          settlementDate: '',
          taxRate: '',
          totalContractAmount: '',
          wiid: '',
          constructionUnitId:'',
          projectManagerId:''
        },
        sumAmountbyDetail:0, // 结算信息金额合计
        sumAmountbyItem:0, // 增减项合计
        sumAmountUnbyItem:0,
        sumAmountUnByDetail:0,
        teamLeaderDialog: BASE_LABOR_TEAM_MAIN_MODEL, // 班组长
        masterContractDialog: { code: 'XiangMuDangAnLaoWuFenBaoHeTong', customDialog: 'XiangMuDangAnLaoWuFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [] },
        mainContractDialog: { code: 'ZhuHeTongZhuanYeFenBaoHeTong', customDialog: 'ZhuHeTongZhuanYeFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    watch:{
      sumAmountbyDetail:{
        handler(newValue,oldVal){
          var that = this;
          var amountItem = this.sumAmountbyItem; // 增减项合计
          var sumAmount = Number(newValue) + Number(amountItem);
          that.dataForm.settlementAmountTax = Object.tofixed(sumAmount,2);
          var retMoney = that.dataForm.retMoney;
          retMoney = retMoney?retMoney:'';
          var amount2 = Number(sumAmount) * Number(retMoney);
          that.dataForm.retentionMoney = Object.tofixed(amount2,2);
        },
        deep:true,
        immediate:true
      },
      sumAmountbyItem:{
        handler(newValue,oldVal){
          var that = this;
          var amountItem = this.sumAmountbyDetail; // 结算信息合计
          var sumAmount = Number(newValue) + Number(amountItem);
          that.dataForm.settlementAmountTax = Object.tofixed(sumAmount,2);
          var retMoney = that.dataForm.retMoney;
          retMoney = retMoney?retMoney:'';
          var amount2 = Number(sumAmount) * Number(retMoney);
          that.dataForm.retentionMoney = Object.tofixed(amount2,2);

        },
        deep:true,
        immediate:true
      },
      sumAmountUnByDetail:{
        handler(newValue,oldVal){
          var that = this;
          var amountItem = this.sumAmountUnbyItem; // 增减项合计
          var sumAmount = Number(newValue) + Number(amountItem);
          that.dataForm.settlementAmountUntax = Object.tofixed(sumAmount,2);
        },
        deep:true,
        immediate:true
      },
      sumAmountUnbyItem:{
        handler(newValue,oldVal){
          var that = this;
          var amountItem = this.sumAmountUnByDetail; // 结算信息合计
          var sumAmount = Number(newValue) + Number(amountItem);
          that.dataForm.settlementAmountUntax = Object.tofixed(sumAmount,2);
        },
        deep:true,
        immediate:true
      },
    },
    computed: {
    },
    mounted() { },
    created(){},
    methods: {
      setFildState(){
        var currentActivityName = window.WFContext.CurrentActivityName;
        var workflowInstinceState = window.WFContext.WorkflowInstinceState;
        if(workflowInstinceState == 2 && currentActivityName == '总部劳务专员'){
          return true
        }else {
          return false
        }
      },
      /**
       * 项目编号
       */
      updateMasterContractValue(data) {
        if(data && data.length <= 0) return;
        const { constructarchivemainid,constructionUnitId,projectManagerId, constructarchivemaincode, constructionunitname, projectmanagername, constructarchivemainname,projectStatusId} = data[0];
        this.dataForm.constructArchiveMainCode = constructarchivemaincode;
        this.dataForm.constructArchiveMainName = constructarchivemainname;
        this.dataForm.constructionUnitName = constructionunitname;
        this.dataForm.projectManagerName = projectmanagername;
        this.dataForm.constructArchiveMainId = constructarchivemainid;
        this.dataForm.projectStatusId = projectStatusId;
        this.mainContractDialog.parm.varParams[0].value = constructarchivemainid;
        this.dataForm.constructionUnitId = constructionUnitId;
        this.dataForm.projectManagerId = projectManagerId;
      },
      /**
       * 主合同名称(控件)
       */
      updateMainContractValue(data) {
        if(data && data.length <= 0) return;
        const { mastercontractid, mastercontractcode, mastercontractname,retmoney,contractpartyaname,taxrate,customersupplierarchivemainname,basetaxratearchiveid} = data[0];
        this.dataForm.contractOutMainId = mastercontractid;
        this.dataForm.masterContractCode = mastercontractcode;
        this.dataForm.masterContractName = mastercontractname;

        this.dataForm.contractPartyAName = contractpartyaname;
        this.dataForm.contractPartyBName = customersupplierarchivemainname;
        this.dataForm.taxRate = taxrate;
        this.dataForm.baseTaxRateArchiveId = basetaxratearchiveid;
        this.dataForm.retMoney = retmoney;
        this.$forceUpdate();
        // 获取结算信息
        this.$refs.settle.getTeamContractDetailFn(mastercontractid,taxrate);
        // 获取金额信息
        this.getTeamContractSettleAmountFn(mastercontractid)
      },
      beforeInit() {
        this.getDataDictByConfigType()
        if(this.dataForm.constructArchiveMainId) this.getRealTimeData()
      },
      afterInit() {
        let list = this.dataForm.detailList;
        let list2 = this.dataForm.sectionDetailList;
        let contractOutMainId = this.dataForm.contractOutMainId
        if(list.length>0){
          this.$refs.settle.loadRows(list)
        }
        if(list2.length>0){
          this.$refs.item.loadRows(list2)
        }
        if(contractOutMainId){
          // 获取金额信息
          this.getTeamContractSettleAmountFn(contractOutMainId)
        }
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
        var state2 = _this.$refs.settle.vaildTableList();
        if(state2 === false){
          return false
        }
        if(_this.$refs.settle) _this.dataForm.detailList = _this.$refs.settle.getResult(); // 结算子表信息
        if(_this.$refs.item) _this.dataForm.sectionDetailList = _this.$refs.item.getResult(); // 增减子表信息
        if(state < 2){
          // 校验子表数据必填
          if(_this.vaildTableData() === false){
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
        const res = await getDataDictByConfigType({ params: { configTypes: '项目状态,班组评级' }})
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '项目状态':
                this.projectStatusOptions = ele.dataDict;
                break;
              case '班组评级':
                this.teamGradeRadio = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },

      // 校验 同一表单内 任一字段(除序号)有值，则此一行数据都必填
      vaildTableData(){
        var that = this;
        var arr = that.dataForm.sectionDetailList;
        // 判断是否唯一性
        if (arr) {
          for (let j = 0; j <arr.length; j++) {
            if (arr[j]) {
              var content = arr[j].content; // 名称
              var amountTax = arr[j].amountTax; // 金额（有税）
              var amountUntax = arr[j].amountUntax; // 金额（有税）
              var taxRateId = arr[j].taxRateId; // 税率
              if ((!content && !amountTax && !amountUntax && !taxRateId) || (content && amountTax && amountUntax && taxRateId)) {
                console.log('')
              } else {
                FUI.Window.showMsg('增减项表格，所有表格行都需补充完整！');
                return false
              }
            }
          }
        }
      },
      // 接受结算信息
      getTableDetail(data){
        if(data){
          let amount = 0;
          let amount2 = 0;
          for(let i in data){
            amount+= Number(data[i].amountTax);
            amount2+= Number(data[i].amountUntax);
          }
          this.dataForm.detailList = data;
          this.sumAmountbyDetail = amount; // 结算信息金额合计
          this.sumAmountUnByDetail = amount2; //  结算信息金额(无税)合计

        }
      },
      // 接收增减项信息
      getTableItem(data){
        if(data){
          let amount = 0;
          let amount2 = 0;
          for(let i in data){
            amount+= Number(data[i].amountTax);
            amount2+= Number(data[i].amountUntax);
          }
          this.dataForm.sectionDetailList = data;
          this.sumAmountbyItem = amount; // 增减项合计
          this.sumAmountUnbyItem = amount2; // 增减项(无税)合计
        }
      },
      // 获取金额信息
      async getTeamContractSettleAmountFn(id){
        var that = this;
        const res = await getProfessionSettleAmount(id);
        if(res.code === 200){
          const {cumulativeOfAuditAmount,totalContractAmount} = res.data;
          that.dataForm.totalContractAmount = totalContractAmount;
          that.dataForm.cumulativeOfAuditAmount = cumulativeOfAuditAmount;
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
</style>
