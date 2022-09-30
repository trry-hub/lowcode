<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import moment from '@/utils/momentjs'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Toast } from 'vant'
import 'vant/es/toast/style'

import { linkToUrl, getAssetsFile } from '@/utils'
import useSettingsStore from '@/store/modules/settings'

interface BrandingMaterialInfo {
  id: string,
  voteCount: number,
  isVote: boolean,
  isCanVote: boolean,
  imageUrl: string,
  materialName: string,
  materialIntro: string,
  materialUrl: string,
  orderIndex: number
}
interface Vote{
  brandingTitle: string,
  imgUrls: string,
  imgShowType: number,
  voteConfigInfo: {
    title: string,
    voteEndTime: string,
    voteStartTime: string,
    voteObject: number,
    voteRule: number,
    ruleParams:string
  },
  brandingStatisticInfo: {
    materialCount: string,
    voteObject: string,
    viewCount: number,
    voteCount: number,
  },
  brandingMaterialInfos: BrandingMaterialInfo[]
}

const props = defineProps<{
  ctx: { emit: (a: string, b: object) => void }
  data: { info: Vote }
}>()

const vote = computed<Vote>(() => props.data.info)

onMounted(() => {
  const settingsStore = useSettingsStore()
  settingsStore.setTitle(vote.value.brandingTitle)
})
// 轮播数据
interface ImgUrls {
  id: string,
  url: string,
  jumpUrl: string
}
const imgList = computed<ImgUrls[]>(() => {
  return JSON.parse(props.data.info.imgUrls || '[]') || []
})

const keyword = ref('')
const sort = ref('default')
const sortRules = ref([
  {
    label: '默认',
    value: 'default'
  },
  {
    label: '人气',
    value: 'sentiment'
  }
])

const fromNow = (): string => {
  const { voteEndTime, voteStartTime } = vote.value.voteConfigInfo
  if (!voteEndTime || !voteStartTime) {
    return ''
  }
  const endYearsStr = voteEndTime.split('-')[0]
  const startYearsStr = voteStartTime.split('-')[0]
  let dateStr = '', suffix = ''
  if (startYearsStr !== endYearsStr) {
    dateStr = `${moment(voteStartTime).format('YYYY.MM.DD')} - ${moment(voteEndTime).format('MM.DD')}`
  } else {
    dateStr = `${moment(voteStartTime).format('YYYY.MM.DD')} - ${moment(voteEndTime).format('MM.DD')}`
  }
  if (moment(new Date()).isBefore(voteStartTime)) {
    suffix = '未开始'
  } else if (moment(new Date()).isAfter(voteStartTime) && moment(new Date()).isBefore(voteEndTime)) {
    var a = moment(new Date())
    var b = moment(voteEndTime)
    const dayNum = b.diff(a, 'days')

    if (dayNum > 0) {
      suffix = dayNum + '天后截止'
    } else if (dayNum === 0) {
      const secondsNum = b.diff(a, 'seconds')

      let time = moment.duration(secondsNum, 'seconds')  // 得到一个对象，里面有对应的时分秒等时间对象值
      let hours = time.hours()
      let minutes = time.minutes()
      let seconds = time.seconds()
      suffix = moment({ h: hours, m: minutes, s: seconds }).format('H:m:s') + '后截止'
    }

  } else if (moment(new Date()).isAfter(voteEndTime)) {
    suffix = '已截止'
  }
  return dateStr + ' ' + suffix
}
// 投票结束
const voteEnd = computed<boolean>(() => {
  const flag = moment(new Date()).isAfter(vote.value.voteConfigInfo?.voteEndTime)
  if (flag) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    sort.value = 'sentiment'
  }
  return flag
})

// 素材数据
const showWorks = computed<BrandingMaterialInfo[]>(() => {
  const works = vote.value.brandingMaterialInfos || []
  if (sort.value !== 'default') {
    works.sort((a: BrandingMaterialInfo, b: BrandingMaterialInfo) => {
      return b.voteCount - a.voteCount
    })
  } else {
    works.sort((a: BrandingMaterialInfo, b: BrandingMaterialInfo) => {
      return a.orderIndex - b.orderIndex
    })
  }

  return works.filter((item: BrandingMaterialInfo) => {
    return item.materialName.includes(keyword.value)
  })
})

// 前三名投票数
const voteCountArr = computed<number[]>(() => {
  if (voteEnd.value) {
    // 添加排名
    return Array.from(new Set(
      showWorks.value.map((item: BrandingMaterialInfo) => {
        return item.voteCount
      }).sort((a: number, b: number) => {
        return b - a
      })
    )).splice(0, 3)
  }
  return []
})

// 广告跳转
const jumpPage = (url: string) => {
  linkToUrl(url, '_self')
}

// 跳转作品详情
const onJumpDetail = (row: BrandingMaterialInfo) => {
  if (!row.materialUrl) {
    vote.value.voteConfigInfo.voteObject === 1 ? props.ctx.emit('vote:jumpDetail', row) : Toast('暂无作品')
  } else {
    jumpPage(row.materialUrl)
  }
}

</script>

<template>
  <div class="vote">
    <Swiper
      v-if="vote.imgShowType === 1" :loop="true" :autoplay="true" :modules="[Pagination, Navigation]"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide v-for="item in imgList" :key="item.id" @click="jumpPage(item.jumpUrl)">
        <img :src="item.url" alt="">
      </SwiperSlide>
    </Swiper>
    <div v-else class="img-list">
      <img v-for="item in imgList" :key="item.id" :src="item.url" alt="" @click="jumpPage(item.jumpUrl)">
    </div>

    <div class="header">
      <svg-icon name="vote-icon" /> <span>{{ vote.voteConfigInfo.title }}</span>
    </div>

    <div class="overview">
      <div class="overview-item">
        <div class="count">
          {{ vote.brandingStatisticInfo?.materialCount || 0 }}
        </div>
        <div class="name">投票{{ vote.voteConfigInfo?.voteObject === 1 ? "作品" : "选手" }}</div>
      </div>
      <div class="overview-item">
        <div class="count">
          {{ vote.brandingStatisticInfo?.voteCount }}
        </div>
        <div class="name">总票数</div>
      </div>
      <div class="overview-item">
        <div class="count">
          {{ vote.brandingStatisticInfo?.viewCount }}
        </div>
        <div class="name">总访问量</div>
      </div>
    </div>

    <div class="tips">
      <template v-if="!voteEnd">
        <div class="item">投票时间：{{ fromNow() }}</div>
        <div class="item">
          <span v-if="vote.voteConfigInfo.voteRule === 1">单个用户可以投票{{ vote.voteConfigInfo.ruleParams }}次，每个{{
            vote.voteConfigInfo.voteObject === 1 ? '作品' : '选手'
          }}每天只可投票一次。</span>
          <span v-else>单个用户每{{ vote.voteConfigInfo.ruleParams.split(',')[0]
          }}天可以投票{{ vote.voteConfigInfo.ruleParams.split(',')[1] }}次，每个{{ vote.voteConfigInfo.voteObject === 1 ? '作品'
            :
            '选手'

          }}每天只可投票一次。</span>
        </div>
      </template>
      <template v-else>
        <div class="item">本次投票已结束</div>
      </template>
    </div>

    <div class="search">
      <div class="search-box">
        <div class="input">
          <svg-icon class="search-icon" name="search" />
          <input v-model="keyword" type="text" placeholder="搜索作品或选手名称">
        </div>
      </div>
    </div>

    <div class="vote-main">
      <div class="title">
        <div class="left">
          <span>投票区</span>
        </div>
        <van-tabs v-model:active="sort" class="tab">
          <van-tab v-for="item in sortRules" :key="item.value" :name="item.value" :title="item.label" />
        </van-tabs>
      </div>
      <van-empty v-if="showWorks.length === 0" description="暂无数据" />
      <div v-else class="content">
        <div v-for="item in showWorks" :key="item.id" class="card">
          <div class="img" @click="onJumpDetail(item)">
            <img
              v-if="voteCountArr?.includes(item.voteCount)" class="vote-ranking-icon"
              :src="getAssetsFile(`images/ranking-${voteCountArr.indexOf(item.voteCount) + 1}.png`)" alt=""
            >
            <img class="cover-img" :src="item.imageUrl" alt="">
            <div class="count">{{ item?.voteCount }}票</div>
          </div>
          <div class="info">
            <template v-if="vote.voteConfigInfo?.voteObject === 1">
              <!-- 作品 -->
              <div class="material-intro">
                <HighlightText
                  style-str="background-color: #ffef8f;" :active-text="keyword"
                  :source-text="item.materialName"
                />
              </div>
            </template>
            <template v-else>
              <div class="title">
                <!-- 选手 -->
                <HighlightText
                  style-str="background-color: #ffef8f" :active-text="keyword"
                  :source-text="item.materialName"
                />
              </div>
              <div class="material-intro">
                <HighlightText
                  style-str="background-color: #ffef8f" :active-text="keyword"
                  :source-text="item.materialIntro"
                />
              </div>
            </template>
          </div>

          <div class="action">
            <van-button class="btn detail-btn" color="#e6ecfa" size="small" @click="onJumpDetail(item)">
              {{ voteEnd ? '查看' : '' }}详情
            </van-button>
            <van-button
              v-if="!voteEnd" class="btn" size="small" type="primary"
              :disabled="voteEnd ? true : item?.isCanVote ? false : item.isVote ? true : false"
              @click="ctx.emit('vote:brandingVote', item)"
            >
              {{ item?.isCanVote ? '投票' : item.isVote ? '已投票' : '投票' }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vote {
  overflow: hidden;
  .swiper {
    height: 200px;
    background-color: #e6e6e6;
  }
  .img-list {
    width: 100%;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
  }
  .header {
    width: 60%;
    margin: 24px auto;
    text-align: center;
    font-size: 16px;
    i {
      margin-right: 5px;
      color: #3d61e3;
    }
    .svg-icon {
      fill: #3d61e3;
    }
  }
  .overview {
    display: flex;
    padding: 10px 30px;
    justify-content: space-between;
    gap: 5px;
    overflow: hidden;
    &-item {
      flex: 1;
      text-align: center;
      overflow: hidden;
      .count {
        font-size: 18px;
        color: #080922;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .name {
        font-size: 12px;
        color: #969696;
        margin-top: 5px;
        font-weight: 400;
      }
    }
  }
  .tips {
    margin: 15px;
    background-color: #fbfbfb;
    text-align: center;
    font-size: 12px;
    padding: 9px 5px;
    color: #969696;
    box-sizing: border-box;
    .item {
      line-height: 18px;
    }
  }
  .search {
    padding: 1px 0;
    background-color: #eee;
    height: 46px;
    &-box {
      height: 100%;
      background-color: #fff;
    }
    .input {
      display: flex;
      position: relative;
      .search-icon {
        position: absolute;
        top: 50%;
        left: 25px;
        font-size: 20px;
        text-align: center;
        color: #c1c5c9;
        transform: translateY(-50%);
      }
      input {
        flex: 1;
        height: 30px;
        margin: 8px 15px;
        border-radius: 15px;
        background-color: #f5f5f5;
        padding: 0 10px;
        font-size: 14px;
        border: none;
        outline: none;
        padding-left: 35px;
      }
      i {
        position: absolute;
        top: 10px;
        left: 15px;
        color: #969696;
      }
    }
  }
  .vote-main {
    >.title {
      display: flex;
      padding: 0 15px;
      height: 50px;
      line-height: 50px;
      justify-content: space-between;
      font-size: 14px;
      .left {
        font-weight: 600;
      }
      :deep(.tab) {
        width: 80px;
        &.van-tab--active {
          color: #3d61e3;
          border-bottom: 2px solid #3d61e3;
        }
      }
    }
    .content {
      background-color: #f0f0f0;
      padding: 14px;
      justify-content: space-between;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      .card {
        padding-bottom: 6px;
        background-color: #fff;
        border-radius: 4px;
        overflow: hidden;
        &:nth-child(odd) {
          margin-left: 0;
        }
      }
      .img {
        height: 170px;
        background-color: #dfdfdf;
        position: relative;
        .cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .vote-ranking-icon {
          position: absolute;
          width: 24px;
          height: 30px;
          right: 10px;
          top: 10px;
        }
        .count {
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          color: #fff;
          font-size: 14px;
          width: 100%;
          line-height: 30px;
          background: linear-gradient(to top, rgb(0 0 0 / 50%), rgb(0 0 0 / 0%));
          text-align: right;
          padding-right: 10px;
        }
      }
      .info {
        font-size: 14px;
        line-height: 18px;
        margin: 5px 7px;
        border-radius: 2px;
        color: #5d5d5d;
        font-weight: 300;
      }
      .title {
        /* stylelint-disable-next-line value-no-vendor-prefix */
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        color: #303030;
        font-weight: 500;
        margin-bottom: 6px;
      }
      .material-intro {
        height: 35px;
        /* stylelint-disable-next-line value-no-vendor-prefix */
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        margin: 10px 5px;
        color: #424244;
        font-weight: 400;
      }
      .action {
        display: flex;
        padding: 0 5px;
        box-sizing: border-box;
        gap: 5px;
        :deep(.btn) {
          flex: 1;
          height: 26px;
          border-radius: 3px;
          text-align: center;
          font-weight: 600;
          line-height: 26px;
          font-size: 14px;
          border: none;
          &.detail-btn {
            color: #3d61e3 !important;
          }
          &.van-button--disabled {
            color: #c7c6cb !important;
            background-color: #f4f3f5;
          }
        }
      }
    }
  }
}
</style>
