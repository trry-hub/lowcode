<script lang="ts" setup name="BrandPage">
import {useRoute} from 'vue-router'
import VoteModel from './VoteModel'
import LayerSwiper from './LayerSwiper.vue'
import LayerVote from './LayerVote.vue'
import Render from '@/machine/core/Render.vue'
import Machine from '@/machine/core/useMachine'

const route = useRoute()
const config = {
  id: 'page-brand-promotion',
  // 模型层
  models: [
    {
      key: 'vote',
      hook: VoteModel
    }
  ],
  // 状态层
  states: [
    {
      key: 'swiper',
      hook: (ctx: any) => {
        return 'READY'
      }
    },
    {
      key: 'vote',
      hook: (ctx: any) => {
        return 'READY'
      }
    }
  ],
  // 图层
  layers: [
    {
      key: 'swiper',
      view: LayerSwiper,
      data: {
        option: (ctx: any) => {
          return {
            imgShowType: ctx.model('vote').get("info").imgShowType,
            imgUrls: ctx.model('vote').get("info").imgUrls
          }
        },
        list: (ctx: any) => {
          return ctx.model('vote').get('list') || []
        }
      }
    },
    {
      key: 'vote',
      view: LayerVote,
      data: {
        info: (ctx: any) => {
          return ctx.model('vote').get('info') || {}
        }
      }
    }
  ],
  frames: [
    {
      // 轮播图
      key: 'swiper',
      blocks: [
        {
          state: 'swiper',
          stateMaps: [
            {
              value: 'READY',
              layer: 'swiper'
            }
          ]
        }
      ]
    },
    {
      // 投票
      key: 'vote',
      blocks: [
        {
          state: 'vote',
          stateMaps: [
            {
              value: 'READY',
              layer: 'vote'
            }
          ]
        }
      ]
    }
  ],
  actions: [
    {
      key: 'vote:brandingVote',
      hook: async (ctx: any) => {
        console.log('%c [ ctx ]-108', 'font-size:13px; background:pink; color:#bf2c9f;', ctx)
        await ctx.model('vote').brandingVote(ctx.payload)
      }
    }
  ],
  init: [
    {
      key: 'init:swiper',
      hook: async (ctx: any) => {
        ctx.model('vote').config({
          list: [
            { id: 1, url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
            { id: 2, url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
            { id: 3, url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
            { id: 4, url: 'https://img.yzcdn.cn/vant/cat.jpeg' }
          ]
        })
      }
    },
    {
      key: 'init:vote',
      hook: async (ctx: any) => {
        await ctx.model('vote').fetchData(route)
      }
    },
  ]
}

const machine = new Machine(config)
</script>

<template>
  <Render :machine="machine" />
</template>
