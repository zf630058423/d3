<template>
  <!-- 项目巡检整改回复单 -->
  <div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" >
      <row-layout :cols="3" title="项目信息" class="form-box">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="managerDeptName" label="管理部门：">
            <el-input v-model="dataForm.managerDeptName" disabled size="small" />
          </el-form-item>
          <el-form-item prop="rectificationDate" label="整改完成日期：">
            <el-date-picker v-model="dataForm.rectificationDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" disabled></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructCode" label="项目编号：">
            <el-input v-model="dataForm.constructCode" disabled size="small" />
          </el-form-item>
          <el-form-item prop="constructManager" label="项目负责人：">
            <el-input v-model="dataForm.constructManager" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="actualRectificationDate" label="实际整改完成日期：">
            <el-date-picker v-model="dataForm.actualRectificationDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" ></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructName" label="项目名称：">
            <el-input v-model="dataForm.constructName" disabled size="small" />
          </el-form-item>
          <el-form-item prop="constructManagerPhone" label="项目负责人联系电话：">
            <el-input v-model="dataForm.constructManagerPhone" disabled size="small"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="projectInspectionCode" label="项目巡检单：">
            <linkInput v-model="dataForm.projectInspectionCode" disabled size="small" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="memo" label="整改回复备注：">
            <el-input v-model="dataForm.memo" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" :title="'项目巡检附件'">
        <el-form-item slot="col_1" prop="inspectionList" label="附件文件：">
          <update-files v-model="dataForm.inspectionList" disabled></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'工程项目巡查整改回复单'">
        <el-form-item slot="col_1" prop="inspectionRectList" label="附件文件：">
          <update-files v-model="dataForm.inspectionRectList" :disabled="setting.readonly"></update-files>
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
import linkInput from '@/components/basic/elInput/linkInput.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { MARKETMAIN_MODEL } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  name: "projectInspectionRectMain",
  components: {
    FormTitle,
    RowLayout,
    updateFiles,
    linkInput,
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
        actualRectificationDate: "", //实际整改完成日期
        code: "", //单据编号
        constructCode: "", //项目编号
        constructName: "", //项目名称
        constructManager: "", //项目负责人
        constructManagerPhone: "", //项目负责人联系电话
        inspectionList: [], //项目巡检附件
        //fileInfoList: [], //附件
        inspectionRectList: [], //附件
        memo: "", //	整改回复备注
        projectInspectionCode: "", //	项目巡检单
        projectInspectionMainId: "", //	项目巡检id
        rectificationDate: "", //	整改完成日期
        createTime: "", //编制时间
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      pleaseEnterPlaceHolder: "请输入", //请输入

      marketMainModelData: MARKETMAIN_MODEL,
      dataRule: RuleRequired.dataRule(['actualRectificationDate', 'inspectionRectList']),
      applyTypeOptions: []
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
    afterInit () {
      //审批阶段且审批人必填
      this.dataRule['marketCode'] = RuleRequired.curFiledRule(this.isApplyType);
      this.dataRule['customerName'] = RuleRequired.curFiledRule(!this.isApplyType);
      //if(this.dataForm.fileInfoList)this.dataForm.inspectionRectList = this.dataForm.fileInfoList
    },
    //立项编号
    selectDialomarketCode (data) {
      this.dataForm.marketName = data[0].NAME;
      this.dataForm.marketCode = data[0].CODE;
      this.dataForm.marketMainId = data[0].id;
      this.dataForm.customerName = data[0].customerName;
      this.dataForm.customerId = data[0].customerId;
    },
    async validateForm () {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
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

</style>
