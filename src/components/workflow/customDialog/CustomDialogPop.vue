<template>
  <FuiDialog :width="fuiDialgData.width" :title="fuiDialgData.title" :height="fuiDialgData.height" :visible="fuiDialgData.visible" @on-cancel="onCancel" @on-confirm="onConfirm">
    <OpenCustomDialog ref="openCustomDialogRef" :is-set-head="customData.isSetHead" :parm="customData.parm" :code="customData.code"></OpenCustomDialog>
  </FuiDialog>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue'; // 公共弹框
import OpenCustomDialog from '@/views/workflow/customDialog/openCustomDialog.vue'; // 打开弹框

export default {
  components: {
    FuiDialog,
    OpenCustomDialog
  },
  data() {
    return {
      fuiDialgData: {
        width: '800px',
        height: '600px',
        title: '选择',
        visible: false
      },
      customData: {
        code: '',
        isSetHead: '0',
        parm: {}
      },
      isSubTableAdd: false,
      fieldData: {},
      vueDataObj: {},
      $vm: null
    }
  },

  created() {

  },
  methods: {
    customDialogInit(vm, conf, vueDataObj) {
      this.$vm = vm;
      this.vueDataObj = vueDataObj || vm.data;
      // selectId 选择按钮的ID
      // backbindIsdetail,返回绑定是否是在线表单的明细行中，可为空，非明细列表时则为当前整个页面中找绑定返回字段
      // conf指的是选择器配置中{selectId:"",backBindIsdetail:true false,"customDialog":"XX",isMulti:true, callBack,"data":[{"title":"组织名称","property":"OrgName","field":"CarApplyfor.CarSector",isKey:0}]}
      const customDialog = conf.customDialog;
      const urlParamsOption = conf.urlParamsOption || [];
      const callBack = conf.callBack || null;
      this.fieldData = conf.data;// 返回绑定目标字段
      const isTest = conf.isTest || false;// 是否测试预览
      this.isSubTableAdd = conf.isSubTableAdd || false;// 是否为子列表开窗选择添加
      const passParm = conf.passParm || {};
      // 自定义变量参数：过滤条件
      conf.varParams = conf.varParams || '';
      let isMulti = true;
      if (conf.isMulti == false) {
        isMulti = false;
      }
      const initailData = conf.initailData || [];// 初始化显示数据 格式：[{"属性名":值}]
      const parm = { customDialog: customDialog, isMulti: isMulti, initailData: initailData };
      if (conf.varParams) {
        // varParams结构[{key:"",value:""}]
        parm.varParams = conf.varParams;
      }
      this.fuiDialgData.width = conf.width ? conf.width + 'px' : '800px';
      this.fuiDialgData.height = conf.width ? conf.height + 'px' : '500px';

      this.customData.code = customDialog;
      this.customData.isSetHead = isTest ? 1 : '';
      this.customData.parm = parm;
      let urlParmString = '';
      let url = '';
      if (urlParamsOption && urlParamsOption.length > 0) {
        $.each(urlParamsOption, function(index, item) {
          const key = item.fieldName;
          const domName = item.comparValue;
          const operator = item.operator;
          let value = '';
          if (operator == 'default' || operator == '') {
            // 默认使用结尾field名控件[field$='']来查找Dom元素
            value = $("[field$='" + domName + "']").val();
          }
          urlParmString = '&' + key + '=' + value;
        });
        if (urlParmString != '') {
          url = url + urlParmString;
        }
      }
      console.log('urlParmString====：', urlParmString);
      this.fuiDialgData.title = this.isSubTableAdd ? '选择添加' : '选择';
      this.fuiDialgData.visible = true;
      this.$nextTick(() => {
        this.$refs.openCustomDialogRef.init();
      })
    },
    onCancel() {
      this.$refs.openCustomDialogRef.tempRow();
      this.fuiDialgData.visible = false;
    },
    onConfirm() {
      const that = this;
      const objectData = this.$refs.openCustomDialogRef.getResult();
      // 字段值结果
      var resultBindFieldData = {};
      if (that.isSubTableAdd === false) {
        // 常规
        $.each(that.fieldData, function(index, confItem) {
          // 多个字段
          var fieldArr = confItem.field.split(',');
          var propertyName = confItem.property;
          $.each(fieldArr, function(_, fieldName) {
            var targetValue = [];
            // 对选中的行钻取字段值，多个值之间使用英文逗号隔开
            $.each(objectData, function(i, item) {
              var selectedValue = item[propertyName];
              targetValue.push(selectedValue);
            });
            var v = targetValue.toString();
            if (fieldName) {
              // 字段付值
              that.vueDataObj[fieldName] = v;
              resultBindFieldData[fieldName] = v;
            }
          });
        });
      } else {
        // 子表开窗选择添加行,可一次选择添加多行
        var rowDatas = [];
        var mainTableName = '';
        var subTableName = '';
        var nameList = [];
        $.each(objectData, function(i, item) {
          var oneRow = [];
          $.each(that.fieldData, function(index, confItem) {
            // 多个字段
            var fieldArr = confItem.field.split(',');
            var propertyName = confItem.property;
            $.each(fieldArr, function(_, fieldName) {
              if (fieldName) {
                // 对选中的行钻取字段值，多个值之间使用英文逗号隔开
                var arr = fieldName.split('.');
                mainTableName = arr[0];
                subTableName = arr[1];
                var theName = arr[2];
                var v = item[propertyName];
                v = v === null ? '' : v === 'null' ? '' : v;
                oneRow.push({ 'name': theName, 'value': v });
                nameList.push(theName);
              }
            });
          });
          nameList.push('MyId');
          oneRow.push({ 'name': 'MyId', 'value': '' });
          if (that.$vm) {
            var row = $getEmptyRow(that.$vm);

            $.each(row, function(key, value) {
              var index = key.lastIndexOf('.');
              var thekey = index > 0 ? key.substr(index + 1) : key;
              if ($.inArray(thekey, nameList) == -1) {
                // 过滤null
                value = value === null ? '' : value === 'null' ? '' : value;
                oneRow.push({ 'name': thekey, 'value': value });
              }
            });
          }
          rowDatas.push(oneRow);
        });
        if (rowDatas && rowDatas.length > 0) {
          $.each(rowDatas, function(_, row) {
            FUI.F2Grid.addRowData(subTableName, mainTableName, row);
          });
        }
      }

      // 回调控件
      // var fn = $vm["onSelectedSuccess"] || "";
      // if (fn) {
      //   fn(resultBindFieldData);
      // }

      that.$emit('onSelectedSuccess', resultBindFieldData)
      this.fuiDialgData.visible = false;

      return false;
    }

  }
}
</script>
<style scoped>

</style>
