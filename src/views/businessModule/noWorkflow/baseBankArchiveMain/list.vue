<template>
  <div class="bank-files">
    <div class="bank-files-content" ref="baseBankArchiveMainRef">
      <searchFrom @search="search" ref="baseBankArchiveMainFormRef" @exportExcel="exportExcel" :openAccountTypeOptions="openAccountTypeOptions" :accountPropOptions="accountPropOptions" :accountStatusOptions="accountStatusOptions"></searchFrom>
      <div class="buttonGroup">
          <el-button type="primary" size="small" class="fa fa-play-circle" @click="addFn">新增</el-button>
          <el-button type="primary" size="small" class="icon icon-daochu"  @click="exportFn">导出</el-button>
          <el-button type="primary" size="small" class="fa" @click="importCommonExcel">更新信息</el-button>
      </div>
      <f2bpm-datagrid :loading="loading" ref="grid" grid="grid" :height="getGridHeight" :pager-config="tablePage"
        :data="tableData" :columns="tableColumn" @page-change="pageChange">
      </f2bpm-datagrid>
    </div>
  </div>
</template>
<script>
import searchFrom from "./components/searchFrom.vue";
import { getList, deleteBankFile, exportBankFile } from "@/Api/baseBankArchiveMain/index";
import { getDataDictByConfigType } from '@/Api/dataDict.js'
export default {
  name: "baseBankArchiveMainList",
  components: { searchFrom },
  data() {
    return {
      loading: false,
      tablePage: {},
      tableColumn: [],
      tableData: [],
      tablePage: {
        align: "center",
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        order: "",
        pageCount: 10,
        total: 50,
        pageSize: 20,
        pageSizes: [10, 15, 20, 25, 50, 100, 200, 500]
      },
      pageData: {
        currentPage: 1,
        pageSize: 20,
        isPaging: 1
      },
      formData: {},
      openAccountTypeOptions: [],
      accountPropOptions: [],
      accountStatusOptions: [],
    };
  },
  computed: {
    getGridHeight() {
      return $(window).height() - 430;
    }
  },
  created() {
    var that = this;
    // 自主开发需要自定义表头字段
    that.tableColumn = [
      {
        type: "checkbox",
        fixed: "left",
        width: 35,
        align: "center"
      },
      {
        title: "操作",
        width: 120,
        align: "center",
        type: "html",
        slots: {
          default: ({ row, column }, h) => {
            const hbtns = [];
            const allbtns = [];
            const item1 = {
              index: 1,
              title: "编辑",
              class: "fa fa-edit",
              code: "default.edit",
              click: () => this.onSelectChange("edit", row)
            };
            const item2 = {
              index: 2,
              title: "删除",
              class: "fa fa-trash-o",
              code: "default.delete",
              click: () => this.onSelectChange("delete", row)
            };
            const item5 = {
              index: 8,
              title: "查看",
              class: "fa fa-search",
              code: "default.view",
              click: () => this.onSelectChange("detail", row)
            };

            var firstItem = null;
            allbtns.push(item5);
            allbtns.push(item1);
            //allbtns.push(item2);
            $.each(allbtns, function (i, item) {
              if (i == 0 && firstItem == null) {
                firstItem = item;
              } else {
                var itemBtn = h(
                  "el-dropdown-item",
                  {
                    attrs: {
                      btn_code: item.code,
                      title: item.tip
                    },
                    class: item.class + " block minw80",
                    nativeOn: { click: item.click }
                  },
                  " " + item.title
                );
                hbtns.push(itemBtn);
              }
            });
            var dropMenus = h(
              "el-dropdown",
              {
                props: {
                  size: "mini",
                  splitButton: true,
                  type: "default"
                },
                attrs: {
                  btn_code: firstItem.code
                },
                on: {
                  click: firstItem.click
                }
              },
              [
                h(
                  "i",
                  { class: firstItem.class, attrs: { title: firstItem.tip } },
                  " " + firstItem.title
                ),
                h(
                  "el-dropdown-menu",
                  {
                    props: {
                      slot: "dropdown"
                    }
                  },
                  hbtns
                )
              ]
            );
            return dropMenus;
          }
        }
      },
      {
        field: "code",
        title: "单据编号",
        prop: "code",
        width: 160,
        align: "center",
        type: "html"
      },
      {
        field: "financeOrgName",
        title: "核算财务组织",
        width: 120,
        align: "center",
        type: "html"
      },
      {
        field: "bankAccountNo",
        title: "银行账号",
        width: 160,
        align: "center",
        type: "html"
      },
      {
        field: "bankAccountName",
        title: "账户名称",
        width: 160,
        align: "center",
        type: "html"
      },
      {
        field: "openAccountTime",
        title: "开户日期",
        align: "center",
        type: "html"
      },
      {
        field: "bankName",
        title: "开户银行",
        align: "center",
        type: "html"
      },
      {
        field: "bankType",
        title: "银行类别",
        align: "center",
        type: "html"
      },
      {
        field: "openAccountType",
        title: "开户类型",
        align: "center",
        type: "html"
      },
      {
        field: "accountProp",
        title: "账户属性",
        align: "center",
        type: "html"
      },
      {
        field: "cashier",
        title: "出纳",
        align: "center",
        type: "html"
      },
      {
        field: "accountStatus",
        title: "账户状态",
        align: "center",
        type: "html"
      },
      {
        field: "isTaxDeductionAccount",
        title: "扣税户",
        align: "center",
        type: "html"
      },
      {
        field: "enableStatusText",
        title: "启用状态",
        align: "center",
        type: "html"
      }
    ];
    this.getDataDictByConfigType();
    this.getDataList();
  },
  methods: {
    addFn(){
      this.$refs.baseBankArchiveMainFormRef.addFn()
    },
    exportFn(){
      this.$refs.baseBankArchiveMainFormRef.exportFn()
    },
    importCommonExcel(){
      this.$refs.baseBankArchiveMainFormRef.importCommonExcel()
    },
    pageChange(e) {
      this.pageData.currentPage = e.currentPage;
      this.pageData.pageSize = e.pageSize;
      this.getDataList();
    },
    search(obj) {
      this.formData = obj;
      this.searchList();
    },
    searchList() {
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 20;
      this.getDataList();
    },
    async getDataList() {
      let dataParams = {
        ...this.pageData,
        ...this.formData
      };
      try {
        this.loading = true;
        let { data } = await getList(dataParams);
        this.loading = false;
        const status = ["", "启用", "禁用"];
        const selectItemValue = ["accountProp", "accountStatus", "openAccountType"];
        data.list.forEach(item => {
          //数据字典下拉选回显
          selectItemValue.forEach(key=>{
            // item[key] = item[key] ? this[key+"Options"][item[key]]?.configName : ''
            item[key] = item[key] ? this[key+"Options"][this[key+"Options"].findIndex(it=>it.configValue == item[key])]?.configName : ''
          })
          if (item.enableStatus) {
            item.enableStatusText = item.enableStatus && status[item.enableStatus];
          }
          if (item.isTaxDeductionAccount) {
            item.isTaxDeductionAccount = item.isTaxDeductionAccount == '1' ? '是' : '否'
          }
        });
        this.tableData = data.list;
        this.tablePage.currentPage = data.pagination.currentPage;
        this.tablePage.total = data.pagination.total;
        // this.tablePage.pageCount = data.pageTotal;
      } catch (error) {
        this.loading = false;
      }
    },
    onSelectChange(e, row) {
      let queryData = {
        code: "baseBankArchiveMain",
        path: "/baseBankArchiveMain/list",
        modelName: "base",
        encode: "baseBankArchiveMain",
        myId: row.id || "",
        formAction: e,
        title: "银行档案",
        fullDev: true //全开发页面
      };
      if (e === 'delete') {
        this.delRow(row.id);
      } else {
        this.$router.push({ path: "/noWorkflowForm", query: queryData });
      }
    },
    async delRow(id) {
      this.loading = true;
      let { code, msg } = await deleteBankFile(id);
      if (code === 200) {
        this.$message.success("删除成功");
        this.loading = false;
        this.searchList(); //刷新列表
      } else {
        this.$message.success(msg);
      }
    },
    //导出
    async exportExcel(obj) {
      let paramData = {
        ...obj
      };
      this.loading = true;
      await exportBankFile(paramData);
      this.loading = false;
    },
     /**
    * 初始化字典
    */
    async getDataDictByConfigType() {
      const optionType = {
        '开户类型': 'openAccountType',
        '账户属性': 'accountProp',
        '账户状态': 'accountStatus'
      }
      const res = await getDataDictByConfigType({ params: { configTypes: '开户类型,账户属性,账户状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          if (optionType[ele.dataDictType]) {
            this[optionType[ele.dataDictType] + 'Options'] = ele.dataDict;
          }
        });

      }
    },
  }
};
</script>
<style lang="scss" scoped>
.bank-files {
  // padding: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  background: #fff;

  .bank-files-content {
    width: 100%;
  }
}

::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-input__icon {
  height: 32px;
  line-height: 32px;
}
.buttonGroup{
  margin: 0;
  line-height: 35px;
  padding-left: 20px;
  margin-bottom: 5px;
}
</style>
