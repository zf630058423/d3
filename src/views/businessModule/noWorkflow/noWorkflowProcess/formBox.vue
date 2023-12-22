<template>
  <div class="f3bpm-page-dialog-layout custBg">
    <div class="no-workflow-cont" :style="{justifyContent: type !== 'detail' ? 'space-between' : 'end'}">
      <!--保存按钮-->
      <div>
        <el-button v-show="type !== 'detail' && formAction != 3" type="primary" size="small" @click="validateForm">保存</el-button>
      </div>
      <breadcrumb-nav :title="title" :fullDev="fullDev" :type="'noWorkFlow'"></breadcrumb-nav>
    </div>
    <!--表单内容-->
    <el-scrollbar class="container-scroll-bar workflow-form-content-height">
      <div id="WorkflowContentDiv" class="workflow-form-detail-container">
        <!--表单信息-->
        <div class="wf-box-section-title cur mt10">
          <component :is="currentView" ref="form" :type="type" :row-data="rowData" />
        </div>
        <!--审核菜单 -->
        <!-- <f2bpm-approval-action :appro-data="approData" @updateapproalaction="updateapproalaction" /> -->
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
  import breadcrumbNav from '@/views/businessModule/components/breadcrumbNav.vue';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
// import { submitForm } from '@/Api/workflowBusssion/index.js';
  import { submitForm, updateForm, reviseForm } from '@/Api/workflowBusssion/index.js';
  export default {
    components: {
      breadcrumbNav, f2bpmApprovalAction
    },
    data() {
      return {
        currentView: '',
        loading: false,
        isReadOnly: false,
        scrollerHeight: 300,
        treeData: [],
        // 打开或关闭的块
        collapseTarget: { baseInfoContainer: true, baseInfo: false, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true },
        approData: '',
        enCode: '',
        rowData: {},
        dataForm: {},
        params: {},
        title: '',
        myId: '',
        formAction: '',
        type: '',
        modelName: '',
        workflowTitleIsDisabled: false,
        isInterface:false,  //是否自己去写保存接口
        fullDev: false  //是否是全开发列表
      }
    },
    mounted() {
      const that = this;
      this.devParams();

      $('body').addClass('overnone');
      that.scrollerHeight = window.innerHeight - 52;
      $(window).resize(function() {
        that.scrollerHeight = window.innerHeight - 52;
      });
      $('.workflow-form-content-height').height(that.scrollerHeight);
      that.resizeEmptySpaceHeight();
      that.initNoWorkflowForm()
    },
  created() {
    window.myvm = this;
    this.devParams();
    const { formAction, myId } = this.params;
    this.formAction = formAction || '';
    this.myId = myId || '';
    this.type = formAction;
    if (Number(this.formAction) > 2  || this.formAction === 'detail') {
      this.isReadOnly = true;
      this.workflowTitleIsDisabled = true;
      this.type = 'detail';
    }
    },
  methods: {
    devParams() {
      this.params = this.$route.query || {};
      const { fullDev,encode, myId,formAction,title, modelName, isInterface } = this.params;
      if (fullDev) {
        this.enCode = encode;
        this.myId = myId;
        this.formAction = formAction;
        this.title = title;
        this.fullDev = !!fullDev;
        this.modelName = modelName;
        this.isInterface = isInterface;
      } else {
        this.encode = Object.toQueryString('encode') || '';
        this.myId = Object.toQueryString('myId') || '';
        this.modelName = Object.toQueryString('modelName') || '';
        this.formAction = Object.toQueryString('formAction') || '';
        this.isInterface = Object.toQueryString('isInterface') || '';
      }
       this.type = this.formAction;
    },
    close() {
      this.$router.go(-1)
    },
      /**
       * 表单详情初始化
       */
      initNoWorkflowForm() {
        // 自定义列表-表单详情
        const { encode, myId, title } = this.params;
        this.enCode = encode;
        this.title = title;
        if (encode) {
          this.currentView = (resolve) => require([`@/views/businessModule/noWorkflow/${encode}/form`], resolve)
          this.rowData = { id: myId, enCode: encode, readonly: this.isReadOnly, modelName:this.modelName }
        }
      },
      updateapproalaction(value) {
        var that = this;
        that.approAction = value;
      },
      async submitForm(callback) {
        try {
          this.dataForm.wiid = this.wfContext.WorkflowInstanceId || '';
          const res = await submitForm(this.modelName, this.enCode, this.dataForm)
          if (res.code === 200) {
            callback(true)
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
    async validateForm() {
      const result = await this.$refs.form.validateForm()
      if (result) {
        this.dataForm = result;
        if (this.isInterface || this.isInterface === 'true') {
          this.saveForm();
        }
      } else {
        //表单校验时滚动至不通过的位置
          this.$nextTick(() => {
            let errDom = document.getElementsByClassName("is-error")
            errDom[0]?.scrollIntoView({ behavior: "smooth" });
          })
        }
    },
    async saveForm() {
      try {
        const methodName = this.dataForm.id ? updateForm : submitForm;
        let res = await methodName(this.modelName, this.enCode, this.dataForm);
        if (res.code === 200) {
            const { code, modelName, encode, toDone, path } = this.$route.query;
            FUI.Window.showMsg2(null, res.msg, null, 1);
            this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
          // this.$router.go(-1)
          this.$router.push({path: path})
            // if(!toDone) {
            //   this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true');
            // } else {
            //   this.$router.go(-1)
            // }
          } else {
            FUI.Window.showMsg(res.msg);
          }
      } catch (error) {
        FUI.Window.showMsg(error);
      }
    },
    resizeEmptySpaceHeight() {
      const that = this;
      const scrollerHeight = that.scrollerHeight;
      setTimeout(function() {
        const WorkflowContentDivHeight = $('#WorkflowContentDiv').height();
        var spaceHeight = scrollerHeight - WorkflowContentDivHeight - 40;
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

  .custBg{
    background: #F7FAFC;

    .no-workflow-cont{
      background: $WhiteBg;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
    }

    .cust-content{
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

  .wf-box-section-title{
    padding: 10px;
  }

  .workflow-form-detail-container{
    margin: 0 auto;
  }

  ::v-deep .el-form-item__label{
    font-size: 14px;
    font-weight: 500;
  }

  ::v-deep .el-input-group{
    vertical-align: middle;
  }

  ::v-deep .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
</style>
