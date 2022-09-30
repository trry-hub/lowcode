import BaseModel from '@/machine/core/BaseModel'
import api from '@/api'
import URLS from '@/api/URL'
import { Toast } from 'vant'
import 'vant/es/toast/style'

class DetailModel extends BaseModel {
  state() {
    return {
      info: {},
      route: {}
    }
  }

  // 请求详情数据
  async fetchData(route: any) {
    this.set('route', route)
    try {
      const params: {
        materialId: string
      } = {
        materialId: route.params.materialId
      }

      const { data }: {
        code: number,
        data: object
      } = await api.get(URLS.materialDetail, { params })
      this.set('info', data)
    } catch (error: any) {
      Toast(error.message)
    }
  }

  // 点击投票
  async brandingVote(row: { id: string }) {
    try {
      const params = { materialId: row.id } // 素材id
      await api({ method: 'post', url: URLS.brandingVote, params })
      Toast('投票成功')
    } catch (error: any) {
      Toast(error.message)
      console.log('[ error ] >', error)
    }
  }
}

export default DetailModel
