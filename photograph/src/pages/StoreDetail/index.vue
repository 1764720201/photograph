<template>
  <view class="store-detail">
    <image
      class="image"
      src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/92f64287-895f-48d2-b277-dc5dad35eecd.jpeg"
      mode="aspectFill"
    ></image>
    <view class="name">{{ name }}</view>
    <view class="address">
      <view class="left">
        <uni-icons type="location" size="20"></uni-icons>
        门店地址:
      </view>
      <view class="address-name">{{ address }}</view>
    </view>
    <view class="time">
      <view class="t-icon t-icon-ai253"></view>
      营业时间：10:00:00 - 22:00:00
    </view>
    <view class="call">
      <view class="left">
        <view class="t-icon t-icon-dianhua"></view>
        联系电话：13700000000
      </view>
      <uni-icons type="forward" size="15" color="#666"></uni-icons>
    </view>
  </view>
</template>

<script lang="ts" setup>
const name = ref<string>();
const address = ref<string>();
onLoad(options => {
  name.value = options.name;
  address.value = options.address;
});
</script>

<style lang="scss" scoped>
.store-detail {
  margin-top: 30rpx;
  width: 90%;
  margin-left: 5%;
  .t-icon {
    width: 40rpx;
    height: 40rpx;
  }
  .image {
    width: 100%;
    height: 350rpx;
    border-radius: 30rpx;
  }
  .name {
    margin-top: 30rpx;
    font-weight: 900;
    font-size: 40rpx;
  }
  .address {
    display: flex;
    border-bottom: 1rpx solid #ccc;
    padding: 30rpx 0;
    align-items: flex-start;
    .left {
      width: 230rpx;
      display: flex;
      align-items: center;
    }
  }
  .time {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #ccc;
    padding: 30rpx 0;
  }
  .call {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #ccc;
    padding: 30rpx 0;
    .left {
      display: flex;
      align-items: center;
    }
  }
}
</style>
