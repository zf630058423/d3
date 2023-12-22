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
        <el-form-item slot="col_1" label="合同编号：">
          <el-input v-model="dataForm.contractCode" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目编号：">
          <selector-dialog :model-data="constructMainDialog" :value="dataForm.constructCode" dynamic-model="customDialog" @updateValue="updateConstructMainValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.managerDeptName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目介绍人：">
          <el-input v-model="dataForm.projectLeaderName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'合同信息'" :cols="3">
        <el-form-item slot="col_1" prop="contType" label="合同类别：">
          <el-radio-group v-model="dataForm.contType" @change="getContractCode">
            <el-radio v-for="(item,index) in contTypeOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同编号：">
          <el-input v-model="dataForm.masterContCode" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="主合同名称：">
          <el-input v-model="dataForm.masterContName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="contract" label="合同名称：">
          <el-input v-model="dataForm.contract" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" label="协议编号：">
          <el-input v-model="dataForm.schemeCode" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="协议名称：">
          <el-input v-model="dataForm.scheme" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="合同类型：">
          <el-input :value="'设计收入合同'" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="copy" label="合同份数：">
          <numberInput v-model="dataForm.copy"></numberInput>
        </el-form-item>
        <el-form-item slot="col_3" prop="contractSignDate" label="合同签订日期：">
          <el-date-picker
            v-model="dataForm.contractSignDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerAId" label="甲方：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.customerA" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'customerA','customerAId')" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="supplierMainId" label="乙方：">
          <selector-dialog :width="500" :model-data="orgDialog" :value="dataForm.supplierMainName" dynamic-model="selectOrg" @updateValue="updateOrgValue($event)" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="effectiveDate" label="合同生效日期：">
          <el-date-picker
            v-model="dataForm.effectiveDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="甲方(二)：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.customerB" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'customerB', 'customerBId')" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="甲方(三)：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.customerC" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'customerC', 'customerCId')" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="endDate" label="合同结束日期：">
          <el-date-picker
            v-model="dataForm.endDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="norigsignmnyTax" label="合同金额(含税)(元)：">
          <amount-input v-model="dataForm.norigsignmnyTax"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="taxRateId" label="税率(%)：">
          <selector-dialog :model-data="taxRateDialog" :value="dataForm.taxRate" dynamic-model="customDialog" @updateValue="updateTaxRateValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="合同金额(无税)(元)：">
          <el-input disabled placeholder="自动带出" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="balaTypeId" label="结算方式：">
          <el-select v-model="dataForm.balaTypeId" placeholder="请选择" :disabled="isMainContract">
            <el-option v-for="(item,index) in balaTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="isbaseline" label="是否触碰营销底限：">
          <el-radio-group v-model="dataForm.isBaseLine">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="合同是否归档：">
          <el-radio-group v-model="dataForm.isTheContractArchived" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.memo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="500" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'收款条款'" :cols="3">
        <el-form-item slot="col_1" prop="advPayment" label="预收款(%)：">
          <percentage-input v-model="dataForm.advPayment" :disabled="isMainContract"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_2" label="进度款(%)：">
          <percentage-input v-model="dataForm.proPayment" :disabled="isMainContract"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="comPayment" label="完工款(%)：">
          <percentage-input v-model="dataForm.comPayment" :disabled="isMainContract"></percentage-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="settlement" label="结算款(%)：">
          <percentage-input v-model="dataForm.settlement" :disabled="isMainContract"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="retMoney" label="质保金(%)：">
          <percentage-input v-model="dataForm.retMoney" :disabled="isMainContract"></percentage-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'进度款(%)-按节点收款'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addProgressDetailList">新增</el-button>
      </div>
      <el-table :data="dataForm.progressDetailList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column type="index" label="序号" width="120px" />
        <el-table-column label="节点内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nodeContent" :disabled="isMainContract" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="进度款比例(%)">
          <template slot-scope="scope">
            <percentage-input v-model="scope.row.progressPayment" :disabled="isMainContract"></percentage-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delProgressDetailList(scope.$index)">删除</el-button>
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
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { getContractCode } from '@/Api/workflowBusssion/contract.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import numberInput from '@/components/basic/numberInput/index.vue';
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import tools from '@/utils/fun.js';
//必填字段 先全部加载
const requiredArray = ['differentPlaces', 'contract', 'contType','copy', 'customerAId', 'contractSignDate',
  'effectiveDate', 'endDate', 'taxRateId', 'isbaseline', 'fileInfoList', 'supplierMainId','advPayment',
  'comPayment','settlement','retMoney'];
export default {
  components: { FormTitle, selectorDialog, RowLayout, cascSelect, updateFiles, numberInput, percentageInput, amountInput },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      isReadOnly: false,
      dataForm: {
        code: '',
        contType: '1',
        customerAId: '',
        customerA: '',
        customerBId: '',
        customerB: '',
        customerCId: '',
        customerC: '',
        supplierMainId: '',
        supplierMainName: '',
        isTheContractArchived: '0',
        projectAgreementId: '',
        taxRate: '',
        taxRateId: '',
        taxRateName: '',
        projectAgreementname: '',
        managerDeptName: '',
        isbaseline: '',
        projectLeaderName: '',
        progressDetailList: [],
        fileInfoList: []
      },
      contTypeOptions: [],
      radioOptions: [],
      postOptions: [],
      balaTypeOptions: [],
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
      projectAgreementDialog: { code: 'XiangMuXieYi', customDialog: 'XiangMuXieYi', isSetHead: 1, isMulti: false, initailData: [] },
      constructMainDialog: { code: 'XiangMuDangAn', customDialog: 'XiangMuDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      customerDialog: { code: 'KeShangDangAn_CP236', customDialog: 'KeShangDangAn_CP236', isSetHead: 1, isMulti: false, initailData: [] },
      orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
      userDialog: { code: 'selectUsers', customDialog: 'selectUsers', isSetHead: 1, parm: { singleSelect: true }, initailData: [] },
      laborSubcontractorDialog: { code: 'supplier_main', customDialog: 'supplier_main', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  computed: {
    /**
     * 【合同金额(无税)(元)】合同金额(含税)(元)/(1+施工税率)
     */
    norigsignmny() {
      if(!this.dataForm.norigsignmnyTax || this.dataForm.taxRate) return '0.00';
      return this.dataForm.norigsignmnyTax/(1+this.dataForm.taxRate);
    },
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
    },
    /**
     * 合同类别=增补合同，根据主合同带出，不可修改
     */
    isMainContract() {
      return this.dataForm.contType == 2 ? true: false
    }
  },
  mounted() { },
  methods: {
    /**
     * 税率
     */
    updateTaxRateValue(data) {
      if (data.length <= 0) return;
      this.dataForm.taxRateId = data[0].id
      this.dataForm.taxRateName = data[0].name
      this.dataForm.taxRate = data[0].taxRate
    },
    /**
     * 更新组织（乙方）
     */
    updateOrgValue(data){
      if(data && data.length <= 0) return;
      const { value, text } = data[0];
      this.dataForm.supplierMainId = value;
      this.dataForm.supplierMainName = text;
    },
    /**
     * 更新客商信息（甲方，甲方二，甲方三）
     */
    updateCustomerValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
      this.$forceUpdate()
    },
    /**
     * 更新项目数据
     */
    updateConstructMainValue(data) {
      if(data && data.length <= 0) return;
      const { constructArchiveMainId, constructCode, deptName, constructName, projectLeaderName,masterContCode,masterContName,
        masterContId, schemeCode, scheme, schemeId, businessUnit, marketMainId, customerNameA, customerNameAId,
        isWinBid, isWinBidId } = data[0];
      this.dataForm.marketMainId = marketMainId;
      this.dataForm.constructArchiveMainId = constructArchiveMainId;
      this.dataForm.constructCode = constructCode;
      this.dataForm.constructName = constructName;
      this.dataForm.managerDeptName = deptName;
      this.dataForm.projectLeaderName = projectLeaderName;
      this.dataForm.masterContId = masterContId;
      this.dataForm.masterContCode = masterContCode;
      this.dataForm.masterContName = masterContName;
      this.dataForm.schemeCode = schemeCode;
      this.dataForm.schemeId = schemeId;
      this.dataForm.scheme = scheme;
      // 如果合同无主合同合同类别只能选中主合同
      if(!masterContId) this.dataForm.contType = '1'
      //当合同类别=主合同，编制人可编辑，默认根据选择的“项目编号”带出对应的客户
      if(this.dataForm.contType == '1') {
        this.dataForm.customerA = customerNameA;
        this.dataForm.customerAId = customerNameAId;
        // 乙方
        this.dataForm.supplierMainName = isWinBid;
        this.dataForm.supplierMainId = isWinBidId;
      }
      // 【是否触碰营销底限】仅业务单元为 中装幕墙 或 深圳市中装科技幕墙工程有限公司 时 必填，否则非必填
      this.dataRule['isbaseline'] = RuleRequired.curFiledRule(businessUnit == '中装幕墙' || businessUnit == '深圳市中装科技幕墙工程有限公司'?true:false);
      this.getContractCode();
      this.$forceUpdate()
    },
    /**
     * 【合同编号】不可编辑，选择项目后自动把项目编号填充至此，若为合同类别为增补合同，则在项目编号的基础上加3位流水号
     * contType 1,主合同 2，增补合同
     */
    async getContractCode() {
      if(!this.dataForm.constructCode) return;
      if(this.dataForm.contType == '2') {
        const res = await getContractCode(this.dataForm.constructCode);
        if(res.code == 200) {
          this.dataForm.contractCode = res.data;
          this.$forceUpdate()
        }
      } else {
        this.dataForm.contractCode = JSON.parse(JSON.stringify(this.dataForm.constructCode))
        // 当项类别=主合同，【主合同编号，主合同名称】为空；
        this.dataForm.masterContCode = ""
        this.dataForm.masterContName = ""
        this.$forceUpdate()
      }
    },

    /**
     * 添加进度款(%)-按节点收款
     */
    addProgressDetailList() {
      if (!this.dataForm.progressDetailList) this.dataForm.progressDetailList = []
      this.dataForm.progressDetailList.push({
        contractInMainId: '',
        id: '',
        nodeContent: '',
        progressPayment: ''
      })
    },
    /**
     * 删除进度款(%)-按节点收款
     */
    delProgressDetailList(index) {
      this.dataForm.progressDetailList.splice(index, 1)
    },
    beforeInit() {
      this.initRuleRequired();
      this.getDataDictByConfigType()
    },
    afterInit() {
      this.dataForm.constructCode = this.dataForm.code;
      if(this.dataForm.contType == '1') {
        // 当项类别=主合同，【主合同编号，主合同名称】为空；
        this.dataForm.masterContCode = ""
        this.dataForm.masterContName = ""
      }
      this.initRuleRequired();
    },
    // 初始化必填校验
    initRuleRequired() {
      // 【是否触碰营销底限】仅业务单元为 中装幕墙 或 深圳市中装科技幕墙工程有限公司 时 必填，否则非必填
      this.dataRule['isbaseline'] = RuleRequired.curFiledRule(this.dataForm.businessUnit == '中装幕墙'
       || this.dataForm.businessUnit == '深圳市中装科技幕墙工程有限公司'?true:false);
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.code = this.dataForm.constructCode;
      dataForm.norigsignmnyTax = this.dataForm.norigsignmnyTax-0;
      return dataForm;
    },
    /**
     * 表单校验
     */
    validateForm() {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if(_this.dataForm.proPayment && _this.dataForm.progressDetailList.length > 0) {
              FUI.Window.showMsg('进度款(%) 与 进度款(%)-按节点收款只能填1个')
              return resolve(false)
            }
            if(_this.dataForm.progressDetailList.length<=0 && !_this.dataForm.proPaymen) {
              FUI.Window.showMsg('进度款(%) 与 进度款(%)-按节点收款必须填1个')
              return resolve(false)
            }
            // 进度款(%)≥预收款(%)
            if(_this.dataForm.progressDetailList.length<=0&&Number(_this.dataForm.proPayment) < Number(_this.dataForm.advPayment)) {
              FUI.Window.showMsg('进度款(%)<预收款(%)')
              return resolve(false)
            }
            // 完工款(%)≥进度款(%)
            if(Number(_this.dataForm.comPayment) < Number(_this.dataForm.proPayment)) {
              FUI.Window.showMsg('完工款(%)<进度款(%)')
              return resolve(false)
            }
            // 结算款(%)≥完工款(%)
            if(Number(_this.dataForm.settlement) < Number(_this.dataForm.comPayment)) {
              FUI.Window.showMsg('结算款(%)<完工款(%)')
              return resolve(false)
            }
            // 结算款(%)+质保金(%)=100(%)
            if(tools.getNumAdd(_this.dataForm.settlement,_this.dataForm.retMoney) != 1) {
              FUI.Window.showMsg('结算款(%)+质保金(%)必须=100')
              return resolve(false)
            }
            for (var i = 0; i < _this.dataForm.progressDetailList.length; i++) {
              if (_this.dataForm.progressDetailList.length>1 && _this.dataForm.progressDetailList[i].progressPayment > _this.dataForm.progressDetailList[i + 1].progressPayment) {
                FUI.Window.showMsg('进度款(%)列表中，表格行 ' + (i + 2) + ' 的进度款比例，需要大于表格行 ' + (i + 1) + ' 的进度款比例')
                return resolve(false)
              }
              if(!_this.dataForm.progressDetailList[i].nodeContent || !_this.dataForm.progressDetailList[i].progressPayment) {
                FUI.Window.showMsg2('进度款(%)列表中，所有表格行都需补充完整！');
                return resolve(false)
              }
            }
            const progressDetailList = _this.dataForm.progressDetailList
            if (progressDetailList.length > 0) {
              var progressPayment = progressDetailList[progressDetailList.length - 1]['progressPayment'];
              if (Number(_this.dataForm.advPayment) > Number(progressPayment)) {
                  FUI.Window.showMsg('预收款 不能大于 进度款-按节点收款');
                  return isOk
              }
              if (Number(progressPayment) > Number(_this.dataForm.comPayment)) {
                  FUI.Window.showMsg('进度款-按节点收款不能大于完工款');
                  return isOk
              }

          }
            return resolve(_this.getDataForm());
          } else {
            return resolve(false)
          }
        })
      });
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '结算方式,是或否,合同类别' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '结算方式':
              this.balaTypeOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '合同类别':
              this.contTypeOptions = ele.dataDict;
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
