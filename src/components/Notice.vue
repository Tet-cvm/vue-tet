<template>
  <div class="notice" :style="{width: Width + 'px'}">
    <div class="message">
      2345
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['Width'],
  name: 'Notice',
    data() {
      return {

      };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.message {
  border-top: 1px solid #f0f2f5;
}
</style>