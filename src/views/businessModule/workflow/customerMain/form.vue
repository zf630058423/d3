<template>
  <!-- 客户信息登记 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="140px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="客户名称：">
          <el-input v-model="dataForm.name" placeholder="请输入" size="small" maxlength="100" />
        </el-form-item>
        <el-form-item slot="col_3" prop="companyType" label="企业类型：">
          <el-select v-model="dataForm.companyType" placeholder="请选择" size="small" style="width:100%" @change="changeCompanyType">
            <el-option v-for="(item,index) in companyTypeOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="taxRegistrationNum" label="统一社会信用代码：">
          <el-input v-model.trim="dataForm.taxRegistrationNum" size="small" placeholder="请输入" maxlength="18" />
        </el-form-item>
        <el-form-item slot="col_2" prop="industryCategory" label="行业类别：">
          <selector-dialog :model-data="industryCategory" :value="dataForm.industryCategory" dynamic-model="customDialog" @updateValue="updateValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="businessTime" label="营业期限：">
          <el-date-picker
            v-model="dataForm.businessTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="regFound" label="注册资本(元)：">
          <amount-input v-model="dataForm.regFound"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="legalbody" label="法定代表人：">
          <el-input v-model="dataForm.legalbody" size="small" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" prop="customerStatus" label="客户状态：">
          <el-radio-group v-model="dataForm.customerStatus" :disabled="customerStatusDisabled" @change="openDialogVisible">
            <el-radio v-for="(item,index) in customerStatusOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="联系人：">
          <el-input v-model="dataForm.contactPerson" size="small" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_2" label="联系人职务：">
          <el-input v-model="dataForm.contactposition" size="small" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" label="联系人电话：">
          <el-input v-model="dataForm.contactTel" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="areaId" label="地址：">
          <cascSelect :default-value="dataForm.areaId" code="AddressCascade" @change-select="changeAreaId" />
        </el-form-item>
        <el-form-item slot="col_2" prop="address" label="联系地址：">
          <el-input v-model="dataForm.address" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="businessScope" label="经营范围：">
          <el-input v-model="dataForm.businessScope" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="3000" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'银行账号'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addBaseBank">新增</el-button>
      </div>
      <el-table :data="dataForm.customerBankDetailList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="银行账号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.accountId" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="账户名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.accountName" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="开户银行">
          <template slot-scope="scope">
            <selector-dialog :model-data="baseBank" :value="scope.row.bankName" dynamic-model="customDialog" @updateValue="updateBaseBankValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="币种">
          <template slot-scope="scope">
            <el-select v-model="scope.row.currencyId" placeholder="请选择" disabled>
              <el-option v-for="(item,index) in currencyOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }} {{ item.configValue }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delCustomerBank(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="附件文件：">
          <update-files v-model="dataForm.fileInfo"></update-files>
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
    <el-dialog
      title="提醒"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>客户状态修改，需填写修改原因。</span>
      <el-form>
        <el-form-item label="客户状态修改原因" prop="modifyReason">
          <el-input
            v-model="form.modifyReason"
            type="textarea"
            :autosize="{ minRows: 5}"
            size="small"
            placeholder="请输入客户状态修改原因"
            :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
// import numberInput from '@/components/basic/numberInput/index'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import moment from 'moment';
const requiredArray = ['name', 'companyType', 'regFound', 'legalbody', 'taxRegistrationNum', 'businessTime', 'businessScope', 'areaId', 'address', 'customerStatus']
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput, cascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      isReadOnly: false,
      dataForm: {
        name: '',
        code: '',
        companyType: '',
        modifyReason: '',
        regFound: '',
        legalbody: '',
        customerStatus: '',
        contactPerson: '',
        contactposition: '',
        contactTel: '',
        taxRegistrationNum: '',
        customerStatus: '0',
        industryCategoryId: '',
        industryCategory: '',
        areaId: '',
        address: '',
        businessScope: '',
        remark: '',
        businessTime: [],
        fileInfo: [],
        customerBankDetailList: []
      },
      currencyOptions: [],
      customerStatusOptions: [],
      companyTypeOptions: [],
      industryCategory: { code: 'customer_type', customDialog: 'customer_type', isSetHead: 1, isMulti: false, initailData: [] },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      // dataRule: {
      //   name: [
      //     { required: true, message: '必填项不能为空', trigger: 'blur' }
      //   ],
      //   noRequired: [{ required: false }],
      //   companyType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
      //   taxRegistrationNum: [
      //     { required: true, message: '必填项不能为空', trigger: 'blur' },
      //     { required: true, pattern: /^[A-Z0-9]{18}$/, message: '请输入正确格式的统一社会信用代码', trigger: 'blur' }
      //   ],
      //   businessTime: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
      //   businessScope: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
      //   areaId: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
      //   address: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      // },
      form: {
        modifyReason: ''
      }
    };
  },
  computed: {
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
  mounted() { },
  methods: {
    handleClick(val) {
      console.log('xxx', val)
    },
    /**
     * 字段校验
     */
    initRuleRequired() {
      const val = this.dataForm.companyType
      this.dataRule['taxRegistrationNum'] = RuleRequired.curCustomRule(!(val== '1' || val == '2'), function (rule, value, callbacak) {
        let pattern = /^[A-Z0-9]{18}$/;
        if (!value || pattern.test(value)) {
          callbacak();
        } else {
          callbacak(new Error('统一社会信用码输入有误'));
        }
       });
      ['businessTime', 'regFound', 'legalbody'].forEach(e=>{
        this.dataRule[e] = RuleRequired.curFiledRule(!(val== '1' || val == '2'))
      })
      if(this.$refs['dataForm']) this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'legalbody'])
    },
    /**
     * 企业类型为-政府机构/国有事业时，不必填，否则编制人必填
     * 【统一社会信用代码，营业期限，注册资本(元)，法定代表人】
     * @param {*} val 
     */
    changeCompanyType(val) { // /^[A-Z0-9]{18}$/
      this.initRuleRequired();
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
      if (!this.dataForm.customerBankDetailList) this.dataForm.customerBankDetailList = []
      this.dataForm.customerBankDetailList.push({
        accountId: '',
        accountName: '',
        bankId: '',
        bankName: '',
        currencyId: 'CNY'
      })
    },
    /**
     * 删除银行账号
     */
    delCustomerBank(index) {
      this.dataForm.customerBankDetailList.splice(index, 1)
    },
    /**
     * 银行类别
     */
    updateBaseBankValue(data, index) {
      this.$set(this.dataForm.customerBankDetailList[index], 'bankId', data[0].id)
      this.$set(this.dataForm.customerBankDetailList[index], 'bankName', data[0].name)
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
    beforeInit() {
      this.initRuleRequired()
      this.getDataDictByConfigType()
    },
    afterInit() {
      if (this.dataForm.businessStartTime && this.dataForm.businessEndTime) this.dataForm.businessTime = [this.dataForm.businessStartTime, this.dataForm.businessEndTime]
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      if (this.dataForm.businessTime && this.dataForm.businessTime.length > 0) {
        dataForm.businessStartTime = moment(this.dataForm.businessTime[0]).format('YYYY-MM-DD')
        dataForm.businessEndTime = moment(this.dataForm.businessTime[1]).format('YYYY-MM-DD')
      }
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const bank = await _this.validateCustomerBank();
      if(!bank) return false;
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
     * 银行信息校验
     */
    validateCustomerBank() {
      const validObj = {
        accountId: '银行账号',
        accountName: '账户名称',
        bankName: '开户银行'
      }
      for (let index in this.dataForm.customerBankDetailList) {
        for (let key in validObj) {
          let _row = this.dataForm.customerBankDetailList[index]
          if (!_row[key]) {
            this.$message.error(`银行信息：第 ${parseInt(index) + 1} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return true;
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '企业类型,客户状态,币种' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '企业类型':
              this.companyTypeOptions = ele.dataDict;
              break;
            case '客户状态': // 客户状态 == 项目介绍人状态
              this.customerStatusOptions = ele.dataDict;
              break;
            case '币种':
              this.currencyOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
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
