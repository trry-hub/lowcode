<script setup lang="ts">
const props = defineProps<{
  ctx: any
  data: any
}>()
</script>

<template>
  <div>
    <p class="cover-box">
      <img :src="data.info.imageUrl" alt="" />
    </p>
    <div class="title">
      <p class="title-name">{{data.info.materialName}}</p>
      <span class="vote-count">当前获得{{data.info.voteCount}}票</span>
    </div>
    <div class="content">{{ data.info.materialIntro }}</div>
  </div>
</template>

<style lang="scss" scoped>
.cover-box {
  width: 100%;
  height: 375px;
  background: #d8d8d8;
  margin: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.title {
  padding: 0 14px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;

  .title-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    margin-right: 10px;
  }

  .vote-count {
    color: #969696;
    overflow: hidden;
    flex-shrink: 0;
  }
}

.content {
  padding: 10px 14px;
  height: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
