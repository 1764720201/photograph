<template>
  <u-swiper :list="detail.image" height="770" :autoplay="false"></u-swiper>
  <view class="detail">
    <Choose></Choose>
    <Standard></Standard>
  </view>
  <view class="options">
    <view
      class="item"
      v-for="item in OptionsList"
      :key="item.value"
      @click="changeOption(item.value)"
    >
      <image
        class="image"
        :src="item.selectedTitle"
        mode="aspectFill"
        v-if="item.value == currentOption"
      ></image>
      <view class="title" v-else>{{ item.title }}</view>
    </view>
  </view>
  <Options></Options>
  <Tabbar></Tabbar>
</template>

<script lang="ts" setup>
import Choose from './Choose/index';
import Tabbar from './Tabbar/index';
import Standard from './Standard/index';
import Options from './Options/index';
const { getProductionDetail, detail, currentOption } = useStore(
  'productionDetail'
);
const { getShopping, getUserInfo, currentSubscribe } = useStore('user');
onLoad(async options => {
  if (options.id) {
    getProductionDetail(options.id);
    await getUserInfo();
    getShopping();
    currentSubscribe.value.length = 0;
  }
});
// 各个选项
const OptionsList = reactive([
  {
    value: 0,
    title: '产品详情',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/6ac46858-eea2-4ea7-80ab-5362ee870acd.png'
  },
  {
    value: 1,
    title: '服务说明',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/2c84ae10-284d-4e06-bf1a-21ac18c2ead4.png'
  },
  {
    value: 2,
    title: '买家秀',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/0dca897a-ccd2-4109-af2f-1f89e7b8cc7c.png'
  }
]);
// 改变选项
const changeOption = (index: number) => {
  currentOption.value = index;
};
</script>

<style lang="scss" scoped>
.detail {
  width: 90%;
  margin-left: 5%;
}
.options {
  margin-top: 50rpx;
  width: 100%;
  display: flex;
  align-items: center;
  .item {
    width: 33%;
    display: flex;
    align-items: center;
    justify-content: center;
    .image {
      width: 150rpx;
      height: 130rpx;
    }
  }
}
</style>
