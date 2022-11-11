<template>
  <view class="nearby" @click="goNearby">
    <view class="left">
      <view class="t-icon t-icon-dianpu"></view>
      <view class="title">附近门店</view>
    </view>
    <view class="tip">先选门店后预约</view>
  </view>
</template>

<script lang="ts" setup>
// 前往门店选择
const goNearby = () => {
  uni.navigateTo({
    url: '/pages/Nearby/index'
  });
};
</script>

<style lang="scss" scoped>
.nearby {
  margin-top: 40rpx;
  height: 55rpx;
  display: flex;
  align-items: center;
  background-color: #eae9ea;
  border-radius: 25rpx;
  padding: 50rpx;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .t-icon {
      width: 45rpx;
      height: 45rpx;
    }
    .title {
      font-weight: 900;
      margin-left: 10rpx;
    }
  }
  .tip {
    font-size: 25rpx;
    color: #666;
  }
}
</style>
