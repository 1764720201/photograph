<template>
  <scroll-view scroll-y style="height: 1300rpx;" @scroll="getScroll">
    <Swiper></Swiper>
    <view class="home">
      <Operation></Operation>
      <Nearby></Nearby>
    </view>
    <Popularity></Popularity>
    <view
      class="shopping-cart"
      v-if="shoppingCart.length > 0"
      @click="openShoppingCart"
      :class="ifHide ? 'hide' : ''"
    >
      <uni-badge
        size="normal"
        :text="shoppingCart.length"
        absolute="rightTop"
        type="error"
      >
        <view class="t-icon t-icon-gouwuche"></view>
        <view class="name">购物车</view>
      </uni-badge>
    </view>
    <Shopping></Shopping>
  </scroll-view>
</template>

<script lang="ts" setup>
import Shopping from '@/components/Shopping/index'
// 轮播图
import Swiper from '@/pages/Home/Swiper/index';
// 轮播图下面的
import Operation from '@/pages/Home/Operation/index';
// 附近门店
import Nearby from '@/pages/Home/Nearby/index';
// 人气热卖
import Popularity from '@/pages/Home/Popularity/index';
const { getShopping, shoppingCart, getUserInfo } = useStore('user');
onShow(async () => {
  await getUserInfo();
  getShopping();
});
const instance=getCurrentInstance()
// 打开购物车
const openShoppingCart=()=>{
  instance?.proxy?.$Bus.emit('openShoppingCart')
}
const ifHide=ref<boolean>(false)
// 获取滑动状态
let timer=0
// 页面不滚动的时候 不隐藏购物车
const getScroll=()=>{
    ifHide.value = true
   clearTimeout(timer)
   timer = setTimeout(() => {
     ifHide.value = false
   },500)
}
</script>

<style lang="scss" scoped>
.home {
  position: absolute;
  margin-top: 340rpx;
  width: 92%;
  margin-left: 4%;
}
.shopping-cart {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  bottom: 20rpx;
  right: 20rpx;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .name {
    color: white;
    font-size: 20rpx;
    text-align: center;
  }

  .t-icon {
    width: 50rpx;
    height: 50rpx;
  }
}
.hide {
  right: -60rpx;
}
</style>
