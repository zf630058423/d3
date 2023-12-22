<template>
  <el-input
    v-model="currentValue"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
    @input="handleInput"
    size="small"
  >
  </el-input>
</template>
<script>
export default {
  name: 'NumberInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    maxlength: {
      type: Number,
      default: 20
    },
    // 最大值设置 -1无限大
    maxValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      currentValue: ''
    }
  },
  watch: {
    value: {
      handler(value) {
        let val = value;
        if (val && typeof val === 'number') {
          val = (val).toString();
        }
        this.currentValue = val?val.replace(/[^\d]+/g, ''):''
      },
      immediate: true
    }
  },
  methods: {
    handleInput(val) {
      val = val.replace(/^[^\d]+/g, '')
      if(this.maxValue != -1 && val>this.maxValue)  val = this.maxValue;
      this.currentValue = val
      this.$emit('change', val)
    }
  }
}
</script>
