import {
  getFormInfo,
  getSerialNumber
} from '@/Api/workflowBusssion/index.js'
import moment from 'moment'
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      dataForm:{},
      setting: {
        modelName: '',
        enCode: '',
        readonly: false
      }
    }
  },
  watch: {
    rowData: {
      handler: function(val) {
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
      this.rowObject = this.setting;
      if (this.beforeInit) this.beforeInit()
      if (data.id) {
        try {
          this.loading = true
          getFormInfo(this.setting.modelName, this.setting.enCode, data.id).then(res => {
            if (res.code === 200) {
              this.dataForm = res.data;
              // const { userId } = FUI.Sys.getAuthor();
              // if ((WFContext.WorkflowInstinceState < 2 || WFContext.WorkflowInstinceState === 5 || WFContext.CurrentActivityCode == 'start') && res.data.createUserId === userId) {
              //   this.setting.readonly = false;
              // } else if(data.isRevise == 'true'){
              //   this.setting.readonly = false;
              // }else {
              //   this.setting.readonly = true;
              // }
              this.$emit('initDataForm', res.data)
              if (this.afterInit) this.afterInit()
            }
          })
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      } else {
        this.getSerialNumber()
        this.initUserInfo()
      }
    },
    /**
     * 获取单据编号
     */
    getSerialNumber() {
      var that = this;
      getSerialNumber({
        counterCode: this.setting.enCode + '_no'
      }).then(res => {
        if (res.success) {
          that.dataForm.code = res.msg;
        }
      })
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
