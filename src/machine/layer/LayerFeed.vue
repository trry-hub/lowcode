
<script setup lang="ts">
import Box from '../element/Box.vue'
import MFeed from '../element/Feed.vue'
import FeedItem from '../../hooks/FeedItem.vue'
import FeedPager from '../../hooks/FeedPager.vue'
const props = defineProps<{
  ctx: any,
  data: any,
}>()

const log = props.ctx.log
log('layer feed')

</script>
<template>
<box color="#ddd">
  {{data.feedParam}}
  <!-- element start: m-feed -->
  <m-feed
    :config="data.feedParam"
    :load-more="(param: any) => ctx.emit('feed:load', param)">
    <template v-slot:placeholder="item" >
      <box h="200" flex="row" align="center">placeholder</box>
    </template>
    <template v-slot:item="item" >
      <component
        :is="FeedItem"
        :data="{ ...item.data, param: data.feedParam }" :pager="item.pager">
      </component>
    </template>
    <template v-slot:pager="pager" >
      <component
        :is="FeedPager"
        :status="pager.status"
        :trigger="pager.trigger"
        :data="pager.data"
      ></component>
    </template>
  </m-feed>
  <!-- element end: m-feed -->
</box>
</template>

<style>
.head{
  background-color: #f7f6f5;
}
</style>