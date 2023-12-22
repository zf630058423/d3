<template>
  <!-- 其他支出合同结算表单 -->
  <div class="form-box">
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
      <row-layout :cols="3" title="合同信息" marginStyle="margin: 16px 16px 0 16px">
        <template slot="col_1">
          <el-form-item prop="settlementDate" label="结算日期：">
            <el-date-picker v-model="dataForm.settlementDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="contractType" label="合同类型：">
            <el-select v-model="dataForm.contractType" placeholder="请选择" size="small" disabled style="width: 100%">
              <el-option v-for="(item, index) in contractTypeOptions" :key="index" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="settlementAmountTax" label="结算金额(含税/元)：">
            <el-input v-model="dataForm.settlementAmountTax" size="small" disabled :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item :prop="`masterContractCode`" label="主合同编号：">
            <select-dialog :width="600" :height="360" :model-data="masterContractCodeModelData"
              :value="dataForm.masterContractCode" @updateValue="selectDialogMasterContractCode"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="contractPartyAName" label="甲方：">
            <el-input v-model="dataForm.contractPartyAName" size="small" disabled />
          </el-form-item>
          <el-form-item prop="settlementAmountUntax" label="结算金额(无税/元)：">
            <el-input v-model="dataForm.settlementAmountUntax" size="small" disabled :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="masterContractName" label="主合同名称：">
            <el-input v-model="dataForm.masterContractName" size="small" disabled />
          </el-form-item>
          <el-form-item prop="contractPartyBName" label="乙方：">
            <el-input v-model="dataForm.contractPartyBName" size="small" disabled />
          </el-form-item>
        </template>

      </row-layout>
      <row-layout :cols="1" marginStyle="margin: 0 16px 16px 16px">
        <template slot="col_1">
          <el-form-item prop="remark" label="备注：">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="结算信息">
        <!-- 结算信息 -->
        <el-form-item slot="col_1" label-width="0">
          <settleOtherDetail v-model="dataForm.contractSettleOtherDetailList" ref="contractSettleOtherDetailList"
            :disabled="setting.readonly" @changeContractAmount="changeContractAmount" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="增减项信息">
        <!-- 增减项信息 -->
        <el-form-item slot="col_1" label-width="0">
          <settleOtherSectionDetail v-model="dataForm.contractSettleOtherSectionDetailList"
            ref="contractSettleOtherSectionDetailList" :disabled="setting.readonly"
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
import settleOtherDetail from './components/settleOtherDetail.vue';
import settleOtherSectionDetail from './components/settleOtherSectionDetail.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  name: "contractSettleOtherMain",
  components: {
    RowLayout,
    updateFiles,
    settleOtherDetail,
    settleOtherSectionDetail,
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
        code: "", //单据编号
        constructArchiveMainCode: "", //项目编号
        constructArchiveMainId: "", //项目档案id
        constructArchiveMainName: "", //	项目名称
        constructionUnitName: "", //	管理部门
        contractPartyAId: "", //合同甲方
        contractPartyAName: "", //合同甲方
        contractPartyBId: "", //	合同乙方
        contractPartyBName: "", //	合同乙方
        settlementDate: new Date(), //	结算日期
        changeTotalAmountTax: "", //	变更后合同总金额(含税)
        contractSettleOtherDetailList: [  //结算信息明细
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
        contractSettleOtherSectionDetailList: [ //增减项信息
          {
            amountTax: "", //金额(含税)
            amountUntax: "", //金额(无税)
            content: "", //内容
            contractSettleMainId: "", //	结算主表id
            taxAmount: "", //税额
            taxRateName: "", //	税率
            taxRate: "", //	税率
            taxRateId: "", //	税率id
          }
        ],
        contractType: "", //合同类型
        fileInfoList: [],//附件
        settlementAmountTax: "", //结算金额(含税)
        settlementAmountUntax: "", //结算金额(无税)
        masterContractCode: "", //主合同编号
        masterContractName: "", //主合同名称
        contractOutMainId: "", //主合同名称
        processFinishedTime: "", //	审批通过时间
        projectManagerName: "", //项目负责人
        remark: "", //备注
      },
      pleaseEnterPlaceHolder: "请输入",
      pleaseEnterNumPlaceHolder: "请输入两位小数",
      computedPlaceHolder: "自动计算",
      masterContractCodeModelData: { code: 'QiTaZhiChuHeTong', customDialog: 'QiTaZhiChuHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: { varParams: [{ key: 'constructArchiveMainId', value: '' }] } },// 其他支出合同
      contractInProjectModelData: { code: 'XiangMuDangAnProjectSubmission', parm: { data: [], singleSelect: true } }, //
      dataRule: RuleRequired.dataRule(['constructArchiveMainCode', 'masterContractCode', 'changeType', 'settlementDate', 'fileInfoList']),
      settlementDict: [],//结算方式
      contractTypeOptions: [],//合同类型选项
      settleOtherOptions: { contractAmountTax: 0, contractAmountTaxFree: 0 },
      settleOtherSectionOptions: { contractAmountTax: 0, contractAmountTaxFree: 0 }
    };
  },
  computed: {

  },
  watch: {
  },
  created () {
    this.getDataDictByConfigType();
  },
  methods: {
    afterInit() {
      if(this.dataForm.changeType) this.dataForm.changeType = this.dataForm.changeType.split(',')
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
      this.dataForm.contractOutMainId = data[0].id;
      this.dataForm.masterContractName = data[0].name;
      let autofillArr = ['contractPartyAId', 'contractPartyAName', 'contractPartyBId', 'contractPartyBName', 'contractType']
      autofillArr.forEach(i => {
        this.dataForm[i] = data[0][i];
      })
    },
    changeContractAmount (data) {
      let settleOther = this.settleOtherOptions
      let settleOtherSection = this.settleOtherSectionOptions
      if (data.type === 'settleOtherSection') {
        settleOther.contractAmountTax = data.contractAmountTax;
        settleOther.contractAmountTaxFree = data.contractAmountTaxFree;
      } else {
        settleOtherSection.contractAmountTax = data.contractAmountTax;
        settleOtherSection.contractAmountTaxFree = data.contractAmountTaxFree;
      }
      this.dataForm.settlementAmountTax = Number(settleOther.contractAmountTax) + Number(settleOtherSection.contractAmountTax);
      this.dataForm.settlementAmountUntax = Number(settleOther.contractAmountTaxFree) + Number(settleOtherSection.contractAmountTaxFree);
    },
    async validateForm () {
      const _this = this;
      const _contractSettleOtherDetailList = await _this.$refs['contractSettleOtherDetailList'].validateForm();
      const _contractSettleOtherSectionDetailList = await _this.$refs['contractSettleOtherSectionDetailList'].validateForm();
      let _dataForm = Object.toDeepClone(_this.dataForm);
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && _contractSettleOtherDetailList && _contractSettleOtherSectionDetailList) {
            _dataForm.contractSettleOtherDetailList = _contractSettleOtherDetailList
            _dataForm.contractSettleOtherSectionDetailList = _contractSettleOtherSectionDetailList
            resolve(_dataForm)
          } else {
            resolve(false)
          }
        })
      });
    },
    /** 初始化字典*/
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '其他支出合同-合同类型' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '其他支出合同-合同类型':
              this.contractTypeOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
    // 超链接
    getWiid (tableName, id) {
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
