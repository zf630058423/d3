<template>
  <!-- 客户信息登记 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="180px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="guaranteeExpireDate" label="保函到期日：">
          <el-date-picker
            v-model="dataForm.guaranteeExpireDate"
            type="date"
            size="small"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            :disabled="setting.readonly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="guaranteeType" label="保函类型：">
          <el-select v-model="dataForm.guaranteeType" placeholder="请选择" size="small"
            style="width:100%" @change="changeGuaranteeType" :disabled="setting.readonly">
            <el-option v-for="(item,index) in guaranteeTypeOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="guaranteeAmount" label="保函金额(含税)(元)：">
          <amountInput v-model="dataForm.guaranteeAmount" :disabled="setting.readonly"></amountInput>
        </el-form-item>
        <el-form-item slot="col_2" prop="isOpenBank" label="是否要求开立行：">
          <el-radio-group v-model="dataForm.isOpenBank" :disabled="setting.readonly">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="guaranteeCompany" label="保函开具公司：">
          <el-input v-model="dataForm.guaranteeCompany" size="small" :disabled="isZhuanYuanApprove"
            placeholder="请输入" maxlength="100" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isPublic" label="是否公共交易中心开具：">
          <el-radio-group v-model="dataForm.isPublic" :disabled="dataForm.guaranteeType!='1'||setting.readonly">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="bidStartDate" label="招标开始日期：">
          <el-date-picker
            v-model="dataForm.bidStartDate"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            :disabled="setting.readonly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="guaranteeForm" label="保函格式：">
          <el-select v-model="dataForm.guaranteeForm" placeholder="请选择" :disabled="setting.readonly"
            size="small" style="width:100%" >
            <el-option v-for="(item,index) in guaranteeFormOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="beneficiaryName" label="客户(受益人)名称：">
          <el-input v-model="dataForm.beneficiaryName" size="small" :disabled="setting.readonly" placeholder="请输入" maxlength="30" />
        </el-form-item>
        <el-form-item slot="col_2" prop="addressDetail" label="详细地址：">
          <el-input v-model="dataForm.addressDetail" :disabled="setting.readonly" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
        <el-form-item slot="col_3" prop="bidEndDate" label="投标截止时间/开竣工时间：" label-width="190px">
          <el-date-picker
            v-model="dataForm.bidEndDate"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            :disabled="setting.readonly"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="addressArea" label="客户(受益人)地址：">
          <cascSelect :default-value="dataForm.addressArea" :disabled="setting.readonly" code="AddressCascade" @change-select="changeAddressArea" />
        </el-form-item>
        <el-form-item slot="col_2" prop="guaranteeStartDate" label="保函开立日期：">
          <el-date-picker
            v-model="dataForm.guaranteeStartDate"
            type="datetime"
            size="small"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            :disabled="!isZhuanYuanApprove23"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="guaranteeEndDate" label="保函失效日期：">
            <el-date-picker
            v-model="dataForm.guaranteeEndDate"
            type="datetime"
            size="small"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            :disabled="!isZhuanYuanApprove23"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="guaranteeNo" label="保函编号：">
          <el-input v-model="dataForm.guaranteeNo" :disabled="!isZhuanYuanApprove23" size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="isPayDemand" label="是否见索即付：">
          <el-radio-group v-model="dataForm.isPayDemand" :disabled="!isZhuanYuanApprove23">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :title="'立项信息'" :cols="3" v-if="dataForm.guaranteeType=='1'">
        <el-form-item slot="col_1" prop="marketMainId" label="立项编号：">
          <selector-dialog :model-data="marketCodeDialog" :value="dataForm.marketCode" :btnDisabled="setting.readonly"
           dynamic-model="customDialog" @updateValue="updateMarketCodeValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="立项名称：">
          <el-input v-model="dataForm.marketName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'项目信息'" :cols="3" v-else>
        <el-form-item slot="col_1" prop="constructArchiveMainId" label="项目编号：">
          <selector-dialog :model-data="constructCodeDialog" :value="dataForm.constructCode" :btnDisabled="setting.readonly"
           dynamic-model="customDialog" @updateValue="updateConstructCodeValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="项目名称：">
          <el-input v-model="dataForm.constructName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="管理部门：">
          <el-input v-model="dataForm.constructUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="客户：">
          <el-input v-model="dataForm.customerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="结算方式：">
          <el-select v-model="dataForm.balaType" placeholder="自动填写" size="small" style="width:100%" disabled>
            <el-option v-for="(item,index) in balaTypeOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isReplenishFile" slot="col_3" label="是否补充上传资料：">
          <el-radio-group v-model="dataForm.isReplenishFile" :disabled="!isZhuanYuanApprove2">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 6}" :disabled="setting.readonly"
           size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="contractFileInfoList" label="合同等资料上传：">
          <update-files v-model="dataForm.contractFileInfoList" :disabled="setting.readonly"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" v-show="dataForm.guaranteeType=='1'">
        <el-form-item slot="col_1" prop="bidFileInfoList" label="招标文件：">
          <update-files v-model="dataForm.bidFileInfoList" :disabled="setting.readonly"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" v-show="isZhuanYuanApprove1">
        <el-form-item slot="col_1" prop="financingFileInfoList" label="融资专员上传资料：">
          <update-files v-model="dataForm.financingFileInfoList" :disabled="!isZhuanYuanApprove1"></update-files>
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
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
// import numberInput from '@/components/basic/numberInput/index'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
const requiredArray = ['guaranteeType', 'guaranteeAmount', 'guaranteeExpireDate','guaranteeCompany',
  'isPublic', 'isOpenBank', 'guaranteeForm', 'addressArea', 'bidStartDate', 'beneficiaryName', 'bidEndDate',
  'addressArea', 'addressDetail', 'marketMainId', 'constructArchiveMainId', 'bidFileInfoList', 'isPayDemand',
  'financingFileInfoList', 'contractFileInfoList', 'isReplenishFile']
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput, cascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      isReadOnly: false,
      dataForm: {
        code: '',
        guaranteeType: '',
        guaranteeAmount: '',
        guaranteeExpireDate: '',
        guaranteeCompany: '',
        isPublic: '',
        isOpenBank: '',
        guaranteeForm: '',
        beneficiaryName: '',
        bidEndDate: '',
        bidStartDate: '',
        addressArea: '',
        addressDetail: '',
        guaranteeNo: '',
        guaranteeStartDate: '',
        guaranteeEndDate: '',
        guaranteeType: '',
        industryCategory: '',
        marketName: '',
        marketUnitName: '',
        customerName: '',
        balaType: '29',
        isReplenishFile: '',
        projectManagerName: '',
        remark: '',
        marketCenterId: '',
        constructionUnitId: '',
        marketMainId: null,
        constructArchiveMainId: null,
        financingFileInfoList: [],
        bidFileInfoList: [],
        contractFileInfoList: []
      },
      guaranteeTypeOptions: [],
      guaranteeFormOptions: [],
      balaTypeOptions: [],
      radioOptions: [],
      constructCodeDialog: { code: 'v_construct_archive_main', customDialog: 'v_construct_archive_main', isSetHead: 1, isMulti: false, initailData: [] },
      marketCodeDialog: { code: 'market_main', customDialog: 'market_main', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      form: {
        modifyReason: ''
      }
    };
  },
  computed: {
    /**
     * 融资专员第二次、第三次审批必填
     * 【保函编号，保函开立日期，保函失效日期，是否见索即付】
     */
    isZhuanYuanApprove23() {
      const isRequired = ['融资专员2','融资专员3'].find(res=> {return this.currentActivityName.indexOf(res) != -1})?true:false;
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      this.dataRule['guaranteeNo'] = RuleRequired.curFiledRule(isRequired&&isApprove);
      this.dataRule['guaranteeStartDate'] = RuleRequired.curFiledRule(isRequired&&isApprove);
      this.dataRule['guaranteeEndDate'] = RuleRequired.curFiledRule(isRequired&&isApprove);
      this.dataRule['isPayDemand'] = RuleRequired.curFiledRule(isRequired&&isApprove);
      return isRequired;
    },
    /**
     * 【保函开具公司】编制人必填，文本框；融资专员审批可编辑必填
     */
    isZhuanYuanApprove() {
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      const isRequired = ['融资专员1'].find(res=> {return this.currentActivityName.indexOf(res) != -1})?true:false;
      this.dataRule['guaranteeCompany'] = RuleRequired.curFiledRule(isRequired&&isApprove?true:!this.setting.readonly);
      return isRequired&&isApprove?false:this.setting.readonly;
    },
    /**
     * 是否上传资料=是，融资专员2必填，否则无法编辑
     */
    isZhuanYuanApprove1() {
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      const isRequired = ['融资专员2'].find(res=> {return this.currentActivityName.indexOf(res) != -1})?true:false;
      const requiredField = isRequired && this.dataForm.isReplenishFile == '1'?true:false;
      let required = requiredField&&isApprove?true:false
      this.dataRule['financingFileInfoList'] = RuleRequired.curFiledRule(required);
      return required;
    },
    /**
     * 【是否上传资料】编制人不可填，融资专员第二次审批必填
     */
    isZhuanYuanApprove2() {
      const isRequired = ['融资专员2'].find(res=> {return this.currentActivityName.indexOf(res) != -1})?true:false;
      this.dataRule['isReplenishFile'] = RuleRequired.curFiledRule(isRequired);
      return isRequired;
    },
    /**
     * 当前审批节点
     */
    currentActivityName() {
      return WFContext.CurrentActivityName.trim();
    }
  },
  mounted() { },
  methods: {
    /**
     * 客户(受益人)地址
     */
    changeAddressArea(data){
      this.dataForm.addressArea = data.value;
      this.$refs['dataForm'].clearValidate('addressArea')
    },
    /**
     * 更新立项编号的值
     */
    updateMarketCodeValue(data) {
      if(data && data.length<= 0) return;
      let {id,CODE,NAME,marketUnitName, customerName, projectLeaderName, customerId} = data[0];
      this.dataForm.marketMainId = id;
      this.dataForm.marketCode = CODE;
      this.dataForm.marketName = NAME;
      this.dataForm.marketUnitName = marketUnitName;
      this.dataForm.projectManagerName = projectLeaderName;
      this.dataForm.customerId = customerId;
      this.dataForm.customerName = customerName;
    },
    /**
     * 更新项目编号的值
     */
    updateConstructCodeValue(data) {
      if(data && data.length<= 0) return;
      let {constructArchiveMainId,constructCode,constructName,managerDeptName,
        contractManagerName, customerA, constructionUnitId, marketCenterId} = data[0];
      this.dataForm.constructArchiveMainId = constructArchiveMainId;
      this.dataForm.constructCode = constructCode;
      this.dataForm.constructName = constructName;
      this.dataForm.constructUnitName = managerDeptName;
      this.dataForm.projectManagerName = contractManagerName;
      this.dataForm.customerName = customerA;
      this.dataForm.constructionUnitId = constructionUnitId;
      this.dataForm.marketCenterId = marketCenterId;
    },
    /**
     * 保函类型(更新)
     */
    changeGuaranteeType(val) {
      //【是否公共交易中心开具】 保函类型为投标保函，编制人必填；保函类型为其他类型保函，编制人不可填；
      if(val) {
        this.requiredField(val)
        this.removeFieldValue(['marketMainId','marketCode','marketName','marketUnitName',
          'constructArchiveMainId','constructCode','constructName','constructUnitName',
          'projectManagerName', 'isPublic'])
      }
    },
    /**
     * 必填字段
     */
    requiredField(val) {
      this.dataRule['isPublic'] = RuleRequired.curFiledRule(val=='1');
      this.dataRule['marketMainId'] = RuleRequired.curFiledRule(val=='1');
      this.dataRule['constructArchiveMainId'] = RuleRequired.curFiledRule(val!='1');
      this.dataRule['bidFileInfoList'] = RuleRequired.curFiledRule(val=='1');
    },
    /**
     * 删除字段值
     */
    removeFieldValue(array){
      array.forEach(e=>{
        this.dataForm[e] = null
      })
    },
    /**
     * 切换地址
     */
    AddressCascade(data) {
      this.dataForm.areaId = data.value
      this.$refs['dataForm'].clearValidate('areaId')
    },
    beforeInit() {
      this.getDataDictByConfigType()
      if(!this.dataForm.id) this.requiredField(this.dataForm.guaranteeType);
    },
    afterInit() {
      this.requiredField(this.dataForm.guaranteeType);
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
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
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '是或否,保函类型,保函格式,结算方式' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '保函类型':
              this.guaranteeTypeOptions = ele.dataDict;
              break;
            case '保函格式':
              this.guaranteeFormOptions = ele.dataDict;
              break;
            case '结算方式':
              this.balaTypeOptions = ele.dataDict;
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
