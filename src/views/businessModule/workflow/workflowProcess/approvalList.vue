<template>
  <!--办理过程 -->
  <div class="wf-box">
    <div class="wf-box-section-title mr0">
      <span class="sectionPrefixBlueBar"></span><span class="section-title">办理过程</span>
      <span :class="collapseTarget.approvalrecordlist?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'" @click="collapseTargetClick('approvalrecordlist')"></span>
    </div>
    <div v-if="collapseTarget.approvalrecordlist" id="approvalrecordlist" class="p20">
      <f2bpm-approvalrecordlist v-if="wfContext.IsShowApprovalList" :pagesize="50" :wiid="wiid" />
    </div>
  </div>
</template>

<script>
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-approvalrecordlist.js';
  export default {
    name: 'ApprovalList',
    components: {
      f2bpmApprovalAction
    },
    props: ['wfContext'],
    data() {
      return {
        // 流程上下文
        // wfContext: {},
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
