<template>
  <!-- 设计施工立项 -->
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px" class="new-data-form-css">
      <row-layout :title="'项目信息'" :cols="3">
        <el-form-item slot="col_1" label="立项编号：" prop="marketCode">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :modelData="designModel" :width="900"
                         :height="360" @updateValue="marketCodeUpdate"
                         :value="dataForm.marketCode || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="立项名称：">
          <el-input v-model="dataForm.marketName" :placeholder="msgTip.AUTO_PLACEHOLDER" size="small"  disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="客户：">
          <el-input v-model="dataForm.customerName" :placeholder="msgTip.AUTO_PLACEHOLDER" size="small"  disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="项目编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="项目名称：" prop="name">
          <el-input v-model="dataForm.name" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_3" label="产品线：">
          <el-input v-model="dataForm.productLineName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>

      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="项目计税方式：" prop="projectTaxMethod">
          <el-radio-group v-model="dataForm.projectTaxMethod">
            <el-radio v-for="(item,index) in projectTaxMethodArray" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="项目分类：">
          <el-select v-model="dataForm.categoryId" placeholder="请选择" disabled>
            <el-option v-for="(item,index) in projectTypeOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="投标利润率(%)：">
          <el-input v-model="dataForm.targetProfitRate" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="项目地址：" prop="projectAddress">
          <casc-select code="AddressCascade"  v-model="dataForm.projectAddress" ref="area" :defaultValue="dataForm.projectAddress" @change-select="selectArea"></casc-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="address" label="详细地址：">
          <el-input v-model="dataForm.address" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" label="中标价(元)：">
          <amount-input v-model="dataForm.bidPrice" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3" :title="'工程信息'">
        <el-form-item slot="col_1" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" label="业务中心：">
          <el-input v-model="dataForm.marketCenterName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_3"  label="项目状态：" prop="projectStatusId">
          <el-select v-model="dataForm.projectStatusId" placeholder="请选择">
            <el-option v-for="(item,index) in projectStatusOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="项目负责人：" prop="projectManagerName">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :modelData="marketModel" :width="900"
                         :height="360" @updateValue="usersUpdate"
                         :value="dataForm.projectManagerName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人电话：" prop="projectManagerTel">
          <el-input v-model="dataForm.projectManagerTel" size="small" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" label="管理部门：" prop="constructionUnitName">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :modelData="marketModel" :width="500"
                         :height="360" @updateValue="orgUpdate"
                         :value="dataForm.constructionUnitName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input type="textarea" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}" maxlength="250"
                    v-model="dataForm.remark"></el-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <update-files v-model="dataForm.fileInfo"></update-files>
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
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  // import numberInput from '@/components/basic/numberInput/index'
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import cascSelect from '@/components/basic/cascSelect/index.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import {
    PROJECTTAXMETHOD_GROUP,
    V_MARKET_MAIN_DOCUMENT_MODEL,
    BASE_BID_TEAM_LIBRARY_MODEL,
    DESIGN_CONSTRUCT_MODEL
  } from '@/views/businessModule/enum/param';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import moment from 'moment'
  export default {
    components: { FormTitle, SelectDialog, RowLayout, amountInput, cascSelect, updateFiles,PercentageInput },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        dialogVisible: false,
        isReadOnly: false,
        marketModel: {
          singleSelect: true,
          resultFieldKey: "",
          data: [],
          parm: {singleSelect: true}
        },
        designModel: DESIGN_CONSTRUCT_MODEL, // 立项编号
        msgTip: RuleRequired.tipMsg,
        projectTaxMethodArray:PROJECTTAXMETHOD_GROUP, // 项目计税方式
        projectTypeOptions:[], // 项目分类
        projectStatusOptions:[], // 项目状态
        dataForm: {
          address: '',
          archArea: '',
          bidPrice: '',
          categoryId: '3',
          code: '',
          constructArchiveMainId: '',
          constructionUnitId: '0023',
          constructionUnitName: '设计研发中心',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerName: '',
          deptId: '',
          deptName: '',
          differentPlaces: '',
          fileInfo: [],
          finishedTime: '',
          firstPartyLinkMan: '',
          id: '',
          isDel: '',
          jsonData: '',
          laborSubcontractorId: '',
          laborSubcontractorName: '',
          lastModifyDeptId: '',
          lastModifyDeptName: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          licenceId: '',
          licenceName: '',
          marketCenterName: '',
          marketCode: '',
          marketMainId: '',
          marketName: '',
          marketUnitName: '',
          moduleType: '',
          name: '',
          plannedCommencementDate: '',
          plannedEntryDate: '',
          procInstState: '',
          processFinishedTime: '',
          productLineName: '',
          projectAddress: '',
          projectDepartmentId: '',
          projectDepartmentName: '',
          projectManagerId: '',
          projectManagerName: '',
          projectManagerTel: '',
          projectStatusId: '1',
          projectTaxMethod: '',
          qualityId: '',
          qualityName: '',
          remark: '',
          safetyId: '',
          safetyName: '',
          superUnit: '',
          superUnitLinkMan: '',
          superUnitLinkManContactTitle: '',
          superUnitLinkManTel: '',
          targetProfitRate: '',
          technicalId: '',
          technicalName: '',
          wiid: '',
          winBidName: ''
        },
        dataRule: RuleRequired.dataRule(['marketCode','name','projectTaxMethod','projectAddress','address','projectStatusId','projectManagerName','projectManagerTel','constructionUnitName','fileInfo']),
        form: {
          modifyReason: ''
        }
      };
    },
    computed: {
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
      }
    },
    mounted() { },
    methods: {
      /**
       * 切换地址
       */
      changeAreaId(data) {
        this.dataForm.areaId = data.value
        this.$refs['dataForm'].clearValidate('areaId')
      },
      /**
       * 添加银行账号
       */
      addBaseBank() {
        if (!this.dataForm.customerBankDetailList) this.dataForm.customerBankDetailList = []
        this.dataForm.customerBankDetailList.push({
          accountId: '',
          accountName: '',
          bankId: '',
          bankName: '',
          currencyId: 'CNY'
        })
      },
      /**
       * 立项编号
       * */
      marketCodeUpdate(data){
        const {marketcode,marketname,id,address,bidprice,customername,customerId,marketunitname,projectaddress,productlinename,targetProfitRate,marketcentername} = data[0];
        this.dataForm.marketCode = marketcode; // 立项编号
        this.dataForm.marketName = marketname; // 立项名称
        this.dataForm.marketMainId = id; // 立项id
        this.dataForm.address = address; // 详细地址
        this.dataForm.targetProfitRate = targetProfitRate; // 详细地址
        this.dataForm.bidPrice = bidprice; // 中标价
        this.dataForm.productLineName = productlinename; // 产品线
        this.dataForm.customerName = customername; // 客户
        this.dataForm.customerId = customerId; // 客户id
        this.dataForm.marketUnitName = marketunitname; // 营销单位
        this.dataForm.marketCenterName = marketcentername; // 营销中心
        this.dataForm.projectAddress = projectaddress; // 营销中心
        this.dataForm.name = marketname; // 项目名称


      },
        /**
         * 项目负责人
         */
      usersUpdate(data){
          this.dataForm.projectManagerName = data[0].realName;
          this.dataForm.projectManagerId = data[0].userId;
          this.dataForm.projectManagerTel = data[0].mobile;
        },
      /**
       * 管理部门
       */
      orgUpdate(data){
        if(data){
          this.dataForm.constructionUnitId = data[0].value;
          this.dataForm.constructionUnitName = data[0].text;
        }

      },
      selectArea(data){
        console.log(data,'1111111')
      },
      // 前置事件
      beforeInit() {
        this.getDataDictByConfigType()
      },
      // 后置事件
      afterInit() {},
      /**
       * 表单校验
       */
      validateForm() {
        const _this = this;
        if(WFContext.WorkflowInstinceState < 2){
          var arr = _this.$refs.area.getResult();
          _this.dataForm.projectAddress = arr.value;
        }
        let parm = Object.toClone(_this.dataForm);
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              return resolve(parm);
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
        const res = await getDataDictByConfigType({ params: { configTypes: '项目分类,项目状态' }})
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '项目分类':
                this.projectTypeOptions = ele.dataDict;
                break;
              case '项目状态':
                this.projectStatusOptions = ele.dataDict;
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
