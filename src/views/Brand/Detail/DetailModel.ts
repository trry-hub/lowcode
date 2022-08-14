import BaseModel from '@/machine/core/BaseModel'
import api from '@/api'
import URL from '@/api/url'
import { Toast } from 'vant'
import 'vant/es/toast/style';

class DetailModel extends BaseModel {
  state() {
    return {
      info: {},
      route: {},
    }
  }

  // 请求详情数据
  async fetchData(route: any) {
    this.set('route', route)
    try {
      let params: {
        materialId: string
      } = {
        materialId: route.params.materialId,
      }

      const { code, data }: {
        code: number,
        data: object
      } = await api.get(URL.materialDetail, { params });
      this.set('info', data)
    } catch (error: any) {
      console.log('%c [ error ]-31', 'font-size:13px; background:pink; color:#bf2c9f;', error)
      Toast(error.message)
    }
  }
}

export default DetailModel
