import BaseModel from '@/machine/core/BaseModel'
import api from '@/api'
import URLS from '@/api/URL'

import { Toast } from 'vant'
import 'vant/es/toast/style'
import { initWxSDK } from '@/utils/index'

class VoteModel extends BaseModel {
  state() {
    return {
      info: {
        brandingTitle: '',
        imgShowType: 1,
        imgUrls: '[]',
        brandingStatisticInfo: {
          materialCount: '',
          voteCount: 0,
          viewCount: 0
        },
        voteConfigInfo: {
          voteRule: '',
          ruleParams: '',
          voteObject: '',
          voteStartTime: '',
          voteEndTime: ''
        },
        brandingMaterialInfos: []
      },
      route: {},
      managePreview: false,
      error: false
    }
  }

  // 监听预览参数
  listeningWinodwPost() {
    window.addEventListener('message', e => {
      if (e) {
        const { data } = e
        this.set('info', {
          ...data,
          brandingTitle: data.brandingTitle,
          imgShowType: data.imgShowType,
          imgUrls: data.imgUrls,
          brandingStatisticInfo: {
            materialCount: 0,
            voteCount: 0,
            viewCount: 0
          },
          voteConfigInfo: data.voteConfigInfo,
          brandingMaterialInfos: data.brandingMaterialInfos.map((item: {materialId: string, id: string}) => {
            item.materialId = item.id
            return item
          }) || []
        })
      }
    })
  }

  // 请求详情数据
  async fetchData(route: any) {
    if (this.get('managePreview')) return
    try {
      this.set('route', route)
      const params: {
        brandingId: string,
        accessFromType: number | string,
        isPreview: boolean
      } = {
        brandingId: route.params.brandingId,
        accessFromType: route.query.accessFromType || 3,
        isPreview: route.query.isPreview || false
      }
      const { data }: {
        code: number,
        data: { brandingTitle: string }
      } = await api.get(URLS.brandingDetail, { params })
      this.set('info', data)
    } catch (error: any) {
      if (error.code === 1105 || error.code === 1107) {
        this.set('error', true)
      } else {
        Toast(error.message)
      }
    }
  }

  // 增加推送的外部链接访问次数
  async addViewCount(route:any) {
    try {
      const params = {
        brandingId: route.params.brandingId,
        accessFromType: route.query.accessFromType || 3 // 访问渠道： 1 banner 2 学术交流圈 3 站外分享链接
      }
      return await api({ method: 'post', url: URLS.addViewCount, params })
    } catch (error: any) {
      console.log(error)
      Toast(error.message)
    }
  }

  // 点击投票
  async brandingVote(row: { id: string, message: string }) {
    if (this.get('managePreview')) return
    try {
      const params = {
        materialId: row.id // 素材id
      }
      await api({ method: 'post', url: URLS.brandingVote, params })
      Toast('投票成功')
      this.fetchData(this.get('route'))
    } catch (error: any) {
      Toast(error.message)
      console.log('[ error ] >', error)
    }
  }

  // 跳转详情
  jumpDetail(router: any, row: { id: string }) {
    if (this.get('managePreview')) return
    router.push({
      name: 'BrandingDetail',
      params: {
        materialId: row.id
      }
    })
  }

  // 分享活动
  share() {
    if (this.get('managePreview')) return
    // 'updateAppMessageShareData', 'updateTimelineShareData'
    const jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
    initWxSDK({ jsApiList, debug: false }).then((wx: any) => {
      wx.checkJsApi({
        jsApiList, // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
        success: (res: any) => {
          // 以键值对的形式返回，可用的 api 值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          for (const key in res.checkResult) {
            if (res.checkResult[key]) {
              const info = this.get('info')
              wx[key]({
                title: info.brandingTitle, // 分享标题
                desc: info.intro, // 分享描述
                imgUrl: info.coverUrl,
                link: decodeURIComponent(window.location.origin + window.location.pathname + '?accessFromType=3'), // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
                success: () => {
                  this.addForwardRecord(info.brandingId)
                }
              })
            }
          }
        }
      })
    }).catch(error => {
      console.log('%c [ error ]-133', 'font-size:14px; background:pink; color:#bf2c9f;', error)
    })
  }

  // 记录分享次数
  async addForwardRecord(brandingId: string) {
    if (this.get('managePreview')) return
    try {
      const params = { brandingId }
      await api({
        method: 'post',
        url: URLS.addForwardRecord,
        params
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default VoteModel
