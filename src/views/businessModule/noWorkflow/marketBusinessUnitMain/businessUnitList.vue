<template>
  <div class="business-unit">
    <!-- 左侧树形结构 -->
    <div class="business-tree">
      <business-tree @change-tree="changeTree" :containerHeight="getTreeHeight" @changeTreeWidth="changeTreeWidth"></business-tree>
    </div>
    <div class="business-content" ref="businessContentRef">
        <searchFrom @search="search" ref="businessFormRef"></searchFrom>
        <f2bpm-datagrid 
          :toolbar="tableToolbar"
          class="business-grid"
          :loading="loading"
          ref="grid"
          grid="grid"
          @toolbar-button-click="toolbarButtonClickEvent"
          :height="getGridHeight"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
           @page-change="pageChange"/>
    </div>
  </div>

</template>
<script>
import searchFrom from './components/searchFrom.vue';
import BusinessTree from './components/businessTree.vue';
import { getList, deleteBusiness, exportBusiness } from '@/Api/businessUnit/index';

export default {
  name: 'businessUnitList',
  components:{ searchFrom, BusinessTree },
  data() { 
    return {
      loading: false,
      treeWidth: 300,
      tablePage: {},
      tableToolbar: {
          id: '',
          buttons: this.myToolBarCustomButton(),
        },
      tableColumn: [
        {
          type: "seq",
          title: "序号",
          fixed: 'left',
          width: 35,
          align: "center",
        },
        {
          type: "html",
          title: "操作",
          fixed: 'left',
          width: 135,
          align: "center",
          // slots: {
          //   default: ({ row, column }, h) => {
          //   let defaultValue = selectData[0].label;
          //     return (
          //       <el-select v-model={defaultValue} onChange={(e) => this.onSelectChange(e,row)}>
          //            {
          //              selectData.map((item) => {
          //                return <el-option key={item.id} label={item.label} value={item.id}></el-option>
          //              })
          //            }
          //         </el-select>
          //     )
          //   },
          // },
          slots: {
            default: ({ row, column }, h) => {
              const hbtns = [];
              const allbtns = [];
              const item1 = {
                index: 2,
                title: "编辑",
                class: "fa fa-edit",
                code: "default.edit",
                click: () => this.onSelectChange(2, row),
              };
              const item2 = {
                index: 3,
                title: "删除",
                class: "fa fa-remove",
                code: "default.remove",
                click: () => this.onSelectChange(3, row),
              };
              const item5 = {
                index: 1,
                title: "查看",
                class: "fa fa-edit",
                code: "default.view",
                click: () => this.onSelectChange(1, row),
              };

              let firstItem = null;
              allbtns.push(item5);
              allbtns.push(item1);
              allbtns.push(item2);
              $.each(allbtns, function (i, item) {
                if (i == 0 && firstItem == null) {
                  firstItem = item;
                } else {
                  var itemBtn = h(
                    "el-dropdown-item",
                    {
                      attrs: {
                        btn_code: item.code,
                        title: item.tip,
                      },
                      class: item.class + " block minw80",
                      nativeOn: { click: item.click },
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
                    type: "default",
                  },
                  attrs: {
                    btn_code: firstItem.code,
                  },
                  on: {
                    click: firstItem.click,
                  },
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
                        slot: "dropdown",
                      },
                    },
                    hbtns
                  ),
                ]
              );
              return dropMenus;
            },
          },
        },
        {
          field: "businessUnit",
          title: "业务单元",
          align: "left",
          fixed: 'left',
          width: 140,
          type: "html",
        },
        {
          field: "affiliatedBusinessCenter",
          title: "所属业务中心",
          align: "center",
          fixed: 'left',
          width: 140,
          type: "html",
        },
        {
          field: "organizationalCode",
          title: "组织编码",
          align: "center",
          type: "html",
        },
        {
          field: "businessUnitCodeOne",
          title: "1.0业务单元编码",
          align: "center",
          width: 120,
          type: "html",
        },
        {
          field: "associatedDept",
          title: `关联部门`,
          align: "center",
          width: 148,
          type: "html",
        },
        {
          field: "financialOrganizations",
          title: "财务组织",
          align: "center",
          width: 148,
          // width: fnTiteWidth('本年累计营销立项数'),
          type: "html",
        },
        {
          field: "enableState",
          title: `启用状态`,
          width: 120,
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              let statusData = {
                0: '禁用',
                1: '启用'
              }
              return (
                <span>{ statusData[row.enableState]}</span>
              )
            },
          },
        }
      ],
      tableData: [],
       tablePage: {
        align: "center",
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        order: "",
        pageCount: 10,
        total:50,
        pageSize: 20,
        pageSizes:[10,15,20,25,50,100,200,500]
      },
      pageData: {
        currentPage: 1,
        pageSize: 20,
        isPaging: 1,
      },
      formData: {},
    }
  },
  computed: {
    getGridHeight() { 
      return $(window).height() - 350;
    },
    getTreeHeight() { 
      return $(window).height() - 240;
    }
  },
  created() { 
    this.getDataList();
  },
  methods: {
    myToolBarCustomButton() { 
      return [
        { code: 'add', status: 'primary', name: '新增', icon: 'fa fa-play-circle' },
        { code: 'export', status: 'primary', name: '导出', alias: 'export', icon: 'icon icon-daochu' }
      ]
    },
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code;
      if (code === 'add') { 
         let queryData = {
            code:'marketBusinessUnitMain',
            path:'/marketBusinessUnitMain/businessUnitList',
            encode:'marketBusinessUnitMain',
            rowId: '',
            formAction: 'add',
            title: '业务单元',
            modelName: 'base',  // business
            isInterface:true,  //为true不用自己写保存接口
            fullDev: true  //全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      } else if (code === 'export') {
        this.exportExcel();
       }
     },
    businessContentWidth() { 
      this.$refs.businessContentRef.style.width = '100%';
    },
    changeTreeWidth(status) { 
      this.changeTreeWidth = status ? 20 : 300;
      this.businessContentWidth();
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
    changeTree(id) {
      this.formData = {};
      this.formData.superiorBusinessUnitId = id;
      this.$refs.businessFormRef.clearFormData();
      this.getDataList();
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
      }
        try {
          this.loading = true;
          let { data } = await getList(dataParams);
          this.loading = false;
          this.tableData = data.list;
          this.tablePage.currentPage = data.pagination.currentPage;
          this.tablePage.total = data.pagination.total;
          // this.tablePage.pageCount = data.pageTotal;
        } catch (error) {
          this.loading = false;
        }
    },
    onSelectChange(e, row) { 
      if (e == 3) {  //删除
        this.delRow(row.id);
      } else {
        let typeDetail = (e === 1) ? 'detail' : (e === 2 ? 'edit' : 'add');
        let queryData = {
          code:'marketBusinessUnitMain',
          path:'/marketBusinessUnitMain/businessUnitList',
          encode:'marketBusinessUnitMain',
          myId: row.id || '',
          formAction: typeDetail,
          modelName:'base',  //  business
          title: '业务单元',
          isInterface: true,  //为true不用自己写保存接口
          fullDev: true  //全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      }
    },
    async delRow(id) { 
      this.loading = true;
      let { code, msg } = await deleteBusiness(id);
      if (code === 200) {
        this.$message.success("删除成功");
        this.loading = false;
        this.searchList();  //刷新列表
      } else { 
        this.$message.success(msg);
      }
    },
    //导出
    async exportExcel() {
      let paramData = this.$refs.businessFormRef.getFormData();
      this.loading = true;
      await exportBusiness(paramData);
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.business-unit{
  padding: 16px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  background: #fff;

  .business-tree{
    height: 100%;
    min-height: 700px;
    border-left: 1px solid #edf2f7;
    border-right: 0;
  }

  .business-content{
    width: auto;
    min-width: calc(100% - 280px);
    height: 100%;
    margin-left: 8px;
  }

  .business-grid{
    margin: 8px 0;
  }
}

::v-deep .el-input__inner{
  height:32px;
  line-height: 32px;
}

::v-deep .el-input__icon{
   height:32px;
  line-height: 32px;
}


</style>