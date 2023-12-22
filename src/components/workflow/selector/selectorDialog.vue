<template>
  <div>
    <div style="position: relative;">
      <el-input v-model="value" placeholder="请选择" :disabled="disabled" size="small">
        <el-button v-if="!btnDisabled" slot="append" icon="el-icon-search" size="small" @click="openDialog()"></el-button>
      </el-input>
      <div class="link" v-show="value && modelData.isShowLink" @click="toLink">{{ value }}</div>
    </div>
    <FuiDialog :width="width+'px'" :title="title" :height="height+'px'" :visible="visible" @on-cancel="onCancel" @on-confirm="onConfirm">
      <component :is="componentModule" ref="componentModuleRef" :parms="modelData" :container-height="height"></component>
    </FuiDialog>
  </div>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue'; // 公共弹框
export default {
  components: {
    FuiDialog
  },
  props: {
    // 数据id
    dataId: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    // 按钮是否禁用
    btnDisabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 500
    },
    value: {
      type: [String, Number],
      default: ''
    },
    modelData: { // 组件参数 parms { 【是否的单选】singleSelect: false, 【取id的是哪个字段】resultFieldKey: 'groupId', needRoot: false, data: [] }
      type: Object,
      default: () => { return {}  }
    },
    dynamicModel: { // 组件模块【selectOnlyUsers(用户控件,单选)，selectUsers(用户控件,多选)，selectOrg(组织控件，多选)，selectRole(角色控件，多选)】
      type: String,
      default: ''
    }
  },
  data() {
    return {
      componentModule: '',
      visible: false
    }
  },
  created() {

  },
  methods: {
    /**
     * 打开新窗口
     */
    toLink(){
      if(this.modelData.linkUrl) window.open(this.modelData.linkUrl)
    },
    /**
     * 打开弹出框
     */
    openDialog() {
      this.initComponent()
    },
    /**
     * 动态加载组件
     */
    initComponent() {
      switch (this.dynamicModel) {
        case 'selectOnlyUsers': // 用户控件
          this.componentModule = () => import('@/components/workflow/selector/selectOnlyUsers');
          break;
        case 'selectUsers': // 组织+用户控件  跟进人
          this.componentModule = () => import('@/components/workflow/selector/selectUsers');
          break;
        case 'selectOrg': // 组织控件  业务单元 选择部门
          this.componentModule = () => import('@/components/workflow/selector/selectOrg');
          break;
        case 'selectRole': // 角色控件
          this.componentModule = () => import('@/components/workflow/selector/selectRole');
          break;
        case 'customDialog': // 自定义对话框
          this.componentModule = () => import('@/components/workflow/selector/openCustomDialog');
          break;
        case 'selectInvoiceByVoucher': // 发票选择控件（预缴完税凭证）
          this.componentModule = () => import('@/components/workflow/selector/selectInvoiceByVoucher');
          break;
        case 'selectPayoutInvoice': // 发票选择控件（付款表单）
          this.componentModule = () => import('@/components/workflow/selector/selectPayoutInvoice');
          break;

        default:
          break;
      }
      this.visible = true;
      this.clearSelector()
    },
    /**
     * 关闭按钮
     */
    onCancel() {
      this.$emit('onCancel')
      this.visible = false;
    },
    /**
     * 确认按钮
     */
    onConfirm() {
      const resultGridData = this.$refs['componentModuleRef'].getResult()
      this.$emit('updateValue', resultGridData)
      //有值改变触发表单校验
      this.$parent.$emit('el.form.change');
      this.$parent.$emit('el.form.blur');
      this.visible = false;
    },
    /**
     * 清除所有
     */
    clearSelector() {
      this.$nextTick(() => {
        if (this.$refs['componentModuleRef']) this.$refs['componentModuleRef'].clearAll()
      })
    }
  }
}
</script>
<style scoped>
.link {
  position: absolute;
  padding-left: 12px;
  z-index: 1000;
  color: #006eff;
  top: 6px;
  background: #f5f7fa;
  left: 4px;
  line-height: 30px;
  text-decoration-line: underline;
  width: 85%;
  margin-right: 50px;

}
</style>
