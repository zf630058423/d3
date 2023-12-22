<template>
   <FuiDialog :visible="visible" :title="title" @on-cancel="onCancel" @on-confirm="onConfirm">
      <ShowModalMsg v-bind="$attrs" v-on="$listeners" ref="showModalMsgRef"></ShowModalMsg>
   </FuiDialog>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
import ShowModalMsg from '@/views/workflow/dialog/showModalMsg.vue';

export default {
  components: {
    FuiDialog,
    ShowModalMsg
  },
  props: {
    visible: {
      type: Boolean,
     default: false
    },
    title: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确认撤回'
    },
    beforeFn: {
      type: Object,
      default: () => { }
    },
    isToStart: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    msgTitle() {
      return this.isToStart ? '请输入【强制撤回到开始】的原因，请谨慎操作？' : '请输入撤回原因？';
    }
  },
  data() { 
    return {

    }
  },
  created() { 
    if (!this.actionButtonBefore(!this.beforeFn)) return false;
  },
  methods: {
    onCancel() { 
      this.$emit('update:visible', false);
    },
    onConfirm() { 
      let content = this.$refs.showModalMsgRef.getResult();
      this.$emit("onConfirm",content,this.isToStart)
    },
    actionButtonBefore(beforeFn) {
      try {
        var isCando = true;
        if (beforeFn) {
          if (typeof eval(beforeFn) == "function") {
            isCando = eval(beforeFn).call(this);
          }
        }
        return isCando;
      } catch (err) {
        alert(err);
        return false;
      }
    }
  }
}
</script>
<style scoped>

</style>