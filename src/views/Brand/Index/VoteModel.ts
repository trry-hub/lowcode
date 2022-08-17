import BaseModel from '@/machine/core/BaseModel'
import api from '@/api'
import URL from '@/api/url'

import { Toast } from 'vant'
import 'vant/es/toast/style'
import { Dialog } from 'vant'
import 'vant/es/dialog/style'
import { initWxSDK } from '@/utils/index'

interface Error {
  message: string,
  code: number
}

class VoteModel extends BaseModel {
  state() {
    return {
      info: {},
      route: {}
    }
  }

  // 请求详情数据
  async fetchData(route: any) {
    try {
      this.set('route', route)
      let params: {
        brandingId: string,
        accessFromType: number | string
      } = {
        brandingId: route.params.brandingId,
        accessFromType: route.query.accessFromType || 1
      }
      const { code, data }: {
        code: number,
        data: object
      } = await api.get(URL.brandingDetail, { params });
      this.set('info', data)
    } catch (error: any) {
      if (error.code === 1105) {
        this.set('error', true)
      } else {
        Toast(error.message)
      }
    }
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
  brandingVote(row: { id: string, message: string }) {
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
        await api({ method: 'post', url: URL.brandingVote, params })
        Toast('投票成功')
      } catch (error: any) {
        Toast(error.message)
        console.log('[ error ] >', error)
      }
    })
  }

  // 跳转详情
  jumpDetail(router: any, row: { id: string }) {
    router.push({
      name: 'BrandingDetail',
      params: {
        materialId: row.id
      }
    })
  }

  // 分享活动
  share(route: any) {
    const jsApiList = ['updateAppMessageShareData', 'onMenuShareWeibo', 'onMenuShareQQ', 'updateTimelineShareData']
    initWxSDK({ jsApiList }, { url: decodeURIComponent('https://kshdoctor-dev3.yaomaitong.net/index') }).then((wx: any) => {
      wx.checkJsApi({
        jsApiList, // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
        success: function (res: any) {
          // 以键值对的形式返回，可用的 api 值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          for (let key in res.checkResult) {
            if (res.checkResult[key] === false) {
              Toast('请先授权')
              return
            } else {
              const { info } = this.state
              wx[res.checkResult[key]]({
                title: info.brandingTitle, // 分享标题
                desc: info.intro, // 分享描述
                link: decodeURIComponent(window.__wxjs_is_wkwebview ? window.wxShareLink : url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
                success: (res: any) => {
                  this.addForwardRecord(route.params.brandingId)
                }
              })
            }
          }
        }
      });
    })
  }

  // 记录分享次数
  async addForwardRecord(brandingId: string = '') {
    try {
      const params = {
        brandingId
      }
      const res = await api.post(URL.addForwardRecord, params)
      console.log(res)

    } catch (error) {
      console.log(error)
    }
  }
}

export default VoteModel
