import BaseModel from '@/machine/core/BaseModel'
import api from '@/api'
import URL from '@/api/url'

class VoteModel extends BaseModel {
  state() {
    return {
      info: {},
    }
  }

  config(opt: any) {
    const { info } = opt
    if (info)
      this.set('info', info)
  }

  // 请求详情数据
  async fetchData(route: any) {
    let params: {
      brandingId: string,
      accessFromType: number | string
    } = {
      brandingId: route.params.brandingId,
      accessFromType: route.query.accessFromType || 1
    }
    const { code, data } :{
      code: number,
      data: object
    } = await api.get(URL.brandingDetail, {params});
    if (code === 0)
      this.set('info', data)
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
  async brandingVote(row: {id: string}) {
    try {
      const params = {
        materialId: row.id // 素材id
      }
      await api.post(URL.brandingVote, params)
    } catch (error) {
      console.log('[ error ] >', error)
    }
  }
}

export default VoteModel
