<template>
  <div class="f3bpm-page-dialog-layout custBg">
    <div class="topCont">
      <!--流程按钮-->
      <buttonGround v-show="activeName=='first'&& reviseCode !='true'" :page-base-infos="this.pageBaseInfo" :formAction="formAction" @validateForm="validateForm" @submitForm="submitForm" @flowInfoChagne="flowInfoChagne" @toRevise="toRevise" @saveWorkflow="saveWorkflow"></buttonGround>
      <div style="flex:1;height:50px"></div>
      <breadcrumb-nav :title="'标题'"></breadcrumb-nav>
    </div>
    <!--表单内容-->
    <el-scrollbar class="container-scroll-bar workflow-form-content-height">
      <div id="WorkflowContentDiv" class="workflow-form-detail-container">
        <!--表单信息-->
        <div class="wf-box-section-title cur mt10" >
          <el-tabs v-if="(reviseCode == 'true' || isRevise == 'true' || isWorkflowRevise == 'true' ) && rowId && isApproved == 'false'" v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
            </el-tab-pane>
            <el-tab-pane label="修订记录" name="second">
            </el-tab-pane>
          </el-tabs>
          <component :is="currentView" v-show="activeName=='first'" ref="form" :row-data="rowData" :pageBaseInfo="this.pageBaseInfo" />
          <revision-record v-show="activeName=='second'"></revision-record>
        </div>
        <!--审核菜单 -->
        <f2bpm-approval-action :appro-data="approData" @updateapproalaction="updateapproalaction" />
        <!--流程附件 -->
        <workflowFileList v-if="wfContext.IsShowWrokflowFileList" :wf-context="this.wfContext"></workflowFileList>
        <!--办理过程 -->
        <approvalList v-if="wfContext.IsShowApprovalList" :wf-context="this.wfContext"></approvalList>
        <!--传阅过程 -->
        <circulationList v-if="wfContext.IsShowCirculationList" :wf-context="this.wfContext"></circulationList>
        <!--流程评论 -->
        <commentList v-if="wfContext.IsShowCommentList" :wf-context="this.wfContext"></commentList>
      </div>
    </el-scrollbar>
    <!--审批意见填写 -->
    <el-dialog>
      <f2bpm-wfopinion @updateworkflowformdata="updateWorkflowformData" />
    </el-dialog>
    <el-drawer
      title="流程信息"
      :visible.sync="drawer"
      :with-header="false"
      :size="800"
    >
      <workflowBaseInfo :wf-context="this.wfContext" :page-base-info="this.pageBaseInfo" @close="closeDrawer"></workFlowBaseInfo>
    </el-drawer>
  </div>
</template>
<script>
  import revisionRecord from '../../components/revisionRecord.vue';
  import buttonGround from './buttonGround';
  import breadcrumbNav from '@/views/businessModule/components/breadcrumbNav.vue';
  import workflowBaseInfo from './workflowBaseInfo';
  import workflowFileList from './workflowFileList';
  import approvalList from './approvalList';
  import circulationList from './circulationList';
  import commentList from './commentList';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
  import { submitForm, updateForm, reviseForm } from '@/Api/workflowBusssion/index.js';
  import { reviseWildForm } from '@/Api/contract/index.js';
  export default {
    components: {
      revisionRecord,
      buttonGround, breadcrumbNav, workflowBaseInfo, workflowFileList, approvalList, circulationList, commentList, f2bpmApprovalAction
    },
    props: {
      formData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        activeName: 'first',
        drawer: false,
        currentView: '',
        loading: false,
        formAction: null,
        isReadOnly: false,
        scrollerHeight: 300,
        treeData: [],
        // 打开或关闭的块
        collapseTarget: { baseInfoContainer: true, baseInfo: false, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true },
        pageBaseInfo: {},
        wfContext: {}, // 流程信息
        workflowTitleIsDisabled: false,
        // 流程自己的数据，比如表单内的审批意见
        workflowformData: {
          hidOpinion: ''
        },
        approData: '',
        enCode: '',
        rowData: {},
        dataForm: {},
        isRevise: false,
        isWorkflowRevise: false,
        rowId: '',
        modelName: '',
        reviseCode: '',
        isSubmit: false,
        isReStart: false,  //是否重启
        isApproved: false
      }
    },
    mounted() {
      var that = this;
      window.myvm = that;
      $('body').addClass('overnone');
      that.scrollerHeight = window.innerHeight - 180;
      $(window).resize(function() {
        that.scrollerHeight = window.innerHeight - 180;
      });
      $('.workflow-form-content-height').height(that.scrollerHeight);
      that.resizeEmptySpaceHeight();
      that.initWorkflowForm()
    },
  activated: function () {
    var that = this;
    window.myvm = that;
    this.initData();
  },
  methods: {
      /**
       * 路由跳转
       */
      initData(action, TaskId) {
        var that = this;
        window.myvm = this;
        var fixedit = Object.toQueryString('fixedit') || '';
        var appId = Object.toQueryString('appId') || '';
        var wiid = Object.toQueryString('wiid') || '';
        var wid = Object.toQueryString('wid') || '';
        var taskId = TaskId || Object.toQueryString('taskId') || '';
        var formAction = action || Object.toQueryString('formAction');
        // 历史留痕ID，传入此参数表示查看的是历史留痕
        var traceId = Object.toQueryString('traceId') || '';
        // 强制指定表单模板做为当前显示的表单
        var forceFormId = Object.toQueryString('forceFormId') || '';
        var forceActivityName = Object.toQueryString('forceActivityName') || '';
        const isReStart = Object.toQueryString("isReStart") || false;  //是否重启
        this.isSubmit = Object.toQueryString("isSubmit") || false;  //审批的时候是否需要提交表单
        that.forceActivityName = forceActivityName;
        that.traceId = traceId;
        that.forceFormId = forceFormId;
        that.appId = appId;
        that.wiid = wiid;
        that.wid = wid;
        that.taskId = taskId;
        that.formAction = formAction;
        that.isReStart = Boolean(isReStart);
        // 0未有实例，2待办，3查看,4待阅
        if (formAction > 2) {
          that.isReadOnly = true;
          that.workflowTitleIsDisabled = true;
        }
        // 修订不走审批流
        const isRevise = Object.toQueryString('isRevise') || 'false';
        // 修订是否走审批
        this.isApproved = Object.toQueryString('isApproved') || 'false';
        that.isRevise = isRevise;
        if (isRevise == 'true' && that.wiid && this.isApproved == 'false') {
          return
        }
        // 加载页面Model数据
        var indexJson = Object.toAjaxJson('/workflow/workflowform/', 'getIndexJson', { appId: appId, wiid: wiid, wid: wid, taskId: taskId, formAction: formAction, traceId: traceId, forceFormId: forceFormId, fixedit: fixedit });
        if (indexJson.success != undefined && indexJson.success == false) {
          FUI.Window.showMsg(indexJson.msg);
          return false;
        }
        that.indexJson = indexJson;
        // 全开发表单获取pid
        if (indexJson.BusObjectDataJson && indexJson.BusObjectDataJson.length > 0 && indexJson.BusObjectDataJson[0].data && indexJson.BusObjectDataJson[0].data.length > 0) {
          const _data = indexJson.BusObjectDataJson[0].data;
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
          // 是否强制为“编辑”模式（最终结果）
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
        // 结束时显示节点表单
        if (that.wfContext.CurrentActivityType == 'End') {
          that.actFormList = indexJson.actFormList || null;
        }

        // 将权限数组转为对象
        $.each(that.wfContext.formRightJson, function(index, item) {
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
        if (that.wfContext.FormType == 'OnlineForm' || (that.wfContext.FormType == 'NoneForm' && that.indexJson.OnlineFormHtml.htmlfields)) {
          that.initailOnlineForm();
          try {
            that.loadPageFieldData();
          } catch (error) {
            console.info('加载页面组件数据出错：' + error);
          }
        }
        that.setActionInit()
        FUI.Form.initailConfigTypeComboBox(this);
      },
      setActionInit() {
        var that = this;
        if (that.wfContext.FormType == 'UrlForm' || that.wfContext.FormType == 'NoneForm') {
          // that.initailUrlForm();
          // 页面重定向
          // 判断当前流程状态为小于3 或 5 且 页面状态为查看 且 --, 页面重定向为待办状态
          // that.wfContext.JumpToTaskId 有值时，当前用户可跳转到的待办流程
          if ((WFContext.WorkflowInstinceState < 3 || WFContext.WorkflowInstinceState == 5) && that.formAction == 3 &&  that.wfContext.JumpToTaskId) {
            // var url = window.location.href.replace('Action=3', 'Action=2');
            // url = url + '&taskId=' + WFContext.TaskId; // taskId: 任务实例ID
            // window.location.href = url;
            that.initData(2, WFContext.TaskId)
          }
        }
      },
      /**
       * 表单详情初始化
       */
    initWorkflowForm() {
        var that = this;
        const isApproved = Object.toQueryString('isApproved') || '';
        if(isApproved)  that.initData();
        const encode = Object.toQueryString('encode');
        const rowId = Object.toQueryString('rowId');
        const appId = Object.toQueryString('appId');
        const modelName = Object.toQueryString('modelName');
        const reviseCode = Object.toQueryString('reviseCode'); // 修订状态
        const isRevise = Object.toQueryString('isRevise');  //是否修订
        const isReStart = Object.toQueryString("isReStart") || false;  //是否重启
        this.rowId = rowId;
        this.enCode = encode;
        this.modelName = modelName;
        this.reviseCode = reviseCode;
        let state = (['marketContractorExtend','marketProjectExtend'].indexOf(encode) != -1) ? true : false;
        const approvedAppIds = [];  //修订流程 EV：预选承包商修订  DV:营销立项修订
        if((state && isRevise) || approvedAppIds.includes(appId)){
          this.isWorkflowRevise = true
        }else{
          this.isWorkflowRevise = false
        }
        this.isReStart = Boolean(isReStart);
        if (encode && !this.isWorkflowRevise) {
          that.currentView = (resolve) => require([`@/views/businessModule/workflow/${encode}/form`], resolve);
          // that.rowData = JSON.parse(JSON.stringify({ id: rowId, enCode: encode, readonly: that.isReadOnly, modelName: that.modelName, isReStart: this.isReStart }))
        } else if (encode && this.isWorkflowRevise) {
          that.currentView = (resolve) => require([`@/views/businessModule/workflow/${encode}/reviseForm`], resolve);
          // that.rowData = JSON.parse(JSON.stringify({ id: rowId, enCode: encode, readonly: that.isReadOnly, modelName: that.modelName }))
        }
        that.rowData = JSON.parse(JSON.stringify({
          id: rowId,
          enCode: encode,
          readonly: that.isReadOnly,
          modelName: that.modelName,
          isReStart: that.isReStart,
          isRevise: that.isRevise
        }))
      },
      closeEdit() {
        FUI.Window.closeEdit()
      },
      // 点击流程信息
      flowInfoChagne() {
        console.log('pageBaseInfo===:', this.pageBaseInfo);
        this.drawer = true;
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
      loadData() {
        var that = this
        if (that.formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, 'com.f2bpm.extend.financialadministration.impl.applicationmakeoutInvoice.model', 'getModel', keyId, null, mainTable);
        }
      },
      async toRevise() {
        try {
          this.validateForm(async res => {
            if (res) {
              this.dataForm.wiid = Object.toQueryString('wiid');
              this.dataForm.workFlow = {
                code: this.dataForm.code,
                isSubmit: 1,
                formAction: WFContext.WorkflowformAction,
                appId: WFContext.AppId,
                formId: WFContext.FormId,
                workflowTitle: WFContext.WorkflowTitle,
                taskId: WFContext.TaskId,
                wiid:  WFContext.WorkflowInstanceId,
                isFixEditMode: WFContext.IsFixEditMode,
                businessKey: WFContext.BusinessKey
              };
              const res = await reviseForm(this.modelName, this.enCode, this.dataForm);
              if (res.code === 200) {
                this.$message.success('修订成功')
                this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
                const { code, encode, modelName } = this.$route.query;
                this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true')
              }
            }
          })
        } catch (error) {
          console.log('error', error)
        }
      },
      /**
       * 保存
       * @param {*} callbacak
       */
    saveWorkflow(callbacak) {
        if (this.$refs.form.getDataForm) {
          callbacak(this.$refs.form.getDataForm());
        } else {
          callbacak(this.$refs.form.dataForm);
        }
      },
      async submitForm(data) {
        // if (WFContext.WorkflowInstinceState == 2 && (this.formAction == 2 || this.formAction == 3 ) && !this.isSubmit) {
        //   return callback(true)
        // }
        try {
          const reviseCode = Object.toQueryString('reviseCode'); // 修改状态 有值调修订方法，没有调增改方法
          const isApproved = Object.toQueryString('isApproved') || ''; // 审批修订流程表单
          const appId = Object.toQueryString('appId') || ''; // 修订流程表单appid
          this.dataForm.wiid = WFContext.WorkflowInstanceId;
          this.dataForm.workFlow = {
            code: this.dataForm.code,
            isSubmit: 1,
            formAction: WFContext.WorkflowformAction,
            appId: WFContext.AppId,
            formId: WFContext.FormId,
            workflowTitle: WFContext.WorkflowTitle,
            taskId: WFContext.TaskId,
            wiid:  WFContext.WorkflowInstanceId,
            isFixEditMode: WFContext.IsFixEditMode,
            businessKey: WFContext.BusinessKey,
            ...data
          };
          let res;
          const approvedAppIds = ['EN','DV'];  //修订流程 EV：预选承包商修订  DV:营销立项修订
          if (reviseCode && !isApproved) {
            res = await reviseForm(this.modelName, this.enCode, this.dataForm); // 无流程修订保存
          } else if ((reviseCode && isApproved == 'true') || approvedAppIds.includes(appId)) {
            let modelName = '';
            let enCode = '';
            if(appId == 'EN' || appId == 'DV') {
               modelName = 'market';
               enCode = 'marketContractorExtend'
            }
            res = await reviseWildForm(modelName, enCode, this.dataForm); // 有流程修订审批
          } else {
            const methodName = this.dataForm.id ? updateForm : submitForm;
            res = await methodName(this.modelName, this.enCode, this.dataForm); // 业务数据保存和更新
          }
          if (res.code === 200) {
            const { code, modelName, encode, toDone } = this.$route.query;
            FUI.Window.closeEditAll();
            setTimeout(() => {
              FUI.Window.showMsg2(null, res.msg, null, 1);
            }, 200);
            this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
            if(!toDone) {
              this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true');
            } else {
              this.$router.go(-1)
            }
          } else {
            FUI.Window.showMsg(res.msg);
          }
        } catch (error) {
          FUI.Window.showMsg(error);
        }
        // f2bpmui.base.js中全局方法收集富文编辑器数据
        // fui_global_richeditorArrValueToInput(that);
        // var success = that.validateForm('formRef');
        // if (!success) return;
        // FUI.Form.submitForm(that, that.data, 'com.f2bpm.extend.financialadministration.impl.applicationmakeoutInvoice.model', 'saveModel', formAction, keyId, parentGridId, mainTable);
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
      async validateForm(callback) {
        const encode = Object.toQueryString('encode');
        // 走修订流程
        if(encode == 'commonRevisions') return callback(true);
        // 正常业务流程
        const result = await this.$refs.form.validateForm();
        if (result) {
          this.dataForm = result
          return callback(true);
        } else {
          //表单校验时滚动至不通过的位置
          this.$nextTick(() => {
            let errDom = document.getElementsByClassName("is-error")
            errDom[0]?.scrollIntoView({ behavior: "smooth" });
          })
          return callback(false)
        }
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
      closeDrawer() {
        this.drawer = false;
       },
    handleClick(tab, event) {
      console.log(tab.index, event);
      if(tab.index == 1){
        this.reviseCode = 1
      }else {
        this.reviseCode = ''
      }
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

    .topCont{
      background: $WhiteBg;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    }
    .topCont:hover{
      box-shadow: 0 0 10px rgba(0,0,0,.2);
      transition: 1s;
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

  ::v-deep .el-select{
    width: 100%;
  }

  ::v-deep .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
</style>
