<template>
  <view class="city">
    <view class="current-city">所选城市：{{ currentCity.cityName }}</view>
    <view class="change-city" @click="goChooseCity">切换城市</view>
  </view>
  <view class="nearby">
    <image
      class="image"
      src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/92f64287-895f-48d2-b277-dc5dad35eecd.jpeg"
      mode="aspectFill"
    ></image>
    <view class="store-info">
      <view class="name">半度摄影</view>
      <view class="address">
        杭州市桐庐县浙江工商大学大学杭州商学院创业中心
      </view>
    </view>
    <view class="footer">
      <view class="contact" @click="contact">联系门店</view>
      <view class="navigation" @click="goLocation">地图导航</view>
      <view class="subscribe" @click="goStore">立即预约</view>
    </view>
  </view>
  <u-action-sheet
    :list="list"
    v-model="ifShowContact"
    borderRadius="10"
    @click="callPhone"
  ></u-action-sheet>
</template>

<script lang="ts" setup>
const { currentCity } = useStore('user');
// 前往选择城市
const goChooseCity = () => {
  uni.navigateTo({
    url: '/pages/ChooseCity/index'
  });
};
const ifShowContact = ref<boolean>(false);
const list = reactive([
  {
    text: '门店电话 13700000000'
  },
  {
    text: '全国电话 13700000000',
    color: '#68c271'
  }
]);
const contact = () => {
  ifShowContact.value = true;
};
// 拨打电话
const callPhone = () => {
  uni.makePhoneCall({
    phoneNumber: '13700000000'
  });
};
// 前往地图
const goLocation = () => {
  uni.navigateTo({
    url: '/pages/Location/index'
  });
};
// 前往门店详情
const goStore = () => {
  uni.navigateTo({
    url: '/pages/Store/index'
  });
};
</script>

<style lang="scss" scoped>
.city {
  padding: 30rpx 20rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  font-weight: 900;
  .change-city {
    color: #57c263;
  }
}
.nearby {
  padding: 30rpx;
  .image {
    width: 100%;
    border-top-right-radius: 30rpx;
    border-top-left-radius: 30rpx;
  }
  .store-info {
    height: 150rpx;
    padding: 0 20rpx;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name {
      font-weight: 900;
      font-size: 35rpx;
    }
    .address {
      font-size: 26rpx;
    }
  }
  .footer {
    padding: 20rpx;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    height: 120rpx;
    align-items: center;
    box-shadow: 0 0 5rpx #ccc;
    .contact,
    .navigation,
    .subscribe {
      width: 150rpx;
      height: 65rpx;
      border-radius: 50rpx;
      border: 5rpx solid #000;
      line-height: 60rpx;
      text-align: center;
      margin-right: 20rpx;
      font-weight: 900;
      font-size: 26rpx;
    }
    .subscribe {
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
