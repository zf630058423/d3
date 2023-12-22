<template>
  <div class="accountInfoClass">
    <div class="bthGround">
      <el-button type="primary" size="small" @click="addTableData">新增</el-button>
    </div>
    <el-table :key="tableKey" :data="marketContractorAccountDetail" style="width: 100%" align="center" size="small" fit
              class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red ">*</i> 网址
        </template>
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.url" size="small" placeholder="请输入"/>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red ">*</i> 登录账号（用户名）
        </template>
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.username" size="small" placeholder="请输入"/>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red ">*</i> 登录密码
        </template>
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.password" size="small" placeholder="请输入"/>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red">*</i> 账户注册时间
        </template>
        <template slot-scope="scope">
            <el-date-picker v-model="scope.row.registerTime" type="date" placeholder="选择日期" size="small"
                            style="width: 100%">
            </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red ">*</i> 账户管理人
        </template>
        <template slot-scope="scope">
            <select-dialog style="display: inline-block" :disabled="true" :width="960" :height="500"  :modelData="dialogModel"
                           :value="scope.row.accountAdminName" @updateValue="updateValue($event,scope.$index)"
                           dynamicModel="selectUsers"></select-dialog>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red">*</i> 预留联系人
        </template>
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.linkman" size="small" placeholder="请输入"/>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red ">*</i> 预留手机号码
        </template>
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.phone" size="small" placeholder="请输入"/>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <i class="red ">*</i> 预留邮箱
        </template>
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.email" size="small" placeholder="请输入"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.remark" size="small" placeholder="请输入" maxlength="64"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import { RADIO_GROUP,BUSINERSSUNIT_MODEL, FOLLOWER_MODEL, PROJECT_LEADER_MODEL }  from '@/views/businessModule/enum/param';

  export default {
    name: "accountInfo",
    components: {SelectDialog},
    data() {
      return {
        tableKey: '',
        marketContractorAccountDetail: [],
        dialogModel: FOLLOWER_MODEL,
        isAble:false
      }
    },
    created() {
      var that = this;
      that.tableKey = Object.toGuid();
      var currentName = WFContext.CurrentActivityName; // 节点名称
      if(currentName == '编制人（反馈结果）'){
        that.isAble = false
      }else {
        that.isAble = true;
      }
    },
    methods: {
      initTableData(data) {
        console.log(data,'33333333333333333');
        this.marketContractorAccountDetail = data.marketContractorAccountDetail;
      },
      /**
       * 添加新行
       * */
      addTableData() {
        if (!this.marketContractorAccountDetail){
          this.marketContractorAccountDetail = [];
        }else{
          this.marketContractorAccountDetail.push({
            accountAdminId: "",
            accountAdminName: "",
            email: "",
            id: "",
            linkman: "",
            marketMainId: "",
            password: "",
            phone: "",
            registerTime: "",
            remark: "",
            url: "",
            username: "",
            _tempId: new Date().valueOf()
          })
        }
      },
      /**
       * 账户管理人
       * */
      updateValue(data, index) {
        if (data.length > 0) {
          this.$set(this.marketContractorAccountDetail[index], 'accountAdminId', data[0].userId);
          this.$set(this.marketContractorAccountDetail[index], 'accountAdminName', data[0].realName);
        }
      },
      /**
       * 删除行
       * */
      handleDelete(index, row) {
        var that = this;
        //删除
        FUI.Window.confirm('是否删除这行数据？', null, function (r) {
          //删除接口
          const data = that.marketContractorAccountDetail;
          for (let i in data) {
            if (data[i]._tempId === row._tempId) {
              data.splice(i, 1)
            }
          }
          that.marketContractorAccountDetail = data;
        });

      },
      // 校验表格数据
      vaildTableData() {
        var isOk = false;
        var that = this;
        // 判断table内输入框必填
        var arr = that.marketContractorAccountDetail;
        if (arr.length) {
          for (var j = 0; j <= arr.length; j++) {
            var a1 = arr[j];
            if (a1) {
              var email = a1.email;
              var linkman = a1.linkman;
              var password = a1.password;
              var phone = a1.phone;
              var url = a1.url;
              var username = a1.username;
              var accountAdminId = a1.accountAdminId;
              var registerTime = a1.registerTime;

              if (email && linkman && password && phone && url && username && accountAdminId && registerTime) {
                return !isOk;
              } else {
                var msg = '';
                if(!url){
                  msg = '账号信息-网址不能为空';
                }else if(!username){
                  msg = '账号信息-登录账号(用户名)不能为空';
                } else if(!password){
                  msg = '账号信息-登录密码不能为空';
                } else if(!registerTime){
                  msg = '账号信息-账户注册时间不能为空';
                } else if(!accountAdminId){
                  msg = '账号信息-账号管理员不能为空';
                }else if(!linkman){
                  msg = '账号信息-预留联系人不能为空';
                } else if(!phone){
                  msg = '账号信息-预留手机号不能为空';
                } else if(!email){
                  msg = '账号信息-预留邮箱不能为空';
                }
                FUI.Window.showMsg(msg);
                return isOk
              }
            }
          }

        }
      },
      getResult() {
        return this.marketContractorAccountDetail;
      }
    }
  }
</script>

<style scoped>
  ::v-deep .designPrice {

  .el-input-group__append {
    padding: 0 12px;
  }

  }
  .btnClass {
    font-size: 25px;
    color: #ed4014;
  }

  .bthGround {
    float: right;
    padding: 5px 10px;
    clear: both;
  }
</style>

