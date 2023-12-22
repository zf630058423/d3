<template>
  <!-- 设计补偿金合同 -->
  <div class="form-box">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="合同信息">
        <template slot="col_1">
          <el-form-item prop="code" label="合同编号：">
            <el-input v-model="dataForm.code" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：">
            <el-input v-model="constructName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item label="项目编号：">
            <el-input v-model="constructCode" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="customerA" label="甲方：">
            <select-dialog :disabled="true" :width="800" :model-data="customerConfig" :height="360"
              :value="dataForm.customerA" @updateValue="(val) => selectDialogCustomer('A', val)"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="supplierName" label="乙方：">
            <select-dialog :width="600" :height="360" :value="dataForm.supplierName"
              @updateValue="selectDialogSupplierMainName" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="marketCode" label="立项编号：">
            <select-dialog :width="600" :height="360" :value="dataForm.marketCode" @updateValue="selectMarketMainModel"
              :modelData="marketMainModelData" :isLinkBtn="true" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="marketName" label="立项名称：">
            <el-input v-model="dataForm.marketName" size="small" disabled :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="norigsignmnyTax" label="合同金额(含税)元：" @change="computeTaxRate">
            <el-input v-model="dataForm.norigsignmnyTax" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="norigsignmny" label="合同金额(无税)元：">
            <el-input v-model="dataForm.norigsignmny" size="small" disabled placeholder="自动计算" />
          </el-form-item>
          <el-form-item prop="settleType" label="付款方式：">
            <el-select v-model="dataForm.settleType" placeholder="请选择">
              <el-option v-for="(item, index) in paymentMethodOptions" :key="index" :value="item.configValue"
                :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="marketUnit" label="业务单元：">
            <el-input v-model="dataForm.marketUnit" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="businessCenter" label="业务中心：">
            <el-input v-model="dataForm.businessCenter" size="small" disabled
              :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="taxRateName" label="税率（%）：">
            <select-dialog :value="dataForm.taxRateName" @updateValue="updateTaxRateValue" :modelData="taxRateDialog"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="contractSignDate" label="合同签订日期：">
            <el-date-picker v-model="dataForm.contractSignDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="memo" label="备注：">
            <el-input v-model="dataForm.memo" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="附件">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="type !== 'add'">
        <template slot="col_1">
          <el-form-item prop="createUserName" label="编制人：">
            <span> {{ dataForm.createUserName }}</span>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="deptName" label="编制人部门：">
            <span> {{ dataForm.deptName }}</span>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="createTime" label="编制时间：">
            <span> {{ dataForm.createTime }}</span>
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
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import MyFun from '@/utils/fun';
export default {
  name: "baseBankArchiveMainListForm",
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
        code: "", //合同编号
        marketCode: "", //立项编号
        marketMainId: "", //立项id
        marketName: "", //立项名称
        marketUnit: "", //业务单元
        businessCenter: "", //业务中心
        fileInfoList: [], //附件
        customerA: "", //甲方
        customerAId: "", //甲方
        supplierName: "", //乙方
        supplierMainId: "", //乙方id
        norigsignmnyTax: "", //合同金额（含税）元
        norigsignmny: "", //合同金额（无税）元
        taxRate: "", //税率（%）
        taxRateId: "", //税率（%）
        taxRateName: "", //税率（%）
        contractSignDate: "", //合同签订日期
        settleType: "", //付款方式
        memo: "", //备注
        wiid: "", //流程实例
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      constructName: "设计类补偿款项目专用", //项目名称
      constructCode: "PM-201712220002", //项目编号
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入
      dataRule: RuleRequired.dataRule(['customerA', 'supplierName', 'marketCode', 'marketName','settleType',
        'contractSignDate','norigsignmnyTax', 'taxRateName', 'fileInfoList']),
      paymentMethodOptions: [],
      customerConfig: { code: 'KeShangDangAn_CP013', customDialog: 'KeShangDangAn_CP013', isSetHead: 1, isMulti: false, initailData: [] },// 客商档案
      marketMainModelData: { code: 'YingXiaoLiXiangSheJiBuChangJin', parm: { isEnableAuthor: 0, data: [], singleSelect: true } },
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
    };
  },
  created () {
    this.dataRule.norigsignmnyTax = RuleRequired.curCustomRule(true, this.validateNumber2);
    this.getDataDictByConfigType();
  },

  methods: {
    afterInit () {
      let { norigsignmnyTax, norigsignmny } = this.dataForm
      try {
        //千分位转数字
        this.dataForm.norigsignmnyTax = norigsignmnyTax ? MyFun.getQianfenWeiStr(MyFun.getTofixed(norigsignmnyTax, 2)) : norigsignmnyTax
        this.dataForm.norigsignmny = norigsignmny ? MyFun.getQianfenWeiStr(MyFun.getTofixed(norigsignmny, 2)) : norigsignmny
        this.computeTaxRate()
      } catch { }
    },
    //千分位保留2位小数
    validateNumber2 (rule, value, callback) {
      if (!value) return callback()
      let _val = value.toString().includes(",") ? MyFun.getCopyAmount(value) : value
      let pattern = /^[\d]+(.[\d]{1,2})*$/;
      if (!pattern.test(_val)) {
        return callback(new Error("请输入大于 0 的数字，最多保留2位小数"))
      } else {
        this.dataForm[rule.field] = MyFun.getQianfenWeiStr(MyFun.getTofixed(_val, 2))
      }
      callback()
    },
    //立项编号
    selectMarketMainModel (data) {
      this.dataForm.marketName = data[0].marketName;
      this.dataForm.marketCode = data[0].marketCode;
      this.dataForm.marketMainId = data[0].marketMainId;
      this.dataForm.marketUnit = data[0].marketUnit;
      this.dataForm.businessCenter = data[0].busisnessCenter
    },
    /** 税率**/
    updateTaxRateValue (data) {
      if (data.length <= 0) return;
      this.dataForm.taxRateId = data[0].id
      this.dataForm.taxRateName = data[0].name
      this.dataForm.taxRate = data[0].taxRate
      this.computeTaxRate()
    },
    //计算无税金额
    computeTaxRate () {
      let _dataForm = this.dataForm
      let { norigsignmnyTax, taxRate } = _dataForm
      //千分位转数字
      norigsignmnyTax = norigsignmnyTax.toString().includes(",") ? MyFun.getCopyAmount(norigsignmnyTax) : norigsignmnyTax
      if (isNaN(norigsignmnyTax) || isNaN(taxRate)) return
      //施工
      if (norigsignmnyTax && taxRate) {
        let norigsignmny = MyFun.getTofixed(norigsignmnyTax / (1 + Number(taxRate)), 2)
        _dataForm.norigsignmny = MyFun.getQianfenWeiStr(norigsignmny)
      }
    },
    //甲方
    selectDialogCustomer (type, data) {
      this.dataForm[`customer${type}`] = data[0].customerName;
      this.dataForm[`customer${type}Id`] = data[0].id;
    },
    //乙方
    selectDialogSupplierMainName (data) {
      this.dataForm.supplierName = data[0].text;
      this.dataForm.supplierMainId = data[0].value;
    },
    /**
     * 获取表单数据
     */
     getDataForm() {
      const dataForm = Object.toDeepClone(this.dataForm);
      let _val = this.dataForm.norigsignmnyTax.toString().includes(",") ? MyFun.getCopyAmount(this.dataForm.norigsignmnyTax) : this.dataForm.norigsignmnyTax
      let _val2 = this.dataForm.norigsignmny.toString().includes(",") ? MyFun.getCopyAmount(this.dataForm.norigsignmny) : this.dataForm.norigsignmny
      if (this.dataForm.norigsignmnyTax) {
        dataForm.norigsignmnyTax = _val-0
      }
      if (this.dataForm.norigsignmny) {
        dataForm.norigsignmny = _val2-0
      }
      console.log('dataForm',dataForm.norigsignmnyTax)
      return dataForm;
    },
    async validateForm () {
      const _this = this;
      let _dataForm = Object.toDeepClone(_this.dataForm);
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            resolve(this.getDataForm())
          } else {
            resolve(false)
          }
        })
      });
    },
    //初始化字典
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '结算方式' } })
      if (res.success) {
        res.data.forEach(ele => {
          this.paymentMethodOptions = ele.dataDict;
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.form-box {
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

::v-deep .el-table td.el-table__cell div {
  overflow: initial;
  height: 30px;
  line-height: 30px;
}
</style>
