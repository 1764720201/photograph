<template>
  <view class="tabbar">
    <uni-badge
      size="small"
      :text="shoppingNum"
      absolute="rightTop"
      type="error"
    >
      <view class="t-icon t-icon-gouwuchekong" @click="openShoppingCart"></view>
    </uni-badge>
    <view class="tabbar-right">
      <view class="add" @click="addShoppingCart">加入购物车</view>
      <view class="subscribe" @click="appointmentTime">立即预约</view>
    </view>
  </view>
  <Shopping></Shopping>
</template>

<script lang="ts" setup>
import Shopping from '@/components/Shopping/index'
const {shoppingNum}=useStore('user')

const instance=getCurrentInstance()
// 添加购物车
const addShoppingCart=()=>{
  instance?.proxy?.$Bus.emit('openChoose','shopping')
}
// 打开预约页面
const appointmentTime=()=>{
  instance?.proxy?.$Bus.emit('openChoose','appointment')
}

// 打开购物车
const openShoppingCart=()=>{
  instance?.proxy?.$Bus.emit('openShoppingCart')
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 40rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 10rpx #ccc;
  align-items: center;
  background-color: #efefef;
  .t-icon {
    width: 55rpx;
    height: 55rpx;
  }
  .tabbar-right {
    width: 70%;
    display: flex;
    justify-content: space-between;
    .add,
    .subscribe {
      height: 80rpx;
      width: 220rpx;
      line-height: 70rpx;
      text-align: center;
      border: 5rpx solid #000;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-weight: 900;
    }
    .subscribe {
      color: white;
      background-color: #000;
    }
  }
}
</style>
