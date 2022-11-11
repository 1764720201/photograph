<template>
  <view class="footer">
    <view class="item">
      <view class="t-icon t-icon-jibenziliao" @click="goUserInfo"></view>
      <view class="name">个人资料</view>
    </view>
    <view class="item" @click="goOpinion">
      <view class="t-icon t-icon-yijianfankui"></view>
      <view class="name">意见反馈</view>
    </view>
    <view class="item" @click="noServie('没有服务协议')">
      <view class="t-icon t-icon-jibenziliao"></view>
      <view class="name">半度服务协议</view>
    </view>
    <view class="item" @click="noServie('没有标准服务')">
      <view class="t-icon t-icon-fuwu"></view>
      <view class="name">半度标准服务</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const goUserInfo = () => {
  uni.navigateTo({
    url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
  });
};
const noServie = (title: string) => {
  uni.showToast({
    title,
    icon: 'error'
  });
};
// 前往意见反馈
const goOpinion = () => {
  uni.navigateTo({
    url: '/pages/Opinion/index'
  });
};
</script>

<style lang="scss" scoped>
.footer {
  height: 200rpx;
  margin-top: 50rpx;
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 25rpx;
    .name {
      margin-top: 10rpx;
    }
  }
}
</style>
