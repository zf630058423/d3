<template>
  <div class="bank-files-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px">
      <row-layout :cols="3" title="业务信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="constructArchiveCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructArchiveCode"
              @updateValue="selectDialogConstructArchive" :modelData="configModelData"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="closeAccountApplyCode" label="销户申请编号：">
            <el-input v-model="dataForm.closeAccountApplyCode" disabled size="small" placeholder="反写更新" />
          </el-form-item>
          <!-- <el-form-item label="项目编号：" prop="closeAccountApplyCode">
            <el-input v-model="dataForm.closeAccountApplyCode" placeholder="请选择项目" disabled size="small">
              <el-button slot="append" icon="el-icon-paperclip" class="mylink" size="small"
                v-if="dataForm.closeAccountApplyCode">链接</el-button>
            </el-input>
          </el-form-item> -->
          <el-form-item prop="operateUserName" label="操作人：">
            <el-input v-model="dataForm.operateUserName" disabled size="small" placeholder="反写更新" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="financeOrgName" label="核算财务组织：">
            <select-dialog :width="600" :height="360" :value="dataForm.financeOrgName"
              @updateValue="selectDialogfinanceOrg" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
          <el-form-item prop="constructArchiveName" label="项目名称：">
            <el-input v-model="dataForm.constructArchiveName" disabled size="small"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="closeAccountTime" label="销户日期：">
            <el-date-picker v-model="dataForm.closeAccountTime" type="datetime" disabled value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="operateTime" label="操作时间：">
            <el-date-picker v-model="dataForm.operateTime" type="datetime" disabled value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="openAccountType" label="开户类型：">
            <el-select v-model="dataForm.openAccountType" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('openAccountType', val)">
              <el-option v-for="(item) in selectOptions.openAccountType" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="openAccountApplyCode" label="开户申请编号：">
            <el-input v-model="dataForm.openAccountApplyCode" size="small" placeholder="反写更新" disabled>
              <el-button slot="append" icon="el-icon-paperclip" class="mylink" size="small"
                v-if="dataForm.openAccountApplyCode">链接</el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="enableStatus" label="启用状态：">
            <el-radio-group v-model="dataForm.enableStatus">
              <el-radio :label="item.id" :key="item.id" v-for="item in isEenableStatusArray">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="账户信息">
        <template slot="col_1">
          <el-form-item prop="bankAccountName" label="账户名称：">
            <el-input v-model="dataForm.bankAccountName" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="bankBranchName" label="开户银行：">
            <select-dialog :width="800" :height="360" :value="dataForm.bankBranchName" @updateValue="selectDialogBankName"
              :modelData="bankNameModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="accountType" label="账户类型：">
            <el-select v-model="dataForm.accountType" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('accountType', val)">
              <el-option v-for="(item) in selectOptions.accountType" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bankBelong" label="银行所在地：">
            <el-select v-model="dataForm.bankBelong" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('bankBelong', val)">
              <el-option v-for="(item) in selectOptions.bankBelong" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="onlineBankReconcileType" label="网银对账方式：">
            <el-select v-model="dataForm.onlineBankReconcileType" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('onlineBankReconcileType', val)">
              <el-option v-for="(item) in selectOptions.onlineBankReconcileType" :key="item.configValue"
                :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="payInStatus" label="收款银企直连：">
            <el-radio-group v-model="dataForm.payInStatus">
              <el-radio :label="item.id" :key="item.id" v-for="item in isEenableStatusArray">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item prop="payOutStatus" label="是否开启银企直连：">
            <el-radio-group v-model="dataForm.payOutStatus">
              <el-radio :label="item.id" :key="item.id" v-for="item in enableStatusArray">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="bankTypeName" label="银行类别：">
            <el-input v-model="dataForm.bankTypeName" size="small" disabled :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="currency" label="币种：">
            <el-select v-model="dataForm.currency" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('currency', val)">
              <el-option v-for="(item) in selectOptions.currency" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="accountProp" label="账户属性：">
            <el-select v-model="dataForm.accountProp" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('accountProp', val)">
              <el-option v-for="(item) in selectOptions.accountProp" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="accountBelongOrgName" label="账户所属区域：">
            <select-dialog :width="600" :height="360" :value="dataForm.accountBelongOrgName"
              @updateValue="accountBelongUpdateValue" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
          <el-form-item prop="cashierName" label="出纳：">
            <select-dialog :width="800" :height="360" :value="dataForm.cashierName" @updateValue="selectDialogCashier"
              dynamicModel="selectUsers" :modelData='{parm:{singleSelect: true}}'></select-dialog>
          </el-form-item>
          
        </template>
        <template slot="col_3">
          <el-form-item prop="bankAccountNo" label="银行账号：">
            <el-input v-model="dataForm.bankAccountNo" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="openAccountTime" label="开户日期：">
            <el-date-picker v-model="dataForm.openAccountTime" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="payProp" label="收付属性：">
            <el-select v-model="dataForm.payProp" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('payProp', val)">
              <el-option v-for="(item) in selectOptions.payProp" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="accountStatus" label="账户状态：">
            <el-select v-model="dataForm.accountStatus" placeholder="请选择" size="small" style="width:100%"
              @change="(val) => changeOptions('accountStatus', val)">
              <el-option v-for="(item) in selectOptions.accountStatus" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isTaxDeductionAccount" label="扣税户：">
            <el-radio-group v-model="dataForm.isTaxDeductionAccount">
              <el-radio :label="item.id" :key="item.id" v-for="item in enableStatusArray">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="accountRemark" label="账户说明：">
            <el-input v-model="dataForm.accountRemark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>

        </template>
        <template slot="col_1">
          <el-form-item prop="remark" label="备注：">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>

        </template>
      </row-layout>
      <row-layout :cols="3" title="预留印鉴">
        <template slot="col_1">
          <el-form-item prop="sealCorporate" label="公章：">
            <el-input v-model="dataForm.sealCorporate" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="sealOther" label="其他：">
            <el-input v-model="dataForm.sealOther" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="sealFinancial" label="财务章：">
            <el-input v-model="dataForm.sealFinancial" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="sealOfficial" label="法人章：">
            <el-input v-model="dataForm.sealOfficial" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="协定存款">
        <template slot="col_1">
          <el-form-item prop="agreeMinDepositAmount" label="协定起存金额（元）：">
            <el-input v-model="dataForm.agreeMinDepositAmount" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="agreeUpRate" label="上浮（%）：">
            <percentage-input v-model="dataForm.agreeUpRate" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="agreeLastDatetime" label="截止时间：">
            <el-date-picker v-model="dataForm.agreeLastDatetime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="agreeDepositRate" label="协定存款利率（%）：">
            <percentage-input v-model="dataForm.agreeDepositRate" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="agreeBase" label="基准：">
            <el-input v-model="dataForm.agreeBase" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoPOList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoPOList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" >
        <!-- v-if="type !== 'add'" -->
        <template slot="col_1">
          <el-form-item prop="createUserName" label="编制人：">
            <label class="label-style">{{dataForm.createUserName}}</label>
          </el-form-item>
          <el-form-item prop="lastModifyUserName" label="修改人：">
            <label class="label-style">{{dataForm.lastModifyUserName}}</label>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="createUserDeptName" label="编制人部门：">
            <label class="label-style">{{dataForm.createUserDeptName}}</label>
          </el-form-item>
          <el-form-item prop="lastModifyUserDeptName" label="修改人部门：">
            <label class="label-style">{{dataForm.lastModifyUserDeptName}}</label>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="createTime" label="编制时间：">
            <label class="label-style">{{dataForm.createTime}}</label>
          </el-form-item>
          <el-form-item prop="lastModifyTime" label="修改时间：">
            <label class="label-style">{{dataForm.lastModifyTime}}</label>
          </el-form-item>
        </template>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import comMixin from "../minix";
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import { saveForm, getDetail, updateBankFile, checkBankArchive } from "@/Api/baseBankArchiveMain/index";
import AmountInput from "@/components/basic/numberInput/amountInput.vue";
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';
//编辑  不可以修改的字段
let readonlyFiled = {
  createUserName: true, //编制人
  createUserDeptName: true, //编制人部门
  createTime: true, //编制时间
  operateUser: true, //操作人
  closeAccountApplyCode: true, //销户申请编号
  constructArchiveName: true, //项目名称
  openAccountApplyCode: true, //开户申请编号
  lastModifyUserName: true, //修改人
  lastModifyUserDeptName: true, //修改人部门
  lastModifyTime: true //修改时间
};

export default {
  name: "baseBankArchiveMainListForm",
  components: {
    FormTitle,
    RowLayout,
    updateFiles,
    SelectDialog,
    AmountInput,
    PercentageInput
  },
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
  mixins: [comMixin],
  data () {
    return {
      dataForm: {
        code: "", //单据编号
        constructArchiveCode: "", //项目编号
        constructArchiveMainId: "", //项目编号
        closeAccountApplyCode: "", //销户申请编号
        operateUser: "", //操作人
        financeOrgName: "", //核算财务组织
        financeOrgId: "", //核算财务组织
        constructArchiveName: "", //项目名称
        closeAccountTime: "", //销户日期
        operateTime: "", //操作时间
        openAccountType: "", //开户类型
        openAccountApplyCode: "", //开户申请编号
        enableStatus: "1", //启用状态
        bankAccountName: "", //	账户名称
        bankBranchName: "", //	开户银行名称
        bankBranchId: "", //	开户银行
        accountType: "", //	账户类型
        bankBelong: "", //	银行所在地
        onlineBankReconcileType: "", //	网银对账方式
        payInStatus: "", //	收款银企直连
        bankTypeName: "", //	银行类别名称
        bankTypeId: "", //	银行类别id
        currency: "", //币种
        accountProp: "", //账户属性
        accountBelongOrgName: "", //账户所属区域
        accountBelongOrgId: "", //账户所属区域
        cashierName: "", //出纳
        cashierId: "", //出纳
        payOutStatus: "", //付款银企直连
        bankAccountNo: "", //银行账号
        openAccountTime: "", //开户日期
        payProp: "3", //收付属性
        accountStatus: "", //账户状态
        isTaxDeductionAccount: "", //扣税户
        accountRemark: "", //账户说明
        sealCorporate: "", //公章
        sealFinancial: "", //财务章
        sealOfficial: "", //法人章
        sealOther: "", //其他
        agreeMinDepositAmount: "", //协定起存金额
        agreeLastDatetime: "", //截止时间
        agreeBase: "", //基准
        agreeUpRate: "", //上浮（%）
        agreeDepositRate: "", //协定存款利率（%）
        fileInfoPOList: [], //附件
        remark: "", //备注
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        lastModifyUserName: "", //修改人
        lastModifyUserId: "", //	修改人id
        lastModifyUserDeptName: "", //修改部门
        lastModifyDeptId: "", //	修改部门id
        operateUserName: "", //	操作人
        lastModifyTime: "" //修改时间
      },
      isEenableStatusArray: [
        { id: '1', label: "启用" },
        { id: '2', label: "禁用" }
      ],
      enableStatusArray: [
        { id: '1', label: "是" },
        { id: '0', label: "否" }
      ],
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入
      pleaseSelectPlaceHolder: "请选择", //请选择
      configModelData: { code: "XiangMuDangAnYinXingDangAn", parm: { isEnableAuthor: 0, data: [], isMulti: false } },
      bankNameModelData: { code: "bank_branch", parm: { isEnableAuthor: 0, data: [], isMulti: false } },
      dataRule: {
        financeOrgName: [
          //业务单元
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        openAccountType: [
          //关联部门
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        bankAccountName: [
          //账户名称
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        bankBranchName: [
          //开户银行
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        bankTypeName: [
          //银行类别
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        bankAccountNo: [
          //银行账号
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: this.validatorBankArchive, trigger: "blur" }
        ],
        accountType: [
          //账户类型
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        bankBelong: [
          //银行所在地
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        currency: [
          //币种
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        accountProp: [
          //        : "", //账户属性
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        accountBelongOrgName: [
          //账户所属区域
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        cashierName: [
          //出纳
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        payOutStatus: [
          //付款银企直连
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        payProp: [
          //收付属性
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        accountStatus: [
          //账户状态
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        isTaxDeductionAccount: [
          //扣税户
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        openAccountTime: [
          //开户日期
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
      },
      selectOptions: {
        openAccountType: [],
        accountType: [],
        currency: [],
        accountProp: [],
        onlineBankReconcileType: [],
        bankBelong: [],
        payProp: [],
        accountStatus: [],
      },
      isAdd: true
    };
  },
  computed: {
    //判断状态
    disableStatus ({ type }) {
      return text => {
        if (type === "add") {
          return false;
        } else if (type == "edit") {
          return readonlyFiled[text] ? readonlyFiled[text] : false;
        } else if (type == "detail") {
          return true;
        }
      };
    },
  },
  created () {
    this.isAdd = Object.toQueryString('formAction') == "add"
    this.formDetail();
    this.getDataDictByConfigType();
  },
  methods: {
    async validatorBankArchive (rule, value, callbacak) {
      let fn = await checkBankArchive({ bankAccountNo: value, id: this.dataForm.id })
      let message = "银行账号已存在！"
      if (!fn.message) return callbacak()
      try { message = JSON.parse(fn.message).message } catch (error) { }
      return callbacak(new Error(message));
    },
    //核算财务组织
    selectDialogfinanceOrg (data) {
      this.dataForm.financeOrgName = data[0].text;
      this.dataForm.financeOrgId = data[0].value;
    },
    //项目编号
    selectDialogConstructArchive (data) {
      this.dataForm.constructArchiveMainId = data[0].id;
      this.dataForm.constructArchiveCode = data[0].code;
      this.dataForm.constructArchiveName = data[0].name;
    },
    //开户银行
    selectDialogBankName (data) {
      this.dataForm.bankBranchName = data[0].name;
      this.dataForm.bankBranchId = data[0].id;
      this.dataForm.bankTypeName = data[0].bank_type;
      this.dataForm.bankTypeId = data[0].bank_type_id;
    },
    //出纳
    selectDialogCashier (data) {
      this.dataForm.cashierName = data[0].realName;
      this.dataForm.cashierId = data[0].userId;
    },
    //账户所属区域
    accountBelongUpdateValue (data) {
      this.dataForm.accountBelongOrgName = data[0].text;
      this.dataForm.accountBelongOrgId = data[0].value;
    },
    validateForm () {
      const _this = this;
      _this.$refs["dataForm"].validate(valid => {
        if (valid) {
          _this.saveForm(_this.dataForm);
        }
      });
    },
    async saveForm (dataForm) {
      dataForm.id = !this.isAdd ? this.rowData.id : "";
      let { code } = !this.isAdd ? await updateBankFile(dataForm) : await saveForm(dataForm);
      if (code === 200) {
        this.$message.success(`${!this.isAdd ? "修改" : "新增"}成功`);
        this.$router.go(-1);
      }
    },
    async formDetail () {
      let id = this.rowData.id;
      if (!id) return
      let { data } = await getDetail(id);
      this.dataForm = data;
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType () {
      const optionType = {
        '开户类型': 'openAccountType',
        '账户类型': 'accountType',
        '币种': 'currency',
        '账户属性': 'accountProp',
        '网银对账方式': 'onlineBankReconcileType',
        '银行所在地': 'bankBelong',
        '收付属性': 'payProp',
        '账户状态': 'accountStatus'
      }
      const res = await getDataDictByConfigType({ params: { configTypes: '开户类型,账户类型,币种,账户属性,网银对账方式,银行所在地,收付属性,账户状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          if (optionType[ele.dataDictType]) {
            this.selectOptions[optionType[ele.dataDictType]] = ele.dataDict;
          }
        });

      }
    },
    changeOptions (type, val) {
      console.log(type, val)
      this.dataForm[type] = val
    }
  }
};
</script>
<style lang="scss" scoped>
@import url('../../style/form.scss');
.bank-files-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .mylink {
    background: #006EFF;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
  }
}
</style>
