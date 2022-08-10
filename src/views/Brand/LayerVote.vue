<script lang="ts" setup>
import Vote from './components/Vote.vue'
defineProps<{
  ctx: any
  data: any
}>()
</script>

<template>
  <Vote :vote="data.info" />
</template>
