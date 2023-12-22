<template>
  <FuiDialog width="500px" title="供应商外部链接" :visible="visible" :isCancel="false" confirmText="关闭" @on-confirm="onConfirm">
    <div class="content">
      <el-form>
        <el-form-item label="外部注册地址:">
          <el-input v-model="linkUrl" type="textarea" :autosize="{ minRows: 5}" readonly
           size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </el-form>
      <div style="color: #909399;font-size:12px"><span class="el-icon-info" style="color: #E6A23C;"></span> 此链接有效期为 3 天，请尽快使用此链接完成自主注册</div>
    </div>
  </FuiDialog>
</template>

<script>
import { getSupplierLinkSecretKey } from '@/Api/workflowBusssion/supplier.js'
import FuiDialog from '@/components/basic/FuiDialog/index.vue'; // 公共弹框
export default {
  components: { FuiDialog },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linkUrl: ''
    };
  },
  watch: {
    visible: {
      handler(value) {
        if(value) {
          this.getSupplierLinkSecretKey()
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    onConfirm() {
      this.$emit('onclose',false)
    },
    async getSupplierLinkSecretKey() {
      const res = await getSupplierLinkSecretKey()
      if(res.code == 200) {
        let url = location.origin + '/supplierRegister?code='+res.data; 
        this.linkUrl = url;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.content {
  padding:20px 50px;
}
</style>
