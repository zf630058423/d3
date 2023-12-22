<template>
  <!-- 建安合同表单 -->
  <div class="form-box">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="140px"
      :disabled="setting.readonly"
    >
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="contractCode" label="合同编号：">
            <el-input v-model="dataForm.contractCode" disabled size="small" />
          </el-form-item>
          <el-form-item prop="managerDeptName" label="管理部门：">
            <el-input
              v-model="dataForm.managerDeptName"
              disabled
              size="small"
            />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructCode" label="项目编号：">
            <select-dialog
              :width="800"
              :height="360"
              :value="dataForm.constructCode"
              :isLinkBtn="true"
              @updateValue="selectDialoContractInProject"
              :modelData="contractInProjectModelData"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="constructManager" label="项目负责人：">
            <el-input
              v-model="dataForm.constructManager"
              disabled
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructName" label="项目名称：">
            <el-input
              v-model="dataForm.constructName"
              disabled
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="合同信息">
        <template slot="col_1">
          <el-form-item prop="contract" label="合同名称：">
            <el-input
              v-model="dataForm.contract"
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="contractTypeId" label="合同类型：">
            <el-checkbox-group
              v-model="dataForm.contractTypeId"
              @change="checkContractType"
            >
              <template v-for="item in checkboxArray">
                <el-checkbox
                  v-if="item.isEnable"
                  :label="item.configValue"
                  :key="item.configId"
                >
                  {{ item.configName }}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="customerA" label="甲方：">
            <select-dialog
              :disabled="true"
              :width="800"
              :model-data="customerConfig"
              :height="360"
              :value="dataForm.customerA"
              @updateValue="val => selectDialogCustomer('A', val)"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="customerB" label="甲方(二)：">
            <select-dialog
              :disabled="true"
              :width="800"
              :model-data="customerConfig"
              :height="360"
              :value="dataForm.customerB"
              @updateValue="val => selectDialogCustomer('B', val)"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="provisionalSums" label="暂列金：">
            <!-- <el-input v-model.number="dataForm.provisionalSums" size="small" :placeholder="pleaseEnterPlaceHolder" /> -->
            <amount-input v-model="dataForm.provisionalSums"></amount-input>
          </el-form-item>
          <el-form-item prop="constructionAmountTax" label="施工金额(含税)：">
            <!-- <el-input v-model="dataForm.constructionAmountTax" size="small" :placeholder="pleaseEnterPlaceHolder"
              /> -->
            <amount-input
              v-model="dataForm.constructionAmountTax"
              @change="computeTaxRate('constructionAmountTax')"
            ></amount-input>
          </el-form-item>
          <el-form-item prop="designAmountTax" label="设计金额(含税)：">
            <!-- <el-input v-model="dataForm.designAmountTax" size="small" :placeholder="pleaseEnterPlaceHolder"
              @change="computeTaxRate('designAmountTax')" /> -->

            <amount-input
              v-model="dataForm.designAmountTax"
              @change="computeTaxRate('designAmountTax')"
            ></amount-input>
          </el-form-item>
          <el-form-item prop="saleAmountTax" label="销售金额(含税)：">
            <!--  <el-input v-model="dataForm.saleAmountTax" size="small" :placeholder="pleaseEnterPlaceHolder"
              @change="computeTaxRate('saleAmountTax')" /> -->
            <amount-input
              v-model="dataForm.saleAmountTax"
              @change="computeTaxRate('saleAmountTax')"
            ></amount-input>
          </el-form-item>
          <el-form-item prop="norigsignmnyTax" label="合同金额(含税)：">
            <!-- <el-input v-model="dataForm.norigsignmnyTax" size="small" disabled :placeholder="computedPlaceHolder" /> -->
            <amount-input
              v-model="dataForm.norigsignmnyTax"
              disabled
            ></amount-input>
          </el-form-item>
          <el-form-item prop="constructAddress" label="项目地址：">
            <casc-select
              code="addressCascade"
              :defaultValue="dataForm.constructAddress"
              @change-select="changeAdressSelect"
            ></casc-select>
          </el-form-item>
          <el-form-item prop="quality" label="质量验收标准：">
            <el-input
              v-model="dataForm.quality"
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="accountName" label="账户名称：">
            <el-input
              v-model="dataForm.accountName"
              size="small"
              disabled
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="contractAmount" label="合同总金额(无税)：">
            <!-- <el-input v-model="dataForm.contractAmount" size="small" disabled :placeholder="computedPlaceHolder" /> -->
            <amount-input v-model="contractAmount" disabled></amount-input>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="schemeCode" label="项目协议编号：">
            <el-input
              v-model="dataForm.schemeCode"
              size="small"
              disabled
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="copy" label="合同份数：">
            <el-input
              v-model="dataForm.copy"
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="supplierName" label="乙方：">
            <select-dialog
              :width="600"
              :height="360"
              :value="dataForm.supplierName"
              @updateValue="selectDialogSupplierMainName"
              dynamicModel="selectOrg"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="customerC" label="甲方(三)：">
            <select-dialog
              :disabled="true"
              :width="800"
              :model-data="customerConfig"
              :height="360"
              :value="dataForm.customerC"
              @updateValue="val => selectDialogCustomer('C', val)"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="warrantyPeriod" label="质保期(年)：">
            <el-input
              v-model.number="dataForm.warrantyPeriod"
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="constructionRate" label="施工税率：">
            <select-dialog
              :width="800"
              :height="360"
              :value="dataForm.constructionRateName"
              @updateValue="val => updateTaxRateValue('constructionRate', val)"
              :modelData="taxRateDialog"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="designTaxRate" label="设计税率：">
            <select-dialog
              :width="800"
              :height="360"
              :value="dataForm.designTaxRateName"
              @updateValue="val => updateTaxRateValue('designTaxRate', val)"
              :modelData="taxRateDialog"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="saleTaxRate" label="销售税率：">
            <select-dialog
              :width="800"
              :height="360"
              :value="dataForm.saleTaxRateName"
              @updateValue="val => updateTaxRateValue('saleTaxRate', val)"
              :modelData="taxRateDialog"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="norigsignmny" label="合同金额(无税)：">
            <amount-input
              v-model.number="dataForm.norigsignmny"
              size="small"
              disabled
              :placeholder="computedPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="address" label="详细地址：">
            <el-input
              v-model="dataForm.address"
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="applyVisaLicence" label="需办理施工许可证：">
            <el-radio-group v-model="dataForm.applyVisaLicence">
              <el-radio
                :label="item.label"
                :key="item.name"
                v-for="item in radioData"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="bankName" label="开户银行：">
            <el-input
              v-model="dataForm.bankName"
              disabled
              size="small"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
          <el-form-item
            prop="totalChangeAmountTax"
            label="累计变更金额(含税)："
          >
            <amount-input
              v-model="dataForm.totalChangeAmountTax"
              disabled
              :placeholder="pleaseEnterPlaceHolder"
            ></amount-input>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="scheme" label="项目协议名称：">
            <el-input v-model="dataForm.scheme" size="small" disabled />
          </el-form-item>
          <el-form-item prop="contractSignDate" label="合同签订日期：">
            <el-date-picker
              v-model="dataForm.contractSignDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="contStartDate" label="合同开工日期：">
            <el-date-picker
              v-model="dataForm.contStartDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期时间"
              @change="changeTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="contEndDate" label="合同竣工日期：">
            <el-date-picker
              v-model="dataForm.contEndDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期时间"
              @change="changeTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="duration" label="工期(天)：">
            <el-input v-model="dataForm.duration" size="small" disabled />
          </el-form-item>
          <el-form-item prop="constructionAmount" label="施工金额(无税)：">
            <amount-input
              v-model.number="dataForm.constructionAmount"
              size="small"
              disabled
              :placeholder="computedPlaceHolder"
            />
          </el-form-item>
          <el-form-item prop="designAmount" label="设计金额(无税)：">
            <amount-input
              v-model="dataForm.designAmount"
              disabled
              @change="computeTaxRate2('designAmount')"
              :placeholder="computedPlaceHolder"
            ></amount-input>
          </el-form-item>
          <el-form-item prop="saleAmount" label="销售金额(无税)：">
            <amount-input
              v-model.number="dataForm.saleAmount"
              size="small"
              disabled
              :placeholder="computedPlaceHolder"
            />
          </el-form-item>
          <el-form-item
            :prop="`${false ? 'isBaseLine' : ''}`"
            label="是否触碰营销底线："
          >
            <el-radio-group v-model="dataForm.isBaseLine">
              <el-radio
                :label="item.label"
                :key="item.name"
                v-for="item in radioData"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="isTheContractArchived" label="合同是否归档：">
            <el-radio-group v-model="dataForm.isTheContractArchived" disabled>
              <el-radio
                :label="item.label"
                :key="item.name"
                v-for="item in radioData"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="accountNo" label="收款账号：">
            <select-dialog
              :disabled="true"
              :btnDisabled="!isZhuanYuanApprove"
              :width="800"
              :model-data="payeebankModelData"
              :height="360"
              :value="dataForm.accountNo"
              @updateValue="accountnoUpdateValue"
              dynamicModel="customDialog"
            ></select-dialog>
          </el-form-item>
          <el-form-item prop="contractAmountTax" label="合同总金额(含税)：">
            <amount-input
              v-model="contractAmountTax"
              disabled
              :placeholder="computedPlaceHolder"
            ></amount-input>
          </el-form-item>
          <el-form-item prop="totalChangeAmount" label="累计变更金额(无税)：">
            <amount-input
              v-model="dataForm.totalChangeAmount"
              disabled
              :placeholder="computedPlaceHolder"
            ></amount-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="memo" label="备注：">
            <el-input
              v-model="dataForm.memo"
              type="textarea"
              :rows="3"
              :placeholder="pleaseEnterPlaceHolder"
            />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="收款方式">
        <!-- 收款方式 -->
        <el-form-item slot="col_1" label-width="0">
          <payinFromTab
            v-model="dataForm.payinDetailList"
            ref="payinFromData"
            :advPayment="dataForm.advPayment"
            :comPayment="dataForm.comPayment"
            :disabled="setting.readonly"
            :settlementDict="settlementDict"
          >
          </payinFromTab>

        </el-form-item>
      </row-layout>
      <row-layout :cols="3" title="收款条款">
        <template slot="col_1">
          <el-form-item prop="advPayment" label="预收款：">
            <!-- <el-input v-model="dataForm.advPayment" size="small" @focus="focusInput('advPayment')"
              :placeholder="pleaseEnterNumPlaceHolder" /> -->
            <percentage-input
              v-model="dataForm.advPayment"
              clearable
            ></percentage-input>
          </el-form-item>
          <el-form-item prop="settlement" label="结算款：">
            <!-- <el-input v-model="dataForm.settlement" size="small" @focus="focusInput('settlement')"
              :placeholder="pleaseEnterNumPlaceHolder" /> -->
            <percentage-input
              v-model="dataForm.settlement"
              clearable
            ></percentage-input>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="proPayment" label="进度款：">
            <!--  <el-input v-model="dataForm.proPayment" size="small" @focus="focusInput('proPayment')"
              :placeholder="pleaseEnterNumPlaceHolder" /> -->
            <percentage-input
              v-model="dataForm.proPayment"
              clearable
            ></percentage-input>
          </el-form-item>
          <el-form-item prop="retMoney" label="质保金：">
            <!-- <el-input v-model="dataForm.retMoney" size="small" @focus="focusInput('retMoney')"
              :placeholder="pleaseEnterNumPlaceHolder" /> -->
            <percentage-input
              v-model="dataForm.retMoney"
              clearable
            ></percentage-input>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="comPayment" label="完工款：">
            <!-- <el-input v-model="dataForm.comPayment" size="small" @focus="focusInput('comPayment')"
              :placeholder="pleaseEnterNumPlaceHolder" /> -->
            <percentage-input
              v-model="dataForm.comPayment"
              clearable
            ></percentage-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="进度款-按节点收款">
        <el-form-item slot="col_1" label-width="0">
          <progressFromTab
            v-model="dataForm.progressDetailList"
            :disabled="setting.readonly"
            :advPayment="dataForm.advPayment"
            :comPayment="dataForm.comPayment"
            :proPayment="dataForm.proPayment"
            ref="progressFromData"
          />
        </el-form-item>
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
import moment from "moment";
import comMixin from "../minix";
import FormTitle from "@/components/basic/formTitle/index.vue";
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from "@/components/basic/uploaderFile/index.vue";
import progressFromTab from "./components/progressFromTab.vue";
import payinFromTab from "./components/payinFromTab.vue";
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import CascSelect from "@/components/basic/cascSelect/index.vue";
import RuleRequired from "@/views/businessModule/enum/requiredMsg";
import {
  MARKETMAIN_MODEL,
  CUSTOMER_MODEL,
  CONTRACT_IN_PROJECT_EXTEND,
  PAYEEBANK_MODEL,
  RADIO3_GROUP
} from "@/views/businessModule/enum/param";
import {
  getDataDictByConfigType,
  getSocialUnifiedCreditCode
} from "@/Api/dataDict.js";
import percentageInput from "@/components/basic/numberInput/percentageInput.vue";
import amountInput from "@/components/basic/numberInput/amountInput.vue";
export default {
  name: "baseBankArchiveMainListForm",
  components: {
    FormTitle,
    RowLayout,
    updateFiles,
    progressFromTab,
    payinFromTab,
    SelectDialog,
    CascSelect,
    percentageInput,
    amountInput
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [comMixin],
  data() {
    return {
      dataForm: {
        accountName: "", //账户名称
        accountNo: "", //收款账号
        advPayment: "", //预收款
        applyVisaLicence: "", //办理施工许可证
        balaTypeId: "", //结算方式
        bankName: "", //开户银行
        code: "", //单据编号
        comPayment: "", //完工款
        constructArchiveMainId: "", //项目id
        constructionAmount: "", //施工金额(无税)
        constructionAmountTax: "", //施工金额(含税)
        constructionRate: "", //	施工税率
        constructionRateId: "", //	施工税率
        constructionRateName: "", //	施工税率
        constructManager: "", //项目负责人
        contEndDate: "", //合同竣工日期
        contStartDate: "", //	合同开工日期
        contract: "", //合同名称
        contractCode: "", //合同编号
        constructName: "", //项目名称
        constructCode: "", //项目编号
        contractAmount: "", //合同总金额(无税)
        contractAmountTax: "", //合同总金额(含税)
        contractTypeId: [], //合同类型Id
        copy: "", //合同份数
        projectAgreementId: "", //
        customerA: "", //甲方
        customerAId: "", //甲方
        customerB: "", //甲方(二)
        customerBId: "", //甲方(二)
        customerC: "", //合同客户(三)
        customerCId: "", //甲方(三)
        customerMainId: "", //客户
        designAmount: "", //设计金额(无税)
        designAmountTax: "", //设计金额(含税)
        designTaxRate: "", //设计税率
        designTaxRateId: "", //设计税率
        designTaxRateName: "", //设计税率
        managerDeptName: "", //管理部门
        duration: "", //工期
        effectiveDate: "", //合同生效日期
        endDate: "", //合同结束日期
        fileInfoList: [], //附件
        isTheContractArchived: "0", //合同是否归档
        isBaseLine: "", //是否触碰营销底限
        marketMainId: "", //营销主键Id
        masterContractId: "", //主合同编号
        memo: "", //备注
        moduleType: "", //模块类型（1-建安合同；2-设计收入合同；3-设计补偿金）
        norigsignmny: "", //合同金额(无税)
        norigsignmnyTax: "", //	合同金额（含税）
        payinDetailList: [
          {
            id: "",
            scale: "", //收款比例
            term: "" //收款方式
          }
        ], //	收款方式
        proPayment: "", //	进度款
        progressDetailList: [
          {
            id: "", //
            contractInMainId: "", //收入类合同主键
            nodeContent: "", //节点内容
            progressPayment: "" //进度款比例
          }
        ], //	进度款-按节点收款
        schemeCode: "", //	协议编号
        scheme: "", //	项目协议名称
        provisionalSums: "", //	暂列金
        quality: "", //	质量验收标准
        retMoney: "", //	质保金
        saleAmount: "", //	销售金额(无税)
        saleAmountTax: "", //	销售金额(含税)
        settlement: "", //	结算款
        saleTaxRate: "", //	销售税率
        saleTaxRateId: "", //	销售税率
        saleTaxRateName: "", //	销售税率
        signDate: "", //	合同签订日期
        stampTaxRate: "", //	印花税税率
        subjCode: "", //	收支项目
        supplierMainId: "", //	乙方
        supplierName: "", //	乙方
        totalChangeAmount: "", //	累计变更金额(无税)
        totalChangeAmountTax: "", //	累计变更金额(含税)
        warrantyPeriod: "", //	质保期
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
        address: "", //详细地址
        constructAddress: "" //项目地址
      },
      pleaseEnterPlaceHolder: "请输入",
      pleaseEnterNumPlaceHolder: "请输入两位小数",
      computedPlaceHolder: "自动计算",
      customerConfig: {
        code: "KeShangDangAn_CP013",
        customDialog: "KeShangDangAn_CP013",
        isSetHead: 1,
        isMulti: false,
        initailData: []
      }, // 客商档案
      marketMainModelData: MARKETMAIN_MODEL,
      contractInProjectModelData: CONTRACT_IN_PROJECT_EXTEND,
      payeebankModelData: PAYEEBANK_MODEL,
      radioData: RADIO3_GROUP,
      taxRateDialog: {
        code: "base_tax_rate_archive",
        customDialog: "base_tax_rate_archive",
        isSetHead: 1,
        isMulti: false,
        initailData: []
      },
      dataRule: RuleRequired.dataRule([
        "constructCode",
        "contract",
        "contractTypeId",
        "copy",
        "signDate",
        "customerA",
        "contEndDate",
        "provisionalSums",
        "warrantyPeriod",
        "applyVisaLicence",
        "constructionRate",
        "constructionAmountTax",
        "designTaxRate",
        "designAmountTax",
        "saleTaxRate",
        "saleAmountTax",
        "quality",
        "address",
        "constructAddress",
        "advPayment",
        "comPayment",
        "settlement",
        "retMoney",
        "contStartDate",
        "fileInfoList",
        "isBaseLine",
        "supplierName"
      ]),
      checkboxArray: [],
      settlementDict: [] //结算方式
    };
  },
  computed: {
    //是否施工
    isConstruction() {
      return this.dataForm.contractTypeId.includes("1");
    },
    //是否审批阶段
    isProcInstCreatorRealName () {
      return  WFContext.WorkflowInstinceState == 2
    },
    /**
     *  只有智链供应链融资主管 可以编辑收款账号 只有智联供应商主管；
     *
     */
    isZhuanYuanApprove() {
      const isRequired = ["融资主管"].find(res => {
        return WFContext.CurrentActivityName.indexOf(res) != -1;
      })
        ? true
        : false;
      this.dataRule["accountNo"] = RuleRequired.curFiledRule(isRequired);
      console.log(WFContext.CurrentActivityName, isRequired);
      return isRequired;
    },
    // 合同总金额无税
    contractAmount() {
      const {
        constructionAmount,
        designAmount,
        saleAmount,
        totalChangeAmount
      } = this.dataForm;
      return (
        constructionAmount -
        0 +
        (designAmount - 0) +
        (saleAmount - 0) +
        (totalChangeAmount - 0)
      );
    },
    // 合同总金额含税
    contractAmountTax() {
      const { norigsignmnyTax, totalChangeAmountTax } = this.dataForm;
      return norigsignmnyTax - 0 + (totalChangeAmountTax - 0);
    }
  },
  created() {
    this.getDataDictByConfigType();
    let numArr = [
      "advPayment",
      "proPayment",
      "comPayment",
      "settlement",
      "retMoney"
    ];
    numArr.forEach(i => {
      this.dataRule[i] = RuleRequired.curCustomRule(
        i != "proPayment",
        this.validateNumber2
      );
    });
    //	暂列金
    this.dataRule.provisionalSums = RuleRequired.curCustomRule(
      true,
      this.validateNumber
    );
    this.dataRule.warrantyPeriod = RuleRequired.curCustomRule(
      true,
      this.validateInt
    );
    this.dataRule.copy = RuleRequired.curCustomRule(true, this.validateInt);
    this.dataRule.constructionAmountTax = RuleRequired.curCustomRule(
      false,
      this.validateNumber3
    );
    this.dataRule.designAmountTax = RuleRequired.curCustomRule(
      false,
      this.validateNumber3
    );
    this.dataRule.saleAmountTax = RuleRequired.curCustomRule(
      false,
      this.validateNumber3
    );
  },
  methods: {
    //校验百分比
    validateNumber2(rule, value, callback) {
      console.log(
        rule.field,
        ["advPayment", "proPayment"].includes(rule.field)
      );
      if (!value)
        return rule.field === "proPayment"
          ? callback()
          : callback(new Error("请输入必填项"));
      const pattern = /(^[0-9]{1,2}$)|(^[0](\.[0-9]{1,2})?$)/;
      let _val = this.toNumber2(value);
      /* if (!pattern.test(_val)) {
        return callback(new Error("请输入大于 0 且小于 1 的两位小数"))
      } */
      if (value > 1 || value < 0) {
        return callback(new Error("请输入0到100的数字"));
      }
      let numArr = [
        "advPayment" /*预收款*/,
        "proPayment" /*进度款*/,
        "comPayment" /*完工款*/,
        "settlement" /*结算款*/,
        "retMoney" /*质保金*/
      ];
      let numObj = {};
      numArr.forEach(code => {
        numObj[code] = this.toNumber2(this.dataForm[code]) || 0;
      });
      if (
        ["advPayment", "proPayment"].includes(rule.field) &&
        numObj.advPayment &&
        numObj.proPayment &&
        numObj.advPayment > numObj.proPayment
      ) {
        return callback(new Error("进度款(%) ≥ 预收款(%)"));
      }
      if (["advPayment", "proPayment"].includes(rule.field)) {
        rule.field == "proPayment"
          ? this.$refs.dataForm.clearValidate("advPayment")
          : this.$refs.dataForm.clearValidate("proPayment");
      }
      if (
        ["comPayment", "proPayment"].includes(rule.field) &&
        numObj.comPayment &&
        numObj.proPayment &&
        numObj.comPayment < numObj.proPayment
      ) {
        return callback(new Error("完工款(%) ≥ 进度款(%)"));
      }
      if (["comPayment", "proPayment"].includes(rule.field)) {
        rule.field == "comPayment"
          ? this.$refs.dataForm.clearValidate("proPayment")
          : this.$refs.dataForm.clearValidate("comPayment");
      }
      if (
        ["comPayment", "settlement"].includes(rule.field) &&
        numObj.settlement &&
        numObj.comPayment &&
        numObj.settlement < numObj.comPayment
      ) {
        return callback(new Error("结算款(%) ≥ 完工款(%)"));
      }
      if (["comPayment", "settlement"].includes(rule.field)) {
        rule.field == "comPayment"
          ? this.$refs.dataForm.clearValidate("settlement")
          : this.$refs.dataForm.clearValidate("comPayment");
      }
      if (
        ["settlement", "retMoney"].includes(rule.field) &&
        numObj.settlement &&
        numObj.retMoney &&
        numObj.retMoney - 0 + (numObj.settlement - 0) != 1
      ) {
        return callback(new Error("结算款(%)+质保金(%)=100(%)"));
      }
      if (["settlement", "retMoney"].includes(rule.field)) {
        rule.field == "settlement"
          ? this.$refs.dataForm.clearValidate("retMoney")
          : this.$refs.dataForm.clearValidate("settlement");
      }
      //this.dataForm[rule.field] =  parseInt(this.toNumber2(_val) * 100)+ '%'
      callback();
    },
    //校验数字
    validateNumber(rule, value, callback) {
      if (!value) return callback(new Error("请输入必填项"));
      const pattern = /(^\d*$)|(^[0-9]*\.\d{1,100}$)/;
      if (!pattern.test(value)) {
        return callback(new Error("请输入数字"));
      }
      callback();
    },
    //校验两位小数
    validateNumber3(rule, value, callback) {
      if (!value) return callback();
      let pattern = /^[\d]+(\.[\d]{1,2})?$/;
      if (!pattern.test(value)) {
        callback(new Error("请输入正数,保留两位小数"));
      }
      callback();
    },
    //校验整数
    validateInt(rule, value, callback) {
      if (!value) return callback(new Error("请输入必填项"));
      const pattern = /(^\d*$)/;
      if (!pattern.test(value)) {
        return callback(new Error("请输入整数"));
      }
      callback();
    },
    afterInit() {
      if (this.dataForm.contractTypeId){
        this.dataForm.contractTypeId = this.dataForm.contractTypeId.split(",")
      }else{
        this.dataForm.contractTypeId = []
      }
      this.checkContractType(this.dataForm.contractTypeId)
      this.$nextTick(() => {
        this.$refs["dataForm"].validateField([
          "advPayment",
          "proPayment",
          "comPayment",
          "settlement",
          "retMoney"
        ]);
      });

    },
    //项目编号
    selectDialoContractInProject(data) {
      this.dataForm.constructName = data[0].constructName; //项目名称
      this.dataForm.constructArchiveMainId = data[0].constructArchiveMainId; //项目id
      this.dataForm.managerDeptName = data[0].managerDeptName; //管理部门
      this.dataForm.constructManager = data[0].constructManagerName; //负责人
      this.dataForm.constructCode = data[0].constructCode; // 项目编号
      this.dataForm.contractCode = data[0].constructCode; // 项目编号
      this.dataForm.scheme = data[0].scheme; //
      this.dataForm.schemeCode = data[0].schemeCode; //
      this.dataForm.projectAgreementId = data[0].projectAgreementId; //

      // this.dataForm.supplierName = data[0].text;
      // this.dataForm.supplierMainId = data[0].value;
    },
    //合同类型
    checkContractType(data) {
      if (data.includes("3") && !data.includes("1")) {
        data.push("1");
      }
      //this.$refs.dataForm.clearValidate(['constructionAmountTax','designAmountTax','saleAmountTax'])
      if(!data.includes("2")){
        this.$refs.dataForm.clearValidate('designAmountTax')
        this.dataForm.designAmountTax = ''
      }
      if(!data.includes("1")){
        this.$refs.dataForm.clearValidate('constructionAmountTax')
        this.dataForm.constructionAmountTax = ''
      }
      if(!data.includes("3")){
        this.$refs.dataForm.clearValidate('saleAmountTax')
        this.dataForm.saleAmountTax = ''
      }
      this.dataRule["constructionAmountTax"] = RuleRequired.curCustomRule(
        data.includes("1"),
        this.validateNumber3
      ); //施工金额
      this.dataRule["constructionRate"] = RuleRequired.curFiledRule(
        data.includes("1")
      ); //施工税率

      this.dataRule["designAmountTax"] = RuleRequired.curCustomRule(
        data.includes("2"),
        this.validateNumber3
      ); //设计金额
      this.dataRule["designTaxRate"] = RuleRequired.curFiledRule(
        data.includes("2")
      ); //设计税率

      this.dataRule["saleAmountTax"] = RuleRequired.curCustomRule(
        data.includes("3"),
        this.validateNumber3
      ); //销售金额
      this.dataRule["saleTaxRate"] = RuleRequired.curFiledRule(
        data.includes("3")
      ); //销售税率
    },
    //甲方
    selectDialogCustomer(type, data) {
      this.dataForm[`customer${type}`] = data[0].customerName;
      this.dataForm[`customer${type}Id`] = data[0].id;
    },
    //乙方
    selectDialogSupplierMainName(data) {
      this.dataForm.supplierName = data[0].text;
      this.dataForm.supplierMainId = data[0].value;
    },
    /**税率 */
    updateTaxRateValue(code, data) {
      if (data.length === 0) return;
      this.dataForm[code] = data[0].taxRate + "";
      this.dataForm[code + "Name"] = data[0].name;
      this.dataForm[code + "Id"] = data[0].id;
      this.computeTaxRate(code);
    },
    //计算累计无税金额
    computeTaxRate(code) {
      let _dataForm = this.dataForm;
      let {
        constructionRate,
        constructionAmountTax,
        designTaxRate,
        designAmountTax,
        saleTaxRate,
        saleAmountTax
      } = _dataForm;
      if (isNaN(_dataForm[code])) return;
      //施工
      if (
        ["constructionRate", "constructionAmountTax"].includes(code) &&
        constructionRate &&
        constructionAmountTax
      ) {
        _dataForm.constructionAmount = this.myToFixed2(
          constructionAmountTax / (1 + Number(constructionRate))
        );
      }
      //设计
      if (
        ["designTaxRate", "designAmountTax"].includes(code) &&
        designTaxRate &&
        designAmountTax
      ) {
        _dataForm.designAmount = this.myToFixed2(
          designAmountTax / (1 + Number(designTaxRate))
        );
      }
      //销售
      if (
        ["saleTaxRate", "saleAmountTax"].includes(code) &&
        saleTaxRate &&
        saleAmountTax
      ) {
        _dataForm.saleAmount = this.myToFixed2(
          saleAmountTax / (1 + Number(saleTaxRate))
        );
      }

      _dataForm.norigsignmnyTax = this.myToFixed2(
        Number(constructionAmountTax) +
          Number(designAmountTax) +
          Number(saleAmountTax)
      );
      _dataForm.norigsignmny = this.myToFixed2(
        Number(_dataForm.constructionAmount) +
          Number(_dataForm.designAmount) +
          Number(_dataForm.saleAmount)
      );
    },
    //收款账号
    accountnoUpdateValue(data) {
      this.dataForm.accountNo = data[0].bank_account_no;
      this.dataForm.accountName = data[0].bank_account_name;
      this.dataForm.bankName = data[0].bank_branch_name;
    },
    //项目地址
    changeAdressSelect(data) {
      this.dataForm.constructAddress = data.value || "";
    },
    getSocialUnifiedCreditCode(id) {
      getSocialUnifiedCreditCode(id).then(res => {
        console.log(res, 11);
        if (res.code == 200) {
          this.dataForm.socialUnifiedCreditCode =
            res.data?.organizationsId || res.data || "914403001922663713";
        }
      });
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.contractTypeId = dataForm.contractTypeId.toString();
      dataForm.contractAmountTax = this.contractAmountTax;
      dataForm.contractAmount = this.contractAmount;
      return dataForm;
    },
    validateForm() {
      console.log('validateFormvalidateForm')
      const _this = this;
      if(this.isProcInstCreatorRealName){
        let _dataForm = Object.toDeepClone(_this.dataForm);
      return new Promise(resolve => {
      
            _dataForm.progressDetailList = _progressFromData;
            _dataForm.payinDetailList = _payinFromData;
            _dataForm.code = _dataForm.contractCode;
            _dataForm.contractTypeId = _this.dataForm.contractTypeId.toString();
            _dataForm.advPayment = _this.toNumber2(_dataForm.advPayment);
            _dataForm.proPayment = _this.toNumber2(_dataForm.proPayment);
            _dataForm.comPayment = _this.toNumber2(_dataForm.comPayment);
            _dataForm.settlement = _this.toNumber2(_dataForm.settlement);
            _dataForm.retMoney = _this.toNumber2(_dataForm.retMoney);
            resolve(_dataForm);
 
      });
      
      }
       
      const _progressFromData = _this.$refs["progressFromData"].validateForm();
      const _payinFromData = _this.$refs["payinFromData"].validateForm();
      let _dataForm = Object.toDeepClone(_this.dataForm);
      return new Promise(resolve => {
        _this.$refs["dataForm"].validate(valid => {
          //如果同时存在进度款与进度款-按节点收款
          if (_progressFromData[0].progressPayment && _dataForm.proPayment) {
            this.$message.error(
              `进度款 与 进度款-按节点收款只能同时存在一个！`
            );
            return resolve(false);
          }
          if (valid && _progressFromData && _payinFromData) {
            _dataForm.progressDetailList = _progressFromData;
            _dataForm.payinDetailList = _payinFromData;
            _dataForm.code = _dataForm.contractCode;
            _dataForm.contractTypeId = _this.dataForm.contractTypeId.toString();
            _dataForm.advPayment = _this.toNumber2(_dataForm.advPayment);
            _dataForm.proPayment = _this.toNumber2(_dataForm.proPayment);
            _dataForm.comPayment = _this.toNumber2(_dataForm.comPayment);
            _dataForm.settlement = _this.toNumber2(_dataForm.settlement);
            _dataForm.retMoney = _this.toNumber2(_dataForm.retMoney);
            resolve(_dataForm);
          } else {
            resolve(false);
          }
        });
      });
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({
        params: { configTypes: "建安合同类型,结算方式" }
      });
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case "建安合同类型":
              this.checkboxArray = ele.dataDict;
              break;
            case "结算方式":
              this.settlementDict = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
    // 超链接
    getWiid(tableName, id) {},
    focusInput(code) {
      let valArr =
        this.dataForm[code] && this.dataForm[code].toString().split("%");
      if (valArr.length < 2) return;
      this.dataForm[code] = this.toNumber2(valArr[0]);
    },
    //百分比转两位小数
    toNumber2(val) {
      if (!val) return "";
      return val;
      let _val = val && val.toString().split("%")[0];
      if (isNaN(_val)) return val;
      //转两位小数输出
      return Number(_val >= 1 && _val < 100 ? _val / 100 : _val);
    },
    myToFixed2(val) {
      return Object.tofixed(val, 2);
    },
    changeTime(val) {
      if (this.dataForm.contEndDate && this.dataForm.contStartDate) {
        this.dataForm.duration =
          moment(this.dataForm.contEndDate).diff(
            moment(this.dataForm.contStartDate)
          ) /
          (1000 * 60 * 60 * 24);
      } else {
        this.dataForm.duration = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("../../style/form.scss");
.form-box {
  .el-form-item {
    margin-bottom: 20px;
  }

  .link_box {
    display: flex;
    align-items: center;

    .link_text {
      flex: 1;
    }

    .link_btn {
      height: 30px;
      margin: 2px 0 0 3px;
    }
  }
}

.el-checkbox-group {
  .el-checkbox {
    margin-right: 20px;
  }

  .el-checkbox:last-of-type {
    margin-right: 0;
  }
}
</style>
