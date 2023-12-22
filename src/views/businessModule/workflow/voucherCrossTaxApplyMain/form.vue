<template>
  <!-- 跨区涉税报告开具申请表单 -->
  <div class="bank-files-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="contractCode" label="收入合同编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.contractCode"
              @updateValue="selectDialogContractCode" :modelData="contractModelData"
              dynamicModel="customDialog"></select-dialog>
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
      <row-layout :cols="3" title="申请信息" marginStyle="margin: 16px 16px 0 16px">
        <template slot="col_1">
          <el-form-item prop="theApplyAmount" label="本次开证金额(元)：">
            <el-input v-model="dataForm.theApplyAmount" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="contactPersonCrossTaxRelated" label="联系人：">
            <el-input v-model="dataForm.contactPersonCrossTaxRelated" size="small"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="isNullifyReopen" label="是否作废重开：">
            <el-radio-group v-model="dataForm.isNullifyReopen">
              <el-radio :label="item.label" :key="item.label" v-for="item in radioOptions">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="stampTaxPaymentAmount" label="印花税缴纳金额(元)：">
            <el-input v-model="dataForm.stampTaxPaymentAmount" size="small" />
          </el-form-item>
          <el-form-item prop="validityPeriodDay" label="上笔税跨报状态：">
            <el-input v-model="dataForm.validityPeriodDay" size="small" placeholder="系统带出" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="invoiceOpenAmountTax" label="已开票金额(含税/元)：">
            <el-input v-model="dataForm.invoiceOpenAmountTax" disabled size="small" placeholder="系统计算" />
          </el-form-item>
          <el-form-item prop="contactInformation" label="联系方式：">
            <el-input v-model="dataForm.contactInformation" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="invalidatedCrossTaxReportCode" label="作废税跨报号：">
            <select-dialog :width="600" :height="360" :value="dataForm.invalidatedCrossTaxReportCode"
              @updateValue="selectDialogInvalidatedCross" :modelData="invalidatedCrossModelData"
              dynamicModel="customDialog" :btnDisabled="['0'].includes(dataForm.isNullifyReopen)"></select-dialog>
          </el-form-item>
          <el-form-item prop="periodsNumber" label="开具期数：">
            <el-input v-model="dataForm.periodsNumber" disabled size="small" placeholder="系统计算" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="taxUnitName" label="纳税单位：">
            <select-dialog :width="600" :height="360" :value="dataForm.taxUnitName"
              @updateValue="selectDialogApplicantOrgName" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
          <el-form-item prop="crossReportState" label="税跨报状态：">
            <el-select v-model="dataForm.crossReportState" disabled>
              <el-option v-for="item in crossReportStateOptions" :key="item.configId" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="stampTaxMethodPayment" label="印花税缴纳方式：">
            <el-select v-model="dataForm.stampTaxMethodPayment">
              <el-option v-for="item in stampTaxMethodPaymentOptions" :key="item.configId" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="preCrossReportCode" label="上笔税跨报号：">
            <el-input v-model.number="dataForm.preCrossReportCode" size="small" placeholder="系统带出"></el-input>
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
import service from '@/utils/services';
export default {
  name: "voucherCrossTaxApplyMain",
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
      dataForm: {
        address: "", //项目详细地址
        code: "", //单据编号
        constructArchiveMainId: "", //项目id
        constructCode: "", //项目编号
        constructName: "", //项目名称
        constructManager: "", //项目负责人
        constructionAmountTotalTax: "", //施工总金额(含税)
        contactInformation: "", //联系方式
        contactPersonCrossTaxRelated: "", //联系人
        contractCode: "", //收入合同编号
        contractInMainId: "", //收入合同id
        contractName: "", //收入合同名称
        crossReportState: "4", //税跨报状态
        customerA: "", //甲方
        deptId: "", //部门id
        deptName: "", //部门
        fileInfoList: [], //附件
        invalidatedCrossTaxReportCode: "", //作废税跨报号
        invalidatedCrossTaxReportId: "", //作废税跨报号id
        invoiceOpenAmountTax: "", //已开票金额(含税)(元)
        isNullifyReopen: "0", //是否作废重开
        managerDeptName: "", //管理部门
        memo: "", //备注
        periodsNumber: "", //开具期数
        preCrossReportCode: "", //上笔税跨报号
        preCrossReportState: "", //上笔税跨报状态
        projectAddress: "", //项目地址
        socialUnifiedCreditCode: "", //统一社会信用代码
        stampTaxMethodPayment: "", //印花税缴纳方式
        stampTaxPaymentAmount: "", //印花税缴纳金额(元)
        taxAcross: "", //税跨报号
        taxUnitId: "", //纳税单位id
        taxUnitName: "", //纳税单位
        theApplyAmount: "", //本次开证金额
        voucherCrossTaxReportMainId: "", //税跨报号id
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入

      contractModelData: { code: 'ShouRuLeiHeTongKuaQuSheShuiKaiJu', parm: { varParams: [{ key: 'constructArchiveMainId', value: '' }] } }, //收入类合同（跨区涉税开具）
      radioOptions: RADIO3_GROUP,
      contractInProjectModelData: { code: 'vconstructarchivemainvoucher', parm: { data: [], singleSelect: true } }, //项目档案（跨区涉税开具申请）
      invalidatedCrossModelData: { code: 'KuaQuSheShuiKaiJuBaoFeiShuiHao', parm: { varParams: [{ key: 'crossReportState', value: '3' }] } }, //跨税报号（通用）作废
      dataRule: RuleRequired.dataRule(['contractCode', 'constructCode', 'theApplyAmount', 'contactPersonCrossTaxRelated',
        'contactInformation', 'isNullifyReopen', 'taxUnitName', 'stampTaxMethodPayment', 'fileInfoList']),
      stampTaxMethodPaymentOptions: [],
      crossReportStateOptions: [],
    };
  },
  computed: {
  },
  created () {
    this.getDataDictByConfigType();
    this.dataRule.theApplyAmount = RuleRequired.curCustomRule(true, this.validateNumber);
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
    //项目编号
    selectConstructCode (data) {
      let { constructName, constructCode, constructArchiveMainId, constructManagerName, managerDeptName, address, projectAddress, constructionAmountTotalTax } = data[0]
      this.dataForm.constructName = constructName;//项目名称
      this.dataForm.constructCode = constructCode;//项目编号
      this.dataForm.constructArchiveMainId = constructArchiveMainId;//项目id
      this.dataForm.constructManager = constructManagerName;//项目负责人
      this.dataForm.managerDeptName = managerDeptName;//管理部门
      this.dataForm.address = address;
      this.dataForm.projectAddress = projectAddress;
      this.dataForm.constructionAmountTotalTax = constructionAmountTotalTax;
      this.contractModelData.parm.varParams[0].value = constructArchiveMainId;//项目id
      this.getContractInfo(constructArchiveMainId)
    },
    //收入合同编号
    selectDialogContractCode (data) {
      this.dataForm.contractCode = data[0].code;//收入合同编号
      this.dataForm.contractName = data[0].contract;//收入合同名称
      this.dataForm.contractInMainId = data[0].contractInMainId;//收入合同id
      this.dataForm.customerA = data[0].customerName;//甲方
      this.dataForm.socialUnifiedCreditCode = data[0].taxRegistrationNum; //统一社会信用代码
    },
    //作废税跨报号
    selectDialogInvalidatedCross (data) {
      this.dataForm.invalidatedCrossTaxReportCode = data[0].taxAcross;//作废税跨报号
      this.dataForm.invalidatedCrossTaxReportId = data[0].voucherCrossTaxReportMainId;//作废税跨报号id
      this.dataForm.preCrossReportCode = data[0].preCrossReportState;//上笔税跨报号
      this.dataForm.preCrossReportState = data[0].preCrossReportState;//上笔税跨报状态

      if (data[0].periodsNumber) this.dataForm.periodsNumber = data[0].periodsNumber;//开具期数
    },
    //纳税单位
    selectDialogApplicantOrgName (data) {
      this.dataForm.taxUnitName = data[0].text;
      this.dataForm.taxUnitId = data[0].value;
    },
    //查询收入合同
    getContractInfo (constructArchiveMainId) {
      service.get(`/voucher/voucherCrossTaxApplyMain/getContractInfo/${constructArchiveMainId}`, { action: '查询产品线' }).then(res => {
        let data = res.data && res.data.length === 1 ? res.data[0] : {}
        this.dataForm.contractCode = data.code || "";//收入合同编号
        this.dataForm.contractName = data.contract || "";//收入合同名称
        this.dataForm.contractInMainId = data.constructArchiveMainId || "";//收入合同id
        this.dataForm.customerA = data.customerName || "";//甲方
        this.dataForm.socialUnifiedCreditCode = data.taxRegistrationNum || ""; //统一社会信用代码
      })
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
      const res = await getDataDictByConfigType({ params: { configTypes: '印花税缴纳方式,税跨报状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '印花税缴纳方式':
              this.stampTaxMethodPaymentOptions = ele.dataDict;
              break;
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
</style>
