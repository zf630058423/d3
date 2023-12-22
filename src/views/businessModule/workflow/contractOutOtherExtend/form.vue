<template>
  <!-- 其他支出合同表单 -->
  <div class="form-box">
    <div class="info">
      <div>温馨提示：以下合同可走其他支出合同：</div>
      设计合同；设计咨询；鉴证咨询；机械设备（挖机、炮机、叉车、高空车）；设备租赁（脚手架、钢管架、吊篮、集装箱）；除甲醛；造价咨询；保洁；垃圾清运；给水管道冲洗；检测；防白蚁；电梯装饰、安装、养护；瓷砖机购买；瓷砖加工；物流运输；灭火器；模具加工；技术服务；房屋租赁；土方清运；搬运等
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="code" label="合同编号：">
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
          <el-form-item prop="contractCategory" label="合同类别：">
            <el-radio-group v-model="dataForm.contractCategory" @change="getMasterContractCode">
              <el-radio :label="item.configValue" :key="item.configValue" v-for="item in contractCategoryOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="name" label="合同名称：">
            <el-input v-model="dataForm.name" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="copies" label="合同份数：">
            <el-input v-model="dataForm.copies" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="contractPartyAName" label="甲方：">
            <select-dialog :width="800" :height="360" :value="dataForm.contractPartyAName"
              @updateValue="selectDialogCustomer" dynamicModel="selectOrg"
              :btnDisabled="!isMasterContract"></select-dialog>
          </el-form-item>
          <el-form-item prop="contractAmountTax" label="合同金额(含税)：">
            <el-input v-model="dataForm.contractAmountTax" size="small" disabled :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item :prop="`${isMasterContract ? '' : 'masterContractCode'}`" label="主合同编号：">
            <select-dialog :width="600" :height="360" :model-data="masterContractCodeModelData"
              :btnDisabled="!dataForm.contractCategory.includes('2')" :value="dataForm.masterContractCode"
              @updateValue="selectDialogMasterContractCode" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="otherContractType" label="合同类型：">
            <el-select v-model="dataForm.otherContractType" placeholder="请选择" size="small" style="width: 100%"
              :disabled="dataForm.contractCategory=='2'"
             >
              <el-option v-for="(item, index) in contractTypeOptions" :key="index" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="settleTypeId" label="结算方式：">
            <el-select v-model="dataForm.settleTypeId" placeholder="请选择" size="small" style="width: 100%"
              :disabled="!isMasterContract">
              <el-option v-for="(item, index) in settlementDict" :key="index" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="contractPartyBName" label="乙方：">
            <select-dialog :width="600" :height="360" :model-data="customerConfig" :value="dataForm.contractPartyBName"
              @updateValue="selectDialogContractPartyBName" dynamicModel="customDialog"
              :btnDisabled="!isMasterContract"></select-dialog>
          </el-form-item>
          <el-form-item prop="contractAmountTaxFree" label="合同金额(无税)：">
            <el-input v-model.number="dataForm.contractAmountTaxFree" size="small" disabled
              :placeholder="computedPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="masterContractName" label="主合同名称：">
            <el-input v-model="dataForm.masterContractName" size="small" disabled />
          </el-form-item>
          <el-form-item prop="signDate" label="合同签订日期：">
            <el-date-picker v-model="dataForm.signDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="effectiveDate" label="合同生效日期：">
            <el-date-picker v-model="dataForm.effectiveDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endDate" label="合同结束日期：">
            <el-date-picker v-model="dataForm.endDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="archivist" label="合同是否归档：">
            <el-radio-group v-model="dataForm.archivist">
              <el-radio :label="item.label" :key="item.name" v-for="item in radioData" disabled>{{ item.name }}</el-radio>
            </el-radio-group>
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
      <row-layout :cols="1" title="合同明细信息">
        <!-- 合同明细信息 -->
        <el-form-item slot="col_1" prop="contractOutOtherDetailList" label-width="0">
          <subFromTab v-model="dataForm.contractOutOtherDetailList" ref="subFromData" :disabled="setting.readonly"
            :settlementDict="settlementDict" @changeContractAmount="changeContractAmount">
          </subFromTab>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" title="支付条款">
        <template slot="col_1">
          <el-form-item prop="advPayment" label="预收款：">
            <!-- <el-input v-model="dataForm.advPayment" size="small" @focus="focusInput('advPayment')"
              :disabled="!isMasterContract" :placeholder="pleaseEnterNumPlaceHolder" /> -->
              <percentage-input v-model="dataForm.advPayment" :disabled="!isMasterContract"></percentage-input>
          </el-form-item>
          <el-form-item prop="settlement" label="结算款：">
           <!--  <el-input v-model="dataForm.settlement" size="small" @focus="focusInput('settlement')"
              :disabled="!isMasterContract" :placeholder="pleaseEnterNumPlaceHolder" /> -->
              <percentage-input v-model="dataForm.settlement" :disabled="!isMasterContract"></percentage-input>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="proPayment" label="进度款：">
            <!-- <el-input v-model.number="dataForm.proPayment" size="small" @focus="focusInput('proPayment')"
              :disabled="" :placeholder="pleaseEnterNumPlaceHolder" /> -->
              <percentage-input v-model="dataForm.proPayment" :disabled="!isMasterContract"></percentage-input>
          </el-form-item>
          <el-form-item prop="retMoney" label="质保金：">
           <!--  <el-input v-model="dataForm.retMoney" size="small" @focus="focusInput('retMoney')"
              :disabled="!isMasterContract" :placeholder="pleaseEnterNumPlaceHolder" /> -->

              <percentage-input v-model="dataForm.retMoney" :disabled="!isMasterContract"></percentage-input>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="comPayment" label="完工款：">
            <!-- <el-input v-model="dataForm.comPayment" size="small" @focus="focusInput('comPayment')"
              :disabled="!isMasterContract" :placeholder="pleaseEnterNumPlaceHolder" /> -->
              <percentage-input v-model="dataForm.comPayment" :disabled="!isMasterContract"></percentage-input>
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
import subFromTab from './components/subFromTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { RADIO3_GROUP } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { queryContractInMain, getMasterContractCode } from './components/index.js'
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
export default {
  name: "baseBankArchiveMainListForm",
  components: {
    RowLayout,
    updateFiles,
    subFromTab,
    SelectDialog,
    percentageInput
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
        archivist: "", //合同是否归档
        settleTypeId: "", //结算方式
        code: "", //单据编号
        name: "", //合同名称
        copies: "", //合同份数
        constructArchiveMainCode: "", //项目编号
        constructArchiveMainId: "", //项目档案id
        constructArchiveMainName: "", //	项目名称
        constructionUnitName: "", //	管理部门
        contractOutMainId: "", //	支出主合同id
        contractCategory: "", //合同类别
        contractPartyAId: "", //合同甲方
        contractPartyAName: "", //合同甲方
        contractPartyBId: "", //	合同乙方
        contractPartyBName: "", //	合同乙方
        othercontracttype:'',
        contractOutOtherDetailList: [  //结算信息明细
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
        otherContractType: "", //合同类型
        signDate: "", //合同签订日期
        effectiveDate: "", //合同生效日期
        endDate: "", //合同结算日期
        fileInfoList: [],//附件
        finishedTime: "", //流程时间
        masterContractCode: "", //主合同编号
        masterContractName: "", //主合同名称
        masterContractId: "", //主合同名称
        processFinishedTime: "", //	审批通过时间
        projectManagerName: "", //项目负责人
        remark: "", //备注
        contractAmountTax: "", //	合同金额(含税)(元)
        contractAmountTaxFree: "", //	合同金额(无税)(元)
        settlementDate: "", //	结算日期
        advPayment: "", //预收款
        retMoney: "", //	质保金
        settlement: "", //	结算款
        proPayment: "", //	进度款
        comPayment: "", //完工款
      },
      pleaseEnterPlaceHolder: "请输入",
      pleaseEnterNumPlaceHolder: "请输入两位小数",
      computedPlaceHolder: "自动计算",
      customerConfig: { code: 'KeShangDangAnQTHTZC', customDialog: 'KeShangDangAnQTHTZC', isSetHead: 1, isMulti: false, initailData: [] },// 客商档案
      masterContractCodeModelData: { code: 'QiTaZhiChuHeTong', customDialog: 'QiTaZhiChuHeTong', isSetHead: 1, isMulti: false, initailData: [] },// 其他支出合同
      contractInProjectModelData: { code: 'XiangMuDangAnProjectSubmission', parm: { data: [], singleSelect: true } }, //
      radioData: RADIO3_GROUP,
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },//税率
      dataRule: RuleRequired.dataRule(['constructArchiveMainCode', 'contractCategory', 'otherContractType', 'name', 'signDate',
        'effectiveDate', 'copies', 'settleTypeId', 'endDate', 'contractPartyAName', 'contractPartyBName', 'advPayment',
        'masterContractCode', 'proPayment', 'comPayment', 'settlement', 'retMoney', 'fileInfoList','contractType']),
      contractCategoryOptions: [],
      settlementDict: [],//结算方式
      contractTypeOptions: [],//合同类型选项
    };
  },
  computed: {
    //是否主合同
    isMasterContract () {
      return this.dataForm.contractCategory.includes('1')
    },
  },
  watch: {
    'dataForm.contractCategory': {
      handler: function (val) {
        const isMasterContract = this.isMasterContract
        //主合同必填
        let constructionArr = ['settleTypeId', 'contractPartyAName', 'contractPartyBName']
        let numArr = ['advPayment', 'proPayment', 'comPayment', 'settlement', 'retMoney']
        constructionArr.forEach((i) => {
          this.dataRule[i] = RuleRequired.curFiledRule(isMasterContract);
        })
        //自定义正则
        numArr.forEach((i) => {
          this.dataRule[i] = RuleRequired.curCustomRule(isMasterContract, this.validateNumber);
        })
      },
      deep: true,
      immediate: true
    },
    'dataForm.constructArchiveMainId': {
      handler: function (val) {
        if (!val) return
        this.queryContractInMain(val)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.getDataDictByConfigType();
    let numArr = ['advPayment', 'proPayment', 'comPayment', 'settlement', 'retMoney']
    //自定义正则
    numArr.forEach((i) => {
      this.dataRule[i] = RuleRequired.curCustomRule(this.isMasterContract, this.validateNumber);
    })
    this.dataRule.copies = RuleRequired.curCustomRule(true, this.validateInt);
  },
  methods: {
    //校验两位小数
    validateNumber (rule, value, callback) {
      if (!value) return rule.field === 'proPayment' ? callback() : callback(new Error("请输入必填项"))
      const pattern = /(^\d*$)|(^[0-9]*\.\d{1,100}$)/
      let _val = this.toNumber2(value)
      if (value>1||value<0) {
        return callback(new Error("请输入0到100的数字"))
      }
      let numArr = ['advPayment'/*预收款*/, 'proPayment'/*进度款*/, 'comPayment'/*完工款*/, 'settlement'/*结算款*/, 'retMoney'/*质保金*/]
      let numObj = {}
      numArr.forEach((code) => {
        numObj[code] = this.toNumber2(this.dataForm[code]) || 0
      })
      if (['advPayment', 'proPayment'].includes(rule.field) && numObj.advPayment && numObj.proPayment && numObj.advPayment > numObj.proPayment) {
        return callback(new Error("进度款(%) ≥ 预收款(%)"))
      }
      if (['comPayment', 'proPayment'].includes(rule.field) && numObj.comPayment && numObj.proPayment && numObj.comPayment < numObj.proPayment) {
        return callback(new Error("完工款(%) ≥ 进度款(%)"))
      }
      if (['comPayment', 'settlement'].includes(rule.field) && numObj.settlement && numObj.comPayment && numObj.settlement < numObj.comPayment) {
        return callback(new Error("结算款(%) ≥ 完工款(%)"))
      }
      if (['settlement', 'retMoney'].includes(rule.field) && numObj.settlement && numObj.retMoney && ((numObj.retMoney-0) + (numObj.settlement-0)) != 1) {
        console.log(numObj.retMoney, numObj.settlement,numObj.retMoney-0 + numObj.settlement)
        return callback(new Error("结算款(%)+质保金(%)=100(%)"))
      }
      // this.dataForm[rule.field] = parseInt(this.toNumber2(_val) * 100) + '%'
      callback()
    },
    //最多保留4位小数
    validateNumber4 (rule, value, callback) {
      if (!value) return callback()
      let pattern = /^[\d]+(.[\d]{1,4})*$/;
      if (!pattern.test(value)) {
        return callback(new Error("请输入大于 0 的数字，最多保留4位小数"))
      } else {
        this.dataForm[rule.field] = parseFloat(value)
      }
      callback()
    },
    //校验整数
    validateInt (rule, value, callback) {
      if (!value) return callback(new Error("请输入必填项"))
      const pattern = /(^\d*$)/
      if (!pattern.test(value)) {
        return callback(new Error("请输入整数"))
      }
      callback()
    },
    afterInit () {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField(['advPayment', 'proPayment', 'comPayment', 'settlement', 'retMoney'])
      })
    },
    //项目编号
    selectConstructArchiveMainCode (data) {
      this.dataForm.constructArchiveMainName = data[0].name; //项目名称
      this.dataForm.constructArchiveMainId = data[0].id; //项目id
      this.dataForm.constructionUnitName = data[0].constructionunitname; //管理部门
      this.dataForm.projectManagerName = data[0].projectmanagername; //负责人
      this.dataForm.constructArchiveMainCode = data[0].code; // 项目编号
    },
    //主合同编号
    selectDialogMasterContractCode (data) {
      console.log(data[0])
      this.dataForm.masterContractCode = data[0].code;
      this.dataForm.masterContractId = data[0].id;
      this.dataForm.masterContractName = data[0].name;
      if(this.dataForm.contractCategory =='2'){
        this.dataForm.otherContractType = data[0].othercontracttype
      }
      if (!this.isMasterContract) {
        //otherContractType
        let autofillArr = ['advPayment', 'proPayment', 'comPayment', 'settlement', 'retMoney', 'settleTypeId',
          'contractPartyAId', 'contractPartyAName', 'contractPartyBId', 'contractPartyBName']
        autofillArr.forEach(i => {
          this.dataForm[i] = data[0][i];
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].validateField(['advPayment', 'proPayment', 'comPayment', 'settlement', 'retMoney'])
        })
      }
      this.queryContractInMain(data[0].id)
    },
    //根据id查询收入合同
    queryContractInMain (id) {
      queryContractInMain({ constructArchiveMainId: id }).then(res => {
        let data = res.data
        if (data) {
          this.dataForm.contractPartyAName = data?.contractPartyBName
          this.dataForm.contractPartyAId = data?.contractPartyBId
        }
      })
    },
    //甲方
    selectDialogCustomer (data) {
      this.dataForm.contractPartyAName = data[0].text;
      this.dataForm.contractPartyAId = data[0].value;
    },
    //乙方
    selectDialogContractPartyBName (data) {
      this.dataForm.contractPartyBName = data[0].customerName;
      this.dataForm.contractPartyBId = data[0].id;
    },
    changeContractAmount (data) {
      this.dataForm.contractAmountTax = data.contractAmountTax;
      this.dataForm.contractAmountTaxFree = data.contractAmountTaxFree;
    },
    //只有一条主合同数据自动带出
    getMasterContractCode () {
      if(this.isMasterContract&&this.dataForm.masterContractId)return
      getMasterContractCode({page:1,rows:20}).then(({rows,total})=>{
        if(total==1)this.selectDialogMasterContractCode(rows)
      })
    },
    async validateForm () {
      const _this = this;
      const _subFromData = await _this.$refs['subFromData'].validateForm();
      let _dataForm = Object.toDeepClone(_this.dataForm);
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && _subFromData) {
            if (['0099', '0201'].includes(_this.dataForm.contractPartyAId)) {
              this.$message.error(`深圳市中装智链供应链有限公司、惠州市中装新材料有限公司提交此流程不能提交此流程！`)
            }
            _this.dataForm.contractOutOtherDetailList = _subFromData
            _dataForm.advPayment = _this.toNumber2(_dataForm.advPayment)
            _dataForm.proPayment = _this.toNumber2(_dataForm.proPayment)
            _dataForm.comPayment = _this.toNumber2(_dataForm.comPayment)
            _dataForm.settlement = _this.toNumber2(_dataForm.settlement)
            _dataForm.retMoney = _this.toNumber2(_dataForm.retMoney)
            resolve(_dataForm)
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
      const res = await getDataDictByConfigType({ params: { configTypes: '合同类别,结算方式,其他支出合同-合同类型' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '合同类别':
              this.contractCategoryOptions = ele.dataDict;
              break;
            case '结算方式':
              this.settlementDict = ele.dataDict.filter(item=>{
                return item.isEnable
              });
              break;
            case '其他支出合同-合同类型':
              this.contractTypeOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
    focusInput (code) {
      let valArr = this.dataForm[code] && this.dataForm[code].toString().split('%')
      if (valArr.length < 2) return
      this.dataForm[code] = this.toNumber2(valArr[0])
    },
    //百分比转两位小数
    toNumber2 (val) {
      if (!val) return ""
      return val
      let _val = val && val.toString().split('%')[0]
      if (isNaN(_val)) return val
      //转两位小数输出
      return Number(_val >= 1 && _val < 100 ? _val / 100 : _val)
    },
    myToFixed2 (val) {
      return Number(val.toString().match(/^\d+(?:\.\d{0,2})?/))
    }
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
.info{
  color: red;
  padding: 0 10px;
  line-height: 1.5;
}
</style>
