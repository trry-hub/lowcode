
<script setup lang="ts">
import Box from '../element/Box.vue';
const props = defineProps<{
  ctx: any,
  data: any,
}>()

const log = props.ctx.log
log('layer one')

</script>
<template>
<box class="head" h="240" color="#f09">
  4
</box>
</template>

<style>
.head{
  background-color: #f7f6f5;
}
</style>