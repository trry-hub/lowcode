
import wx from 'weixin-js-sdk';
import api from '@/api/index'
import URL from '@/api/URL'

// 删除url中参数
export function delUrlParam(param: string): string {
  let obj = new window.URL(window.location.href)
  obj.searchParams.delete(param)
  return obj.href
}

// 初始化微信sdk
export function initWxSDK(configSDK: any, paramsAPI?: { uType?: string, url: string }) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: { appId = '', timestamp = '', nonceStr = '', signature = '' } } = await api.get(URL.WX_CONFIG, {
        params: {
          uType: 'DOCTOR',
          url: decodeURIComponent(window.location.href),
          ...paramsAPI
        }
      })
      wx.config({
        debug: import.meta.env.MODE === 'development', // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature,// 必填，签名
        jsApiList: [], // 必填，需要使用的 JS 接口列表
        ...configSDK
      });
      wx.ready(() => { resolve(wx) })
      wx.error(reject);
    } catch (error) {
      reject(error)
    }
  })
}
