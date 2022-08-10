<script setup lang="ts">
import Block from './RenderBlock.vue';

const props = defineProps<{
  machine: any,
}>()
const machine = props.machine;
const store = machine.store;

</script>
<template>
<block v-for="item in machine.nodes"
  :key="item.state + '/' + store.stateVos[item.state]"
  :machine="machine"
  :state="store.stateVos[item.state]"
  :layerVos="item.stateMapVos"
  ></block>
</template>