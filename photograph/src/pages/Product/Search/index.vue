<template>
  <view class="search">
    <view class="city" @click="goChooseCity">
      {{ currentCity.cityName }}
      <uni-icons type="bottom" size="15" color="#000"></uni-icons>
    </view>
    <view class="input" @click="goSearch">
      <uni-icons type="search" size="20" color="#666"></uni-icons>
      请输入
    </view>
  </view>
</template>

<script lang="ts" setup>
const { currentCity } = useStore('user');
// 前往城市选择
const goChooseCity = () => {
  uni.navigateTo({
    url: '/pages/ChooseCity/index'
  });
};
// 前往搜索页面
const goSearch = () => {
  uni.navigateTo({
    url: '/pages/Search/index'
  });
};
</script>

<style lang="scss" scoped>
.search {
  margin-left: 30rpx;
  border-radius: 30rpx;
  border: 1rpx solid #000;
  height: 40rpx;
  width: 450rpx;
  display: flex;
  align-items: center;
  padding: 30rpx;
  .city {
    font-weight: 900;
  }
  .input {
    margin-left: 20rpx;
    padding-left: 10rpx;
    border-left: 1rpx solid #ccc;
    display: flex;
    align-items: center;
    color: #666;
  }
}
</style>
