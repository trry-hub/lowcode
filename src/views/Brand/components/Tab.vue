<script setup lang="ts">
import { watchEffect, ref } from "vue";

const emit = defineEmits(["switch"]);

const props = defineProps<{
  tabs: any;
  current: string;
}>();

const tabs = ref(props.tabs || []);
const current = ref(props.current || "");
watchEffect(() => {
  tabs.value = props.tabs || [];
  current.value = props.current || "";
});
</script>
<template>
  <div class="n-tab" v-for="tab in tabs" @click="() => emit('switch', tab)">
    <div v-if="tab.id === current" class="tab-item tab-item-cur">
      {{ tab.name }}
    </div>
    <div v-else class="tab-item">
      {{ tab.name }}
    </div>
  </div>
</template>

<style scoped>
.tab {
  height: 60px;
  background-color: #f09;
}

.tab-item {
  background-color: #fff;
  margin-top: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  margin-left: 1px;
}
.tab-item-cur {
  color: #f09;
  font-weight: bold;
}
</style>
