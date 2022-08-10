<script lang="ts" setup>
import { computed, ref } from 'vue'
import momentjs from '@/utils/momentjs'
const props = defineProps<{
  vote: any
}>()

momentjs.locale('zh-cn')

const keyword = ref('')
const sort = ref('default')

const formatTime = (time: string) => {
  return momentjs(time).format('YYYY-MM-DD HH:mm:ss')
}
const fromNow = (): string => {
  return momentjs(props.vote.endTime).to(props.vote.startTime)
}
const isActive = (content: string) => {
  if (!keyword.value.trim()) return false
  return content.includes(keyword.value)
}
const changeSort = (key: string) => {
  sort.value = key
}

const total = computed(() => {
  return props.vote.works?.reduce((total: number, item: any) => {
    return total + item.vote
  }, 0)
})

const showWorks = computed(() => {
  const works = props.vote.works ? [...props.vote.works] : []
  if (sort.value === 'default') return works
  works.sort((a, b) => {
    return b.vote - a.vote
  })
  return works
})
</script>

<template>
  <div class="vote">
    <div class="header">
      <i class="font_family icon-password" />
      <span>{{ vote.title }}</span>
    </div>

    <div class="overview">
      <div class="overview-item">
        <div class="count">
          {{ vote.candidateNum }}
        </div>
        <div class="name">参赛选手</div>
      </div>
      <div class="overview-item">
        <div class="count">
          {{ total }}
        </div>
        <div class="name">总票数</div>
      </div>
      <div class="overview-item">
        <div class="count">
          {{ vote.totalView }}
        </div>
        <div class="name">总访问量</div>
      </div>
    </div>

    <div class="tips">
      <div class="item">投票时间：{{ formatTime(vote.startTime) }} {{ fromNow() }}截止</div>
      <div class="item">每个用户单日仅能投2票，可投同一作品</div>
    </div>

    <div class="search">
      <div class="search-box">
        <div class="input">
          <svg-icon class="search-icon" name="search" />
          <input v-model="keyword" type="text" placeholder="搜索作品或选手名称" />
        </div>
      </div>
    </div>

    <div class="vote-main">
      <div class="title">
        <div class="left">
          <span>投票区</span>
        </div>
        <div class="tab">
          <span v-for="item in vote.sortRules" :key="item.id" :class="{ active: item.key === sort }" @click="changeSort(item.key)">
            {{ item.name }}
          </span>
        </div>
      </div>
      <div class="content">
        <div v-for="item in showWorks" :key="item.id" class="card">
          <div class="img">
            <img :src="item.cover" alt="" />
            <div class="count">{{ item.vote }}票</div>
          </div>
          <div class="title text-cut-2" :class="{ 'title-active': isActive(item.title) }">
            {{ item.title }}
          </div>
          <div class="action">
            <span>详情</span>
            <span class="primary">投票</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vote {
  overflow: hidden;

  .header {
    margin: 24px 0;
    text-align: center;
    font-size: 16px;

    i {
      margin-right: 5px;
      color: #3d61e3;
    }
  }

  .overview {
    display: flex;
    padding: 10px 40px;

    &-item {
      flex: 1;
      text-align: center;

      .count {
        font-size: 18px;
        color: #080922;
      }

      .name {
        font-size: 12px;
        color: #969696;
        margin-top: 5px;
      }
    }
  }

  .tips {
    margin: 15px;
    background-color: #fbfbfb;
    text-align: center;
    font-size: 12px;
    padding: 9px 0;
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
    > .title {
      display: flex;
      padding: 0 15px;
      height: 50px;
      line-height: 50px;
      justify-content: space-between;
      font-size: 14px;

      .left {
        font-weight: 600;
      }

      .tab {
        display: flex;
        justify-content: flex-end;

        span {
          width: 44px;
          text-align: center;

          &.active {
            color: #3d61e3;
            border-bottom: 2px solid #3d61e3;
          }
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
        background-color: #fff;
        height: 270px;
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

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .count {
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          color: #fff;
          font-size: 14px;
          width: 100%;
          line-height: 30px;
          background:
            linear-gradient(
              to top,
              rgb(0 0 0 / 50%),
              rgb(0 0 0 / 0%)
            );
          text-align: right;
          padding-right: 10px;
        }
      }

      .title {
        font-size: 14px;
        line-height: 18px;
        padding: 3px 5px;
        height: 35px;
        margin: 10px 7px;
        /* stylelint-disable-next-line value-no-vendor-prefix */
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        /* stylelint-disable-next-line declaration-colon-space-after */
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        border-radius: 3px;

        &.title-active {
          background-color: #ffef90;
        }
      }

      .action {
        span {
          width: 75px;
          height: 26px;
          display: inline-block;
          border-radius: 3px;
          background-color: #e9ebfa;
          color: #5a51df;
          text-align: center;
          font-weight: 600;
          line-height: 26px;
          margin-left: 5px;
          font-size: 14px;

          &.primary {
            background-color: #5a51df;
            color: #fff;
          }

          &.disabled {
            background-color: #f3f3f3;
            color: #969696;
          }
        }
      }
    }
  }
}
</style>
