<template>
  <div class="f3bpm-page-dialog-layout custBg">
    <div class="no-workflow-cont mt10">
      <div style="flex:1;height:35px"></div>
      <breadcrumb-nav type="fullDevelopment" @close="reBack"></breadcrumb-nav>
    </div>
    <!--表单内容-->
    <el-scrollbar class="container-scroll-bar workflow-form-content-height">
      <div id="WorkflowContentDiv" class="workflow-form-detail-container">
        <!--表单信息-->
        <div class="wf-box-section-title cur mt10">
          <div v-loading="loading">
            <el-form
              ref="dataForm"
              :model="dataForm"
              label-width="200px"
              class="new-data-form-css"
            >
              <row-layout :title="'基础信息'" :cols="3">
                <el-form-item slot="col_1" label="项目编号：">
                  <el-input v-model="dataForm.constructArchiveMainCode" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_2" label="项目名称：">
                  <el-input v-model="dataForm.constructArchiveMainCode" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_3" label="管理部门：">
                  <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <row-layout :cols="3">
                <el-form-item slot="col_1" label="项目负责人：">
                  <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_2" label="最近上传人：">
                  <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_3" label="最近上传时间：">
                  <el-input v-model="dataForm.createTime" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <row-layout :title="'资料信息'" :cols="1">
                <el-row slot="col_1">
                  <el-col :span="12" style="display: flex;align-items: center;">
                    <span>文件名：</span>
                    <el-input v-model="projectParams.fileName" placeholder="请输入" size="small" style="width: 200px" clearable></el-input>
                    <el-button type="primary" size="small" style="margin-left: 15px" @click="handelSearchFile">查 询</el-button>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-checkbox v-model="checked" @change="(val) => getCheckedValue(val)" :disabled="fileList.length<=0">全选</el-checkbox>
                    <el-button type="primary" size="small" @click="handleBatchDownload" :disabled="fileList.length<=0" style="margin-left: 10px;">批量下载</el-button>
                  </el-col>
              </el-row>
            </row-layout>
            </el-form>
          </div>
        </div>
        <el-container style="height: calc(100vh - 500px);background: #fff;">
          <el-container>
            <el-aside width="250px" style="border-right: 1px solid #efefef;padding:10px">
              <el-tree
                class="tree"
                ref="myTree"
                :data="treeData"
                :props="defaultProps"
                accordion
                show-checkbox
                default-expand-all
                width
                node-key="id"
                @check="handleNodeClick">
            </el-tree>
            </el-aside>
            <el-main style="padding:0">
              <div class="file-list">
                <div style=" flex:1;">
                  <div class="file-box">
                    <div class="file" v-for="(item,index) in fileList" :key="index" @click="selectedFile(item)">
                      <span class="fileCheckBox">
                        <el-checkbox v-model="item.isCheck" @change="(val) => handleCheckAllListChange(val, item)"
                                    style="transform: scale(1.2)"></el-checkbox>
                      </span>
                      <img :src="getImgUrl(item.fileName)" alt="" class="img">
                      <div class="fileName" :title="item.fileName">{{item.fileName}}</div>
                    </div>
                    <div class="no-data" v-if="fileList.length<=0">
                      <img class="no-data-img" src="@/resources/images/404_03.png" />
                      <div class="text">暂无数据</div>
                    </div>
                  </div>
                  <el-row style="text-align: right;margin: 15px;width: 100%;padding-right: 50px;">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="pageInfo.currentPage"
                      :page-sizes="[20,50,100]"
                      :page-size="pageInfo.pageSize"
                      background
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                    </el-pagination>
                  </el-row>
                </div>
                <div class="fileInfo">
                  <el-form
                    ref="dataForm"
                    label-width="80px"
                    class="new-data-form-css"
                  >
                    <row-layout :cols="1">
                      <el-form-item slot="col_1" label="上传人：">
                        {{ fileInfo.createUserName||'--' }}
                      </el-form-item>
                    </row-layout>
                    <row-layout :cols="1">
                      <el-form-item slot="col_1" label="上传时间：">
                        {{ fileInfo.createTime||'--' }}
                      </el-form-item>
                    </row-layout>
                    <row-layout :cols="1">
                      <el-form-item slot="col_1" label="文件大小：">
                        {{ fileInfo.fileSize||'0' }} KB
                      </el-form-item>
                    </row-layout>
                    <row-layout :cols="1">
                      <el-form-item slot="col_1" label="文件格式：">
                        {{ fileInfo.fileFormat||'--' }}
                      </el-form-item>
                    </row-layout>
                  </el-form>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </el-scrollbar>
  </div>
  
</template>

<script>
import FormTitle from '@/components/basic/formTitle/index.vue';
import { getBaseProjectDataStoreById, queryDataClassification, getProjectFilelist, batchDownloadProjectFile } from '@/Api/workflowBusssion/construct.js';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import breadcrumbNav from '@/views/businessModule/components/breadcrumbNav.vue';
export default {
  components: { FormTitle, RowLayout, breadcrumbNav },
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      dataForm: {
        code: "",
        contractAmount: "",
        supplementContractAmount: "",
      },
      defaultProps: {
        children: 'children',
        label: 'nameWithFileNumber'
      },
      treeData: [],
      projectParams: {
        baseDataClassificationId: "",
        constructArchiveMainId: "",
        fileName: ""
      },
      pageInfo: {
        currentPage: 1,
        pageSize: 20,
      },
      fileInfo: {
        createUserName: "",
        createTime: "",
        fileSize: "",
        fileFormat: "",
      },
      fileList: [],
      multipleSelection: [],
      getMenuId: null,
      getTreeNode:{},
      checked: false,
      total: 0,
    };
  },
  computed: {
    totalContractAmount() {
      return tools.getNumAdd(this.dataForm.contractAmount,this.dataForm.supplementContractAmount)
    },
  },
  mounted() {
    const { rowId } = this.$route.query;
    this.dataForm.id = rowId;
    this.getBaseProjectDataStoreById(); 
  },
  methods: {
    /**
     * 文件信息
     */
    selectedFile(item) {
      this.fileInfo = item;
    },
    /**
     * 文件选中
     */
    handleCheckAllListChange(val, item) {
      item.isCheck = val;
    },
    /**
     * 文件图片
     */
    getImgUrl(fileName) {
      if(['png','jpg','jpeg','gif','bmp'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/image.png');
      } else if (['mp4','mov','wmv','flv','avi','mkv'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/video.png');
      } else if (['rar','zip','tar','gz','7z'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/zip.png');
      } else if (['doc','docx'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/word.png');
      } else if (['pdf'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/pdf.png');
      } else if (['txt'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/txt.png');
      } else if (['ppt','pptx'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/ppt.png');
      } else if (['xls','xlsx'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/excel.png');
      } else if (['md'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/md.png');
      } else if (['js'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/js.png');
      } else if (['json'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/JSON.png');
      } else if (['mp3','wav','aac','wma'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/JSON.png');
      } else if (['xml'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/xml.png');
      } else if (['css'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/css.png');
      } else if (['html'].includes(this.getFilesType(fileName))) {
        return require('@/resources/images/fileType/html.png');
      } else {
        return require('@/resources/images/fileType/ofile.png');
      } 
    },
    /**
     * 获取文件类型
     * @param {*} val 
     */
    getFilesType(val) {
      var type = val.replace(/.+\./, "");
      return type?type.toLowerCase():""
    },
    handelSearchFile() {
      this.pageInfo.currentPage = 1;
      this.getFileList()
    },
    /**
     * 批量下载
     */
    async handleBatchDownload() {
      var files = [];
      for(var i=0;i<this.fileList.length;i++){
        if(this.fileList[i].isCheck) {
          files.push(this.fileList[i]);
        }
      }
      if(files.length>0){
        await batchDownloadProjectFile(files)
        return true
      }else{
        FUI.Window.showMsg('请选择需要下载的附件资料');
        return false;
      }
    },
    handleSizeChange(val) {
      var that = this;
      that.pageInfo.currentPage = 1;
      that.pageInfo.pageSize = val;
      that.getFileList();
    },
    handleCurrentChange(val) {
      var that = this;
      that.pageInfo.currentPage = val;
      that.getFileList();
    },
    // 全选
    getCheckedValue(val){
      console.log(val,'全选');
      var list = this.fileList;
      for(var i=0;i<list.length;i++){
        list[i].isCheck = val;
      }
    },
    /**
     * 树形菜单事件
     */
    handleNodeClick(data) {
      this.getMenuId = data.myId;
      this.getTreeNode = data;
      const checkedKeys = this.$refs.myTree.getCheckedKeys();
      this.projectParams.baseDataClassificationId = checkedKeys.toString();
      this.getFileList();
      // 初始化文件信息
      this.fileInfo = {
        createUserName: '--',
        createTime: '--',
        fileSize: '0',
        fileFormat: '--',
      }
    },
    reBack() {
      this.$router.push('/supplierCooperate/supplierCooperateList');
    },
    async getBaseProjectDataStoreById() {
      this.loading = true;
      const res = await getBaseProjectDataStoreById(this.dataForm.id)
      if(res.code == 200){
        this.dataForm = res.data;
        this.projectParams.constructArchiveMainId = res.data.constructArchiveMainId;
        this.queryDataClassification();
        this.getFileList();
      }
      this.loading = false;
    },
    /**
     * 树形结构文件列表
     */
    async queryDataClassification() {
      const params = {
        ...this.projectParams,
      }
      const res = await queryDataClassification(params)
      if(res.code == 200){
        this.treeData = res.data;
      }
    },
    async getFileList() {
      this.loading = true;
      const params = {
        ...this.pageInfo,
        ...this.projectParams,
      }
      const res = await getProjectFilelist(params)
      if(res.code == 200){
        this.fileList = res.data.list;
        this.total = res.data.pagination.total;
      }
      this.loading = false;
    },
  }
};
</script>

<style scoped lang="scss">
@import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  $WhiteBg: #fff;
  .no-data {
    text-align: center;
    margin: auto;
    .no-data-img {
      width: 200px;
      height: auto;
    }
    .text {
      font-size: 14px;
      color: #999999;
    }
  }
  .file-list {
    display: flex;
    justify-content: space-between;
    .file-box {
      display: flex;
      flex-wrap: wrap;
      height: calc(100vh - 570px);
      box-sizing: border-box;
      overflow-y: auto;
      padding:10px;
      .file {
        padding: 10px;
        padding-top: 20px;
        border: 1px solid #efefef;
        width: 150px;
        margin-right: 10px;
        text-align: center;
        height: 120px;
        position: relative;
        .fileCheckBox {
          position: absolute;
          left: 5px;
          top: 5px;
          z-index: 99;
        }
      }
      .fileName {
        margin-top: 10px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;					
        -webkit-box-orient: vertical;
      }
      .img {
        width: 50px;
        height: 50px;
      }
    }
    .fileInfo {
      border-left: 1px solid #efefef;
      padding:10px;
    }
  }
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
 .tree {
 
  font-size: 14px;
 
  ::v-deep .el-tree-node__content {
 
    width: 200px;
 
    overflow: hidden;
 
    white-space: nowrap;
 
    text-overflow: ellipsis;
 
    display: block;
 
  }
 
}
</style>
