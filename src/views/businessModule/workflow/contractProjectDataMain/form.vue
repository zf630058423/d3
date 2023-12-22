<template>
  <!-- 项目资料表单 -->
  <div class="form-box">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="180px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <template v-if="['13'].includes(dataForm.archivedMaterials)">
            <el-form-item prop="marketName" label="立项名称：">
              <el-input v-model="dataForm.marketName" disabled size="small" />
            </el-form-item>
            <el-form-item prop="followerName" label="跟进人：">
              <el-input v-model="dataForm.followerName" disabled size="small" />
            </el-form-item>
            <el-form-item prop="estimateAmountOfCooperation" label="预估合作金额：">
              <el-input v-model="dataForm.estimateAmountOfCooperation" disabled size="small" />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item prop="constructArchiveMainName" label="项目名称：">
              <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" />
            </el-form-item>
            <el-form-item :prop="`contractInOutMainCode`" label="合同编号："
              v-if="!['0', '10', '11'].includes(dataForm.archivedMaterials)">
              <select-dialog :width="600" :height="360" :model-data="masterContractCodeModelData"
                :value="dataForm.contractInOutMainCode" @updateValue="selectDialogMasterContractCode"
                :btnDisabled="!dataForm.archivedMaterials || setting.readonly"
                dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item prop="projectSchedule" label="项目进度：">
              <el-input v-model="dataForm.projectSchedule" disabled size="small" />
            </el-form-item>
           
          </template>
          
          

            <el-form-item prop="position" label="存放位置：" v-if="!['10', '11', '12'].includes(dataForm.archivedMaterials)">
            <el-input v-model="dataForm.position" :disabled='!isZhuanYuanApprove' size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="archivedMaterials" label="归档资料：">
            <el-select v-model="dataForm.archivedMaterials" placeholder="请选择" size="small" style="width: 100%">
              <el-option v-for="(item, index) in archivedMaterialsOptions" :key="index" :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="['13'].includes(dataForm.archivedMaterials)">
            <el-form-item prop="customerName" label="客户：">
              <el-input v-model="dataForm.customerName" disabled size="small" />
            </el-form-item>
            <el-form-item prop="projectAgreementCode" label="主协议编号：">
              <el-input v-model="dataForm.projectAgreementCode" disabled size="small" />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item prop="constructionUnitName" label="管理部门：">
              <el-input v-model="dataForm.constructionUnitName" disabled size="small" />
            </el-form-item>
            <el-form-item prop="contractInOutMainName" label="合同名称："
              v-if="!['0', '10', '11'].includes(dataForm.archivedMaterials)">
              <el-input v-model="dataForm.contractInOutMainName" disabled size="small" />
            </el-form-item>
            <el-form-item prop="projectStatus" label="项目状态：">
              <el-select v-model="dataForm.projectStatus" placeholder="请选择" size="small" disabled style="width: 100%">
                <el-option v-for="(item, index) in projectStatusOptions" :key="index" :label="item.configName"
                  :value="item.configValue">
                </el-option>
              </el-select>
            </el-form-item>
            
           
          </template>

          <el-form-item prop="filingDate" label="归档日期：" v-if="!['10', '11', '12'].includes(dataForm.archivedMaterials)">
              <el-date-picker v-model="dataForm.filingDate" value-format="yyyy-MM-dd" type="date" :disabled='!isZhuanYuanApprove'
                placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
        </template>
        <template slot="col_3" >
        <template v-if="['13'].includes(dataForm.archivedMaterials)"> 
          <el-form-item prop="marketCode" label="立项编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.marketCode"
              @updateValue="selectContractInOutMainName" :modelData="schemeModelData" dynamicModel="customDialog"
              :isShowLink="true"></select-dialog>
          </el-form-item>
          <el-form-item prop="marketUnitName" label="业务单元：">
            <el-input v-model="dataForm.marketUnitName" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="projectAgreementName" label="协议名称：">
            <el-input v-model="dataForm.projectAgreementName" disabled size="small"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
         
   
        <template v-if="!['13'].includes(dataForm.archivedMaterials)">
          <el-form-item prop="constructArchiveMainCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructArchiveMainCode"
              @updateValue="selectConstructArchiveMainCode" :modelData="contractInProjectModelData"
              dynamicModel="customDialog" :isShowLink="true"></select-dialog>
          </el-form-item>
          <el-form-item prop="projectManagerName" label="项目负责人：">
            <el-input v-model="dataForm.projectManagerName" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="contractAmount" label="合同金额（含税/元）："
            v-if="!['0', '10', '11'].includes(dataForm.archivedMaterials)">
            <el-input v-model="dataForm.contractAmount" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>

        <el-form-item prop="fileNo" label="档案编号：" v-if="!['10', '11', '12'].includes(dataForm.archivedMaterials)">
            <el-input v-model="dataForm.fileNo" :disabled='!isZhuanYuanApprove' size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          

          <el-form-item prop="actualCompletionDate" label="实际竣工日期：" v-if="['10'].includes(dataForm.archivedMaterials)">
              <el-date-picker v-model="dataForm.actualCompletionDate" value-format="yyyy-MM-dd" type="date"
                placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item prop="actualCommencementDate" label="实际开工日期："
              v-if="['12'].includes(dataForm.archivedMaterials)">
              <el-date-picker v-model="dataForm.actualCommencementDate" value-format="yyyy-MM-dd" type="date"
                placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item prop="dataClassification" label="资料分类：" v-if="['11'].includes(dataForm.archivedMaterials)">
              <el-select v-model="dataForm.dataClassification" placeholder="请选择" size="small" 
                style="width: 100%" >
                <el-option v-for="(item, index) in dataClassificationOptions" :key="index" :label="item.configName"
                  :value="item.configValue">
                </el-option>
              </el-select>
            </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="remark" label="备注：">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="资料信息">
        <!-- 结算信息 -->
        <el-form-item slot="col_1" label-width="0">
          <subFormTab v-model="dataForm.contractProjectDataDetailList" ref="subFormTab"
            :dataClassificationOptions="dataClassificationOptions" :disabled="setting.readonly" />
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
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import subFormTab from './components/subFormTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  name: "contractSettleOtherMain",
  components: {
    RowLayout,
    subFormTab,
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
        actualCommencementDate: "", //实际开工日期
        actualCompletionDate: "", //实际竣工日期
        archivedMaterials: "", //归档资料
        baseProjectAgreementId: "", //项目协议主表id
        code: "", //单据编号
        constructArchiveMainCode: "", //项目编号
        constructArchiveMainId: "", //项目档案id
        constructArchiveMainName: "", //	项目名称
        contractInOutMainId: "", //	收入或支出类合同主表ID
        contractInOutMainCode: "", //	合同编号
        contractInOutMainName: "", //	合同名称
        constructionUnitName: "", //	管理部门
        dataClassification: '', //资料分类
        fileNo: "", //档案编号
        filingDate: "", //	归档日期
        position: "", //	存放位置
        settlementDate: new Date(), //	结算日期
        contractAmount: "", //	合同金额(含税)
        contractProjectDataDetailList: [
          {
            baseDataClassificationId: [], //资料分类ID
            contractProjectDataMainId: "", //项目资料主表ID
            fileInfoList: [], //附件
            baseDataClassificationName: "", //	资料分类名称
          }
        ],
        fileInfoList: [],//附件
        marketCode: "", //	立项编号
        marketName: "", //	立项名称
        marketUnitName: "", //	业务单元
        projectAgreementCode: "", //	协议编号
        projectAgreementName: "", //	协议名称
        customerName: "", //	客户
        followerName: "", //	跟进人
        estimateAmountOfCooperation: "", //	预估合作金额
        processFinishedTime: "", //	审批通过时间
        projectManagerName: "", //项目负责人
        projectSchedule: "", //项目进度
        projectStatus: "", //项目状态
        remark: "", //备注
      },
      pleaseEnterPlaceHolder: "请输入",
      pleaseEnterNumPlaceHolder: "请输入两位小数",
      computedPlaceHolder: "自动计算",
      masterContractCodeModelData:{ code: 'XiangMuZiLiaoHeTongBianHao1', customDialog: 'XiangMuZiLiaoHeTongBianHao1', isSetHead: 1, isShowLink:false, isMulti: false, initailData: [], parm: {varParams:[{ key: 'contractType', value: '' },{key:'constructArchiveMainId',value:''}]} },// 合同编号，按类型取对应合同
      schemeModelData: { code: 'XiangMuXieYiXiangMuZiLiao', parm: { data: [], singleSelect: true } }, //协议编号
      contractInProjectModelData: { code: 'XiangMuDangAnProjectSubmission', parm: { data: [], singleSelect: true } }, //项目编号
      dataRule: RuleRequired.dataRule(['constructArchiveMainCode', 'masterContractCode', 
         'actualCommencementDate', 'actualCompletionDate', 'fileInfoList','dataClassification']),
      dataClassificationOptions: [],//资料分类
      archivedMaterialsOptions: [],//关联表单（归档资料）
      projectStatusOptions: [],//项目状态
    };
  },
  computed: {
    /**
     * 只有融资专员审批环节可上传、编辑文件；
     * 是否上传资料=是，融资专员必填，否则无法编辑
     */
     isZhuanYuanApprove() {
      const isRequired = ['档案管理员'].find(res=> {return WFContext.CurrentActivityName.indexOf(res) != -1 })?true:false;
      const arr = ['fileNo', 'filingDate', 'position'].forEach(item=>{
        this.dataRule[item] = RuleRequired.curFiledRule(isRequired);
      })
      //  fileNo filingDate  position
      return isRequired;
    }
  },
  watch: {
    'dataForm.archivedMaterials': {
      handler: function (val) {
        if (val) this.masterContractCodeModelData.parm.varParams[0].value = val
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.getDataDictByConfigType();
  },
  methods: {
    afterInit () {
      let contractProjectDataDetailList = this.dataForm.contractProjectDataDetailList
      if (contractProjectDataDetailList.length) {
        contractProjectDataDetailList.forEach(i => {
          let id = i.baseDataClassificationId 
          i.baseDataClassificationId = id && id.split(',')
        })
      }
      console.log(contractProjectDataDetailList,222)
    },
    //项目编号
    selectConstructArchiveMainCode (data) {
      this.dataForm.constructArchiveMainName = data[0].name; //项目名称
      this.dataForm.constructArchiveMainId = data[0].id; //项目id
      this.dataForm.constructionUnitName = data[0].constructionunitname; //管理部门
      this.dataForm.projectManagerName = data[0].projectmanagername; //负责人
      this.dataForm.constructArchiveMainCode = data[0].code; // 项目编号
      this.dataForm.projectStatus = data[0].projectStatusId; // 项目状态
      this.dataForm.projectSchedule = data[0].projectSchedule; // 项目进度

      this.masterContractCodeModelData.parm.varParams[1].value = data[0].id; //项目id
      console.log(this.masterContractCodeModelData)
    },
    //立项编号
    selectContractInOutMainName (data) {
      this.dataForm.marketName = data[0].marketname//立项名称
      this.dataForm.baseProjectAgreementId = data[0].id; //项目协议主表id
      this.dataForm.marketCode = data[0].marketcode; // 立项编号
      this.dataForm.marketUnitName = data[0].marketunitname; //业务单元
      this.dataForm.projectAgreementCode = data[0].code; //协议编号
      this.dataForm.projectAgreementName = data[0].scheme; //协议名称
      this.dataForm.customerName = data[0].customername; //客户
      this.dataForm.followerName = data[0].followername; //跟进人
      this.dataForm.estimateAmountOfCooperation = data[0].cooperationamount; //预估合作金额
    },
    //主合同编号
    selectDialogMasterContractCode (data) {
      this.dataForm.contractInOutMainCode = data[0].code;
      this.dataForm.contractInOutMainId = data[0].id;
      this.dataForm.contractInOutMainName = data[0].name;
      this.dataForm.contractAmount = data[0].contractamount;
    },
    /**
     * 保存获取的参数
     */
    getDataForm() {
      const _this = this;
      let dataForm = JSON.parse(JSON.stringify(_this.dataForm));
      //dataForm.dataClassification = this.dataForm.dataClassification.toString();
      const keepData = _this.$refs['subFormTab'].keepData;
      for (const i of keepData) {
        i.baseDataClassificationId = i.baseDataClassificationId.join()
      }
      dataForm.contractProjectDataDetailList = keepData
      
      return dataForm;
    },
    afterInit() {
        //if(this.dataForm.dataClassification) this.dataForm.dataClassification = this.dataForm.dataClassification.split(',')
        if(this.dataForm.contractProjectDataDetailList){
          this.dataForm.contractProjectDataDetailList.forEach(item=>{
            item.baseDataClassificationId = item.baseDataClassificationId.split(',')
          })
        } 
      },
    async validateForm () {
      const _this = this;
      const _subFormData = await Object.toDeepClone(_this.$refs['subFormTab'].validateForm());
      let _dataForm = JSON.parse(JSON.stringify(_this.dataForm));
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && _subFormData) {
            /* for (const i of _subFormData) {
              i.baseDataClassificationId = i.baseDataClassificationId.join()
            }

            _dataForm.contractProjectDataDetailList = _subFormData */
            resolve(_this.getDataForm())
          } else {
            resolve(false)
          }
        })
      });
    },
    /** 初始化字典*/
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '关联表单,资料分类,项目状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '关联表单':
              this.archivedMaterialsOptions = ele.dataDict;
              break;
            case '资料分类':
              this.dataClassificationOptions = ele.dataDict;
              break;
            case '项目状态':
              this.projectStatusOptions = ele.dataDict;
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
    margin-bottom: 16px;
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
