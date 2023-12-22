<template>
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="200px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="劳务分包商编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="分包商名称：">
          <el-input v-model="dataForm.name" placeholder="请输入" :disabled="disableStatus('name')" clearable size="small" maxlength="100" />
        </el-form-item>
        <el-form-item slot="col_3" prop="natureOfSupplier" label="供应商性质：">
          <el-select v-model="dataForm.natureOfSupplier" placeholder="请选择" :disabled="disableStatus('natureOfSupplier')" size="small" style="width:100%" @change="changeCompanyType">
            <el-option v-for="(item,index) in natureOfSupplierList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" :prop="setProp('taxRegistrationNum')" label="统一社会信用代码：">
          <el-input v-model="dataForm.taxRegistrationNum" :disabled="disableStatus('taxRegistrationNum')" size="small" placeholder="请输入" maxlength="18" />
        </el-form-item>
        <el-form-item slot="col_2" prop="registeredFund" label="注册资金(万元)：">
          <!-- <el-input v-model="dataForm.registeredFund" size="small" placeholder="请输入保留两位小数的正数" :disabled="disableStatus('registeredFund')" @input="numInput" />  -->
          <amount-input v-model="dataForm.registeredFund" defaultValue placeholder="请输入" :disabled="disableStatus('registeredFund')"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="recordDate" label="登记日期：">
          <el-date-picker v-model="dataForm.recordDate" type="date" size="small" placeholder="选择日期时间" :disabled="disableStatus('recordDate')"></el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="contactPerson" label="联系人：">
          <el-input v-model="dataForm.contactPerson" :disabled="disableStatus('contactPerson')" size="small" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_2" prop="contactPersonTel" label="联系人电话：">
          <el-input type="number" v-model="dataForm.contactPersonTel" :disabled="disableStatus('contactPersonTel')" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_3" :prop="setProp('corporateName')" label="法人代表：">
          <el-input v-model="dataForm.corporateName" size="small" placeholder="请输入" :disabled="disableStatus('corporateName')" maxlength="50" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="qualificationLevel" label="资质等级：">
          <el-select v-model="dataForm.qualificationLevel" placeholder="请选择" :disabled="disableStatus('qualificationLevel')" size="small" style="width:100%">
            <el-option v-for="(item,index) in qualificationLevel" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="certificatenumber" label="资质证书编号：">  
          <el-input v-model="dataForm.certificatenumber" placeholder="请输入" :disabled="disableStatus('certificatenumber')" size="small" maxlength="100" />
        </el-form-item>
        <el-form-item slot="col_3" prop="qualiBusinessTime" label="资质证书有效期：">
          <el-date-picker 
            v-model="qualiBusinessTime"
            type="daterange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="disableStatus('qualiBusinessTime')"
            align="right"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="endtheworksafetypermit" label="安全生产许可证编号：">  
          <el-input v-model="dataForm.endtheworksafetypermit" placeholder="请输入" :disabled="disableStatus('endtheworksafetypermit')" size="small" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_2" prop="safeProductTime" label="安全生产许可证编号有效期：">
          <el-date-picker
            v-model="safeProductTime"
            type="daterange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="disableStatus('safeProductTime')"
            align="right"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="companyAddress" label="公司地址：">
          <el-input v-model="dataForm.companyAddress" :disabled="disableStatus('companyAddress')" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1"  prop="nameOfReferrer" label="推荐人：">
          <el-input v-model="dataForm.nameOfReferrer" :disabled="disableStatus('nameOfReferrer')" size="small" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_2" prop="referrerPhone" label="推荐人电话：">
          <el-input type="number" v-model="dataForm.referrerPhone" :disabled="disableStatus('referrerPhone')" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_3" prop="strategiccustomerornot" label="是否战略客户：">
          <el-radio-group v-model="dataForm.strategiccustomerornot" :disabled="disableStatus('strategiccustomerornot')">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>  
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" :disabled="disableStatus('remark')" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'银行信息'"></form-title>
      <div>
        <el-button type="primary" :disabled="type!=='detail'?false:true" size="small" @click="addBaseBank">新增</el-button>
      </div>
      <el-table :data="dataForm.detailPOList" class="f2bpmui-datagrid-vuetable" border :header-cell-class-name="headerCell">
        <el-table-column label="银行账号" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.accountId" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="账户名称" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input v-model="scope.row.accountName" :disabled="type!=='detail'?false:true" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="开户银行" :render-header="addRedStar">
          <template slot-scope="scope">
            <selector-dialog :model-data="baseBank" :value="scope.row.bankName" dynamic-model="customDialog" :disabled="true" @updateValue="updateBaseBankValue($event,scope.$index)" class="specialStyle"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="币种">
          <template slot-scope="scope">
            <el-select v-model="scope.row.currencyTypeId" placeholder="请选择" :disabled="type !== 'detail'?false:true">
              <el-option v-for="(item,index) in currencyOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="默认" width="180px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isDefault" true-label='1' false-label='0' @change="changeDefault($event, scope.row)" :disabled="type !== 'detail'?false:true"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="type !== 'detail'?false:true" @click="delCustomerBank(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <update-files v-model="dataForm.fileInfo" :disabled="disableStatus('fileInfo')"></update-files>
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
      <row-layout :cols="3" v-if="type !== 'add'">
        <el-form-item slot="col_1" label="修改人：">
          <span>{{ dataForm.lastModifyUserName }}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="修改人部门：">
          <span>{{ dataForm.lastModifyDeptName }}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="修改时间：">
          <span>{{ dataForm.lastModifyTime }}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { savelaborDetail, getlaborDetail, updatelaborDetail } from '@/Api/supplier/index';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
// import numberInput from '@/components/basic/numberInput/index'
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import moment from 'moment'
import ItemVue from '@/layout/components/Sidebar/Item.vue';
//编辑  不可以修改的字段
let readonlyFiled = {
  createUserName: true, //编制人
  deptName: true, //编制人部门
  createTime: true, //编制时间
  operateUser: true, //操作人
  closeAccountApplyCode: true, //销户申请编号
  constructArchiveName: true, //项目名称
  openAccountApplyCode: true, //开户申请编号
  lastModifyUserName: true, //修改人
  lastModifyDeptName: true, //修改人部门
  lastModifyTime: true //修改时间
};
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();  // 用户信息
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput, cascSelect, updateFiles },
  mixins: [comMixin],
  props: {
    type: {
      type: String,
      default: ""
    },
    rowData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    const dateValidator = (rule, value, callback)=>{
      value = this[rule.field];
      if(Array.isArray(value)){ //格式为：daterange、datetimerange检测
        value.map(function(item){
          if(item === ""){
            return callback("日期不能为空")
          }
        })
      }else{ //格式为：date、datetime、year、month 检测
        if(!value){
            return callback("日期不能为空")
        }
      }
      return callback()
    }
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      dataForm: {
        name: '',
        code: '',
        registeredFund: '',
        modifyReason: '',
        corporateName: '',
        qualificationLevel: '',
        contactPerson: '',
        contactPersonTel: '',
        certificatenumber: '',
        // qualiBusinessTime: [],
        endtheworksafetypermit: '',
        endTheWorkSafetyPermitStart: '',
        endTheWorkSafetyPermitEnd: '',
        periodOfValidityStart: '',
        periodofvalidityend: '',
        companyAddress: '',
        nameOfReferrer: '',
        referrerPhone: '',
        customerStatus: '1',
        natureOfSupplier: '2',
        strategiccustomerornot:'',
        industryCategoryId: '',
        industryCategory: '',
        fileInfos: [],
        recordDate:'',
        detailPOList: [],
        lastModifyDeptName:'',
        // safeProductTime: [], 
      },
      safeProductTime: [],
      qualiBusinessTime: [],
      currencyOptions: [
        {configName:'新加坡元',configValue:'SGD'},
        {configName:'人民币',configValue:'CNY'},
        {configName:'美元',configValue:'USD'},
        {configName:'港元',configValue:'HKD'}
      ],
      customerStatusOptions: [],
      natureOfSupplierList: [
        {configName:'内部',configValue:'1'},
        {configName:'外部',configValue:'2'},
      ],
      companyType: '',
      qualificationLevel: [
        {configName:'一级',configValue:'level1'},
        {configName:'二级',configValue:'level2'},
        {configName:'三级',configValue:'level3'},
        {configName:'不分等级',configValue:'level4'}
      ],
      remark:'',
      industryCategory: { code: 'customer_type', customDialog: 'customer_type', isSetHead: 1, isMulti: false, initailData: [] },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: {
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        noRequired: [{ required: false }],
        natureOfSupplier: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        companyType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        qualificationLevel: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        certificatenumber: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // periodOfValidityStart: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // periodofvalidityend: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        qualiBusinessTime: [{ required: true, message: '必填项不能为空', trigger: 'change',validator: dateValidator }],
        endtheworksafetypermit: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // endTheWorkSafetyPermitStart: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // endTheWorkSafetyPermitEnd: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        safeProductTime: [{ required: true, message: '必填项不能为空', trigger: 'change',validator: dateValidator }],
        // safeProductTime:[
        //   {
        //     // type: 'array',
        //     required: true,
        //     message: '必填项不能为空',
        //     trigger: 'change',
        //     validator: dateValidator
        //     // fields: {
        //     //   //tpye类型试情况而定,所以如果返回的是date就改成date
        //     //   0: { type: 'date', required: true, message: '请选择开始日期' },
        //     //   1: { type: 'date', required: true, message: '请选择结束日期' }
        //     // }
        //   }
        // ],
        taxRegistrationNum: [ 
          { required: true, message: '必填项不能为空', trigger: 'blur' },
          { required: true, pattern: /^[A-Z0-9]{18}$/, message: '请输入正确格式的统一社会信用代码', trigger: 'blur' }
        ],
        recordDate: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        registeredFund: [
          {required: true, message: '注册资金(万元) 不能为空', trigger: 'blur'},
          {required: true, pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确格式的金额', trigger: 'blur'}
        ],
        contactPerson: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
        contactPersonTel: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
        businessTime: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
        businessScope: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        areaId: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
        nameOfReferrer: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        referrerPhone: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        strategiccustomerornot: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
      },
      form: {
        modifyReason: ''
      }
    };
  },
  computed: {
    //判断状态
    disableStatus({ type }) { 
      return (text) => {
        if (type === 'add' && !readonlyFiled[text]) {
          return false;
        } else if (type == 'edit') {
          return readonlyFiled[text] ? readonlyFiled[text] : false;
        } else if (type == 'detail') { 
          return true;
        }
      }
    },
    //判断是否是编辑状态
    isEdit({ type }) {
      return type == 'edit' ? true : false;
    },
    isRequired() {
      if (this.dataForm.companyType === '1') {
        return [{ required: false }]
      }
      return [{ required: true, message: '必填项不能为空', trigger: ['blur', 'change'] }];
    },
    /**
     * 客户状态
     */
    customerStatusDisabled() {
      const { isRevise } = this.$route.query;
      if (isRevise) { return false }
      return true;
    }
  },
  watch: {
    'dataForm.detailPOList.length': {
      handler(newValue){
        if(newValue){
          let isDefault = this.dataForm.detailPOList.some(item => {
            return item.isDefault==='1';
          });
          if(!isDefault){
            this.dataForm.detailPOList[0].isDefault = '1';
          }
        }
      }
    }
  },
  mounted() {
    if (this.type === 'add'){
      this.getUserInfo(); 
    } 
  },
  methods: {
    headerCell({columnIndex}){
      if(columnIndex < 4){
        return 'wu-header-cell'
      } else {
        return ''
      }
    },
    getUserInfo() {
      this.dataForm.createUserId = userId;
      this.dataForm.createUserName = decodeURIComponent(realName);
      // this.dataForm.deptId = orgId;
      this.dataForm.deptName = decodeURIComponent(orgName);
      this.dataForm.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    beforeInit() {
      // this.getDataDictByConfigType()
    },
    // 注册资金(万元) 保留两位小数
    numInput() {
      const {registeredFund} = this.dataForm;
      this.dataForm.registeredFund = registeredFund.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
    },
    // 给银行信息表头加必填符号*
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    // 银行数据，默认只有一条数据勾选
    changeDefault(e, row){
      // console.log(e, row, this.dataForm.detailPOList, '点击的当前行数据');
      this.dataForm.detailPOList.forEach(item => {
        item.isDefault = '0';
      })
      row.isDefault = e;
    },
    handleClick(val) {
      // console.log('xxx', val)
    },
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'corporateName', 'customerStatus'])
    },
    openDialogVisible() {
      this.dialogVisible = true;
      this.form.modifyReason = ''
    },
    handleClose() {

    },
    submitForm() {
      this.dataForm.modifyReason = this.form.modifyReason;
      this.dialogVisible = false;
    },
    /**
     * 切换地址
     */
    changeAreaId(data) {
      this.dataForm.areaId = data.value
      this.$refs['dataForm'].clearValidate('areaId')
    },
    /**
     * 添加银行账号
     */
    addBaseBank() {
      if (!this.dataForm.detailPOList) this.dataForm.detailPOList = []
      this.dataForm.detailPOList.push({
        accountId: '',
        accountName: '',
        bankId: '',
        bankName: '',
        currencyTypeId: '人民币',  // 币种显示名称，默认显示人民币
        supplierMainId: '',	  // 供应商主表主键
        isDefault: '0'
      })
    },
    /**
     * 删除银行账号
     */
    delCustomerBank(index) {
      this.dataForm.detailPOList.splice(index, 1)
    },
    /**
     * 银行类别
     */
    updateBaseBankValue(data, index) {
      this.$set(this.dataForm.detailPOList[index], 'bankId', data[0].id)
      this.$set(this.dataForm.detailPOList[index], 'bankName', data[0].name)
    },
    /**
     * 行业类别
     */
    updateValue(data) {
      if (data.length > 0) {
        this.dataForm.industryCategoryId = data[0].id;
        this.dataForm.industryCategory = data[0].name;
      }
    },
    /**
     * 企业类型为-政府机构/国有事业时，不必填，否则编制人必填
     * @param {*} fieldName
     */
    setProp(fieldName) {
      if (this.dataForm.companyType === '1' || this.dataForm.companyType === '2') {
        return 'noRequired'
      }
      return fieldName;
    },
    afterInit() {
      if (this.dataForm.endTheWorkSafetyPermitStart && this.dataForm.endTheWorkSafetyPermitEnd){
        // this.safeProductTime = [this.dataForm.endTheWorkSafetyPermitStart, this.dataForm.endTheWorkSafetyPermitEnd]
         this.$set(this,'safeProductTime', [this.dataForm.endTheWorkSafetyPermitStart, this.dataForm.endTheWorkSafetyPermitEnd])
      } 
      if (this.dataForm.periodOfValidityStart && this.dataForm.periodofvalidityend){
        // this.qualiBusinessTime = [this.dataForm.periodOfValidityStart, this.dataForm.periodofvalidityend]
        this.$set(this,'qualiBusinessTime', [this.dataForm.periodOfValidityStart, this.dataForm.periodofvalidityend])
      }
      if(this.type !== 'add'){   // 编辑/查看时，编制人信息
        this.dataForm.lastModifyDeptName = !this.dataForm.lastModifyDeptName ? decodeURIComponent(orgName) : this.dataForm.lastModifyDeptName;  // 修改人部门
        this.dataForm.lastModifyDeptId = !this.dataForm.lastModifyDeptName ? orgId : this.dataForm.lastModifyDeptId;
      }else{
        this.dataForm.lastModifyDeptName = null;
        this.dataForm.lastModifyDeptId =  null;
      }
    },
    validateForm() {
      const _this = this;
      if(!this.dataForm.detailPOList.length) {
        FUI.Window.showMsg('银行信息至少要有一行数据，不能为空');
        return;
      };
      for (let key in this.dataForm.detailPOList) {
        if(!this.dataForm.detailPOList[key].accountId) {
          FUI.Window.showMsg('银行账号不能为空');
          return;
        }
        if(!this.dataForm.detailPOList[key].accountName) {
          FUI.Window.showMsg('账户名称不能为空');
          return;
        }
        if(!this.dataForm.detailPOList[key].bankName) {
          FUI.Window.showMsg('开户银行不能为空');
          return;
        }
      };
      if(!this.safeProductTime.length) {
        FUI.Window.showMsg('安全生产许可证编号有效期不能为空');
        return;
      };
      if(!this.qualiBusinessTime.length) {
        FUI.Window.showMsg('资质证书有效期不能为空');
        return;
      }
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
        let {safeProductTime, qualiBusinessTime} = _this;
          _this.dataForm.endTheWorkSafetyPermitStart = (safeProductTime && safeProductTime.length > 0) ? moment(safeProductTime[0]).format("YYYY-MM-DD HH:mm:ss") : '';
          _this.dataForm.endTheWorkSafetyPermitEnd = (safeProductTime && safeProductTime.length > 0) ? moment(safeProductTime[1]).format("YYYY-MM-DD HH:mm:ss") : '';
          _this.dataForm.periodOfValidityStart = (qualiBusinessTime && qualiBusinessTime.length > 0) ? moment(qualiBusinessTime[0]).format("YYYY-MM-DD") : '';
          _this.dataForm.periodofvalidityend = (qualiBusinessTime && qualiBusinessTime.length > 0) ? moment(qualiBusinessTime[1]).format("YYYY-MM-DD") : '';
          _this.dataForm.recordDate = moment(_this.dataForm.recordDate).format("YYYY-MM-DD"); 
          // let formatRecordDate = JSON.parse(JSON.stringify(_this.dataForm.recordDate));
          // _this.dataForm.formatRecordDate = moment(formatRecordDate).format("YYYY-MM-DD"); 
          _this.saveForm(_this.dataForm);
        }
      })
    },
    async saveForm(dataForm) {
      dataForm.id = this.isEdit ? this.rowData.id : '';
      dataForm.lastModifyDeptName = this.isEdit ? decodeURIComponent(orgName) : null;  // 修改人部门（保存时，修改人为当前用户）
      dataForm.lastModifyDeptId = this.isEdit ? orgId : null;
      let { code } =  this.isEdit ? await updatelaborDetail(dataForm) : await savelaborDetail(dataForm);
      if (code === 200) {
        this.$message.success(`${this.isEdit ? '修改' : '新增'}成功`);
        this.$store.dispatch('app/removeTagsView', this.$route.fullPath); // 保存成功后自动关闭页签
        this.$router.go(-1)
      }
    },
    /**
     * 初始化字典
     */
    // async getDataDictByConfigType() {
    //   debugger
    //   const res = await getDataDictByConfigType({ params: { configTypes: '企业类型,项目介绍人状态,币种' }})
    //   if (res.success) {
    //     res.data.forEach(ele => {
    //       switch (ele.dataDictType) {
    //         case '供应商性质':
    //           this.natureOfSupplierList = ele.dataDict;
    //           break;
    //         case '项目介绍人状态': // 客户状态 == 项目介绍人状态
    //           this.customerStatusOptions = ele.dataDict;
    //           break;
    //         case '币种':
    //           this.currencyOptions = ele.dataDict;
    //           break;
    //         default:
    //           break;
    //       }
    //     });
    //   }
    // }
  }
};
</script>

<style scoped lang="scss">
::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}
::v-deep .el-range-editor.is-disabled input {
  color: #333 !important;
}

::v-deep .el-table__header{
  // padding: 0 15px;
  .wu-header-cell {
    transform: translateX(15px);
  }
}
.specialStyle{
  padding-bottom: 7px !important;
}
::v-deep .el-range-editor--small .el-range-input {
    font-size: 12px;   // 日期控件字体
}
</style>
