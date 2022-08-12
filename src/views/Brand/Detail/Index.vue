<script lang="ts" setup name="BrandPage">
import {useRoute} from 'vue-router'
import DetailModel from './DetailModel'
import LayerDetail from './LayerDetail.vue'
import Render from '@/machine/core/Render.vue'
import Machine from '@/machine/core/useMachine'

const route = useRoute()
const config = {
  id: 'page-brand-promotion',
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
        return 'READY'
      }
    },
  ],
  // 图层
  layers: [
    {
      key: 'detail',
      view: LayerDetail,
      data: {
        option: (ctx: any) => {
          return {
            imgShowType: ctx.model('detail').get("info").imgShowType,
            imgUrls: ctx.model('detail').get("info").imgUrls
          }
        },
        list: (ctx: any) => {
          return ctx.model('detail').get('list') || []
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
      key: 'init:feachData',
      hook: async (ctx: any) => {
        ctx.model('detail').config({
          list: [
            { id: 1, url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
            { id: 2, url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
            { id: 3, url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
            { id: 4, url: 'https://img.yzcdn.cn/vant/cat.jpeg' }
          ]
        })
      }
    },
  ]
}

const machine = new Machine(config)
</script>

<template>
  <Render :machine="machine" />
</template>
