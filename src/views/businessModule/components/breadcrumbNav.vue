<template>
  <el-breadcrumb separator="|">
    <!-- <el-breadcrumb-item>
      <span class="breadcrumb-title">{{ title }}</span>
    </el-breadcrumb-item> -->
    <el-breadcrumb-item>
      <div class="breadcrumb-back" @click="closeNav">
        <i class="el-icon-close"></i>
        <span class="el-close">关闭</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadcrumbNav',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'workFlow' // noWorkFlow：无流程  workFlow：有流程
    },
    fullDev: {
      type: Boolean,  //是否是全开发列表
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    closeNav() {
      const { code, encode, path, toPath } = this.$route.query;
      if(toPath) {
        this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
        this.$router.push(toPath)
        return;
      }
      if (this.type === 'noWorkFlow') { //无流程
        if (this.fullDev) {  //如果是全开发列表
          this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
          this.$router.push({path:path});
        } else {
          const { code, encode, modelName } = this.$route.params;
          this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
          this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode)
        }
      }else if(this.type === 'fullDevelopment'){
        this.$emit('close');
      } else {
        const { code, encode, modelName,toDone } = this.$route.query;

        this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
        if(!toDone) {
          this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode + '&refresh=true');
        } else {
          this.$router.go(-1)
        }
        // this.$store.dispatch('app/removeTagsView', this.$route.fullPath)
        // this.$router.push('/businessModule/tableDataGrid?code=' + code + '&keyWord=' + modelName + '_' + encode)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-title{
  font-size: 16px;
  color: #303133;

}
.breadcrumb-back {
  cursor: pointer;
  color: #006eff;
}

::v-deep .el-breadcrumb__item{
      float: none;
}

.el-close{
  margin-left: 4px;
}

::v-deep .el-breadcrumb__inner{
      display: inline-block;
}

::v-deep .el-breadcrumb__separator{
  display: inline-block;
}
</style>
