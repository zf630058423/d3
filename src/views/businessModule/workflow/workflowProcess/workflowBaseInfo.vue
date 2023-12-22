<template>
  <!--流程信息-->
  <div v-show="collapseTarget.baseInfoContainer" id="workflowInstanceBaseInfo" class="wf-box">
    <div class="wf-box-section-title cur" @click="collapseTargetClick('baseInfo')">
      <span class="section-title">{{ $t('workflowform.procInfo') }}</span>
      <span class="el-icon-close close-icon" @click="close"></span>
    </div>
    <!--流程基础信息-->
    <div id="workflow-base-info" class="p2 workflow_base_info">
       <el-row class="el-table-row" :gutter="20">
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.workflowTitle') }} ：</span>
            <span class="grid-text">
              <el-input class="grid-width" v-if="!workflowTitleIsDisabled" v-model="wfContext.WorkflowTitle" size="small" placeholder="工单标题" @mouseover.native="inputOnMouseOver($event)" />
                <span v-if="workflowTitleIsDisabled" v-html="wfContext.WorkflowTitle"></span>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.importance') }}：</span>
            <span class="grid-text">
              <el-select v-model="wfContext.Importance" :disabled="isReadOnly||wfContext.CurrentActivityType!='Start'" size="small" filterable placeholder="请选择">
              <el-option v-for="item in importanceData" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-table-row" :gutter="20">
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">
              {{ $t('workflowform.urgency') }}：
            </span>
            <span class="grid-text">
              <el-select class="grid-width" v-model="wfContext.Urgency" :disabled="isReadOnly||wfContext.CurrentActivityType!='Start'" size="small" filterable placeholder="请选择">
              <el-option v-for="item in urgencyData" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.sheetId') }}：</span>
            <span class="grid-text" v-html="pageBaseInfo.sheetId"></span>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-table-row" :gutter="20">
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.currentActivityName') }}：</span>
            <span class="grid-text">
              {{ language=='en-US' ? pageBaseInfo.currentActivityAlias : pageBaseInfo.currentActivityName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.workflowState') }}：</span>
            <span class="grid-text" v-html="langworkflowInstinceState(pageBaseInfo.workflowInstinceState)"></span>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-table-row" :gutter="20">
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.startor') }}：</span>
            <span class="grid-text" v-html="pageBaseInfo.creator"></span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.startTime') }}：</span>
            <span class="grid-text" v-html="pageBaseInfo.startTime"></span>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-table-row" :gutter="20">
        <el-col :span="12">
          <div class="grid-row bg-purple">
            <span class="grid-title">{{ $t('workflowform.finishedTime') }}：</span>
            <span class="grid-text" v-html="pageBaseInfo.finishedTime"></span>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
    export default {
      name: 'workflowBaseInfo',
      props: ['wfContext', 'pageBaseInfo'],
      data() {
        return {
          // 流程上下文
          isShowTip: false,
          workflowTitleIsDisabled: false,
          isReadOnly: false,
          inputMaxWidth: 370,
          language: '',
          urgencyData: [],
          importanceData: [],
          // 打开或关闭的块
          collapseTarget: { baseInfoContainer: true, baseInfo: true, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true }
        }
      },
      computed: {
        langworkflowInstinceState() {
          return function(status) {
            return window.getWorkflowStatus(status);
          };
        }
      },
  created() {
        var that = this;
        var formAction = Object.toQueryString('formAction') || '';
        if (formAction > 2) {
          that.isReadOnly = true;
          that.workflowTitleIsDisabled = true;
        }
      },
      methods: {
        inputOnMouseOver(event) {
          const target = event.target;
          this.inputMaxWidth = target.offsetWidth ? target.offsetWidth : 370;
          this.isShowTip = target.offsetWidth >= target.scrollWidth;
        },
        collapseTargetClick(name) {
          var that = this;
          that.collapseTarget[name] = !that.collapseTarget[name];
          that.resizeEmptySpaceHeight();
          event.stopPropagation();
          event.preventDefault();
        },
        resizeEmptySpaceHeight() {
          const that = this;
          const scrollerHeight = that.scrollerHeight;
          setTimeout(function() {
            const WorkflowContentDivHeight = $('#WorkflowContentDiv').height();
            var spaceHeight = scrollerHeight - WorkflowContentDivHeight - 10;
            console.info('scrollerHeight:' + scrollerHeight, WorkflowContentDivHeight, spaceHeight);
            $('.workflow-form-content-bottom-empty-space-content').height(spaceHeight);
          }, 300);
        },
        close() {
          this.$emit("close");
        }
      }
    }
</script>

<style lang="scss" scoped>
  // @import "~@/resources/css/workflowform.css";
  // @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  .wf-box-section-title{
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close-icon{
      margin-right: 16px;
      font-size: 16px;
    }
  }


  .workflow_base_info{
    padding: 16px 40px 16px 0;
  }

  .el-table-row {
    margin: 32px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .grid-row{
    display: flex;
    justify-content: flex-start;
    justify-items: center;
    align-items: center;

    .grid-title{
      width: 100px;
      text-align: right;
    }
    .grid-text{
      width: 300px;
    }

    .grid-width{
      width: 280px;
    }
  }
</style>

