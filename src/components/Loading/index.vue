<template>
  <img class="loading-container" :src="loadingUrl" alt="" />
</template>

<script>
import loadingUrl from "@/assets/loading.svg";
export default {
  data() {
    return {
      loadingUrl
    };
  },
};
</script>

<style scoped lang="less">
.loading-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>