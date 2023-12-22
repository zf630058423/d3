<template>
  <div class="">
    <work-search-form></work-search-form>
    <work-table :columns="columns" :table-data="tableData"></work-table>
  </div>
</template>

<script>
import { workSearchForm } from '@/components/table/workSearchForm.vue'
import { workTable } from '@/components/table/workTable.vue'
export default {
  components: {
    workSearchForm,
    workTable
  }
}
</script>

<style>

</style>
