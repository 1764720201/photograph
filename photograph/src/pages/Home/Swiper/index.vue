<template>
  <u-swiper :list="list" height="708"></u-swiper>
  <view class="city" @click="goChooseCity">
    {{ currentCity.cityName }}
    <uni-icons type="bottom" size="15" color="#000"></uni-icons>
  </view>
</template>

<script lang="ts" setup>
import amap from '../../../common/amap-wx.130.js';
const { currentCity } = useStore('user');
onLoad(() => {
  // 利用高德地图获取当前位置
  const amapPlugin = new amap.AMapWX({
    key: 'b675910771e04f68544a7cc6492f034f'
  });
  uni.showLoading({
    title: '获取信息中'
  });
  amapPlugin.getRegeo({
    success: (data: any) => {
      const cityInfo = data[0].regeocodeData.addressComponent;
      currentCity.value.cityCode = Number(cityInfo.adcode);
      currentCity.value.cityName = cityInfo.city;
      uni.hideLoading();
    }
  });
});
const goChooseCity = () => {
  uni.navigateTo({
    url: '/pages/ChooseCity/index'
  });
};

const list = [
  'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/bc93e8e7-263e-4b59-9ff8-1c64dbbae23d.jpg',
  'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/9ab05c6a-019d-4ed1-9f83-2970648ef2b4.jpg',
  'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/9acbd32b-2393-4472-8f71-40cef1c4a637.jpg'
];
</script>

<style lang="scss" scoped>
.city {
  position: absolute;
  left: 20rpx;
  top: 20rpx;
  font-weight: 900;
}
</style>
