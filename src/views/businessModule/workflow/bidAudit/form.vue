<template>
  <!-- 投标评审 -->
  <div v-loading="loading" class="flow-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="140px"
    >
      <!-- 测试 -->
      <form-title :title="'项目信息'"></form-title>
      <el-row>
        <el-col :span="7">
          <el-form-item prop="name" label="潇潇兮">
            <el-input v-model="dataForm.name" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import FormTitle from '@/components/basic/formTitle/index.vue';

import comMixin from '../minix';
import { format } from 'echarts';
export default {
  components: { FormTitle },
  mixins: [comMixin],
  data() {
    return {
      rowObject: {

      },
      loading: false,
      formVisible: false,
      dialogVisible: false,
      dataForm: {
        name: ''
      },
      dataRule: {
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
  },
  mounted() {
    this.beforeInit();
  },
  methods: {
    beforeInit() {
    },
    afterInit() {
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}

</style>
