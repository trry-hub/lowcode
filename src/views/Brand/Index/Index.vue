<script lang="ts" setup name="BrandPage">
import { useRoute, useRouter } from 'vue-router'
import VoteModel from './VoteModel'
import LayerSwiper from './LayerSwiper.vue'
import LayerVote from './LayerVote.vue'
import Render from '@/machine/core/Render.vue'
import Machine from '@/machine/core/useMachine'

const route = useRoute()
const router = useRouter()
const config = {
  id: 'page-brand-vote',
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
        return 'NONE'
      }
    },
    {
      key: 'vote',
      hook: (ctx: any) => {
        if (ctx.model('vote').get('info')) {
          return 'READY'
        }
        return 'NONE'
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
            // imgShowType: ctx.model('vote').get('info').imgShowType,
            // imgUrls: ctx.model('vote').get('info').imgUrls
          }
        },
        list: (ctx: any) => {
          // return ctx.model('vote').get('list') || []
          return []
        }
      }
    },
    {
      key: 'vote',
      view: LayerVote,
      data: {
        info: function(ctx: any) {
          console.log('%c [ ctx ]-62', 'font-size:13px; background:pink; color:#bf2c9f;', ctx.model('vote'))
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
        const {
          voteConfigInfo: { voteObject }
        } = ctx.model('vote').get('info')
        ctx.payload.message = `您确定要给该作品${voteObject === 1 ? '作品' : '人'}吗？一经投票后不可撤回。`
        await ctx.model('vote').brandingVote(ctx.payload)
      }
    },
    {
      key: 'vote:jumpDetail',
      hook: async (ctx: any) => {
        await ctx.model('vote').jumpDetail(router, ctx.payload)
      }
    }
  ],
  init: [
    {
      key: 'init:swiper',
      hook: async (ctx: any) => {}
    },
    {
      key: 'init:vote',
      hook: async (ctx: any) => {
        await ctx.model('vote').fetchData(route)
      }
    }
  ]
}

const machine = new Machine(config)
</script>

<template>
  <Render :machine="machine" />
</template>
