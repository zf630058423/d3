<template>
  <el-input
    v-model="currentValue"
    :placeholder="placeholder"
    size="small"
    :disabled="disabled"
    @focus="focusHandler"
    @blur="blurHandler"
  >
  </el-input>
</template>
<script>
  export default {
    name: 'multipleDecimalsInput',
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      decimalNum: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number],
        default: ''
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
          if(!value) {
            this.currentValue = '';
            return
          }
          let val = value;
          if (val && typeof val === 'number') {
            val = (val).toString();
          }
          const newNal = Object.formatMultipleNumber(val, this.decimalNum);
          // const newNal = value.toString().match(/^\d+(?:\.\d{0,2})?/).toString();
           this.currentValue = newNal
        },
        immediate: true
      }
    },
    created() {
    },
    methods: {
      focusHandler(e) {
        const val = e.target.value;
        this.currentValue = val.replaceAll(',', '')
      },
      blurHandler(e) {
        const val = e.target.value.replaceAll(',', '');
        if (isNaN(val) || !val) {
          this.$emit('change', '');
          this.currentValue = ''
        } else {
          const newNal = Object.formatMultipleNumber(val, this.decimalNum);
          this.$emit('change', newNal);
          this.currentValue = newNal
        }
      }
    }
  }
</script>
