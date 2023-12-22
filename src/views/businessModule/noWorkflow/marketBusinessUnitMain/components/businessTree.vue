<template>
  <el-aside
        ref="sideLeft"
        class="f2bpm-page-left"
        hide-trigger
        collapsible
        :width="isCollapsed ? '20px' : '250px'"
      >
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input
              v-model="treeFilterText"
              class="left-htead-treeFilterText-box"
              size="small"
              clearable
              :placeholder="$t('enterKey')"
              autocomplete="off"
              prefix-icon="el-icon-search"
            />
          </div>
          <div style="float: right; line-height: 35px; padding-right: 5px">
            <i
              v-if="!isCollapsed"
              :title="$t('refresh')"
              class="fa fa-refresh cur mr10 font12"
              @click="loadTree()"
            />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div
          v-if="!isCollapsed"
          class="f2bpm-page-left-content mt4"
        >
        <!-- :default-expanded-keys="defaultExpandedKeys" -->
          <el-tree
            v-loading="loading"
            :default-expanded-keys="[treeData[0].id]"
            ref="mytree"
            node-key="id"
            :style="{height:containerHeight+'px'}"
            :data="treeData"
            :filter-node-method="filterTreeNode"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="onTreeSelected"
          />
        </div>
      </el-aside>
</template>
<script>
import { getTree } from '@/Api/businessUnit/index';

export default {
  props: {
    containerHeight: {
      type: Number,
      default: 500
    },
    parms: { // { 【是否的单选】singleSelect: false, 【取id的是哪个字段】resultFieldKey: 'groupId', needRoot: false, data: [] }
      type: Object,
      default: () => { }
    }
  },
  data() { 
    return {
      defaultExpandedKeys: [],
      treeFilterText: '',
      isCollapsed: false,
      loading: false,
      treeData: [],
      windowparms: { resultFieldKey: 'groupId', needRoot: false, data: [] },
      defaultProps: {
          children: 'children',
          label: 'businessUnit'
        }
    }
  },
  watch: {
    treeFilterText(val) {
      this.$refs.mytree.filter(val);
    }
  },
  computed: {
    rotateIcon() {
      return this.isCollapsed
        ? 'icon icon-arrow-right-bold cur'
        : 'icon icon-arrow-left-bold cur';
    }
  },
  created() { 
    this.initData();
  },
  methods: {
    initData() {
      this.loadTree();
    },
    collapsedSider() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit('changeTreeWidth', this.isCollapsed);
    },
    loadDefaultExpandedKeys() {
      let that = this;
      that.defaultExpandedKeys = [];
      // 默认展开到第几级
      let level = 2;
      Object.toTreeCollection(
        that.treeData,
        'id',
        that.defaultExpandedKeys,
        level
      );
    },
    onTreeSelected(data, treeNode, thisObj) {
      // let attributes = data.attributes;
      // let value = attributes[this.windowparms.resultFieldKey];
      // let text = treeNode.data.title;
      // let parentId = attributes.parentId;
      // let dataParam = {id:value, name:text, parentId}
      this.$emit("change-tree", data.id);
    },
    filterTreeNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
   async loadTree() {
     let that = this;
     this.loading = true;
     let { data } = await getTree();
     this.loading = false;
     that.treeData = data;
    },
  }
}
</script>