<template>
  <div v-if="!isCollapse" :class="{ 'has-logo': showLogo }" style="border-top:solid 1px #EBECF0" >
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <!--左侧菜单 :collapse="isCollapse" 修改为显示或不显示-->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        class="left-navigation-menu"
        :default-openeds="defaultOpenMenuId"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="m in menus"
          :key="m.attributes.resourceId"
          :item="m"
          :base-path="m.attributes.resourceId"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  props: ["mangementSide"],
  watch: {
    mangementSide: {
      handler(newVal, oVal) {
        this.switchManage(newVal);
      },
      deep: true,
      immediate: false,
    },
  },
  created() {
    var that = this;
    that.loadMyMenus();
    if (that.mangementSide != "desktop") {
      that.switchManage(that.mangementSide);
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),

    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      // 获取当前路由
      // const route = this.$route;
      // const { meta, path } = route;
      // // if set path, the sidebar will highlight the path you set
      // if (meta.activeMenu) {
      //   return meta.activeMenu;
      // }
      // return path;
      return this.$store.state.app.currState.currMenuId;
    },

    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  data() {
    return {
      rootMenuId: "wf_PersonalTodoList",
      myMenus: [],
      menus: [],
      defaultOpenMenuId: [],
    };
  },
  methods: {
    switchManage(rootMenuId) {
      var that = this;
      that.rootMenuId = rootMenuId;
      that.loadLeftMenu();
    },
    //加载当前登录人的所有菜单资源
    loadMyMenus() {
      let that = this;
      let f2bpmMemus = localStorage.getItem("f2bpmMemus");
      if (!f2bpmMemus) {
        const resData = Object.toAjaxJson("/home/", "getLeftMemus", {
          //menuId: that.rootMenuId// 'wf_PersonalTodoList',// syssysroot
          menuId: "Root",
        });
        if (resData.success) {
          that.myMenus = resData.leftMenu;
          that.myMenus = this.workbenchMenu(resData.leftMenu);
          that.$store.dispatch("user/setMenus", that.myMenus);
          f2bpmMemus = JSON.stringify(that.myMenus);
          localStorage.setItem("f2bpmMemus", f2bpmMemus);
        }
      } else {
        let myMenus = eval("(" + f2bpmMemus + ")");
        let myAllMenus = this.workbenchMenu(myMenus);
        that.myMenus = myAllMenus;
        that.$store.dispatch("user/setMenus", myAllMenus);
      }
    },
    //放入工作台
    workbenchMenu(menus) { 
      let workbenchObj = {
        nodeType:'null',
        levelNo: 2,
        name: '工作台',
        title: '工作台',
        text: '工作台',
        id: 'workbench',
        checked: true,
        attributes: {
          functionUrl:'/',
          name: '工作台',
          orderNum:1,
          type: 'menu',
          menuImg: 'icon icon-integral cur ml10',
          visible: true,
          tenantId: 'BPM',
          alias: "Workstation",
          enabled: true
        }
      }

      let ids = menus[0].children.map(item => item.id);
      if (!ids.includes('workbench')) { 
        menus[0].children.unshift(workbenchObj);
      }
      
      return menus;
      
    },
    //加载左侧菜单
    loadLeftMenu() {
      const that = this;
      
      if (that.myMenus == null || that.myMenus.length <= 0) {
        that.loadMyMenus();
      }
      var subMenus = that.myMenus.find((m) => m.id == that.rootMenuId);
      that.menus = subMenus.children || [];
      if (that.menus && that.menus.length > 0) {
        that.defaultOpenMenuId = [that.menus[0].id];
      }
      let curMenuId = that.$store.state.app.currState.currMenuId;
      if (curMenuId == '') {
        setTimeout(function () {
          // 点击打开第一项
          $(".sidebar-container .el-menu-item")[0].click();
        }, 500);
      }
    },
  },
};
</script>
<style>
.left-navigation-menu .icon {
  /* font-size: 16px !important; */
  font-size: 20px !important;
}
</style>