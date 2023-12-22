<!--班组工资单-->
<template>
  <div class="f3bpm-page-dialog-layout custBg">
    <div class="no-workflow-cont">
      <!--保存按钮-->
      <el-button type="primary" size="small" @click="validateForm" v-if="isReadOnly">保 存</el-button>
      <breadcrumb-nav :title="title" :type="'fullDevelopment'" @close="close"></breadcrumb-nav>
    </div>
    <!--表单内容-->
    <el-scrollbar class="container-scroll-bar workflow-form-content-height">
      <div id="WorkflowContentDiv" class="workflow-form-detail-container">
        <!--表单信息-->
        <div class="wf-box-section-title cur mt10">
          <formView ref="form"/>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
  import breadcrumbNav from '@/views/businessModule/components/breadcrumbNav.vue';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
  import {saveForm, updateForm, getForm} from '@/Api/contractTeamPayroll/index.js';
  import formView from './components/formView'

  export default {
    components: {
      breadcrumbNav, f2bpmApprovalAction, formView
    },
    data() {
      return {
        currentView: '',
        loading: false,
        formAction: null,
        isReadOnly: true,
        scrollerHeight: 300,
        treeData: [],
        // 打开或关闭的块
        collapseTarget: {
          baseInfoContainer: true,
          baseInfo: false,
          wrokflowFile: true,
          approvalrecordlist: true,
          circulatedrecordlist: true,
          commentrecordlist: true
        },
        approData: '',
        enCode: '',
        rowData: {},
        dataForm: {},
        params: {},
        title: '',
        modelName: ''
      }
    },
    mounted() {
      const that = this;
      window.myvm = that;
      that.params = that.$route.params || {};
      $('body').addClass('overnone');
      that.scrollerHeight = window.innerHeight - 52;
      $(window).resize(function () {
        that.scrollerHeight = window.innerHeight - 52;
      });
      $('.workflow-form-content-height').height(that.scrollerHeight);
      that.resizeEmptySpaceHeight();
      that.initNoWorkflowForm()
    },
    created() {
      this.initNoWorkflowForm()
    },
    methods: {
      close() {
        this.$refs['form'].clearForm();
        this.$router.go(-1)
      },
      /**
       * 表单详情初始化
       */
      initNoWorkflowForm() {
        var that = this;
        let formAction = Object.toQueryString('formAction') || '';
        if (formAction && formAction > 0) {
          that.isReadOnly = false;
        } else {
          that.isReadOnly = true
        }
        that.$nextTick(function () {
          that.$refs.form.init()
        })

      },
      updateapproalaction(value) {
        var that = this;
        that.approAction = value;
      },
      async submitForm(callback) {
        var that = this;
        try {
          var res;
          if (that.dataForm.id) {
            res = await updateForm(that.dataForm);
          } else {
            res = await saveForm(that.dataForm);
          }
          if (res.code === 200) {
            FUI.Window.showMsg('保存成功', '提示', 'info', function (res) {
              if (window.opener != null) {
                that.close();
              }
            });
          } else {
            callback(false)
          }
        } catch (error) {
          callback(false)
        }
        // f2bpmui.base.js中全局方法收集富文编辑器数据
        // fui_global_richeditorArrValueToInput(that);
        // var success = that.validateForm('formRef');
        // if (!success) return;
        // FUI.Form.submitForm(that, that.data, 'com.f2bpm.extend.financialadministration.impl.applicationmakeoutInvoice.model', 'saveModel', formAction, keyId, parentGridId, mainTable);
      },
      async validateForm(callback) {
        var that = this;
        const result = await that.$refs.form.validateForm()
        if (result) {
          this.dataForm = result;
          FUI.Window.confirm(that, '您确定提交吗？', "提交确认", function (res) {
            that.submitForm();
            return callback(true);
          });
        } else {
          return callback(false)
        }
      },
      resizeEmptySpaceHeight() {
        const that = this;
        const scrollerHeight = that.scrollerHeight;
        setTimeout(function () {
          const WorkflowContentDivHeight = $('#WorkflowContentDiv').height();
          var spaceHeight = scrollerHeight - WorkflowContentDivHeight - 10;
          console.info('scrollerHeight:' + scrollerHeight, WorkflowContentDivHeight, spaceHeight);
          $('.workflow-form-content-bottom-empty-space-content').height(spaceHeight);
        }, 300);
      },
      closeDrawer() {
        this.drawer = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  $WhiteBg: #fff;

  .custBg {
    background: #F7FAFC;

    .no-workflow-cont {
      background: $WhiteBg;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
    }

    .cust-content {
      border: 1px solid;
      margin: 16px;
    }
  }

  .pageTitle {
    text-align: center;
    font-size: 26px;
    color: rgb(0, 140, 255);
    height: 48px;
    background: #FFFFFF;
    margin-bottom: 10px;
    line-height: 48px;
    margin-top: 10px;
  }

  .wf-box-section-title {
    padding: 10px;
  }

  .workflow-form-detail-container {
    margin: 0 auto;
  }

  ::v-deep .el-form-item__label {
    font-size: 14px;
    font-weight: 500;
  }

  ::v-deep .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
</style>
