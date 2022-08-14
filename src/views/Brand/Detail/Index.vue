<script lang="ts" setup name="BrandPage">
import {useRoute} from 'vue-router'
import DetailModel from './DetailModel'
import LayerDetail from './LayerDetail.vue'
import Render from '@/machine/core/Render.vue'
import Machine from '@/machine/core/useMachine'

const route = useRoute()
const config = {
  id: 'page-brand-detail',
  // 模型层
  models: [
    {
      key: 'detail',
      hook: DetailModel
    }
  ],
  // 状态层
  states: [
    {
      key: 'detail',
      hook: (ctx: any) => {
        if(ctx.model('detail')) {
          return 'READY'
        }
        return 'NONE'
      }
    },
  ],
  // 图层
  layers: [
    {
      key: 'detail',
      view: LayerDetail,
      data: {
        info: (ctx: any) => {
          console.log('%c [ ctx.model("detail") ]-38', 'font-size:13px; background:pink; color:#bf2c9f;', ctx.model('detail'))
          // return ctx.model('detail').get("info")
          return {}
        }
      }
    },
  ],
  frames: [
    {
      // 投票
      key: 'detail',
      blocks: [
        {
          state: 'detail',
          stateMaps: [
            {
              value: 'READY',
              layer: 'detail'
            }
          ]
        }
      ]
    }
  ],
  init: [
    {
      key: 'init:detail',
      hook: async (ctx: any) => {
        // await ctx.model('detail').fetchData(route)
      }
    },
  ]
}

const machine = new Machine(config)
</script>

<template>
  <Render :machine="machine" />
</template>
