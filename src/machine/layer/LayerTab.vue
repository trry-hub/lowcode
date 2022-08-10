
<script setup lang="ts">
import Box from '../element/Box.vue'
import MTab from '../element/Tab.vue'

const props = defineProps<{
  ctx: any,
  data: any,
}>()

const log = props.ctx.log
log('layer tab')
console.log(props.data.current);

</script>
<template>
<box v-if="data.tabs" class="tab" h="60" color="#ddd" flex="row" align="center">
  <!-- element start: m-tab -->
  <m-tab
    v-model:tabs="data.tabs"
    v-model:current="data.current"
    @on-switch="(tab) => ctx.emit('tab:switch', tab)"
  />
  <!-- element end: m-tab -->
</box>
</template>

<style scoped>
</style>