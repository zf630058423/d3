<template>
  <div>
    <div>
      <el-button type="primary" size="small" @click="toolbarCustBtnOnClick('add')">新增</el-button>
      <el-button type="primary" size="small" @click="toolbarCustBtnOnClick('excelExport')">导出</el-button>
      <el-button type="primary" size="small" @click="toolbarCustBtnOnClick('excelImport')">导入</el-button>
    </div>
    <div class="f2bpm-online-subtable-divcontainer">
      <el-table :key="subtableKey" :data="tempRows" class="f2bpmui-datagrid-vuetable" border show-summary  :summary-method="getSummaries1">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="项目名称">
          <div slot="header"><span style="color: #ed4014;">*</span> 项目名称</div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.fileName" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="项目特征">
          <template slot-scope="scope">
            <el-input v-model="scope.row.memo" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <div slot="header"><span style="color: #ed4014;">*</span> 单位</div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.unit" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <div slot="header"><span style="color: #ed4014;">*</span> 数量</div>
          <template slot-scope="scope">
            <amount-input :decimalNum="4" v-model="scope.row.number" size="small" placeholder="请输入" @change="changeAmountCount($event,scope.$index)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单价(元)">
          <div slot="header"><span style="color: #ed4014;">*</span> 单价(元)</div>
          <template slot-scope="scope">
            <amount-input :decimalNum="4" v-model="scope.row.unitPriceTax" size="small" placeholder="请输入" @change="changeAmountCount($event,scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="金额(元)">
          <div slot="header"><span style="color: #ed4014;">*</span> 金额(元)</div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountTax" size="small" disabled placeholder="自动计算" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="padding: 5px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,50,100]"
          :page-size="currentSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="rows.length">
        </el-pagination>
      </div>
    </div>

    <!-- 导入弹框 -->
  <CommonImpotDilog :visible.sync="commonImportData.visible" :title="commonImportData.title" :type="commonImportData.type" :tableName="commonImportData.tableName" :confirmText="commonImportData.confirmText" @onConfirm="onConfirm"></CommonImpotDilog>
  </div>
</template>

<script>
import CommonImpotDilog from '@/components/basic/commonImportDialog/index.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
  export default {
    name: 'f2bpmSubtable',
    components: {CommonImpotDilog,amountInput},
    props:['tableData'],
    data: function () {
      return {
        commonImportData: {
          title: '数据导入',
          visible: false,
          cancelText: "取消",
          type: '',
          tabeName: '',
          confirmText: '确定导入',
          mainTableName: '',

        },
        detailPOList:[],
        language: "",
        resultPower: {hidden: false, read: false, write: true, required: false},
        onlineformKey: '101',
        primaryKey: '',
        subtableKey: '201',
        footerKey: '301',

        toolbar: [],
        operation: [],
        colunms: [],
        isView: false,

        isCheckAll: false,
        checkList: [],
        // 所有行数据
        rows: [],
        //当前也数据
        tempRows: [],
        // 列合计结果数据
        columnCountData: {},
        currentPage: 1,
        currentSize: 10,
        total: null,
        bthState: ''
      };
    },
    computed: {
    },
    watch: {
      rows: {
        handler(n, o) {
          var that = this;
          that.tempRows = [];
          var rowData = JSON.stringify(n);
          var index = that.currentPage;
          that.total = n.length;
          if (o.length === 0) {
            index = 1;
          } else if (n.length > o.length) {
            index = Math.ceil(n.length / that.currentSize);
          } else if (n.length < o.length) {
            console.log(index, '页码')
            index = Math.ceil(n.length / that.currentSize) >= index ? index : Math.ceil(n.length / that.currentSize);
          } else if (n.length === o.length && (that.bthState === 'del' || that.bthState === 'add')) {
            index = Math.ceil(n.length / that.currentSize);
          }
          if (n.length !== o.length && index === that.currentPage) {
            var s = (index - 1) * that.currentSize;
            var e = s + that.currentSize;
            // that.tempRows = n.slice(s, e);
            that.bthState = '';
            that.tempRows = JSON.parse(rowData).slice(s, e);
          } else {
            that.currentPage = index;
            var s = (that.currentPage - 1) * that.currentSize;
            var e = s + that.currentSize;
            // that.tempRows = n.slice(s, e);
            that.tempRows = JSON.parse(rowData).slice(s, e);
            that.bthState = '';
          }
          //计算合计 这里要获取所有数据
          if (o != undefined && f2grid_global_columnCountData) {
             let allRows = JSON.parse(rowData);
             // that.totalPrice(allRows);
          }
        },
        deep: true,
        // 立即的
        immediate: false
      },
      currentSize: {
        handler(n, o) {
          //console.log(this.rows.length,this.total,n,o);
          this.tempRows = [];
          var rowData = JSON.stringify(this.rows);
          var s = (this.currentPage - 1) * n;
          var e = s + n;
          // this.tempRows = this.rows.slice(s, e);
          this.tempRows = JSON.parse(rowData).slice(s, e);
        },
        // 立即的
        immediate: false
      },
      currentPage: {
        handler(n, o) {
          //console.log(this.rows.length,this.total,n,o);
          this.tempRows = [];

          var rowData = JSON.stringify(this.rows);
          var s = (n - 1) * this.currentSize;
          var e = s + this.currentSize;
          // this.tempRows = this.rows.slice(s, e);
          this.tempRows = JSON.parse(rowData).slice(s, e);

          //点击分页时重新计算合计金额
          let allRows = JSON.parse(rowData);
          // this.totalPrice(allRows);
        },
        // 立即的
        immediate: false
      },
      tempRows: {
        handler(n, o) {
          //如果删除，则rows也要删除指定的数据
          //新增rows也要新增
          //修改
          var that = this;
          var a = JSON.stringify(n);
          var rowData = JSON.parse(a);
          if (n.length > 0) {
            var arr = that.rows;
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < rowData.length; j++) {
                if (rowData[j].tempid === arr[i].tempid) {
                  arr[i] = rowData[j];
                  // that.columnMath(true, that.rows);
                }
              }
            }
          } else {
            that.currentPage = 1;
          }
        },
        deep: true,
        // 立即的
        immediate: false
      }
    },
    mounted() {
    },
    created: function () {
      // JavaScript中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组
      // 在子组件内部改变它会影响父组件的状态,所以它data的变化会直接影响到父组件的data
      var that = this;
      var isView = WFContext.WorkflowformAction > 2;
      that.isView = isView;
      that.handleCurrentChange(1);
      that.loadRows();
    },
  methods: {
    //接收父级传值
    setRows(row){
      var that = this;
      that.rows = row;
      if (that.rows && that.rows.length > 0) {
        $.each(that.rows, function (index, row) {
          row.tempid = 'temp_' + Object.toGuid();
        });
      }
    },
      // 加载table data
    loadRows() {
      var that = this;
      if(that.tableData) {
        that.rows = that.tableData;
        if (that.rows && that.rows.length > 0) {
          $.each(that.rows, function (index, row) {
            row.tempid = 'temp_' + Object.toGuid();
          });
        }
      }
    },
      checkBox() {
        console.info(this.checkList);
      },
      checkAll(val) {
        var that = this;
        this.isCheckAll = val;
        that.checkList = [];
        if (val == true) {
          $.each(that.rows, function (index, r) {
            that.checkList.push(r.tempid);
          });
        }
      },
      delBathRow() {
        var that = this;
        FUI.F2Grid.delBathRow(that);
      },
      // 删除行
      delRow(index) {
        var that = this;
        that.rows.splice(index, 1);
        that.bthState = 'del';
      },
      // 添加行
      addRow() {
        var that = this;
        if (!that.rows) that.rows = [];
        that.rows.push({
          amountTax: '',
          amountUntax: '',
          brand: '',
          fileName: '',
          id: '',
          memo: '',
          number: '',
          specification: '',
          taxAmount: '',
          unit: '',
          unitPriceTax: '',
          unitPriceUntax: '',
          tempid: 'temp_' + Object.toGuid()
        });
        that.bthState = 'add';
      },
      toolbarCustBtnOnClick(btnType) {
        var that = this;
        if (btnType == "add") {
          // 添加行
          that.addRow();
        } else if (btnType == "excelImport") {
          //统一的导入界面
          that.importCommonExcel('subtable', that.props.mainTableName, tableName);
        } else if (btnType == "excelExport") {
          //统一的导出事件
          that.exportCommonExcel('subtable', that.props.mainTableName, tableName);

        }
      },
      // 重新渲染指定的组件
      renderComponent(keyName) {
        var that = this;
        that.subtableKey = Object.toGetRandomNum(100, 2000);
      },
      importCommonExcel(type, mainTableName, tableName) {
        var that = this;
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        //导入前置事件
        var extendFunName = tableName + "_importBeforeEvent";
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          var isPass = exfunc(that, mainTableName, tableName, that.rows);
          if (isPass === false) {
            return false;
          }
        }

        this.commonImportData.visible = true;
        this.commonImportData.type = type;
        this.commonImportData.title = '数据导入';
        // this.commonImportData.edit = FUI.FormAction.Edit;
        this.commonImportData.tabeName = tableName;
        this.commonImportData.confirmText = '确定导入';
    },
      //确定导入
    onConfirm(objectData) {
      let {mainTableName, tableName } = this.commonImportData;
      if (objectData == undefined || objectData == null || objectData == false) {
        return false;
      }
      if (objectData.length > 0) {
        FUI.F2Grid.subAddNVRows(this, mainTableName, tableName, objectData);
        //自定义 导入后置事件
        let extendFunName = tableName + "_importAfterEvent";
        let isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          let exfunc = eval(extendFunName);
          let isPass = exfunc(objectData);
        }
      }
      this.commonImportData.visible = false;
    },
      exportCommonExcel(type, mainTableName, tableName) {
        var that = this;
        // 获取主表id
        var parentId = that.$parent.data[mainTableName+'.MyId'];
        // if (that.checkList.length == 0) {
        //   FUI.Window.showMsg2("请选择要导出的记录");
        //   return false;
        // }
        var myids = [];
        //--------------------------------------自定义 导出前前置事件
        if (!parentId) {
          //自定义 导出前前置事件
          var extendFunNames = tableName + "_exportLeadingEvent";
          var isExists = Object.toIsExitsFunction(extendFunNames);
          if (isExists) {
            var exfuncs = eval(extendFunNames);
            var isPasss = exfuncs(that, parentId);
            if (isPasss === false) {
              return false;
            }
          }
        }
        //--------------------------------------导出前置事件
        var extendFunName = tableName + "_exportBeforeEvent";
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          var isPass = exfunc(that, mainTableName, tableName, that.rows, parentId);
          if (isPass === false) {
            return false;
          }
        }
        var downUrl = "/workflow/security/CommonImport/exportData?type=subtable&tableName="+tableName;
        Object.toAjaxDownloadFile(downUrl, "", JSON.stringify({
          "selectedId": parentId
        }),true);
      }
      , listens() {

      },
      handleSizeChange(val) {
        var that = this;
        that.currentPage = 1;
        that.currentSize = val;
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        var that = this;
        that.currentPage = val;
        console.log(`当前页: ${val}`);
      },
    // 合计
    getSummaries1(param){
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item['amountTax'])); //  金额(含税)
        if (!values.every(value => isNaN(value))) {
          sums[6] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[6] = Object.numberFixed(sums[6],2);
        } else {
          sums[6] = '';
        }
      });

      return sums;
    },
    /**
     * 自动计算
     * 子表--金额(含税)
     * */
    changeAmountCount(e,index){
      var that = this;
      var num = that.tempRows[index]['number']; // 数量
      var price = that.tempRows[index]['unitPriceTax']; // 单价(含税)
      // 金额(含税)
      var amount2 = Number(price) * Number(num); // 单价(含税)*数量
      amount2 = Object.tofixed(amount2,2);
      that.$set(that.tempRows[index], 'amountTax', amount2);
      that.$nextTick(function () {
        that.$emit('sumAmount',that.rows);
      })

    },
    getResult() {
      var list = this.rows;
      if(list.length > 0)
      return list;
    }
    }
  }
</script>
