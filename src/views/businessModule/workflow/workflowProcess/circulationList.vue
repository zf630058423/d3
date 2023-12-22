<template>
  <!--传阅过程 -->
  <div class="wf-box">
    <div class="wf-box-section-title mr0">
      <span class="sectionPrefixBlueBar"></span><span class="section-title">传阅过程</span>
      <span @click="collapseTargetClick('circulatedrecordlist')" :class="collapseTarget.circulatedrecordlist?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
    </div>
    <div id="circulatedrecordlist" class="p20" v-if="collapseTarget.circulatedrecordlist">
      <f2bpm-circulatedrecordlist v-if="wfContext.IsShowCirculationList" :pagesize="50" :wiid="wiid" />
    </div>
  </div>
</template>

<script>
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-circulatedrecordlist.js';
  export default {
    name: "circulatedrecordlist",
    components: {
    },
    props:['wfContext'],
    data(){
      return{
        // 流程上下文
       //wfContext: {},
        //打开或关闭的块
        collapseTarget: { baseInfoContainer: true, baseInfo: false, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true },
      }
    },
    methods:{
      collapseTargetClick(name) {
        var that = this;
        that.collapseTarget[name] = !that.collapseTarget[name];
        that.resizeEmptySpaceHeight();
        event.stopPropagation();
        event.preventDefault();

      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";
</style>
