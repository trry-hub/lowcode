<script setup lang="ts">
// core
import Machine from './core/useMachine'
import Render from './core/Render.vue'

// model
import BaseModel from './core/BaseModel'
import UserModel from '../hooks/UserModel'
import UriModel from './model/UriModel'
import TabModel from './model/TabModel'
import FeedModel from './model/FeedModel'

// layer
import LayerHeadVue from './layer/LayerHead.vue'
import LayerTabVue from './layer/LayerTab.vue'
import LayerFeedVue from './layer/LayerFeed.vue'
import LayerFeedNone from './layer/LayerFeedNone.vue'

import { FetchVoteList } from '../hooks/FeedApi'

function sleep (d = 200) {
  return new Promise((s) => setTimeout(s, d || 200))
}

const config = {
  id: 'Page-vote',
  models: [
    {
      key: 'user',
      hook: UserModel,
    },
    {
      key: 'uri',
      hook: UriModel,
    },
    {
      key: 'store',
      hook: BaseModel,
    },
    {
      key: 'tab',
      hook: TabModel
    },
    {
      key: 'feed',
      hook: FeedModel
    }
  ],

  states: [
    {
      key: 'head',
      hook: (ctx: any) => {
        return 'READY'
      }
    },
    {
      key: 'tab',
      value: 'NONE',
      hook: (ctx: any) => {
        return 'READY'
      }
    },
    {
      key: 'feed',
      value: 'NONE',
      hook: (ctx: any) => {
        const current = ctx.model('tab').get('current')
        if (current) {
          return current
        }
        return 'NONE'
      }
    },
  ],

  layers: [
    {
      key: 'LayerHead',
      view: LayerHeadVue,
      data: {
        message: 'layer one',
      }
    },
    {
      key: 'LayerTab',
      view: LayerTabVue,
      data: {
        tabs: (ctx: any) => {
          return ctx.model('tab').get('tabs') || []
        },
        current: (ctx: any) => {
          return ctx.model('tab').get('current') || ''
        }
      }
    },
    {
      key: 'LayerFeed',
      view: LayerFeedVue,
      data: {
        feedParam: (ctx: any) => {
          const current = ctx.model('tab').get('current') || ''
          return {
            type: current
          }
        }
      }
    },
    {
      key: 'LayerFeedOther',
      view: LayerFeedVue,
      data: {
        feedParam: (ctx: any) => {
          const current = ctx.model('tab').get('current') || ''
          return {
            type: current
          }
        }
      }
    },
    {
      key: 'LayerFeedNone',
      view: LayerFeedNone,
      data: {}
    },
  ],

  frames: [
    {
      // frame
      key: 'page-head',
      blocks: [
        {
          state: 'head',
          stateMaps: [
            {
              value: 'READY',
              layer: 'LayerHead',
            }
          ],
        }
      ],
    },
    {
      // frame
      key: 'page-tab',
      blocks: [
        {
          state: 'tab',
          stateMaps: [
            {
              value: 'READY',
              layer: 'LayerTab',
            }
          ],
        }
      ],
    },
    {
      // frame
      key: 'page-feed',
      blocks: [
        {
          state: 'feed',
          stateMaps: [
            {
              value: 'T001',
              layer: 'LayerFeed',
            },
            {
              value: 'T002',
              layer: 'LayerFeed',
            },
            {
              value: 'T003',
              layer: 'LayerFeedOther',
            },
            {
              value: 'NONE',
              layer: 'LayerFeedNone',
            }
          ],
        }
      ],
    },
  ],

  actions: [
    {
      key: 'tab:switch',
      hook: async(ctx: any) => {
        const { id } = ctx.payload
        ctx.model('tab').switch(id)
        // if use cache remove this line
        ctx.model('feed').clear(id)
        ctx.update()
      }
    },
    {
      key: 'feed:load',
      hook: async(ctx: any) => {
        const { type } = ctx.payload.config || {}
        const { pageIndex } = ctx.payload.pager || {}

        const model = ctx.model('feed')
        // fetch feed
        await model.fetch(type, pageIndex);
        // get feed
        const data = model.get(`${type}.feeds.${pageIndex}`)

        return {
          success: data.status === 2,
          list: data.list,
          hasMore: data.hasMore
        }
      }
    }
  ],

  init: [
    {
      key: 'init:tab',
      hook: async (ctx: any) => {
        ctx.model('tab').config({
          // tab list
          tabs: [
            {
              id: 'T001',
              name: 'TAB1'
            },
            {
              id: 'T002',
              name: 'TAB2'
            },
            {
              id: 'T003',
              name: 'TAB3'
            },
          ],
          // tab current
          current: 'T001'
        })
      }
    }, 
    {
      key: 'init:feed',
      hook: async (ctx: any) => {
        const model = ctx.model('feed')

        // config tab T001
        model.config({
          key: 'T001',
          param: {
            id: 1
          },
          hook: FetchVoteList
        });

        // config tab T002
        model.config({
          key: 'T002',
          param: {
            id: 2
          },
          hook: FetchVoteList
        });

        // config tab T003
        model.config({
          key: 'T003',
          param: {
            id: 3
          },
          hook: FetchVoteList
        });

        // prefetch T001 page 0
        model.fetch('T001', 0)
      }
    }
  ]
}

const machine: any = new Machine(config)

</script>

<template>
<Render :machine="machine" />
</template>
