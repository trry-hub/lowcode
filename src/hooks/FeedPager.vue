
<script setup lang="ts">
const props = defineProps<{
  trigger: any,
  status: any,
  data: any
}>()

</script>
<template>
<div class="pager" v-if="status === 0" @click="trigger"> wait</div>
<div class="pager" v-else-if="status === 1"> loading</div>
<div class="pager" v-else-if="status === 3"> empty</div>
<div class="pager" v-else-if="status === 4" @click="trigger"> error</div>
</template>

<style scoped>
.pager {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
  color: green;
  font-size: 24px;
}

</style>