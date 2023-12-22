<template>
  <div>
    <div style="display: flex;align-items: center;">
      <el-upload
        v-if="!isReadOnly"
        name="fileUpload"
        class="upload-demo"
        :action="postUrl"
        :data="parms"
        :accept="accept"
        :headers="{ f2bpmToken: author?author.token:'' }"
        :on-success="handleSuccess"
        :on-change="handleLimit"
        :multiple="isMultiple"
        :limit="limit"
        :show-file-list="false"
        :on-exceed="handleExceed"
        :on-progress="uploadVideoProcess"
      >
        <el-popover
          placement="top-start"
          title="上传文件格式"
          width="500"
          trigger="hover"
          :content="tip"
        >
          <i
            v-show="tip"
            slot="reference"
            class="el-icon-question"
            style="
              color: #e6a23c;
              font-size: 16px;
              margin-right: 10px;
              line-height: 32px;
            "
          ></i>
        </el-popover>
        <el-button
          v-if="!isReadOnly && !uploadDisabled"
          size="small"
          type="primary"
        >点击上传</el-button>
      </el-upload>
      <el-button
        v-if="showData.length > 1"
        style="margin-left: 10px"
        size="small"
        type="primary"
        @click.stop="downloadAll"
      >批量下载</el-button>
    </div>
    <div style="max-width: 400px; padding-left: 5px">
      <ul class="el-upload-list el-upload-list--text" style="margin-top: 0px">
        <li
          v-for="(f, index) in showData"
          :key="index"
          tabindex="0"
          class="el-upload-list__item is-success"
          style="margin-top: 10px; text-align: left"
        >
          <a @click="handlePreview(f)">
            <i class="el-icon-document"></i> {{ f.name }}</a>
          <label
            class="my-el-upload-list__item-status-label"
            style="margin-bottom: 10px"
          ><i
            class="icon icon-xiazai pl5 pr5 cur blue"
            title="下载附件"
            @click="formDownloadFile(f, index)"
          ></i>
          <i
            v-if="!isReadOnly || f.isReadOnly || !revise"
            class="fa fa-trash-o ml5 pl5 pr5 cur orange"
            title="删除附件"
            @click="deleteFile(f)"
          ></i></label>
          <el-progress
            v-if="f.index > 0 && f.index < 100"
            :percentage="f.index"
            :color="customColors"
          ></el-progress>
        </li>
      </ul>
      <el-progress
        v-if="loadProgressFlag"
        :percentage="loadProgress"
        :color="customColors"
      ></el-progress>
    </div>
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showImageViewer"
      :url-list="srcList"
      hide-on-click-modal
      teleported
      :on-close="closePre"
    />
  </div>
</template>

<script>
import { downloadFilesAll } from '@/Api/common';
import { mapGetters } from 'vuex';
export default {
  name: 'UploaderFile',
  model: {
    // 最终保存到数据库的格式 [filePathName:'2020/08/20200814171353896_5789_.jpg',fileName:'yd4.jpg',groupName:'testGroup']
    prop: 'value',
    event: 'change'
  },
  props: {
    // 文件默认数据
    value: {
      type: Array,
      default: () => { return [] }
    },
    // 文件格式限制
    accept: {
      type: String,
      default: '.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql,.ofd'
    },
    // 提示语
    tip: {
      type: String,
      default: '只支持.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql,.ofd文件格式'
    },
    // 文件限制
    limit: {
      type: Number,
      default: 99
    },
    // 是否支持多选文件
    isMultiple: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    uploadDisabled: {
      type: Boolean,
      default: false
    },
    // 是否只读
    isReadOnly: {
      type: Boolean,
      default: false
    },
    // 是否只读
    revise: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      f2bpmToken: '',
      isView: false,
      isShow: true,
      // 上传时附带的额外参数
      parms: {},
      postUrl: __serverpath + FUI.Handlers.Common + 'uploadFile/',
      // 用于显示的原el的数据格式 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg',fileName,filePathName,groupName,status}]
      showData: [],
      percentage: [],
      loadProgress: 0,
      loadProgressFlag: false,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      srcList: [],
      showImageViewer: false
    };
  },
  computed: {
    ...mapGetters(['author'])
  },
  watch: {
    value: {
      handler(files) {
        if (files && files.length > 0) {
          this.reloadShowFileList(files)
        }else{
          this.showData = [];
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * 文件限制的事件
     * @param {*} file
     * @param {*} fileList
     */
    handleLimit(file, fileList) {
      if (fileList.length >= this.limit) {
        this.uploadDisabled = true;
      } else {
        this.uploadDisabled = false;
      }
    },
    /**
     * 文件上传前的事件（判断特殊字符文件名称）
     * @param {*} file
     * @param {*} data
     */
    beforeAvatarUpload(file, data) {
      if (file.name.split('.').length - 1 === 1) {
        const containSpecial = new RegExp(
          "[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
        );
        if (containSpecial.test(file.name)) {
          this.$message.warning('名称不能含有特殊字符！');
          return false;
        }
      } else {
        this.$message.warning('名称不能含有特殊字符！');
        return false;
      }
    },
    /**
     * 文件上传成功
     * @param {*} response
     * @param {*} file
     * @param {*} fileList
     */
    handleSuccess(response) {
      var that = this;
      setTimeout(function() {
        that.loadProgressFlag = false;
      }, 500);
      if (response.success === true) {
        var valueItem = Object.toClone(response.data);
        const fileList = that.value  || [];
        fileList.push(valueItem);
        this.$emit('change', fileList)
        //有值改变触发表单校验
        this.$parent.$emit('el.form.change');
        this.$parent.$emit('el.form.blur');
      } else {
        FUI.Window.showMsg2(response.msg);
      }
    },
    /**
     * 文件删除提示
     * @param {*} file
     */
    deleteFile(file) {
      const that = this;
      FUI.Window.confirm(`确定删除 ${file.name}？`, null, function() {
        that.handleRemove(file);
      });
    },
    /**
     * 文件删除
     */
    handleRemove(file) {
      const filePathName = file.filePathName;
      const files = this.value.filter((a) => a.filePathName !== filePathName);
      this.$emit('change', files)
    },
    /**
     * 文件超出个数限制时的钩子
     */
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    /**
     * 文件删除
     * @param {*} file
     * @param {*} fileList
     */
    beforeRemove(file, fileList) {
      var that = this;
      if (that.isReadOnly) {
        return false;
      }
      return that.$confirm(`确定删除 ${file.name}？`);
    },
    /**
     * 文件预览事件
     * @param {*} file
     */
    handlePreview(file) {
      const that = this;
      const filePath = file.filePathName;
      const extendName = filePath.substr(filePath.toLowerCase().lastIndexOf('.'));
      // let arr = [".xlsx", ".xls", ".doc", ".docx", ".pdf", ".ppt", ".pptx"];
      const pdfFiles = ['.pdf', '.PDF'];
      const imgArr = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
      if (pdfFiles.indexOf(extendName) > -1) {
        that.preview(file, 'pdf');
      } else if (imgArr.indexOf(extendName) > -1) {
        that.preview(file, 'img');
      } else {
        that.formDownloadFile(file);
      }
    },
    /**
     * 文件预览
     */
    preview(file, type) {
      const that = this;
      const fileName = file.fileName;
      const groupName = file.groupName;
      const filePath = file.filePathName;
      // const url = '';
      if (type === 'pdf') {
        that.openPdfByBrowser(groupName, filePath, fileName);
        return false;
      } else if (type === 'img') {
        that.srcList = [];
        const src =
          __serverpath +
          FUI.Handlers.Common +
          'getShowImage/?groupName=' +
          groupName +
          '&filePath=' +
          filePath;
        that.srcList.push(src);
        that.showPre();
      } else {
        return false;
      }
      // FUI.Window.open(url);
    },
    /**
     * 使用浏览器直接打开显示PDF
     * @param {*} groupName
     * @param {*} filePath
     * @param {*} fileName
     */
    openPdfByBrowser(groupName, filePath, fileName) {
      var that = this;
      fileName = fileName.replace('#', '_');
      var url =
        __serverpath +
        '/workflow/security/baseCommon/getPdfData?groupName=' +
        groupName +
        '&filePath=' +
        filePath;
      url = url + '&f2bpmToken=' + that.author.token;
      const pdfUrl = url;
      window.open(pdfUrl);
    },
    /**
     * 加载显示的文件
     */
    reloadShowFileList() {
      const that = this;
      const showData = [];
      $.each(that.value, function(index, item) {
        const showItem = Object.toClone(item);
        showItem.name = item.fileName;
        showData.push(showItem);
      });
      that.showData = showData;
      // if (that.showData.length >= that.limit) {
      //   this.uploadDisabled = true;
      // } else {
      //   this.uploadDisabled = false;
      // }
    },
    /**
     * 文件下载
     * @param {*} file
     * @param {*} index
     */
    formDownloadFile(file, index) {
      const filePath = file.filePathName;
      const groupName = file.groupName;
      let fileName = file.fileName;
      const pathUrl = __serverpath + FUI.Handlers.Common;
      fileName = encodeURIComponent(fileName);
      window.open(
        pathUrl +
          'downloadFile?fileName=' +
          fileName +
          '&filePath=' +
          filePath +
          '&groupName=' +
          groupName
      );
    },
    /**
     * 上传进度中
     * @param {*} event
     * @param {*} file
     * @param {*} fileList
     */
    uploadVideoProcess(event, file, fileList) {
      this.loadProgressFlag = true;
      this.loadProgress = Math.round((event.loaded / event.total) * 100);
    },
    /**
     * 批量下载 zip包
     */
    async downloadAll() {
      const result = [];
      this.showData.forEach((item) => {
        const res = JSON.parse(
          JSON.stringify(item).replace(/filePathName/g, 'filePath')
        );
        result.push(res);
      });
      try {
        const data = await downloadFilesAll(result);
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        var fileName = '附件.zip';
        fileName = fileName.replace(/%/g, '%25');
        const downlaodFileName = decodeURIComponent(fileName);
        link.setAttribute('download', downlaodFileName);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开预览
     */
    showPre() {
      this.showImageViewer = true;
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', m, false); // 禁止页面滑动
    },
    /**
     * 关闭预览el-image-viewer组件的事件
     */
    closePre() {
      this.showImageViewer = false;
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', m, true);
    }
  }
};
</script>
