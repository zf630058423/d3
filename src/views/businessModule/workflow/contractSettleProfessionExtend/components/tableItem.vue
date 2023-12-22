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
        <el-table-column label="税率">
          <template slot-scope="scope">
            <selector-dialog :model-data="rateModel" :value="scope.row.taxRateId" dynamicModel="customDialog" @updateValue="constructionRateUpdate($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="金额(含税)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountTax" size="small" placeholder="请输入" @change="changeAmount($event,scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="税额">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.taxAmount" size="small" placeholder="自动计算" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="金额(无税)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountUntax" size="small" placeholder="请输入" @change="changeAmount($event,scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
  export default {
    name: "tableItem",
    components: {amountInput,selectorDialog},
    data() {
      return {
        tableData: [],
        rateModel: {  //税率
          code: 'base_tax_rate_archive',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'tax_attribute',
                value: 6
              }
            ]
          }
        },
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
          "amountTax": '',
          "amountUntax": '',
          "content": "",
          "contractSettleMainId": "",
          "createUserId": "",
          "id": "",
          "taxAmount": '',
          "taxRateId": ""
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
          const values2 = data.map(item => Number(item['amountUntax'])); //  金额(无税)
          if (!values.every(value => isNaN(value))) {
            sums[3] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[3] = Object.numberFixed(sums[3], 2);
          } else {
            sums[3] = '';
          }
          if (!values2.every(value => isNaN(value))) {
            sums[5] = values2.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[5] = Object.numberFixed(sums[5], 2);
          } else {
            sums[5] = '';
          }
        });

        return sums;
      },
      /**
       * 税率
       * */
      constructionRateUpdate(data,index) {
        const {taxRate, id} = data[0];
        this.$set(this.tableData[index],'taxRateId',taxRate)
        this.changeAmount('',index);
      },
      // 输入金额
      changeAmount(e,index){
        var amountTax = this.tableData[index].amountTax; // 金额（有税）
        var rate = this.tableData[index].taxRateId; // 税率
        var amountUntax = Number(amountTax)/(1+Number(rate)); // 金额 （无税）
        amountUntax = Object.tofixed(amountUntax,2);
        this.$set(this.tableData[index],'amountUntax',amountUntax);
        var texAmount = Number(amountTax)-Number(amountUntax); // 税额
        texAmount = Object.tofixed(texAmount,2);
        this.$set(this.tableData[index],'taxAmount',texAmount);

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
