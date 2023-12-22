<template>
  <div class="form-box">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="constructionUnitName" label="管理部门：">
            <el-input v-model="dataForm.constructionUnitName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructArchiveMainCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructArchiveMainCode"
              @updateValue="selectConstructArchiveMain" :modelData="marketMainModelData"
              dynamicModel="customDialog"></select-dialog>

          </el-form-item>
          <el-form-item prop="projectManagerName" label="项目负责人：">
            <el-input v-model="dataForm.projectManagerName" size="small" disabled :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructArchiveMainName" label="项目名称：">
            <el-input v-model="dataForm.constructArchiveMainName" size="small" disabled
              :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" cell="1-2" title="申请信息">
        <template slot="col_1">
          <el-form-item prop="projectStatusId" label="项目状态：">
            <el-select v-model="dataForm.projectStatusId" placeholder="请选择" size="small" style="width:100%" :disabled='isProcInstState'>
              <el-option v-for="(item) in projectStatusOptions" :key="item.configValue" :label="item.configName"
                :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="adjustmentInstructions" label="调整说明：">
            <el-input v-model="dataForm.adjustmentInstructions" size="small" :placeholder="pleaseEnterPlaceHolder" :disabled='isProcInstState'/>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="remark" label="备注：">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" :disabled='isProcInstState'/>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="附件">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <update-files v-model="dataForm.fileInfo" :uploadDisabled='isProcInstState'></update-files>
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
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';

export default {
  name: "baseBankArchiveMainListForm",
  components: {
    FormTitle,
    RowLayout,
    updateFiles,
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
        adjustmentInstructions: "", //调整说明
        code: "", //单据编号
        constructArchiveMainCode: "", //项目编号
        constructArchiveMainId: "", //项目档案主键id
        constructArchiveMainName: "", //项目名称
        constructionUnitName: "", //管理部门
        fileInfo: [], //附件
        finishedTime: "", //流程时间
        procInstState: "", //流程状态
        projectManagerName: "", //项目负责人
        projectStatusId: "", //项目状态id
        remark: "", //备注
        wiid: "", //流程实例
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入
      dataRule: RuleRequired.dataRule(['constructArchiveMainCode', 'projectStatusId', 'adjustmentInstructions', 'fileInfo']),
      projectStatusOptions: [],
      marketMainModelData: { code: 'XiangMuDangAnProjectSubmission', parm: { data: [], singleSelect: true } },
    };
  },
  created () {
  },
  computed: {
    //是否编制人
    isConstruction () {
      return this.dataForm.createUserName !== WFContext.CurrentRealName
    },
    // 是否是审批状态
    isProcInstState () {
      return this.dataForm.procInstState == '2'
    }
  },
  methods: {
    beforeInit () {
      this.getDataDictByConfigType();
    },
    //立项编号
    selectConstructArchiveMain (data) {
      this.dataForm.constructArchiveMainName = data[0].name;//项目名称
      this.dataForm.constructArchiveMainCode = data[0].code;
      this.dataForm.constructArchiveMainId = data[0].id;//项目档案主键id
      this.dataForm.constructionUnitName = data[0].constructionunitname;
      this.dataForm.projectManagerName = data[0].projectmanagername;
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
    //初始化字典
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '项目状态' } })
      console.log(res)
      if (res.success) {
        res.data.forEach(ele => {
          console.log(ele.dataDict)
          this.projectStatusOptions = ele.dataDict;
        });
      }
      console.log(this.projectStatusOptions)
    },
  }
};
</script>
<style lang="scss" scoped>
.form-box {
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

::v-deep .el-table td.el-table__cell div {
  overflow: initial;
  height: 30px;
  line-height: 30px;
}
</style>
