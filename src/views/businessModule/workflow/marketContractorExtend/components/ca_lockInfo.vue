<template>
<div class="ca_lockInfoClass">
  <div class="bthGround">
    <el-button type="primary" size="small" @click="addTableData">新增</el-button>
  </div>
  <el-table :key="tableKey" :data="marketLockDetail" style="width: 100%" align="center" size="small" fit class="f2bpmui-datagrid-vuetable">
    <el-table-column label="序号" type="index" width="50">
    </el-table-column>
    <el-table-column align="center" >
      <template slot="header">
        <i class="red">*</i> CA锁名称
      </template>
      <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.lockName" size="small" placeholder="请输入" />
      </template>
    </el-table-column>
    <el-table-column align="center" >
      <template slot="header">
        <i class="red">*</i> CA锁密码
      </template>
      <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.lockPassword" size="small" placeholder="请输入" />
      </template>
    </el-table-column>
    <el-table-column align="center" width="180">
      <template slot="header">
        <i class="red">*</i> 办理时间
      </template>
      <template slot-scope="scope">
          <el-date-picker v-model="scope.row.processeTime" type="date" placeholder="选择日期" size="small" style="width: 100%">
          </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column align="center">
      <template slot="header">
        <i class="red">*</i> 有效期至
      </template>
      <template slot-scope="scope">
          <el-col :span="18">
            <el-date-picker v-model="scope.row.validUntil" type="date" :disabled="scope.row.isChecked"
              placeholder="选择日期" size="small" style="width: 100%">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="scope.row.isChecked" @change="changeIsChecked(scope.row)">长期有效</el-checkbox>
          </el-col>
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center" width="180">
      <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.remark" size="small" placeholder="请输入" maxlength="64" />
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
    export default {
        name: "CA_lockInfo",
        data(){
          return{
            tableKey:'',
            isChecked:false,
            marketLockDetail: [],
          }
        },
        created() {
          var that = this;
          that.tableKey = Object.toGuid();
        },
      methods:{
        initTableData(data) {
          console.log(data,'33333333333333333');
          this.marketLockDetail = data.marketLockDetail;
        },
        /**
         * 新增table
         * */
        addTableData(){
          if (!this.marketLockDetail){
            this.marketLockDetail = [];
          }else{
            this.marketLockDetail.push({
              id: "",
              isLangTrem: "",
              lockName: "",
              lockPassword: "",
              marketMainId: "",
              processeTime: "",
              remark: "",
              validUntil: "",
              _tempId: new Date().valueOf()
            })
          }

        },
        /**
         * 删除table
         * */
        handleDelete(index,row){
          var that = this;
          //删除
          FUI.Window.confirm('是否删除这行数据？', null, function (r) {
            //删除接口
            const data = that.marketLockDetail;
            for (let i in data) {
              if (data[i]._tempId === row._tempId) {
                data.splice(i, 1)
              }
            }
            that.marketLockDetail = data;
          });

        },
        changeIsChecked(e){
          if(e.isChecked){
            e.validUntil = '9999-12-31';
          }else{
            e.validUntil = '';
          }
        },
        // 校验表格数据
        vaildTableData() {
          var isOk = false;
          var that = this;
          // 判断table内输入框必填
          var arr = that.marketLockDetail;
          if (arr.length) {
            for (var j = 0; j <= arr.length; j++) {
              var a1 = arr[j];
              if (a1) {
                var lockName = a1.lockName;
                var lockPassword = a1.lockPassword;
                var processeTime = a1.processeTime;
                var validUntil = a1.validUntil;

                if (lockName && lockPassword && processeTime && validUntil) {
                  return !isOk;
                } else {
                  var msg = '';
                  if(!lockName){
                    msg = 'CA锁信息-CA锁名称';
                  }else if(!username){
                    msg = 'CA锁信息-CA锁密码';
                  } else if(!password){
                    msg = 'CA锁信息-办理时间';
                  } else if(!registerTime){
                    msg = 'CA锁信息-有效期至';
                  }
                  FUI.Window.showMsg(msg);
                  return isOk
                }
              }
            }

          }
        },
        getResult() {
          return this.marketLockDetail;
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
  .btnClass{
    font-size: 25px;
    color: #ed4014;
  }
  .bthGround{
    float: right;
    padding: 5px 10px;
    clear: both;
  }
</style>
