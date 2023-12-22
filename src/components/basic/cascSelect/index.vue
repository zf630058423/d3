<template>
  <div class="online-cascader">
    <el-cascader v-if="isShow" ref="myCascader" v-model="calcValue" size="mini" :disabled="disabled" style="width:35px;" class="online-select" :props="props" @change="change"></el-cascader>
    <el-tooltip
      placement="bottom"
      :disabled="isShowTip"
      popper-class="atooltip"
      effect="light"
    >
      <el-input :id="id" ref="cascaderInput" v-model="value" size="mini" :placeholder="setPlaceholder" class="online-cascader-input" :disabled="!isEnableEdit" style="width:100%;padding:0px" :clearable="clearable" @mouseover.native="inputOnMouseOver($event)"></el-input>
      <div slot="content" :style="{'max-width':`${inputMaxWidth}px`}" v-html="value"></div>
    </el-tooltip>
    <!-- <el-input size="mini" class="online-cascader-input" :id="id" v-model="value" :disabled="!isEnableEdit" :field="field.vModel" style="width:80%;padding:0px" :clearable="clearable" :placeholder="field.fieldRemark"></el-input> -->
  </div>
</template>

<script>
  /**
   * 级联单选下拉列表组件
   */
  export default {
    name: 'CascSelect',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      code: {
        type: String,
        default: ''
      },
      setPlaceholder: {
        type: String,
        default: ''
      },
      defaultValue: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        timeout: null,
        isShow: true,
        url: '/workflow/security/autocompleter/',
        // 是否可编辑
        isEnableEdit: false,
        // 是否根
        isRoot: false,
        // 子控件
        child: null,
        id: '',
        clearable: false,
        // 级联控件的临时值
        calcValue: [],
        value: '', // 显示的文本
        props: {
          // 懒加载的方式
          lazy: true,
          label: 'text',
          // 设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          checkStrictly: true,
          // hover 触发子菜单 click / hover
          expandTrigger: 'click',
          lazyLoad: this.lazyLoad
        },
        isShowTip: false,
        inputMaxWidth: 370
      };
  },
  watch: {
    defaultValue: {
      handler(value) {
        this.value = value;
      },
      immediate: true
    }
  },
    methods: {
      lazyLoad(node, callback) {
        // 从0开始
        const that = this;
        const level = node.level;
        const isroot = node.root;
        const defalutRootValue = '';
        let casccode = that.code;
        if (!isroot && that.child) {
          // 扩展子级的取数据服务
          casccode = that.child[level] ? that.child[level] : casccode;
        }
        if (level == 0) {
          that.text = '';
        }
        const nodeData = node.data || { value: defalutRootValue };
        const parms = { 'casccode': casccode, 'parentValue': nodeData.value };
        const res = Object.toAjaxJson('/workflow/security/autocompleter/', 'getCasSelectListJson', parms, true, null, function(data) {
          if (data.success == false) {
            FUI.Window.showMsg(null, data.msg);
            callback([]);
          } else {
            data = data || [];
            clearTimeout(that.timeout);
            that.timeout = setTimeout(function() {
              callback(data || []);
            }, 200);
          }
        });
      },
      // 点击时触发
      change(expandArr) {
        const expandStr = expandArr.join('/');
        // 获取选中的文本
        this.value = this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join('/');
        const data = {
          value: this.value,
          id: this.calcValue.toString()
        }
        this.$emit('change-select', data)
      },
      getResult() {
        return (this.value && this.calcValue) ? {
          value: this.value,
          id: this.calcValue.toString()
        } : '';
      },
      onBlur() {
        this.isShow = false;
      },
      inputOnMouseOver(event) {
        const target = event.target;
        const dWidth = this.$refs.cascaderInput.$el.clientWidth;
        this.inputMaxWidth = target.offsetWidth ? target.offsetWidth : dWidth;
        this.isShowTip = target.offsetWidth >= target.scrollWidth;
      }
    }
  }
</script>
