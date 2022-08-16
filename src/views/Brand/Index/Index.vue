<script lang="ts" setup name="BrandPage">
import { useRoute, useRouter } from 'vue-router'
import VoteModel from './VoteModel'
import LayerVote from './LayerVote.vue'
import LayerEmpty from './LayerEmpty.vue'
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
      key: 'vote',
      hook: (ctx: any) => {
        if (ctx.model('vote').get('error')) {
          return 'ERROR'
        }
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
      key: 'vote',
      view: LayerVote,
      data: {
        info: function (ctx: any) {
          return ctx.model('vote').get('info') || {}
        },
      }
    },
    {
      key: 'empty',
      view: LayerEmpty,
      data: {}
    }
  ],
  frames: [
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
            },
            {
              value: 'ERROR',
              layer: 'empty'
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
      key: 'init:vote',
      hook: async (ctx: any) => {
        await ctx.model('vote').fetchData(route)
        // ctx.model('vote').share(route)
      }
    },
  ]
}

const machine = new Machine(config)
</script>

<template>
  <Render :machine="machine" />
</template>
