<template>
  <view class="popularity">
    <view class="title">人气热卖</view>
    <view class="popularity-list">
      <view
        class="item"
        v-for="item in popularityList"
        :key="item._id"
        @click="goProductionDetail(item._id)"
      >
        <image
          class="image"
          :src="item.image[0]"
          mode="aspectFill"
          :style="{ width: item.title == '双人照' ? '450rpx' : '220rpx' }"
        ></image>
        <view class="name">{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Image } from '@/types/basic';
const popularityList = reactive<Image[]>([]);
// 从数据库获取图片信息
const db = uniCloud.database();
onLoad(() => {
  db.collection('popularity')
    .orderBy('order', 'asc')
    .limit(5)
    .get()
    .then(res => {
      Object.assign(popularityList, res.result.data);
    });
});
// 前往产品详情页面
const goProductionDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/ProductionDetail/index?id=${id}`
  });
};
</script>

<style lang="scss" scoped>
.popularity {
  width: 100%;
  margin-top: 850rpx;
  background-color: white;
  padding: 30rpx;
  .title {
    font-weight: 900;
  }
  &-list {
    width: 700rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      margin-top: 30rpx;
      display: flex;
      flex-direction: column;
      .image {
        height: 300rpx;
        border-radius: 20rpx;
        box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      }
      .name {
        font-size: 29rpx;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
