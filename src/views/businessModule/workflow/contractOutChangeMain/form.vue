<template>
  <!-- 其他支出合同变更表单 -->
  <div class="form-box">
    <!-- :disabled="setting.readonly" -->
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="180px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="constructionUnitName" label="管理部门：">
            <el-input v-model="dataForm.constructionUnitName" disabled size="small" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructArchiveMainCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructArchiveMainCode" :isLinkBtn="true"
              @updateValue="selectConstructArchiveMainCode" :modelData="contractInProjectModelData"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="projectManagerName" label="项目负责人：">
            <el-input v-model="dataForm.projectManagerName" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructArchiveMainName" label="项目名称：">
            <el-input v-model="dataForm.constructArchiveMainName" disabled size="small"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="合同信息">
        <template slot="col_1">
          <el-form-item :prop="`masterContractCode`" label="主合同编号：">
            <select-dialog :width="600" :height="360" :model-data="masterContractCodeModelData"
              :value="dataForm.masterContractCode" @updateValue="selectDialogMasterContractCode"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="contractPartyAName" label="甲方：">
            <el-input v-model="dataForm.contractPartyAName" size="small" disabled />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="masterContractName" label="主合同名称：">
            <el-input v-model="dataForm.masterContractName" size="small" disabled />
          </el-form-item>
          <el-form-item prop="contractPartyBName" label="乙方：">
            <el-input v-model="dataForm.contractPartyBName" size="small" disabled />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="settleType" label="结算方式：">
            <el-select v-model="dataForm.settleType" placeholder="请选择" size="small" style="width: 100%" disabled>
              <el-option v-for="(item, index) in settlementDict" :key="index" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="变更信息" marginStyle="margin: 16px 16px 0 16px">
        <template slot="col_1">
          <el-form-item prop="changeDate" label="变更日期：">
            <el-date-picker v-model="dataForm.changeDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="thisChangeAmountTax" label="本次变更金额(含税/元)：">
            <el-input v-model="dataForm.thisChangeAmountTax" size="small" disabled :placeholder="computedPlaceHolder"  />
          </el-form-item>
          <el-form-item prop="changeTotalAmountTax" label="变更后合同总金额(含税)：">
            <el-input v-model="dataForm.changeTotalAmountTax" size="small" disabled :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="changeType" label="变更类型：">
            <el-checkbox-group v-model="dataForm.changeType">
              <el-checkbox v-for="item in checkboxArray" :label="item.configValue" :key="item.configValue"> {{
                item.configName }} </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="thisChangeAmountUntax" label="本次变更金额(无税/元)：">
            <el-input v-model="dataForm.thisChangeAmountUntax" size="small" disabled :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item :prop="isChangeType2 ? 'afterChangeSettlementTypeId' : ''" label="变更后结算方式：">
            <el-select v-model="dataForm.afterChangeSettlementTypeId" placeholder="请选择" size="small" style="width: 100%"
              :disabled="!isChangeType2">
              <el-option v-for="(item, index) in settlementDict" :key="index" :label="item.configName"
                :value="item.configValue"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="thisChangeTaxAmount" label="本次变更税额(元)：">
            <el-input v-model="dataForm.thisChangeTaxAmount" size="small" disabled :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" marginStyle="margin: 0 16px 16px 16px">
        <template slot="col_1">
          <el-form-item :prop="isChangeType3 ? 'otherTermsChange' : ''" label="其他条款变更：">
            <el-input v-model="dataForm.otherTermsChange" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder"
              :disabled="!isChangeType3" />
          </el-form-item>
          <el-form-item prop="remark" label="备注：">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="变更明细信息">
        <!-- 变更明细信息 -->
        <el-form-item slot="col_1" :prop="isChangeType1 ? 'contractOutChangeDetailList' : ''" label-width="0">
          <subFromTab v-model="dataForm.contractOutChangeDetailList" ref="subFromData"
         
            @changeContractAmount="changeContractAmount" />
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
import comMixin from "../minix";
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import subFromTab from './components/subFromTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { getChangeTotalAmountTax } from './components/index.js'

export default {
  name: "contractOutChangeMainForm",
  components: {
    RowLayout,
    updateFiles,
    subFromTab,
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
      changeTotalAmountTax: "", //	变更后合同总金额(含税)
      dataForm: {
        afterChangeSettlementTypeId: "", //变更后结算方式
        settleType: "", //结算方式
        code: "", //单据编号
        constructArchiveMainCode: "", //项目编号
        constructArchiveMainId: "", //项目档案id
        constructArchiveMainName: "", //	项目名称
        constructionUnitName: "", //	管理部门
        contractPartyAId: "", //合同甲方
        contractPartyAName: "", //合同甲方
        contractPartyBId: "", //	合同乙方
        contractPartyBName: "", //	合同乙方
        changeDate: new Date(), //	变更日期
        changeTotalAmountTax: "", //	变更后合同总金额(含税)
        contractOutChangeDetailList: [  //结算信息明细
          {
            amountTax: "", //金额(含税)
            amountUntax: "", //	金额(无税)
            brand: "", //品牌
            contractSettleMainId: "", //结算主表id
            id: "", //	主键
            isDel: "", //是否删除(0否1是)
            name: "", //名称
            number: "", //	数量
            specification: "", //	规格/型号
            taxAmount: "", //税额
            taxRateName: "", //	税率
            taxRate: "", //	税率
            taxRateId: "", //	税率id
            unit: "", //	单位
            unitPriceTax: "", //	单价(含税)
            unitPriceUntax: "" //	单价(无税)
          }
        ],
        changeType: [], //变更类型
        otherTermsChange: "", //其他条款变更
        remark: "", //备注
        fileInfoList: [],//附件
        finishedTime: "", //流程时间
        thisChangeAmountTax: "", //本次变更金额(含税)
        thisChangeAmountUntax: "", //本次变更金额(无税)
        thisChangeTaxAmount: "", //本次变更税额
        masterContractCode: "", //主合同编号
        masterContractName: "", //主合同名称
        masterContractId: "", //主合同名称
        processFinishedTime: "", //	审批通过时间
        projectManagerName: "", //项目负责人
        contractAmountTax: "", //	结算金额(含税)(元)
        contractAmountTaxFree: "", //	结算金额(无税)(元)
        settlementDate: "", //	结算日期
      },
      pleaseEnterPlaceHolder: "请输入",
      pleaseEnterNumPlaceHolder: "请输入两位小数",
      computedPlaceHolder: "自动计算",
      masterContractCodeModelData: { code: 'QiTaZhiChuHeTong', isShowLink: true, parm: { varParams: [{ key: 'constructArchiveMainId', value: '' }] } },// 其他支出合同
      contractInProjectModelData: { code: 'XiangMuDangAnProjectSubmission', parm: { data: [], singleSelect: true } }, //
      dataRule: RuleRequired.dataRule(['constructArchiveMainCode', 'masterContractCode', 'changeType', 'changeDate',
        'afterChangeSettlementTypeId', 'otherTermsChange', 'fileInfoList']),
      settlementDict: [],//结算方式
      checkboxArray: [],//变更类型
    };
  },
  computed: {
    isChangeType1 () {
      //return this.dataForm.changeType.includes('1')
      return this.dataForm.changeType.includes('1')
    },
    isChangeType2 () {
      return this.dataForm.changeType.includes('2')
    },
    isChangeType3 () {
      return this.dataForm.changeType.includes('3')
    },
  },
  watch: {
  },
  created () {
    this.getDataDictByConfigType();
  },
  methods: {
    afterInit() {
      if(this.dataForm.changeType) this.dataForm.changeType = this.dataForm.changeType.split(',')
      if(this.dataForm.masterContractId)this.getChangeTotalAmountTax()
      if(this.dataForm.constructArchiveMainId)this.masterContractCodeModelData.parm.varParams[0].value = this.dataForm.constructArchiveMainId
    },
    //项目编号
    selectConstructArchiveMainCode (data) {
      this.dataForm.constructArchiveMainName = data[0].name; //项目名称
      this.dataForm.constructArchiveMainId = data[0].id; //项目id
      this.dataForm.constructionUnitName = data[0].constructionunitname; //管理部门
      this.dataForm.projectManagerName = data[0].projectmanagername; //负责人
      this.dataForm.constructArchiveMainCode = data[0].code; // 项目编号
      this.masterContractCodeModelData.parm.varParams[0].value = data[0].id;
    },
    //主合同编号
    selectDialogMasterContractCode (data) {
      this.dataForm.masterContractCode = data[0].code;
      this.dataForm.masterContractId = data[0].id;
      this.dataForm.masterContractName = data[0].name;
      this.dataForm.settleType = data[0].settleTypeId;
      let autofillArr = ['contractPartyAId', 'contractPartyAName', 'contractPartyBId', 'contractPartyBName']
      autofillArr.forEach(i => {
        this.dataForm[i] = data[0][i];
      })
      this.getChangeTotalAmountTax()
    },
    getChangeTotalAmountTax () {
      getChangeTotalAmountTax(this.dataForm.masterContractId).then(res => {
        this.dataForm.changeTotalAmountTax = res.data + this.dataForm.thisChangeAmountTax
        this.changeTotalAmountTax = res.data
      })
    },
    changeContractAmount (data) {
      this.dataForm.thisChangeAmountTax = data.contractAmountTax;
      this.dataForm.thisChangeAmountUntax = data.contractAmountTaxFree;
      this.dataForm.thisChangeTaxAmount = data.taxAmount;
      this.dataForm.changeTotalAmountTax = this.changeTotalAmountTax + this.dataForm.thisChangeAmountTax
    },
    /**
     * 获取表单数据
     */
     getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.changeType = this.dataForm.changeType.sort((a,b)=>a-b).toString();
      return dataForm;
    },
    async validateForm () {
      const _this = this;
      const _subFromData = await _this.$refs['subFromData'].validateForm();
      let _dataForm = Object.toDeepClone(_this.dataForm);
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && _subFromData) {
            _dataForm.contractOutChangeDetailList = this.isChangeType1 ? _subFromData : []
            resolve(_this.getDataForm());
          } else {
            resolve(false)
          }
        })
      });
    },
    /** 初始化字典*/
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '结算方式,变更类型-其他支出合同变更' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '结算方式':
              this.settlementDict = ele.dataDict;
              break;
            case '变更类型-其他支出合同变更':
              this.checkboxArray = ele.dataDict;
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
