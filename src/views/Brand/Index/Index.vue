<script lang="ts" setup name="BrandPage">
import { useRoute, useRouter } from 'vue-router'
import VoteModel from './VoteModel'
import LayerVote from './LayerVote.vue'
import LayerEmpty from './LayerEmpty.vue'
import Render from '@/machine/core/Render.vue'
import Machine from '@/machine/core/useMachine'

import { Dialog } from 'vant'
import 'vant/es/dialog/style'

import moment from '@/utils/momentjs'

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
        if (ctx.model('vote').get('info').length !== 0) {
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
        info: function(ctx: any) {
          return ctx.model('vote').get('info') || {}
        }
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
      hook: async(ctx: any) => {
        const {
          voteConfigInfo: { voteObject, voteStartTime }
        } = ctx.model('vote').get('info')
        if (moment(new Date()).isBefore(voteStartTime)) {
          await ctx.model('vote').brandingVote(ctx.payload)
        } else {
          ctx.payload.message = `您确定要给该${voteObject === 1 ? '作品' : '选手'}投票吗？一经投票后不可撤回。`
          Dialog.confirm({
            title: '温馨提示',
            message: ctx.payload.message,
            cancelButtonText: '再想想',
            cancelButtonColor: '#969696',
            className: 'custom-dialog'
          }).then(async() => {
            await ctx.model('vote').brandingVote(ctx.payload)
          })
        }
      }
    },
    {
      key: 'vote:jumpDetail',
      hook: async(ctx: any) => {
        await ctx.model('vote').jumpDetail(router, ctx.payload)
      }
    }
  ],
  init: [
    {
      key: 'init:vote',
      hook: async(ctx: any) => {
        ctx.model('vote').set('managePreview', route.query.managePreview === 'true')
        if (route.query.managePreview === 'true') {
          ctx.model('vote').listeningWinodwPost(router)
        } else {
          try {
            if (route.query.isPreview !== 'true') {
              await ctx.model('vote').addViewCount(route)
            }
          } finally {
            await ctx.model('vote').fetchData(route)
          }
          ctx.model('vote').share(route)
        }
      }
    }
  ]
}

const machine = new Machine(config)
</script>

<template>
  <Render :machine="machine" />
</template>
