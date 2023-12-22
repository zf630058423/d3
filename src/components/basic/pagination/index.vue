<template>
  <div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="pageSizes" :page-size="thatPageSize" :layout="layout" v-bind="$attrs"
      @input="change($event)" :total="total" background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'paginaction',
  props: {
    sourceData: { //源数据
      type: Array,
      default: () => { }
    },
    pageSizes: {
      type: Array,
      default: () => { return [5, 10, 20, 50] }
    },
    pageSize: {  //当前显示多少页 默认5页
      type: Number,
      default: 5
    },
    layout: {
      type: String,
      default:'total, sizes, prev, pager, next'
    }
  },
  data () {
    return {
      listData: [],
      keepData: [],
      currentPage: 1,
      thatPageSize: 5,
      total: 0,
    }
  },
  watch: {
    sourceData: {
      handler: function (val) {
        //删除
        if (val && val.length < this.total) {
          this.total = val.length
          //删除当前页最后一条后返回上一页
          if (this.total <= (this.currentPage - 1) * this.thatPageSize) {
            this.currentPage--
          }
        }
        //新增
        if (val && val.length > this.total) {
          this.total = val.length
          this.currentPage = Math.ceil(this.total / this.thatPageSize)
        }
        this.fetchData()
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.thatPageSize = this.pageSize || this.thatPageSize
  },
  methods: {
    handleSizeChange (val) {
      this.thatPageSize = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    },
    fetchData () {
      let _keepData = this.sourceData
      let listData = []
      console.log(this.thatPageSize)
      if (!_keepData || _keepData.length == 0) {
        this.$emit('input', [])
        return false
      }
      const _index = (this.currentPage - 1) * this.thatPageSize //当前页下标
      for (let index = _index; index < (_index + this.thatPageSize) && index < _keepData.length; index++) {
        listData.push(_keepData[index])
      }
      this.$emit('input', listData)
    }
  }
}
</script>
<style scoped>
.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>