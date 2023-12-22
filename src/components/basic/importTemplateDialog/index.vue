<template>
  <FuiDialog :visible="visible" :title="title" :is-bottom="true" :confirm-text="confirmText" @on-cancel="close" @on-confirm="onConfirm">
    <el-form class="form-box">
      <el-form-item label="上传文件：">
        <el-button type="primary" size="small" class="button">选择文件<input class="input-file" type="file" @change="changeFile"></el-button>
        {{ fileName }}
      </el-form-item>
      <div style="line-height: 25px;font-size: 12px;">
        <em>导入说明：</em>
        <br>
        Excel文件必须是office2010版及以上,只能上传.xlsx文件;
        <br>
        Excel内容上不允许有公式，函数，宏脚本、控件、组件等，必须是纯文本内容。
      </div>
      <div><span class="dowloadFile" @click="downloadExcelTemplate"><i class="icon icon-Controls-82"></i> 点击下载Excel模板</span></div>
    </el-form>
  </FuiDialog>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
import { downloadTemplateFile, importData } from '@/Api/workflowBusssion/index.js'
export default {
  components: {
    FuiDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '数据导入'
    },
    confirmText: {
      type: String,
      default: '确定导入'
    },
    keyword: {
      type: String,
      default: ''
    },
    modelName: {
      type: String,
      default: ''
    },
    tableName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileName: '',
      file: {}
    }
  },
  methods: {
    changeFile(e) {
      const { name } = e.target.files[0];
      if (name.indexOf('.xlsx') === -1) {
        return
      }
      this.fileName = name;
      this.file = e.target.files[0];
      e.target.value = null
    },
    close() {
      this.$emit('update:visible', false);
    },
    async onConfirm() {
      const res = await importData(this.modelName, this.keyword, { file: this.file, test: this.tableName })
      if (res.code === 200) {
        this.$message.success('导入成功');
        this.$emit('importSuccess',this.tableName,res.data)
      } else {
        this.$message.error(res.msg)
      }
    },
    async downloadExcelTemplate() {
      await downloadTemplateFile(this.keyword)
    }
  }
}
</script>
<style lang="scss" scoped>
.form-box {
  padding: 30px;
  .button {
    position: relative;
  }
  .input-file{
    position: absolute;
    left: 0;
    width: 98px;
    opacity: 0;
  }
  .dowloadFile{
    color: blue;
    margin-top: 30px;
    cursor: pointer;
    display: block;
  }
}
</style>
