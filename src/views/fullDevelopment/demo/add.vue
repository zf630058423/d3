<template>
  <div class="f2bpm-page-dialog-layout custBg">
    <div class="topCont">
      <!--流程按钮-->
      <buttonGround :pageBaseInfos="this.pageBaseInfo" @workflow-buttonClick="WorkflowButtonClick"></buttonGround>
    </div>
    <!--表单内容-->
    <el-scrollbar class="container-scroll-bar workflow-form-content-height">
      <div id="WorkflowContentDiv" class="workflow-form-content-detail-container">
        <!--流程信息-->
        <workflowBaseInfo :wfContext="this.wfContext" :pageBaseInfo="this.pageBaseInfo"></workflowBaseInfo>
        <!--页面标题-->
        <div class="pageTitle">demo 页面</div>
        <!--表单信息-->
        <div class="wf-box-section-title cur mt10" @click="collapseTargetClick('baseInfoContainer')">
          <span class="sectionPrefixBlueBar"></span><span class="section-title">基本信息</span>
          <span
            :class="collapseTarget.baseInfoContainer?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
        </div>
        <!--审核菜单 -->
        <f2bpm-approval-action :appro-data="approData" @updateapproalaction="updateapproalaction"/>
        <div v-show="collapseTarget.baseInfoContainer" style="background-color: #FFFFFF">
          <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform"
                   label-width="120px">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-col :span="8">
                  <el-form-item label="编号：" prop="code">
                    <el-input :disabled="isReadOnly" v-model="data.code"></el-input>
                  </el-form-item>
                  <el-form-item label="税率：" prop="inputDecimal">
                    <el-input :disabled="isReadOnly" v-model="data.inputDecimal"></el-input>
                  </el-form-item>
                  <el-form-item label="单位：" prop="inputDict">
                    <el-input :disabled="isReadOnly" v-model="data.inputDict"></el-input>
                  </el-form-item>
                  <el-form-item label="上级键ID：" prop="inputDictMore">
                    <el-input :disabled="isReadOnly" v-model="data.inputDictMore"></el-input>
                  </el-form-item>
                  <el-form-item label="税额：" prop="inputString">
                    <el-input :disabled="isReadOnly" v-model="data.inputString"></el-input>
                  </el-form-item>
                  <el-form-item label="时间：" prop="inputTime">
                    <el-date-picker
                      v-model="data.inputTime"
                      type="date"
                      :disabled="isReadOnly"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="单价（含税）：" prop="jsonData">
                    <el-input :disabled="isReadOnly" v-model="data.jsonData"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!--审批意见填写 -->
        <f2bpm-wfopinion @updateworkflowformdata="updateWorkflowformData"/>
        <!--流程附件 -->
        <workflowFileList v-if="wfContext.IsShowWrokflowFileList" :wfContext="this.wfContext"></workflowFileList>
        <!--办理过程 -->
        <approvalList v-if="wfContext.IsShowApprovalList" :wfContext="this.wfContext"></approvalList>
        <!--传阅过程 -->
        <circulationList v-if="wfContext.IsShowCirculationList" :wfContext="this.wfContext"></circulationList>
        <!--流程评论 -->
        <commentList v-if="wfContext.IsShowCommentList" :wfContext="this.wfContext"></commentList>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
  import buttonGround from '../../businessModule/workflow/workflowProcess/buttonGround'
  import workflowBaseInfo from '../../businessModule/workflow/workflowProcess/workflowBaseInfo';
  import workflowFileList from '../../businessModule/workflow/workflowProcess/workflowFileList';
  import approvalList from '../../businessModule/workflow/workflowProcess/approvalList';
  import circulationList from '../../businessModule/workflow/workflowProcess/circulationList';
  import commentList from '../../businessModule/workflow/workflowProcess/commentList';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
  import demoApi from '@/Api/demo/index';

  export default {
    components: {
      buttonGround, workflowBaseInfo, workflowFileList, approvalList, circulationList, commentList, f2bpmApprovalAction
    },
    data() {
      return {
        loading: false,
        formAction: null,
        isReadOnly: false,
        scrollerHeight: 300,
        treeData: [],
        //打开或关闭的块
        collapseTarget: {
          baseInfoContainer: true,
          baseInfo: false,
          wrokflowFile: true,
          approvalrecordlist: true,
          circulatedrecordlist: true,
          commentrecordlist: true
        },
        data: {
          id: '',
          code: '',
          inputDecimal: 0,
          inputDict: "",
          inputDictMore: "",
          inputString: "",
          inputTime: "",
          jsonData: ""
        },
        formRules: {
          code: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          inputDecimal: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          inputDict: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          inputDictMore: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          inputString: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          inputTime: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          jsonData: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },
        pageBaseInfo: {},
        wfContext: {}, // 流程信息
        workflowTitleIsDisabled: false,
        // 流程自己的数据，比如表单内的审批意见
        workflowformData: {
          hidOpinion: ''
        },
        approData: ''
      }
    },
    mounted() {
      var that = this;
      window.myvm = that;
      $('body').addClass('overnone');
      that.scrollerHeight = window.innerHeight - 52;
      $(window).resize(function () {
        that.scrollerHeight = window.innerHeight - 52;
      });
      $('.workflow-form-content-height').height(that.scrollerHeight);
      that.resizeEmptySpaceHeight();
    },
    activated(){
      this.loadWorkflowInfo();
      console.log('111111111111111111111111')
    },
    beforeRouteUpdate(to, from, next) {
      // 在当前路由改变，路由参数发生变化，组件被复用时调用
      // this.loadWorkflowInfo();
      // console.log(to, from, next)
      // var formAction = Object.toQueryString('formAction') || '';
      // if(WFContext.WorkflowInstinceState > 3 && formAction === 3){
      //   window.location.href = window.location.href.replace("Action=3", "Action=2");
      // }
      console.log('2222222222222222222222222222222')
    },
    created: function () {
      this.loadWorkflowInfo();

    },
    methods: {
      // 加载工作流信息
      loadWorkflowInfo() {
        var that = this;
        window.myvm = this;
        var fixedit = Object.toQueryString('fixedit') || '';
        var appId = Object.toQueryString('appId') || '';
        var wiid = Object.toQueryString('wiid') || '';
        var wid = Object.toQueryString('wid') || '';
        var taskId = Object.toQueryString('taskId') || '';
        var formAction = Object.toQueryString('formAction') || '';
        // 历史留痕ID，传入此参数表示查看的是历史留痕
        var traceId = Object.toQueryString('traceId') || '';
        //强制指定表单模板做为当前显示的表单
        var forceFormId = Object.toQueryString('forceFormId') || '';
        var forceActivityName = Object.toQueryString('forceActivityName') || '';
        that.forceActivityName = forceActivityName;
        that.traceId = traceId;
        that.forceFormId = forceFormId;
        that.appId = appId;
        that.wiid = wiid;
        that.wid = wid;
        that.taskId = taskId;
        that.formAction = formAction;
        if (formAction > 2) {
          that.isReadOnly = true;
          that.workflowTitleIsDisabled = true;
        }
        // 加载页面Model数据
        var indexJson = Object.toAjaxJson('/workflow/workflowform/', 'getIndexJson', {
          appId: appId,
          wiid: wiid,
          wid: wid,
          taskId: taskId,
          formAction: formAction,
          traceId: traceId,
          forceFormId: forceFormId,
          fixedit: fixedit
        });
        if (indexJson.success != undefined && indexJson.success == false) {
          FUI.Window.showMsg(indexJson.msg);
          return false;
        }
        that.indexJson = indexJson;
        //全开发表单获取pid
        if (indexJson.BusObjectDataJson && indexJson.BusObjectDataJson.length > 0 && indexJson.BusObjectDataJson[0].data && indexJson.BusObjectDataJson[0].data.length > 0) {
          let _data = indexJson.BusObjectDataJson[0].data;
          that.pidData = _data.filter(item => item.name == 'Pid')
        }

        that.pageBaseInfo = indexJson.pageBaseInfo;
        that.printFormId = indexJson.pageBaseInfo.printFormId;
        that.wfContext = indexJson.JSWorkflowContext;
        // 传递沟通时不允许修改表单
        if (that.wfContext.IsTaskCommunication === true) {
          that.wfContext.WorkflowformAction = 3;
          that.isReadOnly = true;
          that.workflowTitleIsDisabled = true;
        }
        if (that.wfContext.IsFixEditMode === true) {
          //是否强制为“编辑”模式（最终结果）
          that.wfContext.WorkflowformAction = 2;
        }

        that.wfContext.formRightJson = indexJson.FormRightJson;
        if (!that.wiid) {
          that.wiid = that.wfContext.WorkflowInstanceId;
        }
        if (!that.wid) {
          that.wid = that.wfContext.WorkflowId;
        }
        // 快照列表
        if (that.traceId != '') {
          that.snapshotDataList = indexJson.SnapshotDataList;
        }
        //结束时显示节点表单
        if (that.wfContext.CurrentActivityType == 'End') {
          that.actFormList = indexJson.actFormList || null;
        }

        // 将权限数组转为对象
        $.each(that.wfContext.formRightJson, function (index, item) {
          var name = item.name;
          that.wfContext.formRightJson[name] = item;
        });
        // 审核菜单
        if (that.pageBaseInfo.approData && that.pageBaseInfo.approData.length > 0) {
          that.approData = that.pageBaseInfo.approData;
        }
        WFContext = that.wfContext;
        WFContext.deviceType = that.deviceType;
        // that.taskState = WFContext.TaskState;
        // that.taskIsValid = WFContext.TaskIsValid;
        // that.taskValid();
        if (that.wfContext.WorkflowTitle) {
          $('title').html(that.wfContext.WorkflowTitle);
        }
        if (that.wfContext.CurrentIsModifyProcInstTitle != true && WFContext.CurrentActivityType != 'Start') {
          that.workflowTitleIsDisabled = true;
        }
        if (that.wfContext.FormType == 'UrlForm') {
          that.initailUrlForm();
          // 页面重定向
          if(WFContext.WorkflowInstinceState < 3 && formAction == 3){
            var Action = 2;
            var url =  '/add/?appId=' + that.appId + '&formAction=' + Action + '&wiid=' + wiid+'&taskId='+ WFContext.TaskId;
            window.location.href = __webpath+url;
          }
        }
      },
    //初始Url表单
     initailUrlForm() {
      var that = this;
      var htmlfields = that.indexJson.OnlineFormHtml.htmlfields;
      var urlParmsStr = window.location.search.substr(1);
      var url = htmlfields.url;
      if (url == null || url == "" || (url.indexOf("{") > -1 && url.indexOf("}") > -1)) {
        //配置的是JSON结构，直接返回
        return false;
      }
      //将浏览器的Url参数拼接进去
      if (urlParmsStr) {
        var theChar = url.indexOf("?") > -1 ? "&" : "?";
        url = url + theChar + urlParmsStr;
      }
      if (url.indexOf("wiid=") == -1) {
        url = url + "&wiid=" + that.wfContext.WorkflowInstanceId;
      }
      if (url.indexOf("formAction=") == -1) {
        url = url + "&formAction=" + that.wfContext.WorkflowformAction;
      }
      that.urlForm = htmlfields;
      that.urlForm.url = url;

    },
    closeEdit() {
      FUI.Window.closeEdit()
    },
    updateWorkflowformData(propertyName, newValue) {
      var that = this;
      that.workflowformData[propertyName] = newValue;
    },
    updateapproalaction(value) {
      var that = this;
      that.approAction = value;
    },
    collapseTargetClick(name) {
      var that = this;
      that.collapseTarget[name] = !that.collapseTarget[name];
      that.resizeEmptySpaceHeight();
      event.stopPropagation();
      event.preventDefault();

    },
    // 加载数据
    loadData() {
      var that = this;
      if (formAction != FUI.FormAction.Add) {
        FUI.Form.bindDataToForm(that, "com.f2bpm.extend.financialadministration.impl.applicationmakeoutInvoice.model", "getModel", keyId, null, mainTable);
      }
    },
    // 表单提交
    submitForm() {
      var that = this;
      var success = false;
      //f2bpmui.base.js中全局方法收集富文编辑器数据
      fui_global_richeditorArrValueToInput(that);
      let parm = Object.toClone(that.data);
      parm.wiid = WFContext.WorkflowInstanceId;
      var res = demoApi.addData(parm);
      if (res.code === 200) {
        return !success
      } else {
        FUI.Window.showMsg(res.msg);
        return success
      }
    },
    // field: 可以是字段名也可以是字段定义的对象
    updateFieldValue(field, newValue, vueDataName, subVueDataName) {
      // 更新控件值
      var that = this
      var vueDataObj = vueDataName ? that[vueDataName] : that.data
      if (subVueDataName) {
        vueDataObj = that[vueDataName][subVueDataName]
      }
      if (typeof field === 'string') {
        vueDataObj[field] = newValue
      } else {
        if (field.fieldName) {
          vueDataObj[field.fieldName] = newValue
        } else if (field.vModel) {
          vueDataObj[field.vModel] = newValue
        } else if (field['field']) {
          vueDataObj[field['field']] = newValue
        }
      }
    },
    // 表单校验方法
    validateForm(refFormName) {
      var success = false;
      this.$refs[refFormName].validate(valid => {
        success = valid;
      })
      return success;
    },
    // 调整空白页面高度大小
    resizeEmptySpaceHeight() {
      let that = this;
      let scrollerHeight = that.scrollerHeight;
      setTimeout(function () {
        let WorkflowContentDivHeight = $("#WorkflowContentDiv").height();
        var spaceHeight = scrollerHeight - WorkflowContentDivHeight - 10;
        console.info("scrollerHeight:" + scrollerHeight, WorkflowContentDivHeight, spaceHeight);
        $(".workflow-form-content-bottom-empty-space-content").height(spaceHeight);
      }, 300);
    },
    // 流程按钮事件
    WorkflowButtonClick(btnItem) {
      var that = this;
      var success = false;
      var valid = false;
      if (btnItem.actionName === 'send') {
        // 校验后提交
        valid = that.validateForm('formRef');
        if (!valid) return;
        success = that.submitForm('formRef');
        if (!success) return;
      } else if (btnItem.actionName === 'save') {
        // 无校验暂存
        success = that.submitForm('formRef');
        if (!success) return;
      }
    },
    saveWorkflow(btnDef) {
      var that = this;
      console.info("urlFormDemo saveWorkflow:", btnDef);
      that.data.procInstState = 1;
      var result = "";
      result = that.submitForm('formRef');
      return result;

    }
  }
  }
</script>
<style lang="scss" scoped>
  /*@import "~@/resources/css/workflowform.css";*/
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  .custBg {
    background-color: rgb(243 248 255);
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

  ::v-deep .mymsg {
    width: 400px !important;

    .el-dialog__body {
      padding: 15px 15px !important;

      span {
        font-family: element-icons !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: flex;
        align-items: center;
        -webkit-font-smoothing: antialiased;
      }

      span:before {
        content: "\e7a3";
        color: #E6A23C;
        font-size: 20px;
        margin-right: 10px;
      }
    }

    .dialog-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

  }

  .el-dialog__wrapper {
    transition-duration: 0.3s;
  }

  .dialog-fade-enter-active {
    animation: none !important;
  }

  .dialog-fade-leave-active {
    transition-duration: 0.15s !important;
    animation: none !important;
  }

  .dialog-fade-enter-active .el-dialog,
  .dialog-fade-leave-active .el-dialog {
    animation-fill-mode: forwards;
  }

  .dialog-fade-enter-active .el-dialog {
    animation-duration: 0.3s;
    animation-name: anim-open;
    animation-timing-function: cubic-bezier(0.6, 0, 0.4, 1);
  }

  .dialog-fade-leave-active .el-dialog {
    animation-duration: 0.3s;
    animation-name: anim-close;
  }


  @keyframes anim-open {
    0% {
      opacity: 0;
      transform: scale3d(0, 0, 1);
    }
    100% {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }


  @keyframes anim-close {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale3d(0.5, 0.5, 1);
    }
  }


  .container-scroll-bar {
    ::v-deep .el-scrollbar__wrap,
    ::v-deep .el-scrollbar__view {
      overflow-x: auto;
    }
  }

  .formBox {
    position: relative;
  }

  .menuBox {
    position: fixed;
    left: 90%;
    top: 90%;
  }
</style>
