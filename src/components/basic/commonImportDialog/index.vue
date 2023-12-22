<template>
   <FuiDialog :visible="visible" :title="title" :isBottom="true" :confirmText="confirmText" @on-cancel="close" @on-confirm="onConfirm">
     <CommonExcelImport v-bind="$attrs" v-on="$listeners" @close="close" ref="commonExcelImportRef"></CommonExcelImport>
   </FuiDialog>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
import CommonExcelImport from '@/views/workflow/security/commonImport/commonExcelImport.vue';

export default {
  components: {
    FuiDialog,
    CommonExcelImport
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
      default:'确定导入'
    }
  },
  data() { 
    return {

    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    onConfirm() { 
      let result = this.$refs.commonExcelImportRef.getResult();
      this.$emit('onConfirm',result)
    }
  }
}
</script>
<style scoped>

</style>