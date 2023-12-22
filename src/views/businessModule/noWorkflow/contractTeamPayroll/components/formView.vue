<!--班组工资单-->
<template>
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="isReadOnly" label-width="140px">
      <row-layout title="基本信息" :cols="3">
        <el-form-item slot="col_1" label="工资单：">
          <el-input v-model="dataForm.code" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="teamLeader" label="班组长：">
          <select-dialog :model-data="teamLeaderDialog" :value="dataForm.teamLeader" dynamicModel="customDialog" @updateValue="updateTeamLeader"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="总人数：">
          <el-input v-model="dataForm.totalNumPeople" size="small" placeholder="请输入" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="有考勤人数：">
          <el-input v-model="dataForm.hasAttendanceRecord" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="无考勤人数：">
          <el-input v-model="dataForm.noAttendanceRecord" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="有考勤人员总金额：">
          <amount-input v-model="dataForm.hasAttendanceAmount" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="无考勤人员总金额：">
          <amount-input v-model="dataForm.noAttendanceAmount" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="其他金额：">
          <amount-input v-model="dataForm.otherAmount" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item slot="col_3" label="生成人：">
          <el-input v-model="dataForm.generatePeople" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="生成时间：">
          <el-date-picker v-model="dataForm.generateDate" type="datetime" placeholder="自动带出" size="small" disabled
                          value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" label="发放时间段：">
          <el-input v-model="dataForm.releaseTimeBegin" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="工资单类型：">
          <el-select v-model="dataForm.attendanceWay" placeholder="自动带出" size="small" disabled style="width: 100%">
            <el-option v-for="(item,index) in attendanceWayOptions" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>

      <form-title :title="'工人工资(点对点)'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addDetail">新增</el-button>
        <el-button type="primary" size="small">导入</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
      <el-table :data="dataForm.detailList" class="f2bpmui-datagrid-vuetable" border show-summary
                :summary-method="getSummaries2">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="工人姓名" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>工人姓名</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workName" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>身份证号</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workCard" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="工种" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>工种</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workType" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>手机号</span>
          </div>
          <template slot-scope="scope">
            <number-input v-model="scope.row.workTel" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="收款银行" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>收款银行</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.receivingBank" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="开户网点" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>开户网点</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workBankName" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>银行卡号</span>
          </div>
          <template slot-scope="scope">
            <number-input v-model="scope.row.workBankNo" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="设备考勤天数" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>设备考勤天数</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.attendanceDay" @change="changeTofixed($event,scope.$index,'attendanceDay')"
                      size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="上报加班天数" width="160px">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>上报加班天数</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.overtimeDay" @change="changeTofixed($event,scope.$index,'overtimeDay')"
                      size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="日工资" width="160px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.dailyWage" @change="changeTofixed($event,scope.$index,'dailyWage')"
                          size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="工资金额" width="160px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.wageAmount" size="small" placeholder="自动计算" @change="changeWageAmount($event,scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="已垫付金额" width="160px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.advancePayAmount" @change="changeAdvancePayAmount($event,scope.$index)"
                          size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="实际应支付金额" width="160px">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.actualPayAmount" size="small" placeholder="自动计算" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="160px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.memo" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <form-title :title="'代领工资'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addPayrollProxy">新增</el-button>
      </div>
      <el-table :key="tableKey" :data="dataForm.payrollProxyDetailList" class="f2bpmui-datagrid-vuetable" border
                show-summary :summary-method="getSummaries1">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="代领人姓名">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>代领人姓名</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workName" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="身份证号">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>身份证号</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workCard" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="电话号码">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>电话号码</span>
          </div>
          <template slot-scope="scope">
            <number-input v-model="scope.row.workTel" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="开户行">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>开户行</span>
          </div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.workBankName" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>银行卡号</span>
          </div>
          <template slot-scope="scope">
            <number-input v-model="scope.row.workBankNo" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="代领金额">
          <div slot="header">
            <span style="color: #ed4014">*</span>
            <span>代领金额</span>
          </div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.takeAmount" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.memo" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delPayrollProxy(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import UploaderFile from '@/components/basic/uploaderFile/index.vue'
  import AmountInput from '@/components/basic/numberInput/amountInput.vue';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import {getSerialNumber} from '@/Api/workflowBusssion/index.js'
  import {saveForm, updateForm, getForm} from '@/Api/contractTeamPayroll/index.js';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import moment from 'moment'
  const requiredArray = ['teamLeader'];

  export default {
    components: {FormTitle, RowLayout, SelectDialog, NumberInput, CascSelect, UploaderFile, AmountInput},
    data() {
      return {
        rowObject: {},
        fileList: [],
        attendanceWayOptions: [], // 工资单类型
        numVal: '100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        isAble: false,
        isReadOnly: false,
        tableKey: 1,
        radioData: [
          {label: 1, name: '是'},
          {label: 0, name: '否'}
        ],
        dataForm: {
          attendanceWay: '1',
          baseLaborTeamMainId: '',
          code: '',
          constructArchiveMainId: '',
          createTime: '',
          createUserId: '',
          deptId: '',
          detailList: [],
          generateDate: '',
          generatePeople: '',
          hasAttendanceAmount: '',
          hasAttendanceRecord: '',
          id: '',
          isDel: '',
          isGomeeWage: '',
          noAttendanceAmount: '',
          noAttendanceRecord: '',
          otherAmount: '',
          payrollProxyDetailList: [],
          releaseTimeBegin: '',
          releaseTimeEnd: '',
          totalAmount: '',
          totalNumPeople: '',
          teamLeader: ''
        },
        teamLeaderDialog:{
          code: 'BanZuKu',
          customDialog: 'BanZuKu',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    computed: {},
    created() {
      let formAction = Object.toQueryString('formAction') || '';
      let projectId = Object.toQueryString('projectId') || '';
      if (formAction > 0) {
        this.isReadOnly = true;
      }
      this.dataForm.constructArchiveMainId = projectId;
      this.beforeInit();
    },
    mounted() {
      this.beforeInit();
    },
    methods: {
      /**
       * 初始化详情
       * @param {*} data
       */
      init() {
        var that = this;
        let id = Object.toQueryString('id') || '';
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
          this.clearForm();
          this.getSerialNumber();
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
        this.getDataDictByConfigType();
        this.init();
      },
      afterInit() {
      },
      handleChange() {
      },
      /**
       * 班组长
       * */
      updateTeamLeader(data){
        if (data && data.length <= 0) return;
        const {teamleader,baselaborteammainid} = data[0];
        this.dataForm.teamLeader = teamleader;
        this.dataForm.baseLaborTeamMainId = baselaborteammainid;
      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({params: {configTypes: '工资单类型'}});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '工资单类型':
                this.attendanceWayOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 获取单据编号
       */
      getSerialNumber() {
        var that = this;
        var code = 'GZDXQ';
        getSerialNumber({
          counterCode: code
        }).then(res => {
          if (res.success) {
            that.dataForm.code = res.msg;
          }
        })
      },
      /**
       * 添加点对点工资单
       */
      addDetail() {
        if (!this.dataForm.detailList) this.dataForm.detailList = []
        this.dataForm.detailList.push({
          "actualPayAmount": '',
          "advancePayAmount": '',
          "attendanceDay": '',
          "contractTeamPayrollMainId": "",
          "dailyWage": '',
          "id": "",
          "memo": "",
          "overtimeDay": '',
          "receivingBank": "",
          "wageAmount": '',
          "workBankName": "",
          "workBankNo": "",
          "workCard": "",
          "workName": "",
          "workTel": "",
          "workType": ""
        })
      },
      /**
       * 删除
       */
      delDetail(index) {
        this.dataForm.detailList.splice(index, 1);
        this.setFildValue();
      },
      /**
       * 代领工资
       * */
      addPayrollProxy() {
        if (!this.dataForm.payrollProxyDetailList) this.dataForm.payrollProxyDetailList = [];
        this.dataForm.payrollProxyDetailList.push({
          "contractTeamPayrollMainId": "",
          "id": "",
          "memo": "",
          "takeAmount": "",
          "workBankName": "",
          "workBankNo": "",
          "workCard": "",
          "workName": "",
          "workTel": ""
        })
      },
      /**
       * 删除
       * */
      delPayrollProxy(index) {
        this.dataForm.payrollProxyDetailList.splice(index, 1)
      },
      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        let parm = Object.toClone(_this.dataForm);
        if (_this.vaildTableList() === false) {
          return false
        }
        if (_this.vaildPayrollTable() === false) {
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
      clearForm() {
        this.$refs['dataForm'].resetFields();
        this.dataForm.detailList = [];
        this.dataForm.payrollProxyDetailList = [];
      },
      // 保留小数
      changeTofixed(e, oIndex, name) {
        var that = this;
        var val = e == 0?0: Number(e) ? Number(e) : '';
        if (typeof val == 'number') {
          val = Object.tofixed(val, 2);
          that.$set(that.dataForm.detailList[oIndex], name, val);
        } else {
          that.$set(that.dataForm.detailList[oIndex], name, '');
        }
        var attendanceDay = that.dataForm.detailList[oIndex].attendanceDay; // 设备考勤天数
        var overtimeDay = that.dataForm.detailList[oIndex].overtimeDay; // 加班天数
        var dailyWage = that.dataForm.detailList[oIndex].dailyWage; // 日工资
        var wageAmount = (Number(attendanceDay) + Number(overtimeDay)) * Number(dailyWage);
        wageAmount = Object.tofixed(wageAmount, 2);
        that.$set(that.dataForm.detailList[oIndex], 'wageAmount', wageAmount);
        var val1 = that.dataForm.detailList[oIndex].advancePayAmount; // 垫付工资
        var val2 = Number(wageAmount); //工资总额
        var val3 = Number(val2) - Number(val1);
        val3 = Object.tofixed(val3, 2);
        this.$set(that.dataForm.detailList[oIndex], 'actualPayAmount', val3); // 实际应支付金额
        that.$forceUpdate();
        // 联动计算
        that.setFildValue();
      },
      changeAdvancePayAmount(e, oIndex) {
        var val1 = e; // 垫付工资
        var val2 = this.dataForm.detailList[oIndex].wageAmount; //工资总额
        var val3 = Number(val2) - Number(val1);
        val3 = Object.tofixed(val3, 2);
        this.$set(this.dataForm.detailList[oIndex], 'actualPayAmount', val3); // 实际应支付金额
      },
      changeWageAmount(e,oIndex){
        var val1 = this.dataForm.detailList[oIndex].advancePayAmount; // 垫付工资
        var val2 = e; //工资总额
        var val3 = Number(val2) - Number(val1);
        val3 = Object.tofixed(val3, 2);
        this.$set(this.dataForm.detailList[oIndex], 'actualPayAmount', val3); // 实际应支付金额
      },
      // 校验点对点子表信息完整
      vaildTableList() {
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.detailList;
        if (arr.length > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var workName = (arr[j].workName).toString(); //工人姓名
              var workCard = (arr[j].workCard).toString(); //身份证号
              var workType = (arr[j].workType).toString(); // 工种
              var workTel = (arr[j].workTel).toString(); // 手机号
              var receivingBank = (arr[j].receivingBank).toString(); // 收款银行
              var workBankName = (arr[j].workBankName).toString(); // 开户网点
              var workBankNo = (arr[j].workBankNo).toString(); // 银行卡号
              var attendanceDay = (arr[j].attendanceDay).toString(); // 设备考勤天数
              var overtimeDay = (arr[j].overtimeDay).toString(); // 上报加班天数

              if (workName && workCard && workType && workTel && receivingBank && workBankName && workBankNo && attendanceDay && overtimeDay) {
                return !isOk;
              } else {
                var msg = '';
                var oIndex = j + 1; // 行号
                if (!workName) msg = '工人工资(点对点)信息中，第' + oIndex + '行的工人姓名不能为空';
                if (!workCard) msg = '工人工资(点对点)信息中，第' + oIndex + '行的身份证号不能为空';
                if (!workType) msg = '工人工资(点对点)信息中，第' + oIndex + '行的工种不能为空';
                if (!workTel) msg = '工人工资(点对点)信息中，第' + oIndex + '行的手机号不能为空';
                if (!receivingBank) msg = '工人工资(点对点)信息中，第' + oIndex + '行的收款银行不能为空';
                if (!workBankName) msg = '工人工资(点对点)信息中，第' + oIndex + '行的开户网点不能为空';
                if (!workBankNo) msg = '工人工资(点对点)信息中，第' + oIndex + '行的银行卡号不能为空';
                if (!attendanceDay) msg = '工人工资(点对点)信息中，第' + oIndex + '行的设备考勤天数不能为空';
                if (!overtimeDay) msg = '工人工资(点对点)信息中，第' + oIndex + '行的上报加班天数不能为空';

                FUI.Window.showMsg2(msg);
                return isOk
              }
            }
          }

        } else {

          FUI.Window.showMsg2('工人工资(点对点)信息至少要有一条');
          return isOk
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
          const values = data.map(item => Number(item['takeAmount'])); //  代理金额
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
      // 合计
      getSummaries2(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['attendanceDay'])); //  设备考勤天数
          const values2 = data.map(item => Number(item['overtimeDay'])); //  上报加班天数
          const values3 = data.map(item => Number(item['wageAmount'])); //  工资金额
          const values4 = data.map(item => Number(item['advancePayAmount'])); //  已垫付金额
          const values5 = data.map(item => Number(item['actualPayAmount'])); //  实际应支付金额

          if (!values.every(value => isNaN(value))) {
            sums[8] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[8] = Object.numberFixed(sums[8], 2);
          } else {
            sums[8] = '';
          }
          if (!values2.every(value => isNaN(value))) {
            sums[9] = values2.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[9] = Object.numberFixed(sums[9], 2);
          } else {
            sums[9] = '';
          }

          if (!values3.every(value => isNaN(value))) {
            sums[11] = values3.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[11] = Object.numberFixed(sums[11], 2);
          } else {
            sums[11] = '';
          }
          if (!values4.every(value => isNaN(value))) {
            sums[12] = values4.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[12] = Object.numberFixed(sums[12], 2);
          } else {
            sums[12] = '';
          }
          if (!values5.every(value => isNaN(value))) {
            sums[13] = values5.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[13] = Object.numberFixed(sums[13], 2);
          } else {
            sums[13] = '';
          }
        });

        return sums;
      },
      // 联动赋值
      setFildValue() {
        var that = this;
        var list = that.dataForm.detailList;
        var arr1 = []; // 有考勤
        var arr2 = []; // 无考勤
        var sumAmount1 = 0; //有考勤金额
        var sumAmount2 = 0; //无考勤金额
        if (list) {
          for (var i in list) {
            var day = list[i].attendanceDay;
            if (day && Number(day) > 0) {
              arr1.push(list[i]);
            } else {
              arr2.push(list[i]);
            }
          }
          if (arr1.length > 0) {
            that.dataForm.hasAttendanceRecord = arr1.length;
            for (let n in arr1) {
              sumAmount1 += Number(arr1[n].wageAmount);
            }
            that.dataForm.hasAttendanceAmount = sumAmount1;
          }else {
            that.dataForm.hasAttendanceRecord = '';
            that.dataForm.hasAttendanceAmount = '';
          }
          if (arr2.length > 0) {
            that.dataForm.noAttendanceRecord = arr2.length;
            for (let n in arr2) {
              sumAmount2 += Number(arr2[n].wageAmount);
            }
            that.dataForm.noAttendanceAmount = sumAmount2;
          }else{
            that.dataForm.noAttendanceRecord = '';
            that.dataForm.noAttendanceAmount = ''
          }
          that.dataForm.totalNumPeople = list.length;
        }
      },
      // 校验代领工资子表信息
      vaildPayrollTable(){
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.payrollProxyDetailList;
        if (arr) {
          for (var j = 0; j <= arr.length; j++) {
            var a1 = arr[j];
            if (a1) {
              var takeAmount = (a1.takeAmount).toString();
              var workBankName = (a1.workBankName).toString();
              var workBankNo = (a1.workBankNo).toString();
              var workCard = (a1.workCard).toString();
              var workName = (a1.workName).toString();
              var workTel = (a1.workTel).toString();

              if (takeAmount && workBankName && workBankNo && workCard && workTel && workName) {
                console.log(1)
              } else {
                var msg = '';
                var oIndex = j + 1; // 行号
                if (!workName) msg = '代领工资信息中，第' + oIndex + '行的代领人姓名不能为空';
                if (!workCard) msg = '代领工资信息中，第' + oIndex + '行的身份证号不能为空';
                if (!workTel) msg = '代领工资信息中，第' + oIndex + '行的电话号码不能为空';
                if (!workBankName) msg = '代领工资信息中，第' + oIndex + '行的开户行不能为空';
                if (!workBankNo) msg = '代领工资信息中，第' + oIndex + '行的银行卡号不能为空';
                if (!takeAmount) msg = '代领工资信息中，第' + oIndex + '行的代领金额不能为空';
                FUI.Window.showMsg2(msg);
                return isOk
              }
            }
          }

        }
        return !isOk;

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

</style>
