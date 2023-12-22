<template>
  <!-- 合同变更 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="180px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructCode" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructCode" dynamic-model="customDialog" @updateValue="updateMasterContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.managerDeptName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.constructManager" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'合同信息'" :cols="3">
        <el-form-item slot="col_1" label="合同编号：">
          <el-input v-model="dataForm.contractCode" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="合同名称：">
          <el-input v-model="dataForm.contract" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="甲方：">
          <el-input v-model="dataForm.customerA" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="甲方(二)：">
          <el-input v-model="dataForm.customerB" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="甲方(三)：">
          <el-input v-model="dataForm.customerC" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="变更后合同总金额(含税)：">
          <el-input v-model="dataForm.totalChangeAmountTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'变更信息'" :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="changeDate" label="变更日期：">
          <el-date-picker
            v-model="dataForm.changeDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="changeTheType" label="变更类型：">
          <el-checkbox-group v-model="dataForm.changeTheType" @change="changeTheTypeEvent">
            <el-checkbox v-for="(item,index) in changeTheTypeOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="changeCustomer" label="变更甲方：">
          <el-radio-group v-model="dataForm.changeCustomer">
            <el-radio v-for="(item,index) in changeCustomerOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="afterChangeCustomerId" label="变更后甲方：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.afterChangeCustomer" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'afterChangeCustomer','afterChangeCustomerId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="changeAmountBelong" label="变更金额归属：">
          <el-radio-group v-model="dataForm.changeAmountBelong" :disabled="isDisabledChangeAmountBelong" @change="changeAmountBelongEvent">
            <el-radio v-for="(item,index) in changeAmountBelongOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="changeAmountTax" label="本次变更金额(含税)：">
          <amount-input v-model="dataForm.changeAmountTax" :disabled="dataForm.changeTheType.indexOf('3')==-1"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="税率(%)：">
          <el-input v-model="dataForm.taxRate" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="本次变更金额(无税)：">
          <el-input v-model="contractAmountTaxFree" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isUseProvisionalSums" label="是否使用暂列金：">
          <el-radio-group v-model="dataForm.isUseProvisionalSums" :disabled="isDisabledUseProvisionalSums">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="agentOfPaymentId" label="代付款单位：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.agentOfPayment" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'agentOfPayment','agentOfPaymentId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="是否触碰营销底线：">
          <el-radio-group v-model="dataForm.isBaseLine">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="otherTermsChange" label="其他条款变更：">
          <el-input v-model="dataForm.otherTermsChange" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'变更后收款方式'"></form-title>
      <el-button type="primary" @click="addPayinDetailList">新建</el-button>
      <el-table :data="dataForm.payinDetailList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="收款方式" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-select v-model="scope.row.term" placeholder="请选择">
              <el-option v-for="(item,index) in termOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="收款比例(%)" :render-header="addRedStar">
          <template slot-scope="scope">
            <percentageInput v-model="scope.row.scale"  />
          </template>
        </el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button type="text" @click="delPayinDetailList(scope.$index)">删除</el-button>
           </template>
        </el-table-column>
      </el-table>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
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
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { getContractInMainAmount } from '@/Api/workflowBusssion/contract.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import numberInput from '@/components/basic/numberInput/index.vue';
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
import tools from '@/utils/fun.js';
const requiredArray = ['changeDate', 'changeAmountTax', 'constructCode', 'customerCId', 'changeTheType','changeCustomer', 'afterChangeCustomerId',
'changeAmountBelong', 'isUseProvisionalSums', 'agentOfPayment', 'otherTermsChange','fileInfoList', 'prepaymentDeductionMethod'];
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput,numberInput,percentageInput, cascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      isReadOnly: false,
      dataForm: {
        code: '',
        contractInMainId: '',
        afterChangeCustomer: '',
        afterChangeCustomerId: '',
        agentOfPayment: '',
        agentOfPaymentId: '',
        constructArchiveMainId: '',
        constructCode: '',
        moduleType: '',
        customerB: '',
        customerC: '',
        customerAId: '',
        customerA: '',
        managerDeptName: '',
        contract: '',
        contractCode: '',
        customerBId: '',
        constructManager: '',
        customerCId: '',
        saleTaxRate: '',
        designTaxRate: '',
        market_main_id: '',
        changeAmountBelong: '',
        constructionRate: '',
        constructName: '',
        totalChangeAmountTax: '',
        fileInfoList: [],
        payinDetailList: [],
        changeTheType: []
      },
      changeTheTypeOptions: [],
      changeAmountBelongOptions: [],
      changeCustomerOptions: [],
      termOptions: [],
      radioOptions: [],
      prepaymentDeductionMethodOptions: [],
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
      masterContractDialog: { code: 'v_construct_archive_main', customDialog: 'v_construct_archive_main', isSetHead: 1, isMulti: false, initailData: [] },
      mainContractDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
      customerDialog: { code: 'KeShangDangAn_CP013', customDialog: 'KeShangDangAn_CP013', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  computed: {
    /**
     * 【本次变更金额(无税)】系统计算=本次变更金额(含税)/(1+税率)，2位小数位
     */
    contractAmountTaxFree() {
      if(this.dataForm.changeAmountTax && this.dataForm.taxRate) {
        return this.dataForm.changeAmountTax/(1+this.dataForm.taxRate)
      }
      return ''
    },
    /**
     * 【变更金额归属】当 变更类型 勾选 金额 且 所选合同=【建安合同】时，编制人必填，
     * 当所选合同=【建安合同】合同类型 只有一个时，则默认带出，不可修改，若有多个则用户可编辑，
     * 当 变更类型 勾选 金额 且 所选合同=【设计收入合同】时，默认勾选 设计，不可修改-刷一下历史数据
     */
    isDisabledChangeAmountBelong() {
      if(this.dataForm.changeTheType.indexOf('3') != -1 &&  this.dataForm.changeAmountBelong && this.dataForm.changeAmountBelong.split(',') > 1) return false;
      return true;
    },
    /**
     * 当 变更类型 勾选 金额时，且带出的合同编号是建安合同时，编制人必填，单选，否则不可编辑 
     */
    isDisabledUseProvisionalSums() {
      if(this.dataForm.changeTheType.indexOf('3') != -1 && this.dataForm.moduleType==1) return false;
      return true;
    }
  },
  mounted() { },
  methods: {
    /**
     * 变更后合同总金额(含税）
     */
    async getContractInMainAmount() {
      const res = await getContractInMainAmount(this.dataForm.contractInMainId)
      if(res.code == 200){
        this.dataForm.totalChangeAmountTax = res.data;
      }
    },
    /**
     * 1,客户 2,结算方式 3,金额 4,代付款单位 5,其他
     * @param {*} val 
     * @param {*} isInit 是否初始化进来的 
     */
    changeTheTypeEvent() {
      // 所选合同=【设计收入合同】时，默认勾选 设计
      if(this.dataForm.moduleType == 2) {
        this.dataForm.changeAmountBelong = '2'
      } else {
        const contractType = this.dataForm.changeAmountBelong.split(',')
        // 若有多个所选合同=【建安合同】则用户可编辑
        if(contractType.length > 0) {
          this.dataForm.changeAmountBelong = ''
        } else {
          this.dataForm.changeAmountBelong = contractType
          
        }
      }
      this.initCurFiledRule()
    },
    /**
     * 变更金额归属
     * @param {*} val 
     */
    changeAmountBelongEvent(val) {
      const { constructionRate, designTaxRate, saleTaxRate } = this.dataForm
      this.dataForm.taxRate = val == 1 ? constructionRate : val == 2 ? designTaxRate : saleTaxRate;
    },
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      if(this.dataForm.changeTheType.indexOf('2') != -1) {
        return [
          h("span", " " + column.label),
          h("span", { style: "color: red" }, "*")
        ];
      }
      return  h("span", " " + column.label);
    },
    /**
     * 更新客商信息（合同乙方，合同丙方）
     */
    updateCustomerValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
      this.$forceUpdate()
    },
    /**
     * 项目编号
     */
    updateMasterContractValue(data) {
      if(data && data.length <= 0) return;
      const { constructArchiveMainId, constructCode, moduleType, customerB, customerC, customerAId,
        customerA, managerDeptName, contract, contractCode, customerBId, contractManagerName, customerCId,
        saleTaxRate, designTaxRate, market_main_id, contractTypeId, constructionRate, constructName, contractInMainId } = data[0];
      this.dataForm.constructArchiveMainId = constructArchiveMainId;
      this.dataForm.constructCode = constructCode;
      this.dataForm.contractInMainId = contractInMainId;
      this.dataForm.moduleType = moduleType;
      this.dataForm.customerB = customerB;
      this.dataForm.customerC = customerC;
      this.dataForm.customerAId = customerAId;
      this.dataForm.customerA = customerA;
      this.dataForm.managerDeptName = managerDeptName;
      this.dataForm.contract = contract;
      this.dataForm.contractCode = contractCode;
      this.dataForm.customerBId = customerBId;
      this.dataForm.constructManager = contractManagerName;
      this.dataForm.customerCId = customerCId;
      this.dataForm.saleTaxRate = saleTaxRate;
      this.dataForm.designTaxRate = designTaxRate;
      this.dataForm.market_main_id = market_main_id;
      this.dataForm.changeAmountBelong = contractTypeId;
      this.dataForm.constructionRate = constructionRate;
      this.dataForm.constructName = constructName;
      // changeAmountBelong 合同类型 【1，施工，2，设计，3，销售，4，其他】
      if(contractTypeId && contractTypeId.split(',').length == 1) {
        this.dataForm.taxRate = contractTypeId == 1 ? constructionRate : contractTypeId == 2 ? designTaxRate : saleTaxRate;
      }
      this.getContractInMainAmount();
      this.$forceUpdate()
    },
    beforeInit() {
      this.getDataDictByConfigType()
      this.initCurFiledRule()
    },
    afterInit() {
      if (this.dataForm.changeTheType) {
        this.dataForm.changeTheType = this.dataForm.changeTheType.split(',');
      } else {
        this.dataForm.changeTheType = []
      }
      // 税率
      const { changeAmountBelong, constructionRate, designTaxRate, saleTaxRate } = this.dataForm;
      if(changeAmountBelong && changeAmountBelong.split(',').length == 1) {
        this.dataForm.taxRate = changeAmountBelong == 1 ? constructionRate : changeAmountBelong == 2 ? designTaxRate : saleTaxRate;
      }
      this.dataForm.changeAmountBelong = this.dataForm.changeAmountBelong?this.dataForm.changeAmountBelong.split(','):'';
      this.initCurFiledRule()
    },
    /**
     * 初始化校验
     */
    initCurFiledRule() {
      const { changeTheType } = this.dataForm;
      // 【变更甲方】当 变更类型 勾选 甲方时，编制人必填，单选，否则不可编辑 
      this.dataRule['changeCustomer'] = RuleRequired.curFiledRule(changeTheType.indexOf('1')!=-1);

      // 【变更后甲方】当 变更类型 勾选 甲方时，编制人必填，客商类别为“客户”的【客商档案】控件，显示名称，否则不可编辑 
      // 审核通过后 根据勾选的“变更甲方”更新所选合同(主合同+增补合同) 甲方或甲方(二)或甲方(三) 字段
      this.dataRule['afterChangeCustomer'] = RuleRequired.curFiledRule(changeTheType.indexOf('1')!=-1);

      // 【变更金额归属】当 变更类型 勾选 金额 且 所选合同=【建安合同】时，编制人必填，当所选合同=【建安合同】合同类型 只有一个时，则默认带出，不可修改，若有多个则用户可编辑，
      // 当 变更类型 勾选 金额 且 所选合同=【设计收入合同】时，默认勾选 设计，不可修改-刷一下历史数据
      this.dataRule['changeAmountBelong'] = RuleRequired.curFiledRule(!this.isDisabledChangeAmountBelong);

      // 【本次变更金额(含税)】当 变更类型 勾选 金额 时，编制人必填，否则不可编辑 
      this.dataRule['changeAmountTax'] = RuleRequired.curFiledRule(changeTheType.indexOf('3')!=-1);

      // 【是否使用暂列金】当 变更类型 勾选 金额时，且带出的合同编号是建安合同时，编制人必填，单选，否则不可编辑 
      this.dataRule['isUseProvisionalSums'] = RuleRequired.curFiledRule(!this.isDisabledUseProvisionalSums);

      // 【代付款单位】当 变更类型 勾选 代付款单位时，编制人必填，客商类别为“客户”的【客商档案】控件，显示名称；否则不可编
      this.dataRule['agentOfPayment'] = RuleRequired.curFiledRule(changeTheType.indexOf('1')!=-1);

      // 【其他条款变更】当 变更类型 勾选 其他条款 时，编制人必填，否则不可编辑
      this.dataRule['otherTermsChange'] = RuleRequired.curFiledRule(changeTheType.indexOf('5')!=-1);
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.changeTheType = this.dataForm.changeTheType.toString();
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      //【变更后收款方式】当变更类型勾选了 收款方式 时必填，且校验各收款方式的收款比例之和必须等于100%
      const _this = this;
      if(_this.dataForm.changeTheType.indexOf('2') != -1) {
        if(_this.dataForm.payinDetailList.length <= 0) {
          _this.$message.error('请至少添加变更后收款方式')
          return resolve(false)
        }
        var totalScale = 0;
        for (var i = 0; i < _this.dataForm.payinDetailList.length; i++) {
          if(!_this.dataForm.payinDetailList[i].term || !_this.dataForm.payinDetailList[i].scale) {
            FUI.Window.showMsg2('变更后收款方式列表中，所有表格行都需补充完整！');
            return resolve(false)
          }
          totalScale = tools.getNumAdd(totalScale,_this.dataForm.payinDetailList[i].scale)
        }
        if(totalScale != 1){
          return FUI.Window.showMsg2('各收款方式的收款比例之和必须等于100%'); 
        }
      }
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
     * 新增变更后收款方式
     */
    addPayinDetailList() {
      this.dataForm.payinDetailList.push({
        id: '',
        term: '',
        scale: ''
      });
    },
    /**
     * 删除变更后收款方式
     */
    delPayinDetailList(index) {
      this.dataForm.payinDetailList.splice(index,1);
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: 
        '是或否,变更类型,建安合同类型,结算方式,变更客户' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '变更类型':
              this.changeTheTypeOptions = ele.dataDict;
              break;
            case '建安合同类型':
              this.changeAmountBelongOptions = ele.dataDict;
              break;
            case '采购材料类型':
              this.purchaseMaterialsTypeOptions = ele.dataDict;
              break;
            case '结算方式':
              this.termOptions = ele.dataDict;
              break;
            case '变更客户':
              this.changeCustomerOptions = ele.dataDict;
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
