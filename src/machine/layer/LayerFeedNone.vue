
<script setup lang="ts">
import Box from '../element/Box.vue';
const props = defineProps<{
  ctx: any,
  data: any,
}>()

const log = props.ctx.log
log('layer feed none')

</script>
<template>
<box h="240" color="#f09">
  no feed
</box>
</template>

<style>
.head{
  background-color: #f7f6f5;
}
</style>