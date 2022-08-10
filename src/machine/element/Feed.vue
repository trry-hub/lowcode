
<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps<{
  config?: any
  loadMore: any
}>()

const initGroup: any = [
  {
    status: 0, // 0 wait 1 loading 2 ok 3 empty 4 error
    list: [],
    pager: {
      pageIndex: 0
    }
  }
]

const groups = ref(initGroup)

function updateGroup(index: any, data: any) {
  const { status, list } = data || {}
  const group = groups.value[index]
  if (group) {
    group.status = status
  }
  if (list) {
    group.list = list;
  }
}

async function loadMore(pager: any) {
  const hook = props.loadMore
  if (hook) {
    const { pageIndex } = pager;
    updateGroup(pageIndex, { status: 1 })
    const res = await hook({ pager: { ...pager }, config: props.config }) || {}
    const { success, list = [], hasMore } = res;
    if (success) {
      // set ok
      updateGroup(pageIndex, { status: 2, list: list })

      if (hasMore) {
        groups.value.push({
          status: 0,
          list: [],
          pager: {
            pageIndex: pageIndex + 1
          }
        })
      } else {
        updateGroup(pageIndex, { status: 3 })
      }
    } else {
      updateGroup(pageIndex, { status: 4 })
    }
  }
}

loadMore(groups.value[0].pager)

</script>
<template>
<div class="n-feed">
  <template v-for="group in groups">
    <template v-if="groups.length === 1 && (group.status !== 2)" class="n-feed-list">
      <slot name="placeholder" :status="group.status" :pager="group.pager"></slot>
    </template>
    <div class="n-feed-list">
      <slot name="item" class="n-feed-item" :data="item" :pager="group.pager" v-if="group.list" v-for="item in group.list">
        <div>{{item}}</div>
      </slot>
    </div>
    <div v-if="group.status !== 2" class="n-feed-pager">
      <slot name="pager" :status="group.status" :data="group.pager" :trigger="() => loadMore(group.pager)">
        <div v-if="group.status === 0" @click="() => loadMore(group.pager)">wait</div>
        <div v-else-if="group.status === 1">loading</div>
        <div v-else-if="group.status === 3">empty</div>
        <div v-else-if="group.status === 4">error</div>
      </slot>
    </div>
  </template>
</div>
</template>

<style scoped>

</style>
