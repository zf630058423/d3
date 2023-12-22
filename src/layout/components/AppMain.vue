<template>
  <section id="appMain" class="app-main">
    <div class="navigationTabs">
      <navigation-tabs />
    </div>
    <transition name="fade-transform" mode="out-in">
      <!-- <router-view :key="key" /> -->
      <div class="content-box">
        <keep-alive>
          <router-view ref="keepAlive" :key="key"></router-view>
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      </div>
    </transition>
  </section>
</template>

<script>
import navigationTabs from './navigationTabs';
export default {
  name: 'AppMain',
  // 注册组件
  components: {
    navigationTabs
  },
  data() {
    return {
      tabsList: []
    };
  },
  computed: {
    key() {
      return this.$route.fullPath;
    }
  },
  watch: {
    '$store.state.app.tagsView'(val, old) {
      console.log(val, old);
      const object = this.$refs.keepAlive.$vnode.parent.componentInstance.cache
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const obj = val.filter(res => {
            return res.functionUrl === key
          })
          if (obj && obj.length <= 0) {
            this.$refs.keepAlive.$vnode.parent.componentInstance.cache[key] = ''
          }
        }
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      console.log(document.getElementById('appMain').scrollHeight, '滚动高度');
    }
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 56px);
  /*width: 100%;*/
  position: relative;
  overflow: auto;
  min-width: 1200px;
  /* background: #f3f3f3; */
}
.content-box {
  padding: 16px;
  /* background: rgb(243, 243, 243); */
  margin-top: 42px;
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
  background: #F7FAFC;
}
.fixed-header + .app-main {
  padding-top: 56px;
}
.toTop {
  width: 45px;
  height: 45px;
  border: 1px solid;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.navigationTabs {
  display: flex;
}
.transform {
  padding: 14px;
  background: #000;
}
</style>
