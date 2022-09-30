<script setup lang="ts" name="LayerEmpty">
import { mapInfo } from '@/utils/mapping'
import { linkToUrl } from '@/utils'

const jumpList = () => {
  linkToUrl(`${mapInfo().doctorUrl}/academic`, '_self')
}
</script>

<template>
  <div class="empty">
    <div class="container">
      <div class="empty-icon">
        <img src="@/assets/images/vote-empty.png" alt="">
      </div>
      <p class="empty-title">当前活动已下架</p>
      <p class="empty-description">去其他地方逛逛吧</p>
      <van-button class="empty-button" @click="jumpList">查看其他活动</van-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
// scss
.empty {
  min-height: calc(100vh - 2px);
  background-color: #f5f5f5;
  border: 1px solid transparent;

  .container {
    text-align: center;

    .empty-icon {
      margin: 0 auto;
      margin-top: 98px;
      width: 160px;
      height: 110px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .empty-title {
      font-size: 16px;
      font-family: PingFangSC-Regular, "PingFang SC";
      font-weight: 400;
      color: #5a5a5a;
      line-height: 16px;
      margin-bottom: 10px;
    }

    .empty-description {
      font-size: 14px;
      font-family: PingFangSC-Regular, "PingFang SC";
      font-weight: 400;
      color: #9ba6ac;
      line-height: 14px;
      margin: 0;
    }

    .empty-button {
      margin-top: 40px;
      width: 140px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid #3d61e3;
      color: #3d61e3;
      background-color: transparent;
    }
  }
}
</style>
