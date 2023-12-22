<template>
  <div class="business-unit-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="140px"
    >
    <row-layout :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="autofillPlaceHolder" />
        </el-form-item>
        <el-form-item slot="col_2" prop="businessUnit" label="业务单元：">
          <text-input v-model="dataForm.businessUnit" :disabled="disableStatus('businessUnit')" size="small" :placeholder="pleaseEnterPlaceHolder"></text-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="associatedDept" label="关联部门：">
          <select-dialog :btnDisabled="disableStatus('associatedDept')" :width="600" :height="360" :value="dataForm.associatedDept" @updateValue="associatedDeptUpdateValue" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="superiorBusinessUnit" label="上级业务单元：">
          <select-dialog :btnDisabled="disableStatus('superiorBusinessUnit')" :width="800" :height="360" :value="dataForm.superiorBusinessUnit" dynamicModel="customDialog" :modelData="superiorBusinessUnitModelData" @updateValue="businessUnitValue"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="affiliatedBusinessCenterName" label="所属业务中心：">
          <select-dialog :btnDisabled="disableStatus('affiliatedBusinessCenterName')" :width="800" :height="360" :value="dataForm.affiliatedBusinessCenterName" @updateValue="businessCenterUpdateValue" :modelData="superiorBusinessUnitModelData" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="associatedCentre" label="关联中心：">
          <select-dialog :btnDisabled="disableStatus('associatedCentre')" :width="600" :height="360" :value="dataForm.associatedCentre" @updateValue="associatedCentreUpdateValue" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="financialOrganizations" label="财务组织：">
          <select-dialog :btnDisabled="disableStatus('financialOrganizations')" :width="600" :height="360" :value="dataForm.financialOrganizations" @updateValue="fOrgUpdateValue" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="socialUniformCreditCode" label="统一社会信用代码：">
          <text-input :disabled="disableStatus('socialUniformCreditCode')" v-model="dataForm.socialUniformCreditCode" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" prop="organizationalAttributes" label="组织属性：">
          <el-radio-group :disabled="disableStatus('organizationalAttributes')" v-model="dataForm.organizationalAttributes" @change="organizationalAttributesChange">
            <el-radio :label="item.configValue" :key="item.configValue" v-for="item in organizationalAttributesArray">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="billingAddress" label="开票地址：">
          <el-input :disabled="disableStatus('billingAddress')" v-model="dataForm.billingAddress" size="small" :placeholder="pleaseEnterPlaceHolder" />
        </el-form-item>
        <el-form-item slot="col_2" prop="phoneMakeInvoice" label="开票电话：">
          <el-input :disabled="disableStatus('phoneMakeInvoice')" v-model="dataForm.phoneMakeInvoice" size="small" :placeholder="pleaseEnterPlaceHolder" />
        </el-form-item>
        <el-form-item slot="col_3" prop="invoicingBank" label="开票开户行：">
          <el-input :disabled="disableStatus('invoicingBank')" v-model="dataForm.invoicingBank" size="small" placeholder="请选择" />
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="billingBankAccountNumber" label="开票银行账号：">
          <text-input :disabled="disableStatus('billingBankAccountNumber')" v-model="dataForm.billingBankAccountNumber" size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="makeInvoiceAmount" label="开票限额：">
            <el-select v-model="dataForm.makeInvoiceAmount" placeholder="请选择" :disabled="disableStatus('makeInvoiceAmount')">
              <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in makeInvoiceAmountArray">{{ item.configName }}</el-option>
            </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="baiWangState" label="百望开票：">
          <el-radio-group :disabled="disableStatus('baiWangState')" v-model="dataForm.baiWangState">
            <el-radio :label="item.label" :key="item.label" :name="item.name" v-for="item in enableStateArray">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payeeBankAcc" label="收款账号：">
          <select-dialog :btnDisabled="disableStatus('payeeBankAcc')" :width="820" :height="360" :value="dataForm.payeeBankAcc" dynamicModel="customDialog" :modelData="payeeBankModelData" @updateValue="payeeBankUpdateValue"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="accName" label="收款账户名称：">
          <el-input :disabled="disableStatus('accName')" v-model="dataForm.accName" size="small" :placeholder="autofillPlaceHolder" />
        </el-form-item>
        <el-form-item slot="col_3" prop="bankBranchName" label="收款银行：">
          <el-input disabled v-model="dataForm.bankBranchName" size="small" :placeholder="autofillPlaceHolder" />
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="organizationalCode" label="组织编码：">
          <text-input :disabled="disableStatus('organizationalCode')" v-model="dataForm.organizationalCode" size="small" :placeholder="pleaseEnterPlaceHolder" />
        </el-form-item>
        <el-form-item slot="col_2" prop="businessUnitCodeOne" label="1.0业务单元编码：">
          <text-input :disabled="disableStatus('businessUnitCodeOne')" v-model="dataForm.businessUnitCodeOne" size="small" :placeholder="pleaseEnterPlaceHolder" />
        </el-form-item>
        <el-form-item slot="col_3" prop="sorting" label="排序：">
          <el-input :disabled="disableStatus('sorting')" v-model="dataForm.sorting" size="small" :placeholder="pleaseEnterPlaceHolder" />
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="enableState" label="启用状态：">
          <el-radio-group :disabled="disableStatus('enableState')" v-model="dataForm.enableState">
            <el-radio :label="item.label" :key="item.label" v-for="item in enableStateArray">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2">
        </el-form-item>
        <el-form-item slot="col_3">
        </el-form-item>
     </row-layout>
     <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制人部门：">
          <label class="label-style">{{dataForm.deptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <label class="label-style">{{dataForm.createTime}}</label>
        </el-form-item>
     </row-layout>
     <row-layout :cols="3" v-if="type !== 'add'">
        <el-form-item slot="col_1" prop="lastModifyUserName" label="修改人：">
          <!-- <el-input :disabled="disableStatus('lastModifyUserName')" v-model="dataForm.lastModifyUserName" size="small" :placeholder="autofillPlaceHolder" /> -->
          <label class="label-style">{{dataForm.lastModifyUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="lastModifyDeptName" label="修改人部门：">
          <!-- <el-input :disabled="disableStatus('lastModifyDeptName')" v-model="dataForm.lastModifyDeptName" size="small" :placeholder="autofillPlaceHolder" /> -->
          <label class="label-style">{{dataForm.lastModifyDeptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="lastModifyTime" label="修改时间：">
          <!-- <el-date-picker :disabled="disableStatus('lastModifyTime')" v-model="dataForm.lastModifyTime" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
          <label class="label-style">{{dataForm.lastModifyTime}}</label>
        </el-form-item>
     </row-layout>
  </el-form>

  </div>
</template>
<script>
import comMixin from '../minix';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import { saveForm, getDetail, updateBusiness } from '@/Api/businessUnit/index';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import { BUSINERSSUNIT_MODEL, PAYEEBANK_MODEL, RADIO_GROUP } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';


//编辑  不可以修改的字段
let readonlyFiled = {
  createUserName: true, //编制人
  deptName: true,  //编制人部门
  createTime: true,  //编制时间
  bankBranchName: true,  //收款银行
  lastModifyUserName: true,  //修改人
  lastModifyDeptName: true,  //修改人部门
  lastModifyTime: true  //修改时间
}

//默认必填的字段
const requiredFiles = ['businessUnit','associatedDept','organizationalAttributes','affiliatedBusinessCenterName','affiliatedBusinessCenterName','associatedCentre','socialUniformCreditCode', 'billingAddress', 'phoneMakeInvoice', 'invoicingBank', 'billingBankAccountNumber', 'makeInvoiceAmount','sorting']

export default {
  name: 'businessUnitForm',
  components: {
    RowLayout,
    SelectDialog,
    AmountInput,
    TextInput
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    rowData: {
      type: Object,
      default: () => { }
    }
  },
  mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',  //单据编号
        businessUnit: '',  //业务单元
        associatedDept: '',  //关联部门
        associatedDeptId: '',  //关联部门Id
        superiorBusinessUnit: '',  //上级业务单元
        superiorBusinessUnitId: '',  //上级业务单元id
        affiliatedBusinessCenterName: '',  ///所属业务中心
        affiliatedBusinessCenterId: '', //所属业务中心id
        associatedCentre: '',  //关联中心
        associatedCentreId: '',  //关联中心id
        financialOrganizations: '',  //财务组织
        financialOrganizationsId: '',  //财务组织id
        socialUniformCreditCode: '', //统一社会信用代码
        organizationalAttributes: '',  //组织属性
        billingAddress: '',  //开票地址
        phoneMakeInvoice: '', //开票电话
        invoicingBank: '',  //开票开户行
        billingBankAccountNumber: '',  //开票银行账号
        makeInvoiceAmount: '',  //开票限额
        baiWangState: '',  //百望开票
        payeeBankAccId: '',  //收款账号id
        payeeBankAcc:'',  //收款账号
        accName: '',  //收款账户户名
        bankBranchName:'',//收款银行
        organizationalCode: '', //组织编码
        businessUnitCodeOne: '', //1.0业务单元编码
        sorting: '',  //排序
        enableState:'1',  //启用状态
        createTime: '',  //编制时间
        createUserName: '',  //编制人
        createUserId: '',  //编制人Id
        lastModifyUserName: '',  //修改人
        lastModifyUserId: '',  //	修改人id
        lastModifyDeptName: '',  //修改部门
        lastModifyDeptId: '',  //	修改部门id
        lastModifyTime:'',  //修改时间
      },
      organizationalAttributesArray: [
        // { id: 1, label: '集团公司' },
        // { id: 2, label: '子公司' },
        // { id: 3, label: '分公司' },
        // { id:4, label:'部门'},
      ],
      enableStateArray: RADIO_GROUP,
      autofillPlaceHolder: '自动带出',  //自动填写
      pleaseEnterPlaceHolder: '请输入',   //请输入
      pleaseSelectPlaceHolder: '请选择',  //请选择
      superiorBusinessUnitModelData: BUSINERSSUNIT_MODEL,  //业务单元弹框配置
      // superiorBusinessUnitModelData: {
      //   code: 'YeWuDanYuan',
      //   customDialog: 'YeWuDanYuan',
      //   isSetHead: 1,
      //   isMulti: false,
      //   initailData: []
      // },
      payeeBankModelData: PAYEEBANK_MODEL,  //收款账号弹框配置
      dataRule: RuleRequired.dataRule(requiredFiles),
      makeInvoiceAmountArray:[],  //开票限额
    }
  },
  computed: {
    //判断状态
    disableStatus({ type }) {
      return (text) => {
        if (type === 'add') {
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
    }
  },
  created() {
    this.formDetail();
    this.getDataDictByConfigType();
  },
  methods: {
    updateValue() { },
    beforeInit() { 
      const defaultNoRequired = ['socialUniformCreditCode', 'billingAddress', 'phoneMakeInvoice', 'invoicingBank', 'billingBankAccountNumber', 'makeInvoiceAmount'];
      this.noRequiredFiles(defaultNoRequired);
    },
    afterInit() {
      let { baiWangState } = this.dataForm;
      this.dataForm.baiWangState = baiWangState !== null && baiWangState !== '' ? baiWangState.toString() : ''; 
    },
    //关联部门
    associatedDeptUpdateValue(data) {
      this.dataForm.associatedDept = data[0].text;
      this.dataForm.associatedDeptId = data[0].value;
     },
    //上级业务单元
    businessUnitValue(data) {
      this.dataForm.superiorBusinessUnit = data[0].businessUnit
      this.dataForm.superiorBusinessUnitId = data[0].superiorBusinessUnitId;
    },
    //所属业务中心
    businessCenterUpdateValue(data) {
      this.dataForm.affiliatedBusinessCenterName = data[0].businessUnit;
      this.dataForm.affiliatedBusinessCenterId = data[0].affiliatedBusinessCenterId;
    },
    //关联中心
    associatedCentreUpdateValue(data) {
      this.dataForm.associatedCentre = data[0].text; //关联中心
      this.dataForm.associatedCentreId = data[0].value;  //关联中心id
    },
    //财务组织
    fOrgUpdateValue(data) {
      this.dataForm.financialOrganizations = data[0].text; //财务组织
      this.dataForm.financialOrganizationsId = data[0].value;  //财务组织id
    },
    //选择组织属性时
    organizationalAttributesChange(e) {
      console.log("选择组织属性时===:", e);
      const arr = ['1', '2', '3'];  //为集团公司、子公司、分公司是必填
      const requiredFiles = ['socialUniformCreditCode', 'billingAddress', 'phoneMakeInvoice', 'invoicingBank', 'billingBankAccountNumber', 'makeInvoiceAmount'];  //为集团公司、子公司、分公司必填字段  等于部门时都不必填
      
      if (arr.includes(e)) { 
        requiredFiles.forEach(filed => { 
          this.dataRule[filed] = RuleRequired.curFiledRule(true);
        })
        this.dataRule['socialUniformCreditCode'] = [
          ...RuleRequired.curFiledRule(true),
          ...RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
            const reg = /^[A-Z0-9]{18}$/;
            if (value.match(reg)) {
              callbacak();
            } else { 
              callbacak(new Error('请输入正确格式的统一社会信用代码'));
            }
           },'blur')
        ]
      }
      if (e === '4') { 
        this.noRequiredFiles(requiredFiles);
      }
    },
    //不必填的字段
    noRequiredFiles(arr) {
       arr.forEach(filed => { 
          this.dataRule[filed] = RuleRequired.curFiledRule(false);
        })
     },
    //收款账号
    payeeBankUpdateValue(data) {
      if (data) { 
         this.dataForm.payeeBankAccId = data[0].id; 
         this.dataForm.payeeBankAcc = data[0].accountNo; //收款账号
         this.dataForm.accName = data[0].accountName;  //收款账户户名
         this.dataForm.bankBranchName = data[0].bankName;  //收款银行 
      }
    },
    // validateForm() {
    //   const _this = this
    //     _this.$refs['dataForm'].validate(valid => {
    //       if (valid) {
    //         _this.saveForm(_this.dataForm);
    //       }
    //     })
    // },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            return resolve(_this.dataForm);
          } else {
            return resolve(false)
          }
        })
      });
    },
    async getDataDictByConfigType() {
      const configTypes = '组织属性,开票限额';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        if (data && data.length > 0) {
          //组织属性
          this.organizationalAttributesArray = data.find(item => item.dataDictType === '组织属性')?.dataDict || [];
          //开票限额
          this.makeInvoiceAmountArray = data.find(item => item.dataDictType === '开票限额')?.dataDict || [];
        }
      }
    },
    async saveForm(dataForm) {
      dataForm.id = this.isEdit ? this.rowData.id : '';
      let { code } =  this.isEdit ? await updateBusiness(dataForm) : await saveForm(dataForm);
      if (code === 200) {
        this.$message.success(`${this.isEdit ? '修改' : '新增'}成功`);
        this.$router.go(-1)
      }
    },
    async formDetail() {
      let id = this.rowData.id;
      let { data } = await getDetail(id);
      this.dataForm = data;
    }
  }
}
</script>
<style scoped lang="scss">
@import '../../style/form.scss';


</style>
