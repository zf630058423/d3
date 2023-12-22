<template>
  <!-- 介绍信申请 -->
  <div class="bank-files-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="基础信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="marketMainCode" label="立项编号：" :rules="[{ required: isApplyType, message: '必填项不能为空' }]"
            v-if="isApplyType">
            <select-dialog :width="800" :height="360" :value="dataForm.marketMainCode"
              @updateValue="selectDialoMarketMainCode" :modelData="marketMainModelData"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="letterLookUpOrg" label="介绍信抬头单位：" :rules="[{ required: true, message: '必填项不能为空' }]">
            <el-input v-model="dataForm.letterLookUpOrg" :disabled="isApplyType" size="small" placeholder="反写更新" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="applyType" label="申请性质：">
            <el-radio-group v-model="dataForm.applyType" @change="changeApplyType">
              <el-radio :label="item.configValue" :key="item.configName" v-for="item in applyTypeOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="marketMainName" label="立项名称：" v-if="isApplyType">
            <el-input v-model="dataForm.marketMainName" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="letterIssueOrgName" label="介绍信开具单位：">
            <select-dialog :width="600" :height="360" :value="dataForm.letterIssueOrgName"
              @updateValue="selectDialogLetterIssueOrgName" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="applicantOrgName" label="申请单位：">
            <select-dialog :width="600" :height="360" :value="dataForm.applicantOrgName"
              @updateValue="selectDialogApplicantOrgName" dynamicModel="selectOrg"></select-dialog>
          </el-form-item>
          <el-form-item prop="validityPeriodDay" label="有效期(天)：">
            <el-input v-model.number="dataForm.validityPeriodDay" size="small" placeholder="请输入"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="contactMatterMemo" label="联系事宜：">
            <el-input v-model="dataForm.contactMatterMemo" type="textarea" :rows="3"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="remark" label="备注：">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="被介绍人信息">
        <template slot="col_1">
          <el-form-item label="总共参与人数：">
            <el-input v-model.number="dataForm.detailList.length" disabled size="small" placeholder="请输入" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <!-- 被介绍人信息 -->
        <el-form-item slot="col_1" prop="detailList" label-width="0">
          <fromTab v-model="dataForm.detailList" ref="subFromData" :disabled="setting.readonly"></fromTab>
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
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import fromTab from './components/fromTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import { MARKETMAIN_MODEL2 } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'


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
        marketMainId: "", //项目ID
        marketMainCode: "", //立项编号
        marketMainName: "", //立项名称
        constructArchiveCode: "", //项目编号
        applicantOrgId: "", //申请单位ID
        applicantOrgName: "", //申请单位名称
        applyType: "1", //申请性质
        contactMatterMemo: "", //联系事宜
        totalNumberOfParticipant: "", //总共参与人数
        detailList: [
          {
            age: "",
            id: "", //介绍信申请信息表Id
            identityCard: "", //身份证号
            introducedPersonName: "", //姓名
            sex: "" //性别
          }
        ],//被介绍人信息
        fileInfoList: [], //附件
        letterIssueOrgId: "", //介绍信开具单位Id
        letterIssueOrgName: "", //介绍信开具单位名称
        letterLookUpOrg: "", //介绍信开具单位抬头
        remark: "", //备注
        validityPeriodDay: "", //有效期（天）
        wiid: "", //流程实例Id
        procInstState: "", //流程状态
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入

      marketMainModelData: MARKETMAIN_MODEL2,
      dataRule: {
        applyType: [
          //申请性质
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        letterIssueOrgName: [
          //介绍信开具单位
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        validityPeriodDay: [
          //有效期(天
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        contactMatterMemo: [
          //联系事宜
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        totalNumberOfParticipant: [
          //总共参与人数
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        applicantOrgName: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        fileInfoList: [
          { required: true, type: 'array', message: "必填项不能为空", trigger: "change" }
        ],
      },
      applyTypeOptions: []
    };
  },
  computed: {
    //是否项目试用
    isApplyType () {
      return this.dataForm.applyType === "1"
    }
  },
  created () {
    this.getDataDictByConfigType();
  },
  methods: {
    //立项编号
    selectDialoMarketMainCode (data) {
      this.dataForm.marketMainName = data[0].name;
      this.dataForm.marketMainCode = data[0].code;
      this.dataForm.marketMainId = data[0].id;
      this.dataForm.letterLookUpOrg = data[0].customerName;
    },
    //介绍信开具单位
    selectDialogLetterIssueOrgName (data) {
      this.dataForm.letterIssueOrgName = data[0].text;
      this.dataForm.letterIssueOrgId = data[0].value;
    },
    //申请单位
    selectDialogApplicantOrgName (data) {
      this.dataForm.applicantOrgName = data[0].text;
      this.dataForm.applicantOrgId = data[0].value;
    },
    //申请性质
    changeApplyType (value) {
      console.log(value)
      if (value != '1') {
        this.dataForm.marketMainName = '';
        this.dataForm.marketMainCode = '';
        this.dataForm.marketMainId = '';
        this.dataForm.letterLookUpOrg = '';
      }
    },
    async validateForm () {
      const _this = this;
      const subFromData = await _this.$refs['subFromData'].validateForm();
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && subFromData) {
            _this.dataForm.detailList = subFromData
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
@import url('../../style/form.scss');

.bank-files-form {
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
</style>
