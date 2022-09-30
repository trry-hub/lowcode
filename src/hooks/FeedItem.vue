
<script setup lang="ts">
const props = defineProps<{
  data: any,
  pager?: any,
}>()
</script>
<template>
<div class="item" color="#ddd">
  {{data}} {{pager}}
</div>
</template>

<style scoped>
.item {
  height: 80px;
  margin-bottom: 20px;
  background-color: #fff;
}
</style>