<template>
  <!--税率，百分比 对话框组件，可显示为xxx%格式内容-->
  <div>
    <el-input v-model="currentValue" placeholder="请选择" :disabled="disabled" size="small"  @focus="focusHandler" @blur="blurHandler">
      <el-button slot="append" icon="el-icon-search" @click="openDialog()" size="small" :disabled="btnDisabled"></el-button>
    </el-input>
    <FuiDialog :width="width+'px'" :title="title" :height="height+'px'" :visible="visible" @on-cancel="onCancel" @on-confirm="onConfirm">
      <component :is="componentModule" ref="componentModuleRef" :parms="modelData" :container-height="height"></component>
    </FuiDialog>
  </div>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue'; // 公共弹框
import inputFun from '@/utils/fun.js'
export default {
  components: {
    FuiDialog
  },
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    //按钮是否禁用
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
    decimalNum: {
      type: Number,
      default: 2
    },
    modelData: { // 组件参数 parms { 【是否的单选】singleSelect: false, 【取id的是哪个字段】resultFieldKey: 'groupId', needRoot: false, data: [] }
      type: Object,
      default: () => { }
    },
    dynamicModel: { // 组件模块【selectOnlyUsers(用户控件,单选)，selectUsers(用户控件,多选)，selectOrg(组织控件，多选)，selectRole(角色控件，多选)】
      type: String,
      default: ''
    }
  },
  watch: {
    value: {
      handler(n,o) {
        let val = n;
        if(val && typeof val == "number"){
          val = (val).toString();
        }else{
          return ''
        }
        this.currentValue = Object.tofixed(Number(val) * 100, this.decimalNum) + '%';

      },
      deep:true,
      immediate:true
    }
  },
  data() {
    return {
      componentModule: '',
      currentValue:'',
      visible: false
    }
  },
  created() {

  },
  methods: {
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
      this.visible = false;
    },
    /**
     * 清除所有
     */
    clearSelector() {
      this.$nextTick(() => {
        if (this.$refs['componentModuleRef']) this.$refs['componentModuleRef'].clearAll()
      })
    },
    focusHandler(e) {
      const val = e.target.value
      const value = val.replaceAll('%', '')
      if (value) this.currentValue = inputFun.getTofixed(value, this.decimalNum)
    },
    blurHandler(e) {
      const val = e.target.value
      if (isNaN(val)) {
        this.$emit('change', '')
        this.currentValue = ''
      } else {
        const newNal = inputFun.getTofixed(val / 100, this.decimalNum + 2);
        this.$emit('change', newNal)
        this.currentValue = inputFun.getTofixed(newNal * 100, this.decimalNum) + '%'
      }
    }
  }
}
</script>
<style scoped>

</style>
