<template>
  <view class="mold">
    <view
      class="item"
      v-for="item in currentMold"
      :key="item._id"
      @click="goProductionDetail(item._id)"
    >
      <view class="title">{{ item.title }}</view>
      <image class="image" :src="item.image[0]" mode="aspectFill"></image>
    </view>
  </view>
</template>

<script lang="ts" setup>
const { currentMold } = useStore('product');
const goProductionDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/ProductionDetail/index?id=${id}`
  });
};
</script>

<style lang="scss" scoped>
.mold {
  width: 550rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .item {
    position: relative;
    padding: 20rpx;
    height: 420rpx;
    background-color: white;
    margin-top: 30rpx;
    width: 500rpx;
    display: flex;
    flex-direction: column;
    border-radius: 20rpx;
    align-items: center;
    justify-content: flex-end;
    .image {
      width: 350rpx;
      height: 350rpx;
      border-radius: 20rpx;
    }
    .title {
      left: 10rpx;
      top: 10rpx;
      position: absolute;
      font-weight: 900;
    }
  }
}
</style>
