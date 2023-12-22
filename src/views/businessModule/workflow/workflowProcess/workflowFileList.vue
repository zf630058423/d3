<template>
  <div class="wf-box">
    <div class="wf-box-section-title mr0">
      <span class="sectionPrefixBlueBar"></span><span class="section-title">流程附件</span>
      <span :class="collapseTarget.wrokflowFile?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'" @click="collapseTargetClick('wrokflowFile')"></span>
    </div>
    <div v-if="collapseTarget.wrokflowFile" id="wfattachmentlist" class="p20">
      <f2bpm-processinstfilelist v-if="wfContext.IsShowWrokflowFileList" ref="processinstfilelist" :pagesize="50" :wiid="wiid" />
    </div>
  </div>
</template>

<script>
  import f2bpmProcessinstfilelist from '@/views/workflow/components/workflow/f2bpm-processinstfilelist.vue';
    export default {
        name: 'WorkflowFileList',
        components: {
          f2bpmProcessinstfilelist
        },
        props: ['wfContext'],
        data() {
          return {
            // 打开或关闭的块
            collapseTarget: { baseInfoContainer: true, baseInfo: false, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true }
          }
        },
        methods: {
          collapseTargetClick(name) {
            var that = this;
            that.collapseTarget[name] = !that.collapseTarget[name];
            that.resizeEmptySpaceHeight();
            event.stopPropagation();
            event.preventDefault();
          }
        }
    }
</script>

<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";
</style>
