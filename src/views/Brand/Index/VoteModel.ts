import BaseModel from '@/machine/core/BaseModel'
import api from '@/api'
import URL from '@/api/url'

import { Toast } from 'vant'
import 'vant/es/toast/style'
import { Dialog } from 'vant'
import 'vant/es/dialog/style'

class VoteModel extends BaseModel {
    state() {
        return {
            info: {},
            route: {}
        }
    }

    // 请求详情数据
    async fetchData(route: any) {
      this.set('route', route)
      let params: {
        brandingId: string,
        accessFromType: number | string
      } = {
        brandingId: route.params.brandingId,
        accessFromType: route.query.accessFromType || 1
      }
      // const { code, data }: {
      //   code: number,
      //   data: object
      // } = await api.get(URL.brandingDetail, { params });
      const code = 0, data={
        id: '',
        brandingTitle: 'test',
        brandingStatisticInfo: {
          materialCount: 0,
          voteCount: 1,
          viewCount: 100,
        },
        voteConfigInfo: {
          voteObject: 1,
          voteStartTime: '2022-03-06',
          ruleParams: '0,1'
        },
        brandingMaterialInfos: [
          {
            voteCount: 10,
            materialName: '名字',
            id: '123',
            imageUrl: ''
          }
        ]
      }
      if (code === 0)
      this.set('info', data)
      return data
    }

    // 增加推送的外部链接访问次数
    async addViewCount() {
      try {
        const params = {
          pushId: '',
          accessFromType: '' // 访问渠道： 1 banner 2 学术交流圈 3 站外分享链接
        }
        const res = await api.post(URL.addViewCount, params)
        console.log('%c [ res ]-57', 'font-size:13px; background:pink; color:#bf2c9f;', res)
      }
      catch (error) {
        console.log(error)
      }
    }

    // 点击投票
    brandingVote(row: { id: string,message:string }) {
      Dialog.confirm({
        title: '温馨提示',
        message: row.message,
        cancelButtonText: '再想想',
        cancelButtonColor: '#969696',
      }).then(async res => {
        try {
          const params = {
            materialId: row.id // 素材id
          }
          const { data } = await api.post(URL.brandingVote, params)
          console.log('%c [ data ]-70', 'font-size:13px; background:pink; color:#bf2c9f;', data)
          Toast('投票成功')
        } catch (error: any) {
          Toast(error.message)
          console.log('[ error ] >', error)
        }
      })
    }

    // 跳转详情
    jumpDetail(router: any, row: { id: string }) {
      console.log('%c [ row ]-81', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      router.push({
        name: 'BrandingDetail',
        params: {
          materialId: row.id
        }
      })
    }
}

export default VoteModel
