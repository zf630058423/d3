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
        <el-form-item slot="col_1" prop="code" label="供应商编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="供应商名称：">
          <el-input v-model="dataForm.name" placeholder="请输入" :disabled="disableStatus('name')" clearable size="small" maxlength="20" />
        </el-form-item>
        <!-- <el-form-item slot="col_3" prop="natureOfSupplier" label="供应商性质：">
          <el-select v-model="dataForm.natureOfSupplier" placeholder="请选择" size="small" style="width:100%" @change="changeCompanyType">
            <el-option v-for="(item,index) in natureOfSupplierList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item slot="col_3" :prop="setProp('taxRegistrationNum')" label="统一社会信用代码：">
          <el-input v-model="dataForm.taxRegistrationNum" size="small" placeholder="请输入" :disabled="disableStatus('taxRegistrationNum')" maxlength="18" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerCategory" label="供应商级别：">
          <el-select v-model="dataForm.customerCategory" placeholder="请选择"  :disabled="disableStatus('customerCategory')" size="small" style="width:100%" @change="changeCompanyType" clearable>
            <el-option v-for="(item,index) in customerCategorylist" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="contactPerson" label="联系人：">
          <el-input v-model="dataForm.contactPerson" size="small" placeholder="请输入" :disabled="disableStatus('contactPerson')" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_3" prop="contactPersonTel" label="联系电话：">
          <el-input type="number" v-model="dataForm.contactPersonTel" size="small" placeholder="请输入" :disabled="disableStatus('contactPersonTel')" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="地址：" prop="address">
          <!-- <el-select v-model="dataForm.address" placeholder="请选择" :disabled="disableStatus('address')" size="small" style="width:100%" @change="changeCompanyType" clearable>
            <el-option v-for="(item,index) in addressList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select> -->
          <cascSelect :default-value="dataForm.address" code="AddressCascade" @change-select="changeTeamCity" />
        </el-form-item>
        <el-form-item slot="col_2" prop="detailsAddress" label="详细地址：">
          <el-input v-model="dataForm.detailsAddress" size="small" placeholder="请输入" :disabled="disableStatus('detailsAddress')" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" label="启用状态：" prop="enableState">
          <el-radio-group v-model="dataForm.enableState" :disabled="disableStatus('enableState')">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <!-- <row-layout :cols="3">
        <el-form-item slot="col_1" prop="blackListStatus" label="黑名单状态：">
          <el-checkbox v-model="dataForm.blackListStatus" true-label='1' false-label='0' :disabled="disableStatus('blackListStatus')"></el-checkbox>
        </el-form-item>
        <el-form-item slot="col_2" label="经营状态：" prop="operatingState">
          <el-radio-group v-model="dataForm.operatingState" :disabled="disableStatus('operatingState')">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">异常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout> -->
      <!-- <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout> -->
      <form-title :title="'银行信息'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addBaseBank" :disabled="type!=='detail'?false:true">新增</el-button>
      </div>
      <el-table :data="dataForm.detailPOList" class="f2bpmui-datagrid-vuetable" border :disabled="disableStatus('detailPOList')">
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
            <selector-dialog :model-data="baseBank" :value="scope.row.bankName" dynamic-model="customDialog" :disabled="type!=='detail'?false:true" @updateValue="updateBaseBankValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="币种" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-select v-model="scope.row.currencyTypeId" placeholder="请选择" width="100%" :disabled="type !== 'detail'?false:true">
              <el-option v-for="(item,index) in currencyOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="默认" width="100px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isDefault" true-label='1' false-label='0' :disabled="type !== 'detail'?false:true"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="type!=='detail'?false:true" @click="delCustomerBank(scope.$index)">删除</el-button>
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
    </el-form>
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { saveSporadic, updateSporadic, getSporadicDetail } from '@/Api/supplier/index'; 
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import moment from 'moment'
//编辑  不可以修改的字段
let readonlyFiled = {
  createUserName: true, //编制人
  deptName: true, //编制人部门
  operateUser: true, //操作人
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
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      dataForm: {
        name: '',
        code: '',
        taxRegistrationNum: '',
        customerCategory: '',
        contactPerson: '',
        contactPersonTel: '',
        address: '',
        detailsAddress: '',
        enableState: '1',  // 启用状态 默认启用，可修改
        blackListStatus: '',
        operatingState: '1',  // 经营状态 默认正常，可修改
        detailPOList: [],
        fileInfo: [], // 附件文件
      },
      currencyOptions: [
        {configName:'新加坡元',configValue:'SGD'},
        {configName:'人民币',configValue:'CNY'},
        {configName:'美元',configValue:'USD'},
        {configName:'港元',configValue:'HKD'}
      ],
      customerStatusOptions: [],
      customerCategorylist: [
        {configName:'一般客户',configValue:'0'},
        {configName:'重大客户',configValue:'1'},
        {configName:'合格',configValue:'2'},
        {configName:'集采/战略',configValue:'3'}
      ],
      addressList: [
        {configName:'--省-市-区',configValue:'0'},
        {configName:'--省-市',configValue:'1'},
        {configName:'市-区',configValue:'3'}
      ],
      // natureOfSupplierList: [
      //   {configName:'内部',configValue:'value1'},
      //   {configName:'外部',configValue:'value2'},
      // ],
      companyType: '',
      remark:'',
      industryCategory: { code: 'customer_type', customDialog: 'customer_type', isSetHead: 1, isMulti: false, initailData: [] },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: {
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        noRequired: [{ required: false }],
        companyType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        taxRegistrationNum: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
          { required: true, pattern: /^[A-Z0-9]{18}$/, message: '请输入正确格式的统一社会信用代码', trigger: 'blur' }
        ],
        fileInfo: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        businessTime: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
        areaId: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
      },
      form: {
        modifyReason: ''
      }
    };
  },
  watch: {
    'dataForm.detailPOList.length': {
      handler(){
        if(this.dataForm.detailPOList[0]){
          this.dataForm.detailPOList[0].isDefault = true;
        }
      }
    }
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
  mounted() {
    if (this.type === 'add'){
      this.getUserInfo(); 
    }
  },
  methods: {
    getUserInfo() {
      this.dataForm.createUserId = userId;
      this.dataForm.createUserName = decodeURIComponent(realName);
      // this.dataForm.deptId = orgId;
      this.dataForm.deptName = decodeURIComponent(orgName);
      this.dataForm.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    beforeInit() {
    },
    afterInit(){
    },
    handleClick(val) {
      console.log('xxx', val)
    },
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'corporateName', 'customerStatus'])
    },
    /**
     * 切换所在城市
     */
    changeTeamCity(data) {
      this.dataForm.address = data.value;
      this.$refs['dataForm'].clearValidate('address')
    },
    openDialogVisible() {
      this.dialogVisible = true;
      this.form.modifyReason = ''
    },
    handleClose() {

    },
    // 给银行信息表头加必填符号*
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
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
        currencyTypeId: '人民币',
        supplierMainId: '',	  // 供应商主表主键
        isDefault: false
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
      if (this.dataForm.natureOfSupplier){   // 供应商性质
        this.dataForm.natureOfSupplier= this.dataForm.natureOfSupplier==="1"?'内部':'外部';
      }
    },
    async validateForm() {
      const _this = this;
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
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
          _this.saveForm(_this.dataForm);
        }
      })
    },
    async saveForm(dataForm) {
      dataForm.id = this.isEdit ? this.rowData.id : '';
      let { code } =  this.isEdit ? await updateSporadic(dataForm) : await saveSporadic(dataForm);
      if (code === 200) {
        this.$message.success(`${this.isEdit ? '修改' : '新增'}成功`);
        this.$store.dispatch('app/removeTagsView', this.$route.fullPath); // 保存成功后自动关闭页签
        this.$router.go(-1)
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
