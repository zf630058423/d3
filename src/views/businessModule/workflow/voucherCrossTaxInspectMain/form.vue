<template>
  <!-- 跨区涉税报告报验表单 -->
  <div class="bank-files-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="contractCode" label="收入合同编号：">
            <el-input v-model="dataForm.contractCode" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="customerA" label="甲方：">
            <el-input v-model="dataForm.customerA" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="constructManager" label="项目负责人：">
            <el-input v-model="dataForm.constructManager" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructCode" @updateValue="selectConstructCode"
              :isLinkBtn="true" :modelData="contractInProjectModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="contractName" label="收入合同名称：">
            <el-input v-model="dataForm.contractName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="socialUnifiedCreditCode" label="统一社会信用代码：">
            <el-input v-model="dataForm.socialUnifiedCreditCode" disabled size="small"
              :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="projectAddress" label="项目地址：">
            <el-input v-model="dataForm.projectAddress" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructName" label="项目名称：">
            <el-input v-model="dataForm.constructName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="constructionAmountTotalTax" label="施工总金额(含税/元)：">
            <el-input v-model="dataForm.constructionAmountTotalTax" disabled size="small"
              :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="managerDeptName" label="管理部门：">
            <el-input v-model="dataForm.managerDeptName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="address" label="详细地址：">
            <el-input v-model="dataForm.address" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="报验信息" marginStyle="margin: 16px 16px 0 16px">
        <template slot="col_1">
          <el-form-item prop="taxAcross" label="税跨报号：">
            <select-dialog :value="dataForm.taxAcross" @updateValue="voucherCrossMainCode"
              :modelData="voucherCrossModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="releaseDate" label="发证日期：">
            <el-date-picker v-model="dataForm.releaseDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" disabled></el-date-picker>
          </el-form-item>
          <el-form-item prop="inspectionDate" label="报验日期：">
            <el-date-picker v-model="dataForm.inspectionDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="taxBureauName" label="纳税税务局：">
            <select-dialog :value="dataForm.taxBureauName" @updateValue="upDateTaxPaymentTaxBureauId"
              :modelData="taxPaymentTaxBureauIdModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="theApplyAmount" label="本次开证金额(元)：">
            <el-input v-model="dataForm.theApplyAmount" size="small" disabled :placeholder="pleaseEnterPlaceHolder" disabled=""/>
          </el-form-item>
          <el-form-item prop="effectiveStartDate" label="有效开始日期：">
            <el-date-picker v-model="dataForm.effectiveStartDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" disabled></el-date-picker>
          </el-form-item>
          <el-form-item prop="inspectionPersonName" label="报验登记人：">
            <select-dialog :value="dataForm.inspectionPersonName" @updateValue="upDateInspectionPersonId"
              :modelData="{
          singleSelect: true,
          resultFieldKey: '',
          data: []
        }" dynamicModel="selectUsers"></select-dialog>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="crossReportState" label="税跨报状态：">
            <el-select v-model="dataForm.crossReportState" disabled>
              <el-option v-for="item in crossReportStateOptions" :key="item.configId" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="latestExpiryDate" label="最新有效截止日期：">
            <el-date-picker v-model="dataForm.latestExpiryDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" disabled></el-date-picker>
          </el-form-item>
          <el-form-item prop="incomeDetailedDeclaration" label="个税全额全员明细申报：">
           <!--  :disabled="!dataRule.incomeDetailedDeclaration[0].required" -->
            <el-radio-group v-model="dataForm.incomeDetailedDeclaration"
             :disabled='isDisabled'
              >
              <el-radio :label="item.label" :key="item.label" v-for="item in radioOptions">{{ item.name }}</el-radio>
            </el-radio-group>
            <!-- 链接 -->
            <el-button size="small" type="text" class="link_text"
              v-show="dataForm.incomeDetailedDeclaration == '1'">新增【个人所得税全额全员明细申报】</el-button>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" marginStyle="margin: 0 16px 16px 16px">
        <template slot="col_1">
          <el-form-item prop="memo" label="备注：">
            <el-input v-model="dataForm.memo" type="textarea" :rows="3" :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" :title="'附件'">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <template slot="col_1">
          <el-form-item prop="createUserName" label="编制人：">
            <label class="label-style">{{ dataForm.createUserName }}</label>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="deptName" label="编制人部门：">
            <label class="label-style">{{ dataForm.deptName }}</label>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="createTime" label="编制时间：">
            <label class="label-style">{{ dataForm.createTime }}</label>
          </el-form-item>
        </template>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import comMixin from "../minix";
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import { RADIO3_GROUP } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';

export default {
  name: "voucherCrossTaxInspectMain",
  components: {
    RowLayout,
    updateFiles,
    SelectDialog,
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => { }
    }
  },
  mixins: [comMixin],
  data () {
    return {
      isDisabled: true,
      dataForm: {
        address: "", //项目详细地址
        applicationCode: "", //申请单号
        applicationId: "", //申请单号id
        code: "", //单据编号
        constructArchiveMainId: "", //项目id
        constructCode: "", //项目编号
        constructName: "", //项目名称
        constructManager: "", //项目负责人
        constructionAmountTotalTax: "", //施工总金额(含税)
        contactInformation: "", //联系方式
        contactPersonRrossTaxRelated: "", //联系人
        contractCode: "", //收入合同编号
        contractInMainId: "", //收入合同id
        contractName: "", //收入合同名称
        crossReportState: "1", //税跨报状态
        customerA: "", //甲方
        deptId: "", //部门id
        deptName: "", //部门
        fileInfoList: [], //附件
        invoiceOpenAmountTax: "", //已开票金额(含税)(元)
        inspectionDate: "", //报验日期
        releaseDate: "", //发证日期
        effectiveStartDate: "", //有效开始日期
        effectiveEndDate: "", //有效截止日期
        latestExpiryDate: "", //最新有效截止日期
        inspectionPersonName: "", //	报验登记人
        inspectionPersonId: "", //	报验登记人id
        incomeDetailedDeclaration: "", //个税全额全员明细申报
        managerDeptName: "", //管理部门
        memo: "", //备注
        projectAddress: "", //项目地址
        socialUnifiedCreditCode: "", //统一社会信用代码
        taxAcross: "", //税跨报号
        theApplyAmount: "", //本次开证金额
        voucherCrossTaxReportMainId: "", //税跨报号id
        taxBureauName: "", //税跨报号
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
        taxPaymentTaxBureauId:'', //税务局
      },
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入
      radioOptions: RADIO3_GROUP,
      voucherCrossModelData: { code: 'KuaShuiBaoHaoTongYong', parm: { varParams: [{ key: 'crossReportState', value: '6' }, { key: 'constructArchiveMainId', value: '' }] } }, //跨税报号（通用）已办理
      taxPaymentTaxBureauIdModelData: { code: 'ShuiWuDangAn', parm: { varParams: [] } }, //纳税税务局
      contractInProjectModelData: { code: 'vconstructarchivemainvoucher', parm: { data: [], singleSelect: true } }, //项目档案（跨区涉税开具申请）
      dataRule: RuleRequired.dataRule(['constructCode', 'contactPersonRrossTaxRelated', 'incomeDetailedDeclaration',
        'contactInformation', 'isNullifyReopen', 'taxUnitName', 'stampTaxMethodPayment', 'fileInfoList','taxAcross','inspectionDate','taxBureauName','inspectionPersonName']),
      crossReportStateOptions: [],
    };
  },
  computed: {
  },
  created () {
    this.getDataDictByConfigType()
    //this.dataRule.theApplyAmount = RuleRequired.curCustomRule(true, this.validateNumber);
  },
  methods: {
    //校验数字
    validateNumber (rule, value, callback) {
      //constructionAmountTotalTax invoiceOpenAmountTax
      if (!value) return callback(new Error("请输入必填项"))
      const pattern = /(^\d*$)|(^[0-9]*\.\d{1,2}$)/
      if (!pattern.test(value)) {
        return callback(new Error("请输入数字,保留两位小数"))
      }
      let difference = Number(this.dataForm.constructionAmountTotalTax || 0) - Number(this.dataForm.invoiceOpenAmountTax || 0)
      if (value > difference) {
        return callback(new Error(`本次开证金额(${value})需小于等于 施工总金额 - 已开票金额】(${difference})`))
      }
      callback()
    },
    afterInit () {
      this.voucherCrossModelData.parm.varParams[1].value = this.dataForm.constructArchiveMainId
      this.dataRule.incomeDetailedDeclaration = RuleRequired.requiredFiledRule(this.dataForm.incomeDetailedDeclaration !== '1');
    },
    //项目编号
    selectConstructCode (data) {
      let { constructName, constructCode, constructArchiveMainId, constructManagerName, managerDeptName, address, projectAddress } = data[0]
      this.dataForm.constructName = constructName;//项目名称
      this.dataForm.constructCode = constructCode;//项目编号
      this.dataForm.constructArchiveMainId = constructArchiveMainId;//项目id
      this.dataForm.constructManager = constructManagerName;//项目负责人
      this.dataForm.managerDeptName = managerDeptName;//管理部门
      this.dataForm.address = address;
      this.dataForm.projectAddress = projectAddress;
      this.voucherCrossModelData.parm.varParams[1].value = constructArchiveMainId
    },
    //税跨报号
    voucherCrossMainCode (data) {
      this.dataForm.taxAcross = data[0].taxAcross;//税跨报号
      this.dataForm.applicationId = data[0].voucherCrossTaxReportMainId;//税跨报号单id
      this.dataForm.voucherCrossTaxReportMainId = data[0].voucherCrossTaxReportMainId;//税跨报号单id
      this.dataForm.contractCode = data[0].contractCode;//收入合同编号
      this.dataForm.contractName = data[0].contract;//收入合同名称
      this.dataForm.contractInMainId = data[0].contractInMainId;//收入合同id
      this.dataForm.customerA = data[0].customerName;//甲方
      this.dataForm.socialUnifiedCreditCode = data[0].taxRegistrationNum; //统一社会信用代码
      this.dataForm.constructionAmountTotalTax = data[0].constructionAmountTotalTax; //施工总金额
      this.dataForm.effectiveStartDate = data[0].effectiveStartDate; //有效开始日期
      this.dataForm.releaseDate = data[0].releaseDate; //发证日期
      this.dataForm.theApplyAmount = data[0].theApplyAmount; //本次开证金额
    },
    //税务局
    upDateTaxPaymentTaxBureauId(data){
      this.dataForm.taxBureauName = data[0].taxBureauName; //
      this.dataForm.taxPaymentTaxBureauId = data[0].id; //
      this.dataForm.incomeDetailedDeclaration = data[0].incomeTaxDeclaration; //
      // 默认根据 所选 纳税税务局 所选【税务局档案】 个税申报 字段 自动带出，当自动带出=是，则不允许修改，否则编制人可编辑，必填
      if(data[0].incomeTaxDeclaration != '1'){
        this.isDisabled = false
      }else{
        this.isDisabled = true
      }
    },
    upDateInspectionPersonId(data){
        const {realName, userId, mobile} = data[0];
        this.dataForm.inspectionPersonName = realName;
        this.dataForm.inspectionPersonId = userId;
        //this.dataForm.projectManagerTel = mobile;
    },
    async validateForm () {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            resolve(_this.dataForm)
          } else {
            resolve(false)
          }
        })
      });
    },
    /**
    * 初始化字典
    */
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '税跨报状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '税跨报状态':
              this.crossReportStateOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });

      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import url('../../style/form.scss');

.bank-files-form {
  .el-form-item {
    margin-bottom: 16px;
  }
}

.link_text {
  padding: 0;
  font-size: 14px;
  text-decoration: underline;
}
</style>
