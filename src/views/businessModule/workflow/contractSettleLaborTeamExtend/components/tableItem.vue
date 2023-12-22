<template>
  <div>
    <div>
      <el-button type="primary" size="small" @click="addRow">新增</el-button>
    </div>
    <div class="f2bpm-online-subtable-divcontainer">
      <el-table :data="tableData" class="f2bpmui-datagrid-vuetable" border show-summary :summary-method="getSummaries1">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.content" size="small" placeholder="请输入" maxlength="64"/>
          </template>
        </el-table-column>
        <el-table-column label="金额(元)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountTax" size="small" placeholder="请输入" @change="changeAmount"/>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.memo" size="small" placeholder="请输入" maxlength="64"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  export default {
    name: "tableItem",
    components: {amountInput},
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      // 加载table data
      loadRows(data) {
        var that = this;
        that.tableData = data;
        if (that.tableData && that.tableData.length > 0) {
          $.each(that.tableData, function (index, row) {
            row.tempid = 'temp_' + Object.toGuid();
          });
        }
      },
      // 新增
      addRow(){
        var that = this;
        if (!that.tableData) that.tableData = [];
        that.tableData.push({
          content: '',
          amountTax: '',
          id: '',
          memo: '',
        });
        this.$emit('getTableItem',this.tableData)
      },
      // 删除行
      delRow(index) {
        var that = this;
        that.tableData.splice(index, 1);
        that.$nextTick(() =>{
          that.$emit('getTableItem',that.tableData)
        });

      },
      // 合计
      getSummaries1(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['amountTax'])); //  金额(含税)
          if (!values.every(value => isNaN(value))) {
            sums[2] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[2] = Object.numberFixed(sums[2], 2);
          } else {
            sums[2] = '';
          }
        });

        return sums;
      },
      // 输入金额
      changeAmount(){
        this.$emit('getTableItem',this.tableData)
      },
      getResult() {
        return this.tableData;
      }
    }
  }
</script>

<style scoped>

</style>
