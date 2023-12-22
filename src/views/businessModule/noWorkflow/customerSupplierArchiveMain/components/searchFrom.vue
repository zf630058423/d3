<template>
   <div class="search-form">
     <div style="display: flex;padding: 10px">
      <el-form ref="dataForm" :model="formData" label-width="120px" style="flex: 1" label-position="right" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客商编号：">
              <el-input class="business-input" v-model="formData.code" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="客商名称：" >
              <el-input class="business-input" v-model="formData.customerName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码：">
              <el-input class="business-input" v-model="formData.taxRegistrationNum" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客商类别：">
              <el-select v-model="formData.customerCategoryId" placeholder="请选择" clearable style="width: 100%" size="small" multiple>
                <el-option v-for="(item,index) in customerCategoryIdList" :key="index" :label="item.configName" :value="item.configValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客商状态：">
              <el-select v-model="formData.customerStatus" placeholder="请选择" clearable style="width: 100%" size="small" multiple>
                <el-option v-for="(item,index) in customerStatusList" :key="index" :label="item.configName" :value="item.configValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="启用状态：">
              <el-select v-model="formData.enableStatus" placeholder="请选择" clearable style="width: 100%" size="small">
                <el-option v-for="(item,index) in enableStatusList" :key="index" :label="item.configName" :value="item.configValue">
                </el-option>
              </el-select>
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
        code: "",
        customerName: "",
        enableStatus: "",
        taxRegistrationNum: "",
        customerCategoryId: "",
        customerStatus: "",
      },

      customerCategoryIdList:[],
      enableStatusList:[],
      customerStatusList:[]
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
      if(parm.customerCategoryId && parm.customerCategoryId.length > 0){
        parm.customerCategoryId = (parm.customerCategoryId).join();
      }else {
        parm.customerCategoryId = ''
      }
      if(parm.customerStatus && parm.customerStatus.length > 0){
        parm.customerStatus = (parm.customerStatus).join();
      }else {
        parm.customerStatus = ''
      }
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
      const res = await getDataDictByConfigType({ params: { configTypes: '启用状态,客户状态,客商类别' }});
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '客户状态':
              this.customerStatusList = ele.dataDict;
              break;
            case '启用状态':
              this.enableStatusList = ele.dataDict;
              break;
            case '客商类别':
              this.customerCategoryIdList = ele.dataDict;
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
