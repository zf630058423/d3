<template>
  <div class="bank-files-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="基本信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" />
          </el-form-item>
          <el-form-item prop="marketCode" label="立项编号：" v-show="isApplyType">
              <select-dialog :width="800" :height="360" :value="dataForm.marketCode" @updateValue="selectDialomarketCode" 
                :modelData="marketMainModelData" dynamicModel="customDialog" class="link_text"></select-dialog>
          </el-form-item>
          <el-form-item prop="issuingDate" label="签发日期：">
            <el-date-picker v-model="dataForm.issuingDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="applicationType" label="申请性质：">
            <el-radio-group v-model="dataForm.applicationType">
              <el-radio :label="item.configValue" :key="item.configName" v-for="item in applyTypeOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="marketName" label="立项名称：" v-show="isApplyType">
            <el-input v-model="dataForm.marketName" disabled size="small" placeholder="自动带出" />
          </el-form-item>
          <el-form-item prop="expirationDate" label="有效截止日期：">
            <el-date-picker v-model="dataForm.expirationDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="applicantName" label="申请单位：">
            <select-dialog :width="600" :height="360" :value="dataForm.applicantName"
              @updateValue="selectDialogApplicantName" dynamicModel="selectOrg" :disabled='false'></select-dialog>
          </el-form-item>
          <el-form-item prop="customerName" label="客户：">
            <el-input v-model.number="dataForm.customerName" :disabled="isApplyType" size="small"
              placeholder="自动带出"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="authorizationScope" label="授权权限范围：">
            <el-input v-model="dataForm.authorizationScope" type="textarea" :rows="3"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="memo" label="备注：">
            <el-input v-model="dataForm.memo" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="委托单位信息">
        <template slot="col_1">
          <el-form-item prop="commissionedAgentName" label="委托单位：">
            <select-dialog :width="600" :height="360" :value="dataForm.commissionedAgentName"
              @updateValue="selectDialogCommissionedAgentName" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
          <el-form-item prop="mainBusiness" label="主营：">
            <el-input v-model="dataForm.mainBusiness" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="socialUnifiedCreditCode" label="统一社会信用代码：">
            <el-input v-model="dataForm.socialUnifiedCreditCode" size="small" disabled placeholder="自动带出" />
          </el-form-item>
          <el-form-item prop="concurrentBusiness" label="兼营：">
            <el-input v-model="dataForm.concurrentBusiness" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>

        </template>
        <template slot="col_3">
          <el-form-item prop="economicNature" label="经济性质：">
            <el-input v-model.number="dataForm.economicNature" size="small" placeholder="请输入"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="被委托人信息">
        <!-- 被委托人信息 -->
        <el-form-item slot="col_1" prop="legalLetterClientDetailList" label-width="0">
          <fromTab v-model="dataForm.legalLetterClientDetailList" ref="subFromData" :disabled="setting.readonly">
          </fromTab>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'附件'">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <update-files v-model="dataForm.fileInfo"></update-files>
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
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import fromTab from './components/fromTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { MARKETMAIN_MODEL } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType, getSocialUnifiedCreditCode } from '@/Api/dataDict.js'

export default {
  name: "baseBankArchiveMainListForm",
  components: {
    FormTitle,
    RowLayout,
    updateFiles,
    fromTab,
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
        marketMainId: "", //立项ID
        marketCode: "", //立项编号
        marketName: "", //立项名称
        applicationType: "1", //申请性质
        applicantId: "", //申请单位
        applicantName: "", //申请单位名称
        commissionedAgentId: "", //委托单位
        commissionedAgentName: "", //委托单位
        customerName: "", //客户
        customerId: "", //客户id
        issuingDate: "", //签发日期
        expirationDate: "", //有效截止日期
        socialUnifiedCreditCode: "", //统一社会信用代码
        economicNature: "", //经济性质
        mainBusiness: "", //主营
        concurrentBusiness: "", //兼营
        legalLetterClientDetailList: [
          {
            age: "",
            marketLegalLetterMainId: "", //Id
            identityCard: "", //身份证号
            name: "", //姓名
            sex: "" //性别
          }
        ],//被委托人信息
        fileInfo: [], //附件
        authorizationScope: "", //授权权限范围
        memo: "", //备注
        wiid: "", //流程实例Id
        procInstState: "", //流程状态
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      pleaseEnterPlaceHolder: "请输入", //请输入
      marketMainModelData: {
        code: 'market_main',
        parm: {
          isEnableAuthor: 0,
          data: [],
          isMulti: false
        },
        isShowLink: true,
        linkUrl: null
      },
      dataRule: RuleRequired.dataRule(['applicationType', 'applicantName', 'marketCode', 'commissionedAgentName', 'customerName', 'issuingDate', 'expirationDate',
        'authorizationScope', 'mainBusiness', 'economicNature', 'fileInfo']),
      applyTypeOptions: []
    };
  },
  computed: {
    //是否项目试用
    isApplyType () {
      return this.dataForm.applicationType === "1"
    },
    //用户信息
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  watch: {
    'dataForm.applicationType': {
      handler: function (val) {
        this.afterInit();
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.getDataDictByConfigType();
    //this.afterInit();
    const { orgName,orgId,orgCode } = this.userInfo
    this.dataForm.applicantName = orgName;
    this.dataForm.applicantId = orgId;
  },
  methods: {
    afterInit () {
      //审批阶段且审批人必填
      this.dataRule['marketCode'] = RuleRequired.curFiledRule(this.isApplyType);
      this.dataRule['customerName'] = RuleRequired.curFiledRule(!this.isApplyType);
      if(this.dataForm.marketMainId)this.marketMainModelData.linkUrl = `/workflowForm?formAction=3&appId=AE&wiid=0081c0e0-351e-49ea-a1f6-da5e563e0c58&encode=marketProjectExtend&rowId=${this.dataForm.marketMainId}&code=custGrid_CustSearch_YingXiaoLiXiang&modelName=market`
    },
    //立项编号
    selectDialomarketCode (data) {
      this.dataForm.marketName = data[0].NAME;
      this.dataForm.marketCode = data[0].CODE;
      this.dataForm.marketMainId = data[0].id;
      this.dataForm.customerName = data[0].customerName;
      this.dataForm.customerId = data[0].customerId;
      this.marketMainModelData.linkUrl = `/workflowForm?formAction=3&appId=AE&wiid=0081c0e0-351e-49ea-a1f6-da5e563e0c58&encode=marketProjectExtend&rowId=${data[0].id}&code=custGrid_CustSearch_YingXiaoLiXiang&modelName=market`
    },
    //申请单位
    selectDialogApplicantName (data) {
      this.dataForm.applicantName = data[0].text;
      this.dataForm.applicantId = data[0].value;
    },
    //委托单位
    selectDialogCommissionedAgentName (data) {
      this.dataForm.commissionedAgentName = data[0].text;
      this.dataForm.commissionedAgentId = data[0].value;
      this.getSocialUnifiedCreditCode(data[0].value)
    },
    getSocialUnifiedCreditCode (id) {
      this.dataForm.socialUnifiedCreditCode = ''
      getSocialUnifiedCreditCode(id).then((res) => {
        if (res.code == 200) {
          this.dataForm.socialUnifiedCreditCode = res.data.socialUniformCreditCode
        }
      })
    },
    async validateForm () {
      const _this = this;
      const subFromData = await _this.$refs['subFromData'].validateForm();
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && subFromData) {
            _this.dataForm.legalLetterClientDetailList = subFromData
            resolve(_this.dataForm)
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
      const res = await getDataDictByConfigType({ params: { configTypes: '申请类型' } })
      if (res.success) {
        res.data.forEach(ele => {
          this.applyTypeOptions = ele.dataDict;
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.bank-files-form {
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
</style>
