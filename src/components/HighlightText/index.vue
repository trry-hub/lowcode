<script setup lang="ts" name="HighlightText">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  styleStr: string,
  sourceText: string,
  activeText: string
}>(), {
  styleStr: '',
  sourceText: '',
  activeText: ''
})
const formatText = computed(() => {
  const { sourceText, activeText, styleStr } = props
  return sourceText.replace(activeText, `<span style="${styleStr}">${activeText}</span>`)
})
</script>

<template>
  <span v-dompurify="formatText" />
</template>
