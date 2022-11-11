<template>
  <view class="operation">
    <view class="header">
      <view class="service" @click="goService">
        <view class="t-icon t-icon-fuwu2"></view>
        <view class="name">企业服务</view>
      </view>
      <!-- <view class="gift">
        <view class="t-icon t-icon-liwujingxi"></view>
        <view class="name">送TA礼物</view>
      </view> -->
      <view class="photograph" @click="goProduct">
        <view class="t-icon t-icon-xiangji1"></view>
        <view class="name">我要拍照</view>
      </view>
    </view>
    <!-- <view class="footer">
      <view class="service" @click="goService">
        <view class="t-icon t-icon-T-shirt"></view>
        <view class="right">
          <view class="title">企业服务</view>
          <view class="tip">放心交给我</view>
        </view>
      </view>
      <view class="rim">
        <view class="t-icon t-icon-zhoubian"></view>
        <view class="right">
          <view class="title">定制周边</view>
          <view class="tip">专属有你造</view>
        </view>
      </view>
      <view class="photoshop">
        <view class="t-icon t-icon-xiutu"></view>
        <view class="right">
          <view class="title">在线修图</view>
          <view class="tip">随手修大片</view>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
// 前往全部产品
const goProduct = () => {
  uni.switchTab({
    url: '/pages/Product/index'
  });
};
// 前往企业服务
const goService = () => {
  uni.navigateTo({
    url: '/pages/Service/index'
  });
};
</script>

<style lang="scss" scoped>
.operation {
  height: 310rpx;
  background-color: white;
  border-radius: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .header {
    height: 310rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1rpx solid #d9d9d9;
    .service,
    .photograph {
      justify-content: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 70rpx;
      .t-icon {
        width: 90rpx;
        height: 90rpx;
      }
      .name {
        margin-top: 10rpx;
        font-weight: 900;
        font-size: 35rpx;
      }
    }
    .service {
      border-right: 1rpx solid #dedede;
    }
  }
  // .footer {
  //   height: 120rpx;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-around;
  //   .service,
  //   .rim,
  //   .photoshop {
  //     display: flex;
  //     align-items: center;
  //     .right {
  //       display: flex;
  //       flex-direction: column;
  //       margin-left: 15rpx;
  //       .title {
  //         font-size: 28rpx;
  //         font-weight: 900;
  //       }
  //       .tip {
  //         font-size: 23rpx;
  //         color: #ccc;
  //       }
  //     }
  //   }
  //   .service,
  //   .rim {
  //     border-right: 1rpx solid #ccc;
  //     padding-right: 20rpx;
  //   }
  // }
}
</style>
