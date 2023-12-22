<template>
   <div class="search-form">
     <div style="display: flex;padding: 10px">
      <el-form ref="dataForm" :model="formData" label-width="120px" style="flex: 1" label-position="right" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目编号：" prop="constructCode">
              <el-input class="business-input" v-model="formData.code" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="项目名称：" prop="name">
              <el-input class="business-input" v-model="formData.name" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务单元：" prop="marketUnitName">
              <el-input class="business-input" v-model="formData.marketUnitName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理部门：" prop="constructionUnitName">
              <el-input class="business-input" v-model="formData.constructionUnitName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="项目部：" prop="projectDepartmentName">
              <el-input class="business-input" v-model="formData.projectDepartmentName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目状态：" prop="projectStatus">
              <el-select v-model="formData.projectStatus" placeholder="请选择" clearable style="width: 100%" size="small">
                <el-option v-for="(item,index) in projectStatusList" :key="index" :label="item.configName" :value="item.configValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改人：" prop="lastModifyUserName">
              <el-input class="business-input" v-model="formData.lastModifyUserName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="项目负责人：" prop="projectManagerName">
              <el-input class="business-input" v-model="formData.projectManagerName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="修改时间：">
              <el-date-picker
                size="small"
                clearable style="width: 100%"
                v-model="formData.lastModifyTime"
                type="datetimerange"
                value-format="yyyy-MM-dd hh:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
       <div style="margin-top: 5px;margin-left:20px">
         <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
         <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
       </div>
     </div>

   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
export default {
  name: 'searchFrom',
  components: { RowLayout },
  data() {
    return {
      formData: {
        code: '',
        constructCode: '',
        name: '',
        marketUnitName: '',
        constructionUnitName: '',
        projectDepartmentName: '',
        projectStatus: '',
        lastModifyUserName: '',
        projectManagerName: '',
        lastModifyTime:[]
      },


      projectStatusList: [], // 项目状态
    }
  },
  created(){
    this.getDataDictByConfigType()
  },
  methods: {
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate()
    },
    //查询
    searchFn() {
      let parm = Object.toClone(this.formData);
      parm.lastModifyTime = parm.lastModifyTime?(parm.lastModifyTime).join():'';
      this.$emit('searchForm-click',parm)
    },
    //重置
    resetFn() {
      this.clearFormData();
      this.$emit('searchForm-click',this.formData)
    },
    clearFormData() {
      this.formData = {};
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '项目状态' }});
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '项目状态':
              this.projectStatusList = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
// @import url('../../../style/form.scss');
.search-form{
  width: auto;
  min-width: 100%;
}

.business-input{
  height: 32px;
  line-height: 32px;
  width: 250px;
}

::v-deep .el-input__inner{
  height: 32px;
  line-height: 32px;
}
.el-form-item{
    margin-bottom: 10px;
    margin-right: 15px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-form-item__label{
    font-family: PingFang SC;
    font-weight: 500;
    color: #56576C;
  }
</style>
