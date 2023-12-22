<template>
  <!--流程按钮组-->
  <div id="wftoolbar" class="wf_buttons_bar" style="clear: both; background-color: transparent; border: none">
    <div id="sendButtomDiv" class="workflow-buttonaction-toolbar">
      <el-button v-for="(btn, bIndex) in pageBaseInfos.buttons" v-show="!isRevise || isWorkflowRevise"
        :id="btn.actionName" :key="bIndex" :type="btn.btnType" size="small" @click="buttonAction(btn)">
        <i :class="btn.icon && btn.icon.indexOf('icon') > -1? 'icon ' + btn.icon: 'fa ' + btn.icon"/>{{ btn.buttonName }}
      </el-button>
      <el-button v-show="isRevise && !isWorkflowRevise" class="el-button el-button--primary el-button--small" @click="toRevise">
        修订
      </el-button>
      <el-button class="el-button el-button--primary el-button--small" @click="flowInfo" v-show="!isRevise || isWorkflowRevise">
        流程信息
      </el-button>
      <el-dropdown
        v-if="actFormList && actFormList.length > 0"
        size="small"
        class="ml2"
      >
        <el-button type="primary" size="small">
          查看节点表单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in actFormList"
            :key="index"
            @click.native="openActFormView(item)"
          ><span
            :class="item.activityName == forceActivityName ? 'red' : ''"
            v-html="item.activityName"
          ></span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="标记已阅"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <div style="font-size: 14px; padding: 5px; margin-bottom: 5px">
        请填写批注内容
      </div>
      <el-input
        v-model="AnnotationContent"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        placeholder="请输入内容"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="clearForm">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitSetDone"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="审批意见"
      :visible.sync="visibleOpinion"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-input
        v-model="workflowformData.hidOpinion"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        placeholder="请输入审批意见"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="clearOpinionForm">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="buttonAction(workflowformData.butItem)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { submitForm, updateForm } from '@/Api/workflowBusssion/index.js';
export default {
  name: 'ButtonGround',
  props: {
    pageBaseInfos: {
      type: Object,
      default: () => {}
    },
    formAction: {
      type: [String, Number],
      default: '0'
    }
  },
  data() {
    return {
      dialogVisible: false,
      visibleOpinion: false,
      isRevise: false,
      isWorkflowRevise: false,
      wiid:'',
      AnnotationContent: '',
      // 基础展示信息
      pageBaseInfo: { workflowTitle: '' },
      // 节点表单
      actFormList: null,
      // 流程自己的数据，比如表单内的审批意见
      workflowformData: {
        hidOpinion: ''
      },
      // 快照节点数据
      snapshotDataList: [],
      // 流程变量
      processVariablesJson: '',
      // 选中的审核菜单
      approAction: '',
      // 可选的审核菜单
      approData: [], // [ {approAction:"同意",approName:"同意",orderNo:100 },{ approAction:"反对",   approName: "反对",orderNo:101 }],
      // 打印模板的ID
      printFormId: ''
    };
  },
  watch: {
    pageBaseInfos: {
      handler(val, oldVal) {
        var that = this;
        that.printFormId = val.printFormId;
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.isRevise = Object.toQueryString('isRevise'); // 修订
    const encode = Object.toQueryString('encode');
    var state =  ['marketContractorExtend','commonRevisions','marketProjectExtend'].indexOf(encode) != -1 ? true : false; // 有流程修订
    if(this.isRevise && state){
      this.isWorkflowRevise = true;
    }else{
      this.isWorkflowRevise = false
    }
    this.wiid = Object.toQueryString('wiid') // 流程id
  },
  methods: {
    clearOpinionForm() {
      this.visibleOpinion = false;
      this.workflowformData.hidOpinion = ""
    },
    flowInfo() {
      this.$emit('flowInfoChagne');
    },
    toRevise() {
      this.$emit('toRevise');
    },
    // 按钮动作
    async buttonAction(butItem) {
      var that = this;
      console.info(butItem);
      const WFContext = window.WFContext;
      if (!butItem.actionName) {
        return false;
      }
      this.$emit('workflow-buttonClick', butItem);
      // 根据按钮code调用不同流程方法
      switch (butItem.actionName) {
        case 'flowmap':
            // 打开流程图
            showWorkflowMap(butItem.beforeFn);
          break;
        case 'print':
            // 打印事件
            if (!that.printFormId) {
              var res = Object.toAjaxJson(
                '/workflow/workflowform/',
                'getPrintFormId',
                { wfformId: WFContext.FormId }
              );
              if (res.success) {
                that.printFormId = res.data;
              }
            }
            if (
              that.printFormId == '' ||
              that.printFormId == null ||
              that.printFormId == undefined
            ) {
              // 判断有没有打印模板，没有时则使用打印页面
              printTable(butItem.beforeFn);
            } else {
              printExcelTable(
                butItem.beforeFn,
                '',
                that.wfContext.WorkflowInstanceId,
                that.printFormId
              );
            }
          break;
        case 'showHistoryApproval':
        case 'approvalHistory':
            // 查看办理过程
            showHistoryApproval(butItem.beforeFn);
          break;
        case 'circulatedHistory':
        case 'showCirculatedHistory':
            // 查看传阅过程
            showCirculatedHistory(butItem.beforeFn);

          break;
        case 'taskCommunication':
            // 打开沟通窗口
            openSendNextTaskCommunication(butItem.beforeFn);

          break;
        case 'complateTaskCommunication':
            // 完成沟通
            openComplateTaskCommunicationDialog();

          break;
        case 'taskCommunicationList':
            // 打开沟通记录列表
            showHistoryTaskCommunication(butItem.beforeFn);

          break;
        case 'send':
            // 打开提交窗口
            this.$emit('validateForm', (res) => {
              console.log('res', res);
              if (WFContext.IsShowFormOpinion && WFContext.IsMustAddOpinion == true && that.workflowformData.hidOpinion == "") {
                that.visibleOpinion = true;
                that.workflowformData = {
                  hidOpinion: "",
                  butItem: butItem
                }
                return false;
              }
              if (res) {
                openValidDialog(
                  that,
                  butItem.beforeFn,
                  butItem,
                  ($vm, data, btnDef) => {
                    if ($vm) {
                      this.$emit('submitForm',data);
                      this.visibleOpinion = false;
                      // this.$emit('submitForm', (res) => {
                      //   if (res) {
                      //     sendWorkflow($vm, data, btnDef, (res) => {
                      //       if (res) {
                      //         this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
                      //         const { code, modelName, encode } = this.$route.query;
                      //         this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true');
                      //         FUI.Window.closeEditAll();
                      //       }
                      //     });
                      //   }
                      // });
                    }
                  }
                );
              }
            });
          break;
        case 'save':
            // 暂存事件
            that.saveWorkflow(that, true, butItem);
          break;
        case 'invalid':
            // 作废流程
            that.invalidWorkflow(that, butItem.beforeFn, butItem);

          break;
        case 'taskclaim':
            // 锁定
            taskclaim(that, butItem.beforeFn, butItem);

          break;
        case 'sendCirculated':
            // 打开传阅窗口
            openCirculatedActor(that, butItem.beforeFn, butItem);
          break;
        case 'setDoneCirculated':
            // 修改为可以添加已阅意见
            this.setDoneCirculateds(that, butItem.beforeFn, butItem);
          break;
        case 'sendReferred':
            // 打开转交窗口
            openReferredActor(that, butItem.beforeFn, butItem);

          break;
        case 'reject':
            // 点击驳回事件
            openRejectActorSelected(that, butItem.beforeFn, butItem);
          break;
        case 'comment':
            that.openComment(butItem);

          break;
        case 'withdraw':
            // 撤回任务
            that.withdrawWorkflow(that, butItem.beforeFn);
          break;
        case 'withdrawToStart':
            // 强制撤回到开始
            that.withdrawWorkflow(that, butItem.beforeFn, true);
          break;
        case 'taskdister':
            // 打开发分窗口,即任务分发给其它人
            openSendTaskdister(that, butItem.beforeFn);
          break;
        case 'taskdisterList':
            // 打开处理分发历史处理过程窗口
            showHistoryTaskdister(that, butItem.beforeFn);
          break;
        case 'sendTaskdister':
            // 处理分发任务
            openSendTaskdisterDailog(that, butItem.beforeFn);
          break;
        case 'snapshot':
            // 打开窗体数据跟踪
            that.openFormDataTrace(that, butItem.beforeFn);
          break;
        case 'appendTask':
            // 加签
            that.appendTaskUser(that, butItem.beforeFn);
          break;
        case 'procInstBaseInfo':
            // 流程信息
            that.procInstBaseInfo(that, butItem.beforeFn);

          break;
      }
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
    },
    /**
     * 作废流程
     */
    invalidWorkflow($vm) {
      var width;
      var height;
      if (window.screen.width > 500) {
        width = 500;
        height = 330;
      } else {
        width = window.screen.width;
        height = window.screen.height - 120;
      }
      FUI.Window.showModalMsg($vm, "", "作废流程", null, { sureText: '确定作废', label: '请输入作废流程的意见原因', tip: '请输入作废流程的意见原因', width: width, height: height },
        function (content, index, layerObject) {
          if (content) {
            try {
              var opinion = content;
              var dataJsonParm = {};
              dataJsonParm.formAction = WFContext.WorkflowformAction;
              dataJsonParm.wiid = WFContext.WorkflowInstanceId;
              dataJsonParm.formId = WFContext.FormId;
              dataJsonParm.wid = WFContext.WorkflowId;
              dataJsonParm.appId = WFContext.AppId;
              dataJsonParm.taskId = WFContext.TaskId;
              dataJsonParm.OutType = WFContext.OutType;
              dataJsonParm.Opinion = opinion;
              var mssg = Object.toAjaxJson(workflowformSender, "invalidWorkflow", dataJsonParm);
              if (mssg === false) return false;
              if (mssg.success) {
                if (window.opener != null) {
                  try {
                    //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
                    if (typeof customRefreshOpenerWindow == "function") {
                      customRefreshOpenerWindow.call(this);
                    } else {
                      window.opener.window.refreshTargetGrid("grid");
                    }
                  } catch (err) {
                  }
                }

                FUI.Window.showMsg(null, mssg.msg, "流程实例作废提示", "info", function () {
                  $vm.$store.dispatch('app/removeTagsView', $vm.$route.fullPath)
                  const { code, encode, modelName } = $vm.$route.query;
                  $vm.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true')
                  FUI.Window.closeEditAll();
                });

              } else {
                FUI.Window.showMsg(null, mssg.msg);
              }
              return false;

            } catch (err) {
              FUI.Window.showMsg(null, err);
              return false;
            }
          } else {
            FUI.Window.showMsg(null, "请输入作废原因");
          }
        });
      return false;
    },
    //撤回任务
    withdrawWorkflow($vm, beforeFn, isToStart) {
      if (!this.actionButtonBefore(beforeFn)) return false;
      var tipMsg = isToStart ? '请输入【强制撤回到开始】的原因，请谨慎操作？' : '请输入撤回原因？';
      var width;
      var height;
      if (window.screen.width > 500) {
        width = 500;
        height = 330;
      } else {
        width = window.screen.width;
        height = window.screen.height - 120;
      }
      FUI.Window.showModalMsg($vm, "", "撤回确认", null,
        { sureText: '确定撤回', label: tipMsg, tip: tipMsg, width: width, height: height },
        function (content, index, layerObject) {
          if (content) {
            try {
              var opinion = content;
              var dataJsonParm = {};
              dataJsonParm.formAction = WFContext.WorkflowformAction;
              dataJsonParm.wiid = WFContext.WorkflowInstanceId;
              dataJsonParm.formId = WFContext.FormId;
              dataJsonParm.wid = WFContext.WorkflowId;
              dataJsonParm.appId = WFContext.AppId;
              dataJsonParm.taskId = WFContext.TaskId;
              dataJsonParm.OutType = WFContext.OutType;
              dataJsonParm.Opinion = opinion;
              var action = isToStart ? "withdrawWorkflowToStart" : "withdrawWorkflow";
              var mssg = Object.toAjaxJson(workflowformSender, action, dataJsonParm);
              if (mssg === false) return false;
              if (mssg.success) {
                if (window.opener != null) {
                  try {
                    //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
                    if (typeof customRefreshOpenerWindow == "function") {
                      customRefreshOpenerWindow.call(this);
                    } else {
                      window.opener.window.refreshTargetGrid("grid");
                    }
                  } catch (err) {
                  }
                }
                FUI.Window.showMsg(mssg.msg, "流程撤回提示", "info", function () {
                  $vm.$store.dispatch('app/removeTagsView', $vm.$route.fullPath)
                  const { code, encode, modelName } = $vm.$route.query;
                  $vm.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true')
                  FUI.Window.closeEditAll();
                });

              } else {
                FUI.Window.showMsg(mssg.msg);
              }
              return false;
            } catch (err) {
              FUI.Window.showMsg(err.toString());
              return false;
            }
          } else {
            FUI.Window.showMsg("请输入撤回原因");
          }
        });
      return false;
    },
    // 查看节点表单
    openActFormView(item) {
      var that = this;
      var forceFormId = item.actFormId;
      that.forceFormId = forceFormId;
      var forceActivityName = item.activityName;
      var url =
        __webpath +
        '/workflow/workflowform/index/?formAction=3&wiid=' +
        that.wiid +
        '&forceFormId=' +
        forceFormId +
        '&forceActivityName=' +
        forceActivityName;
      if (!forceFormId) {
        url =
          __webpath +
          '/workflow/workflowform/index/?formAction=3&wiid=' +
          that.wiid;
      }
      window.location.href = url;
    },
    // 校验表单
    validateForm(refFormName, isNotToCheckTheEmptyValue) {
      var that = this;
      richeditorArrValueToInput(that);
      // 如果有则调用前置事件的扩展
      if (Object.toIsExitsFunction('extend_validateWorkflowForm_before')) {
        var isExtendValidatePass = extend_validateWorkflowForm_before();
        if (isExtendValidatePass == false) {
          return;
        }
      }
      var success = isNotToCheckTheEmptyValue
        ? FUI.validate(that.fieldsDef, that.data, null, true)
        : FUI.validate(that.fieldsDef, that.data);
      return success;
    },
    // 流程信息
    procInstBaseInfo(butItem) {
      var that = this;
      var type = 'appendTask';
      var typeTitle = '加签处理人';
      var appId = WFContext.AppId;
      var wiid = WFContext.WorkflowInstanceId;
      var taskId = WFContext.TaskId;
      var formAction = WFContext.WorkflowformAction;
      var width;
      var height;
      if (window.screen.width > 500) {
        width = 700;
        height = 400;
      } else {
        width = window.screen.width;
        height = window.screen.height - 120;
      }
      FUI.Window.openEdit(
        '/workflow/workflowBusiness/showProcInstBaseInfo/?appId=' +
          appId +
          '&wiid=' +
          wiid +
          '&taskId=' +
          taskId,
        '流程信息',
        formAction,
        'grid',
        width,
        height
      );
    },
    // 加签
    appendTaskUser() {
      var that = this;
      var type = 'appendTask';
      var typeTitle = '加签处理人';
      var wiid = WFContext.WorkflowInstanceId;
      var sheetId = WFContext.SheetId;
      var activityId = WFContext.CurrentActivityId;
      var width;
      var height;
      if (window.screen.width > 500) {
        width = 880;
        height = 580;
      } else {
        width = window.screen.width;
        height = window.screen.height - 120;
      }
      FUI.Window.openEdit(
        '/workflow/workflowMonitor/appendTask/?type=' +
          type +
          '&wiid=' +
          wiid +
          '&sheetId=' +
          sheetId +
          '&activityId=' +
          activityId,
        '流程单号【' + sheetId + '】',
        'Add',
        'grid',
        width,
        height
      );
    },
    // 打开意见弹窗
    handleOpen() {
      var that = this;
      that.AnnotationContent = '';
      that.dialogVisible = true;
    },
    // 关闭弹窗
    clearForm() {
      this.dialogVisible = false;
      this.AnnotationContent = '';
    },
    // 打开弹窗设置已阅
    setDoneCirculateds($vm, beforeFn) {
      var that = this;
      try {
        // 调用按钮前置函数
        if (!actionButtonBefore(beforeFn)) return false;
      } catch (err) {
        alert(err);
        return false;
      }
      FUI.Window.confirm('确定要标记为已阅吗？', '温馨提示', function(index) {
        that.AnnotationContent = '';
        that.dialogVisible = true;
      });

      return false;
    },
    // 确认已阅
    submitSetDone() {
      var that = this;
      try {
        var dataJsonParm = {};
        dataJsonParm.formAction = WFContext.WorkflowformAction;
        dataJsonParm.wiid = WFContext.WorkflowInstanceId;
        dataJsonParm.formId = WFContext.FormId;
        dataJsonParm.wid = WFContext.WorkflowId;
        dataJsonParm.appId = WFContext.AppId;
        dataJsonParm.taskId = WFContext.TaskId;
        dataJsonParm.opinion = that.AnnotationContent;
        var mssg = Object.toAjaxJson(
          workflowformSender,
          'setDoneCirculated',
          dataJsonParm
        );
        if (mssg === false) return false;
        if (mssg.success) {
          that.dialogVisible = false;
          if (window.opener != null) {
            try {
              // 如果有自定义的方法调用业务表单自定义刷新父窗口的方法
              if (typeof customRefreshOpenerWindow === 'function') {
                customRefreshOpenerWindow.call(this);
              } else {
                window.opener.window.refreshTargetGrid('grid');
              }
            } catch (err) {}
          }
          FUI.Window.showMsg(mssg.msg, '提示', 'info', function() {
            if (window.opener != null) {
              window.close();
            } else {
              FUI.Window.closeEdit(true, 'grid');
            }
          });
        } else {
          FUI.Window.showMsg(mssg.msg, null, 1);
        }
        return false;
      } catch (err) {
        FUI.Window.showMsg(err);
        return false;
      }
    },
    // 上传流程附件
    uploadWorkflowAttachment() {
      var that = this;
      var width;
      var height;
      if (window.screen.width > 500) {
        width = 600;
        height = 450;
      } else {
        width = window.screen.width;
        height = window.screen.height - 120;
      }
      if (
        that.wfContext.WorkflowformAction == WF.WorkflowformAction.Todo ||
        that.wfContext.WorkflowformAction == 0
      ) {
        var url =
          __webpath +
          '/workflow/workflowBusiness/attachmentUpload?bk=' +
          that.wfContext.WorkflowInstanceId +
          '&attachmentType=Workflow&activityName=' +
          that.wfContext.CurrentActivityName +
          '&activityId=' +
          that.wfContext.CurrentActivityId;
        FUI.Window.openEdit(
          url,
          '上传流程附件',
          'Add',
          'AttachmentsGrid',
          width,
          height
        );
      } else {
        FUI.Window.showMsg('当前不是您待办事项，不能上传附件');
      }
      return false;
    },
    refreshProcessinstfilelist() {
      this.$refs.processinstfilelist.dataGridSearch();
    },
    saveWorkflow($vm, isAutoSave, btnDef) {
      this.$emit('saveWorkflow', async(dataForm) => {
        const methodName = dataForm.id ? updateForm : submitForm;
        var { modelName, encode, code } = this.$route.query;
        dataForm.wiid =  WFContext.WorkflowInstanceId;
        dataForm.workFlow = {
          code: dataForm.code,
          isSubmit: 0,
          formAction: WFContext.WorkflowformAction,
          appId: WFContext.AppId,
          formId: WFContext.FormId,
          workflowTitle: WFContext.WorkflowTitle,
          taskId: WFContext.TaskId,
          wiid:  WFContext.WorkflowInstanceId,
          isFixEditMode: WFContext.IsFixEditMode,
          businessKey: WFContext.BusinessKey
        }
        const res = await methodName(modelName, encode, dataForm);
        if (res.code === 200) {
          FUI.Window.showMsg2(null, res.msg, null, 1);
          $vm.$store.dispatch('app/removeTagsView', $vm.$route.fullPath)
          // const { code, encode, modelName } = $vm.$route.query;
          $vm.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true')
        } else {
          FUI.Window.showMsg(res.msg);
        }
      })
    },
    saveWorkflowSubmit($vm, isAutoSave, btnDef) {
      // 保存 先保存工作流，再保存表单，如果是未有实例的情况下保存为草稿，且保存完跳转页面
      var dataJsonParm = {};
      dataJsonParm.formAction = WFContext.WorkflowformAction;
      dataJsonParm.wiid = WFContext.WorkflowInstanceId;
      dataJsonParm.formId = WFContext.FormId;
      dataJsonParm.wid = WFContext.WorkflowId;
      dataJsonParm.appId = WFContext.AppId;
      dataJsonParm.taskId = WFContext.TaskId;
      dataJsonParm.isFixEditMode = WFContext.IsFixEditMode;
      if (dataJsonParm.isFixEditMode === true) {
        // 强制查看状态下的编辑模式下修改为3
        dataJsonParm.formAction = 3;
      }
      WF.Workflowform.submitWorkflowform(
        $vm,
        workflowformSender,
        'saveWorkflow',
        null,
        dataJsonParm,
        null,
        null,
        function(mssg) {
          Object.toCloseLoading();
          if (mssg === false) return false;
          if (mssg.success) {
            FUI.Window.showMsg2(null, mssg.msg, null, 1);
            $vm.$store.dispatch('app/removeTagsView', $vm.$route.fullPath)
            const { code, encode, modelName } = $vm.$route.query;
            $vm.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true')
          } else {
            FUI.Window.showMsg(mssg.msg);
          }
        },
        true
      );
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/resources/css/workflowform.css";
@import "/static/f2bpmUI/onlineForm/onlinedisginer.css";
</style>
