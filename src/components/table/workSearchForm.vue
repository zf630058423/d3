<template>
  <div v-if="showSearch" id="gridSearch" class="grid-search-form">
    <div style="display: flex;">
      <el-form ref="form" class="search-form" label-position="right" style="flex: 1;">
        <el-row :gutter="20">
          <el-col v-for="(item,index) in theTableform.items" v-show="item.itemRender.name!='$hidden'&&item.itemRender.name!='$buttons'" :key="index" :span="childCol">
            <el-form-item :label="langTitle(item)+'：'" :label-width="labelWidth+'px'">
              <f2bpmui-textbox v-if="item.itemRender.name=='$input'" :field="item" :fieldvalue="theTableform.data[item.fieldName]" style="width:100%" @updatevalue="updateFieldValue"></f2bpmui-textbox>
              <f2bpmui-textbowteen v-if="item.itemRender.name == '$inputBowteen'" :field="item" :fieldvalue="theTableform.data[item.fieldName]" style="width:100%" @updatevalue="updateFieldValue"></f2bpmui-textbowteen>
              <f2bpmui-select v-else-if="item.itemRender.name=='$select'" :field="item" :fieldvalue="theTableform.data[item.fieldName]" style="width:100%" @updatevalue="updateFieldValue"></f2bpmui-select>
              <f2bpmui-datetime v-else-if="item.itemRender.name=='$datetime'" :field="item" :fieldvalue="theTableform.data[item.fieldName]" style="width:100%" @updatevalue="updateFieldValue"></f2bpmui-datetime>
              <f2bpmui-autocompleter v-else-if="item.itemRender.name=='autocompleter'" :field="item" :fieldvalue="theTableform.data[item.fieldName]" style="width:100%" @updatevalue="updateFieldValue"></f2bpmui-autocompleter>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 5px;margin-left:20px">
        <el-button size="small" type="primary" class="search-btn" @click="btnclick('dataGridSearch')" @keyup.enter="keyDown($event)"><i :class="submitbtn.icon"></i>{{ submitbtn.content }}</el-button>
        <el-button size="small" @click="btnclick('dataGridReSet')" @keyup.enter="keyDown($event)"><i class="fa fa-undo"></i>重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    /* components: {f2bpmuiTextbox,f2bpmuiSelect,f2bpmuiDatetime,f2bpmuiAutocompleter}, */
    name: 'F2bpmGridsearchform',
    props: {
      childCol: {
        type: Number,
        default: 8
      },
      tableform: {
        type: Object,
        default: () => { return {}; }
      },
      extenddes: {
        type: Boolean,
        default: false
      },
      labelWidth: {
        type: Number,
        default: 145
      }
    },
    data: function() {
      return {
        language: '',
        searchfieldsTitle: '',
        showSearch: true,
        submitbtn: {
          icon: 'fa fa-search',
          type: 'submit',
          content: '查询',
          status: 'primary'
        },
        resetbtn: {
          icon: 'fa  fa-undo', type: 'reset', content: '重置'
        },
        isShowResetBtn: true,
        isSimpleSearch: false,

        theTableform: {},
        expansMore: false,
        moreIcon: 'icon icon-arrow-down-bold',
        moreTitle: this.$t('expand'),
        collapsedHeight: 'grid-search-form-list-height'
      };
    },
    computed: {
      langTitle() {
        return function(item) {
          var enTitle = item.fieldAlias;
          if (enTitle == '' || enTitle == null) {
            enTitle = item.fieldTitle;
          }
          var zhTitle = item.fieldTitle;

          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      }
    },
    watch: {
      value(val, oleVal) {
        var that = this;
        // 基本结构
        // var selectItem = {
        //     field: '',
        //     title: '',
        //     span: 4,
        //     itemRender: {props: {clearable: true}, attrs: {}, name: '$select', options: []}
        // };
        // this.$emit('updatevalue', that.field, val)
      }
    },
    mounted() {
      var that = this;
      // 绑定监听事件
      window.addEventListener('keydown', this.keyDown, true)// 开启监听键盘按下事件
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.keyDown, true)// 关闭监听键盘按下事件
    },
    created: function() {
      var that = this;
      var language = this.$store.state.app.language;
      that.language = language;
      that.theTableform = that.tableform;
      if (that.theTableform.items.length > 0) {
        // 过滤出两个按钮
        var item = that.theTableform.items.find(a => a.itemRender.name == '$buttons');
        var fields = that.theTableform.items.filter(a => a.itemRender.name != '$buttons');
        that.expansMore = fields.length >= 2;
        that.isSimpleSearch = item.isSimpleSearch;
        var buttons = item.itemRender.children;
        var submit = buttons.find(a => a.props.type == 'submit');
        that.submitbtn = submit.props;
        var resetbtn = buttons.find(a => a.props.type == 'reset');
        if (resetbtn) {
          that.resetbtn = resetbtn.props;
        } else {
          that.isShowResetBtn = false;
        }
        that.init();
      } else {
        that.showSearch = false;
      }
    },
    methods: {
      init() {
        var that = this;
      },
      updateFieldValue(fieldName, newVal) {
        console.log('fieldName,newVal===:', fieldName, newVal);
        var that = this;
        this.setFunnelData(fieldName, newVal);
        that.theTableform.data[fieldName] = newVal;
        this.$emit('updatevalue', fieldName, newVal, 'tableForm', 'data');
      },
      setFunnelData(fieldName, newVal) {
        const funnelData = JSON.parse(localStorage.getItem('funnelData'));
        if (funnelData) {
          if (funnelData.hasOwnProperty(fieldName)) {
            funnelData[fieldName] = newVal;
          }
          localStorage.setItem('funnelData', JSON.stringify(funnelData));
        }
        this.localStorageJuadge('TeamContractNo', newVal);
        this.localStorageJuadge('ProjectNo', newVal);
        const getParms = JSON.parse(localStorage.getItem('GetParms'));
        if (getParms) {
          if (getParms.hasOwnProperty(fieldName)) {
            getParms[fieldName] = newVal;
          }
          localStorage.setItem('GetParms', JSON.stringify(getParms));
        }
      },
      localStorageJuadge(localStorageName, newVal) {
        const name = localStorage.getItem(localStorageName);
        if (name) {
          if (newVal === '') {
            localStorage.removeItem(localStorageName);
          } else {
            localStorage.setItem(localStorageName, newVal);
          }
        }
      },
      btnclick(name) {
        var that = this;
        if (name == 'dataGridReSet') {
          that.$refs.form.resetFields()
          $.each(that.theTableform.data, function(key, value) {
            that.updateFieldValue(key, '');
          });
        }
        this.$emit('searchForm-click', that.theTableform.data);
      },
      keyDown(e) {
        // 回车则执行登录方法 enter键的ASCII是13
        if (e.key == 'Enter') {
          this.btnclick('dataGridSearch'); // 定义的登录方法
          e.preventDefault(); // 去掉默认的换行
        }
      },
      dataGridSearch() {

      },
      onSearchExpansMore() {
        var name = '';
        if (this.moreTitle == this.$t('expand')) {
          this.moreIcon = 'icon icon-arrow-up-bold';
          this.collapsedHeight = '';
          this.moreTitle = this.$t('packUp');
          name = 'expand';
        } else {
          this.moreIcon = 'icon icon-arrow-down-bold';
          this.collapsedHeight = 'grid-search-form-list-height';
          this.moreTitle = this.$t('expand');
          name = 'packup';
        }
        this.$emit('expandclick', name);
      }

    }
  }
</script>
<style lang="scss" scoped>
  .grid-search-form{
    padding: 10px;
    .search-form {
      .el-form-item {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        ::v-deep .el-form-item__label {
          white-space: pre-line;
          text-align: right;
          margin-top: 4px;
          line-height: 16px !important;
        }
        ::v-deep .el-form-item__content{
          flex: 1;
          margin-left: 0px !important;
        }
      }
    }
  }
</style>
