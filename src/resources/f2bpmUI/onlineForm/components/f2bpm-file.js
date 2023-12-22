import Vue from 'vue';
// 多选框组件
var f2bpmFile = Vue.component('f2bpm-file', {
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      isView: false,
      isShow: true,
      isReadOnly: false,
      headers: {},
      // 上传时附带的额外参数
      parms: {},
      uploadDisabled: false,
      limit: 99,
      // 是否支持多选文件
      isMultiple: true,
      accept: '.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql',
      tip: '',
      postUrl: __serverpath + FUI.Handlers.Common + 'uploadFile/',
      // 最终保存到数据库的格式 [filePathName:'2020/08/20200814171353896_5789_.jpg',fileName:'yd4.jpg',groupName:'testGroup']
      value: [],
      // 用于显示的原el的数据格式 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg',fileName,filePathName,groupName,status}]
      showData: []
    };
  },
  watch: {
    value(val, oleV) {
      var that = this;
      if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
        this.$emit('updatevalue', that.field, val);
      }
    }
  },
  created: function () {
    var that = this;
    var author = this.$store.state.user.author;
    var f2bpmToken = author.token;
    var headerAuthor = { 'f2bpmToken': f2bpmToken };
    that.headers = headerAuthor;
    var formAction = WFContext.WorkflowformAction;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    } else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
    that.initailFieldOption();
    if (that.fieldvalue && that.fieldvalue.length > 0) {
      that.value = typeof that.fieldvalue === 'string' && that.fieldvalue != '' ? eval('(' + that.fieldvalue + ')') : that.fieldvalue;
      that.reloadShowFileList();
    }
    if (that.field.fieldOptions) {
      // 可配置上传的更多属性
    }
  }, mounted() {
    var that = this;
    //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
  },
  methods: {
    initailFieldOption() {
      var that = this;
      if (that.field.fieldOptions) {
        var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
        var general = fieldOptions.find(a => a.opttype == 'general');
        if (general) {
          var kvData = general.params.kvData;
          var item = kvData.find(a => a.key == 'isMultiple');
          if (item) {
            that.isMultiple = item.value;
          }
          item = kvData.find(a => a.key == 'uploadtip');
          if (item) {
            that.tip = item.value;
          }
          item = kvData.find(a => a.key == 'uploadextension');
          if (item && item.value) {
            that.accept = item.value;
          }
          item = kvData.find(a => a.key == 'uploadlimit');
          if (item && item.value > 0) {
            that.limit = item.value;
          }
        }
      }
    },
    handleLimit(file, fileList) {
      var that = this;
      if (fileList.length >= that.limit) {
        this.uploadDisabled = true;
      } else {
        this.uploadDisabled = false;
      }
    },
    handleSuccess(response, file, fileList) {
      var that = this;
      if (response.success === true) {
        var valueItem = Object.toClone(response.data);
        that.value.push(valueItem);
        var item = response.data;
        item.name = item.fileName;
        that.showData.push(item);
        that.onBlur();
      } else {
        FUI.Window.showMsg2(response.msg);
        that.handleRemove(file, fileList);
      }
    },
    handleError(err, file, fileList) {
      console.log(response);
      console.log(file, fileList);
    },
    deleteFile(file) {
      var that = this;
      FUI.Window.confirm(`确定删除 ${file.name}？`, null, function () {
        that.handleRemove(file);
      });
    },
    handleRemove(file, fileList) {
      var that = this;
      var filePathName = file.filePathName;
      that.value = that.value.filter(a => a.filePathName != filePathName);
      that.reloadShowFileList();
    },
    handleExceed(files, fileList) {
      // 文件超出个数限制时的钩子
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      var that = this;
      if (that.isReadOnly) {
        return false;
      }
      return that.$confirm(`确定删除 ${file.name}？`);
    },
    handlePreview(file) {
      var that = this;
      var filePath = file.filePathName;
      var extendName = filePath.substr(filePath.toLowerCase().lastIndexOf('.'));
      // var arr = [".xlsx", ".xls", ".doc", ".docx", ".pdf", ".ppt", ".pptx"];
      var arr = ['.pdf', '.PDF'];
      var imgArr = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
      if (arr.indexOf(extendName) > -1) {
        that.preview(file, 'pdf');
      } else if (imgArr.indexOf(extendName) > -1) {
        that.preview(file, 'img');
      } else {
        that.formDownloadFile(file);
      }
    },
    preview(file, type) {
      var that = this;
      var groupName = file.groupName;
      var filePath = file.filePathName;
      var url = '';
      if (type == 'pdf') {
        url = '#/workflow/security/pdfview/previewpdf?groupName=' + groupName + '&filePath=' + filePath;
      } else if ((type == 'img')) {
        url = '#/workflow/security/pdfview/previewpicture?groupName=' + groupName + '&filePath=' + filePath;
      } else {
        return false;
      }
      FUI.Window.open(url);
    },
    reloadShowFileList() {
      var that = this;
      var showData = [];
      $.each(that.value, function (index, item) {
        var showItem = Object.toClone(item);
        showItem.name = item.fileName;
        showData.push(showItem);
      });
      that.showData = showData;
      if (that.showData.length >= that.limit) {
        this.uploadDisabled = true;
      } else {
        this.uploadDisabled = false;
      }
    },
    onBlur() {
      var that = this;
      var fieldDef = that.field;
      var fieldValue = that.value;
      var funcName = fieldDef.vModel.replace(/\./g, '_');
      if (Object.toIsExitsFunction(funcName)) {
        window[funcName](fieldValue, fieldDef);
      }
    },
    formDownloadFile(file) {
      var filePath = file.filePathName;
      var groupName = file.groupName;
      var fileName = file.fileName;
      var actionUrl = FUI.Handlers.Common;
      var data = Object.toAjaxDownloadFile(actionUrl, 'downloadFile', { 'filePath': filePath, 'fileName': fileName, 'groupName': groupName });
    }
  },
  template: '<div><el-upload' +
    ' :vModel="field.vModel"' +
    ' name="fileUpload"' +
    '  class="upload-demo"' +
    '  :action="postUrl"' +
    '  :data="parms"' +
    '   :accept="accept"' +
    '  :headers="headers"' +
    '  :on-success="handleSuccess"' +
    '  :on-change="handleLimit"' +
    '  :multiple="isMultiple"' +
    '  :limit="limit"' +
    '  :show-file-list="false"' +
    '  :on-exceed="handleExceed"' +
    '>' +
    '  <el-button size="small" type="primary" v-if="!isReadOnly&&!uploadDisabled">点击上传</el-button>' +
    '  <div slot="tip" class="el-upload__tip">{{tip}}</div>' +
    '</el-upload>' +
    '<div>' +
    '    <ul class="el-upload-list el-upload-list--text">' +
    '     <li v-for="f in showData" tabindex="0" class="el-upload-list__item is-success""><a  @click="handlePreview(f)"> <i class="el-icon-document"></i> {{f.name}}</a>' +
    '     <label class="my-el-upload-list__item-status-label"><i @click="formDownloadFile(f)" class="fa fa-download pl5 pr5 cur" title="下载附件"></i><i v-if="!isReadOnly" @click="deleteFile(f)" class="fa fa-times ml10 pl5 pr5" title="删除附件"></i></label> </li>' +
    '    </ul>' +
    '</div>' +
    '</div>'
});
