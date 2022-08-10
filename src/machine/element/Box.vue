
<script setup lang="ts">

import { ref, watchEffect } from 'vue'


const props = defineProps<{
  rect?: any
  x?: string
  y?: string
  w?: string
  h?: string
  color?: string
  flex?: string
  align?: string
}>()

const { x, y , w, h, color, flex, align } = props;

function toPx(n: string | number) {
  return `${n}px`
}

// const groups = ref(initGroup)
const style: any = ref({
  position: 'relative'
})

function init() {
  const S = style.value
  if (color) {
    S.background = color
  }

  if (w) {
    S.width = toPx(w)
  }
  if (h) {
    S.height = toPx(h)
  }

  if (x || y) {
    S.position = 'absolute'
  }

  if (x) {
    S.left = toPx(x)
  }
  if (y) {
    S.top = toPx(y)
  }
  if (flex) {
    S.display = 'flex'
    
    if (flex === 'row') {
      S.flexDirection = 'row'
    }

    if (align) {
      switch(align) {
        case 'center':
          S.alignItems = 'center';
          S.justifyContent = 'center'
          break;
        default:
          break;
      }
    }
  }
}

watchEffect(() => {
  init()
})

init()

</script>
<template>
<div class="n-box" :style="style">
<slot></slot>
</div>
</template>

<style scoped>
</style>