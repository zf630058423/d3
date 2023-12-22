<!--专业分包核量-->
<template>
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="165px" class="new-data-form-css">
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
        <el-form-item slot="col_1" label="主合同编号：" prop="contractOutMainCode">
          <selector-dialog :model-data="mainContractDialog" :value="dataForm.contractOutMainCode" dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同名称：">
          <el-input v-model="dataForm.contractOutMainName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="合同供应商：">
          <el-input v-model="dataForm.contractPartyBName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="thisNuclearQuantityAmount" label="本次核量金额(含税)(元)：">
          <amount-input v-model="dataForm.thisNuclearQuantityAmount" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" prop="approvedAmount" label="已核量金额(含税)(元)：">
          <amount-input v-model="dataForm.approvedAmount" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" prop="totalContractAmount" label="合同总金额(含税)(元)：">
          <amount-input v-model="dataForm.totalContractAmount" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.memo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入，内容长度不超过250个字符" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'核量信息'"></form-title>
      <sub-table :tableData="rowDatas" ref="detail" @getSubTableData="getSubTableData"></sub-table>

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
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import cascSelect from '@/components/basic/cascSelect/index.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import numberInput from '@/components/basic/numberInput/index.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import {CUSTOMER2_MODEL,BASE_LABOR_TEAM_MAIN_MODEL} from '@/views/businessModule/enum/param';
  import {getProfessionCheckAmountInfo,getContractCheckLaborTeamExtendDetail} from '@/Api/contract/index.js'
  import subTable from './components/subtable'
  import moment from 'moment'
  const requiredArray = ['constructArchiveMainCode', 'contractOutMainCode', 'teamPeople', 'totalAttendanceDay','thisNuclearStartTime','thisNuclearEndTime', 'fileInfoList'];
  export default {
    components: { FormTitle, selectorDialog, RowLayout, amountInput,numberInput,percentageInput, cascSelect, updateFiles,SelectDialog2,subTable },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        isReadOnly: false,
        rowDatas:[],
        dataForm: {
          approvedAmount: '',
          code: '',
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          contractCheckMainId: '',
          contractOutMainCode: '',
          contractOutMainId: '',
          contractOutMainName: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          cumulativeSupervisionAmount: '',
          detailList: [],
          fileInfoList: [],
          id: '',
          memo: '',
          procInstState: '',
          processFinishedTime: '',
          projectManagerName: '',
          teamLeader: '',
          teamlibraryid: '',
          teamPeople: '',
          thisNuclearEndTime: '',
          thisNuclearQuantityAmount: '',
          thisNuclearStartTime: '',
          totalAttendanceDay: '',
          totalContractAmount: '',
          wiid: '',
          constructionUnitId:'',
          projectManagerId:''
        },
        radioOptions: [],
        teamLeaderDialog: BASE_LABOR_TEAM_MAIN_MODEL, // 班组长
        masterContractDialog: { code: 'XiangMuDangAnLaoWuFenBaoHeTong', customDialog: 'XiangMuDangAnLaoWuFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [] },
        mainContractDialog: { code: 'ZhuHeTongZhuanYeFenBaoHeTong', customDialog: 'ZhuHeTongZhuanYeFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
        orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    computed: {
    },
    mounted() { },
    created(){},
    methods: {
      /**
       * 项目编号
       */
      updateMasterContractValue(data) {
        if(data && data.length <= 0) return;
        const { constructarchivemainid, constructarchivemaincode, constructionunitname, projectmanagername, constructarchivemainname,constructionUnitId,projectManagerId} = data[0];
        this.dataForm.constructArchiveMainCode = constructarchivemaincode;
        this.dataForm.constructArchiveMainName = constructarchivemainname;
        this.dataForm.name = constructarchivemainname;
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
        const { mastercontractid, mastercontractcode, mastercontractname,customersupplierarchivemainname} = data[0];
        this.dataForm.contractOutMainId = mastercontractid;
        this.dataForm.contractOutMainCode = mastercontractcode;
        this.dataForm.contractOutMainName = mastercontractname;
        this.dataForm.contractPartyBName = customersupplierarchivemainname;
        this.$forceUpdate();
        // 获取金额信息
        this.getContractAmountInfoFn();
        // 获取核量信息
        this.$refs.detail.getTeamContractDetailFn(mastercontractid);
      },
      /**
       * 班组长
       * */
      updateTeamLeader(data){
        if(data.length > 0){
          const {teamLeader,id} = data[0];
          this.dataForm.teamLeader = teamLeader;
          this.dataForm.teamLibraryId = id;
        }
      },
      beforeInit() {
      },
      afterInit() {
        this.rowDatas = this.dataForm.detailList;
        if(this.rowDatas.length>0){
          this.$refs.detail.loadRows(this.rowDatas)
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
        var state = WFContext.WorkflowInstinceState; // 流程状态
        _this.dataForm.detailList = _this.$refs.detail.getResult(); // 子表信息
        // 校验本次核量金额
        var amount  = _this.dataForm.thisNuclearQuantityAmount; // 本次核量金额(元)
        if(Number(amount) < 0){
          FUI.Window.showMsg('本次核量金额(元) 不能小于0，否则无法进行核量操作');
          return false
        }
        // 校验本次核量日期区间
        if(_this.vaildTime() === false){
          return false
        }
        if(state < 2){
          // 校验子表数据
          if(_this.$refs.detail.vaildTableData() === false){
            return false
          }
          // 校验子表数据唯一性
          // if(_this.$refs.detail.vaildOnlyTableData() === false){
          //   return false
          // }
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
      // 保留两位小数
      changeTofixed(e,name){
        var that = this;
        var val = Number(e)?Number(e):'';
        if(typeof val == 'number'){
          val = Object.tofixed(val,2);
          that.$set(that.dataForm,name,Number(val));
        }else {
          that.$set(that.dataForm,name,'');
        }
        this.$forceUpdate();
      },
      // 校验两个日期大小
      vaildTime(){
        var sTime = this.dataForm.thisNuclearStartTime;
        var eTime = this.dataForm.thisNuclearEndTime;
        if(sTime && eTime){
          var flag = Object.checkDateTime(sTime, eTime);
          if (flag == 1) {
            FUI.Window.showMsg2('本次核量开始日期不能大于结束时间');
            return false
          }
        }
      },
      // 获取金额数据
      async getContractAmountInfoFn(){
        var params = {
          "contractCheckMainId": this.dataForm.id,
          "contractOutMainId": this.dataForm.contractOutMainId
        };
        let res = await getProfessionCheckAmountInfo(params);
        if(res.code === 200){
          const {approvedAmount,totalContractAmount} = res.data;
          this.dataForm.approvedAmount = approvedAmount; // 已核量金额(元)(不含本次)
          this.dataForm.totalContractAmount = totalContractAmount; //合同总金额(元)
        }else{
          FUI.Window.showMsg(res.msg);
          return false;
        }
      },
      // 获取核量信息 or 获取本次核量金额
      getSubTableData(rows){
        let sumData = 0;
        if(rows.length > 0){
          this.detailList = rows;
          for(let i in rows){
            let amount = rows[i].amountTax;
            sumData+=Number(amount);
          }
        }
        this.dataForm.thisNuclearQuantityAmount = sumData; // 本次核量金额
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
