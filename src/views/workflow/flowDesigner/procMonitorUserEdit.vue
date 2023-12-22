<template>
  <el-form ref="formRef" class="f2bpm-editform" label-width="120px">
    <div v-if="false" placeholder="" v-html="data.monitorUser"></div>
    <label>流程监控人：</label>
    <el-input v-model="data.monitorRealName" placeholder="请选择流程监控人" size="mini">
      <template slot="append"><i class="fa fa-search cur" @click="selectorUserTextValue('monitorUser','monitorRealName',null,true)">选择</i>
      </template>
    </el-input>
    <div v-if="false" placeholder="" v-html="data.condition"></div>
    <label>角色：</label>
    <el-input v-model="data.RoleCondition" placeholder="请选择角色" size="mini"> <!--'condition', 'RoleCondition', 'Role'-->
      <template slot="append"><i class="fa fa-search cur" @click="selectorRoleTextValue('condition','RoleCondition','Role',true)">选择</i>
      </template>
    </el-input>
    <span class="fa fa-minus-circle red cur mt4" @click="clear">清空</span>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="saveAndClose()"><i class="fa fa-save" />保存
      </el-button>
      <el-button id="btn_cancel" size="small" onclick="FUI.Window.closeEdit()"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        attrName: '',

        data: {
          monitorUser: '',
          monitorRealName: '',
          condition:'',
          RoleCondition:''
        }

      }
    },
    created: function() {
      var that = this
      var obj
      var wid
      var attrName
      var value
      obj = parent.window.currentWindowTargetObjectValue
      var title = obj.title
      value = obj.value
      attrName = obj.name
      wid = obj.otherParm
      this.content = value
      this.attrName = attrName
      if (value) {
        // 去掉前后的#号
        value = value.replace('#', '').replace('#', '')
        value = typeof value === 'string' ? eval('(' + value + ')') : value
        this.data.monitorUser = value
        var realNameList = []
        $.each(value, function(i, item) {
          realNameList.push(item.text)
        })
        this.data.monitorRealName = realNameList.toString()
      }
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
      //选择角色
      selectorRoleTextValue(inputKey, inputName,type, passParm, singleSelect, keyName){
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, null, null, null, null, 'selectCallBack');
      },
       clear() {
        this.data.monitorUser = '';
        this.data.monitorRealName = '';
        this.data.condition = '';
        this.data.RoleCondition = '';
      },
       saveAndClose() {
        var that = this;
        var val_1 = that.data.monitorUser; // 人员
        var val_2= that.data.condition; // 角色
        var resultStr = val_1?val_1:val_2;
        FUI.Window.confirm(that, '您确定要提交？', '温馨提示', function() {
          if (resultStr == '[]') {
            parent.setTargetValue('')
          } else {
            resultStr = '#' + resultStr + '#'
            parent.setTargetValue(that.attrName, resultStr)
          }
          FUI.Window.closeEditAll()
        })
      },
      selectCallBack(type, data) {
        var that = this;
        type = type.toLowerCase();
        if (type == 'org' || type == 'role' || type == 'approaction') {
          var titles = [];
          var ids = [];
          $.each(data, function (i, item) {
            titles.push(item.text);
            ids.push(item.value);
          });
          $('#Des').val(titles.toString());
        }
      },
    }
  }
</script>
