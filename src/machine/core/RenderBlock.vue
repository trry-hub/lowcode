<script setup lang="ts">
import debug from './debug';
import Block from './RenderBlock.vue'

const props = defineProps<{
  machine: any;
  state: any,
  layerVos: any,
}>()

// layer
const layer = props.layerVos[props.state];

// machine store
const store = props.machine.store;

// init layer store
if (layer) {
  store.initLayerData(layer) || {};
}

// get layer store hook
const data = store.layerDataVos;
const ctx = {
  emit: (name: string, payload: any) => {
    return props.machine.invoke(name, payload)
  },
  log: debug(`${store.$id}.Layer.${layer?.path}`),
}

</script>

<template>
<component v-if="layer"
  :ctx="ctx"
  :is="layer.view"
  :data="data[layer.path] || {}"
>
  <block v-if="layer.children" v-for="item in layer.children"
    :key="item.state + '/' + store.stateVos[item.state]"
    :machine="machine"
    :state="store.stateVos[item.state]"
    :layerVos="item.stateMapVos"
    ></block>
</component>
</template>