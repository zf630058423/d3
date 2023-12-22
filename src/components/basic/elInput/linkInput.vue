<template>
  <div class="link-input">
     <el-input
      ref="input"
      v-on="$listeners"
      v-bind="$attrs"
      :value="value"
      @blur="blur"
      >
    </el-input>
    <div class="link" v-if="value && linkStatus" @click="linkCancel">
      <el-tooltip class="item" effect="dark" :content="$attrs.tip || '连接'" placement="bottom-start">
        <span class="link-span" @click.stop="toLink">{{ value }}</span>
      </el-tooltip>
    </div>
  </div>
</template>
<script>

/**
 * 文本框组件包含连接文字或数字
 * value： 默认值
 */
export default {
  name: 'linkInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
  },
  data() { 
    return {
      linkStatus: true
    }
  },
  methods: {
    blur() { 
      this.linkStatus = !this.linkStatus;
    },
    linkCancel() { 
      if (this.$attrs.disabled) return;
      this.linkStatus = !this.linkStatus;
      this.$refs.input.focus();
    },
    toLink() {
      this.$emit('linkChange', this.currentValue);
     }
  }
}
</script>
<style scoped lang="scss">
.link-input{
  position: relative;

  .link {
    position: absolute;
    padding-left: 12px;
    z-index: 1000;
    top: 5px;
    background: #f5f7fa;
    left: 1px;
    line-height: 30px;
    width: 99%;
    margin-right: 50px;
    border-radius: 4px;

    &-span{
      display: inline-block;
      height: 30px;
      line-height: 30px;

      &:hover {
        cursor: pointer;
        color: #006eff;
        text-decoration-line: underline;
      }
    }

    
  }
}

</style>