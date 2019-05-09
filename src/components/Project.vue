<template>
  <div class="project">
    <Crumb title="Project"/>
    <div>
      project
    </div>
  </div>
</template>

<script lang="ts">
import Crumb from '@/components/Crumb.vue'
export default {
    name: 'Project',
    components: {
        Crumb
    },
    data() {
      return {

      };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.project {
  border-top: 2px solid #f0f2f5;
}
</style>