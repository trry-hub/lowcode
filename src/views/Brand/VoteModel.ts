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

  async fetchData() {
    // const res = await axios.get("/api/vote/getVoteInfo");
    const res = {
      code: 0,
      data: {
        title: '这是标题',
        candidateNum: 2,
        totalView: 100,
        startTime: '2020-01-01',
        sortRules: [
          {
            id: 1,
            key: 'default',
            name: '默认',
          },
          {
            id: 2,
            key: 'sentiment',
            name: '人气',
          },
        ],
        works: [
          {
            id: 1,
            title:
              '作品1作品1作品1作品1作品1作品1作品1作品1作品1作品1作品1作品1作品1作品1作品1',
            vote: 10,
            cover: '',
          },
          { id: 2, title: '作品2', vote: 100, cover: '' },
        ],
      },
    }
    const { code, data } = res
    if (code === 0)
      this.set('info', data)
  }

  async addViewCount() {
    try {
      const res = await api.get(URL.addViewCount)
      console.log('%c [ res ]-57', 'font-size:13px; background:pink; color:#bf2c9f;', res)
    }
    catch (error) {
      console.log(error)
    }
  }
}

export default VoteModel
