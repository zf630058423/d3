import {
  getFormInfo,
  getSerialNumber,
  getReStartInfo
} from '@/Api/workflowBusssion/index.js'
import moment from 'moment'
export default {
  props: {
    rowData: {
      type: Object,
      default: () => { }
    },
    pageBaseInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      loading: false,
      setting: {
        modelName: '',
        enCode: '',
        readonly: false
      }
    }
  },
  watch: {
    rowData: {
      handler: function (val) {
        this.init(val)
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 初始化详情
     * @param {*} data
     */
    init(data) {
      this.dataForm.id = data.id || '';
      this.setting = data;
      if (this.$refs['dataForm']) this.$refs['dataForm'].resetFields();
      if (this.beforeInit) this.beforeInit();
      if (data.id && !data.isReStart) {  //只是详情 不包含重启
        try {
          this.loading = true;
          getFormInfo(this.setting.modelName, this.setting.enCode, data.id).then(res => {
            if (res.code === 200) {
              this.dataForm = { ...this.dataForm , ...res.data }  //保留新增表单的字段，避免详情没有返回时this.dataForm.code = value赋值没有实时更新数据的问题
              // 流程状态是否可编辑 0拟稿 1流程运行中(草稿) 2 审批中 3审批通过 4挂起中 5 驳回 99流程取消作废 100 已删除
              // 流程开始节点等于当前提交人 WFContext.WFContext.CurrentActivityCode == 'start'
              const { userId } = FUI.Sys.getAuthor();
              const { isRevise } = this.$route.query;
              if ((WFContext.WorkflowInstinceState < 2 || WFContext.WorkflowInstinceState === 5 || WFContext.CurrentActivityCode == 'start') && res.data.createUserId === userId) {
                this.setting.readonly = false;
              } else if (isRevise) {
                this.setting.readonly = false;
              }else {
                this.setting.readonly = true;
              }
              this.$emit('initDataForm', res.data)
              if (this.afterInit) this.afterInit()
            }
          })
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      } else if (data.id && data.isReStart) { //重启详情 调用另外一个接口
        this.loading = true;
        getReStartInfo(this.setting.modelName, this.setting.enCode, data.id).then(res => {
          if (res.code === 200) {
           this.dataForm = { ...this.dataForm , ...res.data }
            const { userId } = FUI.Sys.getAuthor();
            if ((WFContext.WorkflowInstinceState < 2 || WFContext.WorkflowInstinceState === 5) && res.data.createUserId === userId) {
              this.setting.readonly = false;
            }
            this.loading = false;
            this.$emit('initDataForm', res.data)
            if (this.afterInit) this.afterInit()
            const marketMainId = data.marketMainId;  //重启获取营销立项的id
            this.getSerialNumber(marketMainId)
          }
        })
        this.loading = false
      } else {
        this.getSerialNumber(data.id)
        this.initUserInfo()
      }
    },
    /**
     * 获取单据编号
     */
    getSerialNumber(id) {
      var that = this;
      if(!id){
        getSerialNumber({
          counterCode: this.setting.enCode + '_no'
        }).then(res => {
          if (res.success) {
            that.dataForm.code = res.msg;
          }
        })
      }
    },
    /**
     * 初始化用户信息
     */
    initUserInfo() {
      const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
      this.dataForm.createUserId = userId;
      this.dataForm.createUserName = decodeURIComponent(realName);
      this.dataForm.deptId = orgId;
      this.dataForm.deptName = decodeURIComponent(orgName);
      this.dataForm.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
};
