<template>
  <view class="product">
    <view class="header">
      <Search></Search>
      <view class="header-tab">
        <view
          class="item"
          @click="selectHeaderTab(item)"
          v-for="item in headerTabList"
          :key="item.value"
          :style="{
            border:
              item.value == currentHeaderTab
                ? '5rpx solid #000'
                : '5rpx solid #ccc'
          }"
        >
          {{ item.text }}
        </view>
      </view>
    </view>
    <LeftTab></LeftTab>
  </view>
  <view
    class="shopping-cart"
    v-if="shoppingCart.length > 0"
    @click="openShoppingCart"
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
</template>

<script lang="ts" setup>
import Shopping from '@/components/Shopping/index';
import { Option } from '@/types/basic';
// 引入搜索框
import Search from './Search/index';
// 引入左侧导航栏
import LeftTab from './LeftTab/index';
const { headerTabWhere, getCurrentLeftTab, getMold } = useStore('product');
const { shoppingCart } = useStore('user');
const headerTabList = reactive<Option[]>([
  {
    value: 0,
    text: '全部'
  },
  {
    value: 1,
    text: '单人拍摄'
  },
  {
    value: 2,
    text: '双人拍摄'
  },
  {
    value: 3,
    text: '多人拍摄'
  }
]);
// 当前选择的头部tab
const currentHeaderTab = ref<number>(0);
// 选择头部tab
const selectHeaderTab = async (item: Option) => {
  currentHeaderTab.value = item.value;
  if (item.value > 0) {
    headerTabWhere.value = `mold=='${item.text}'`;
  } else {
    headerTabWhere.value = `mold!=1`;
  }
  await getCurrentLeftTab();
  getMold();
};
onLoad(async () => {
  await getCurrentLeftTab();
  getMold();
});const instance=getCurrentInstance()
// 打开购物车
const openShoppingCart=()=>{
  instance?.proxy?.$Bus.emit('openShoppingCart')
}
</script>

<style lang="scss" scoped>
.product {
  .header {
    padding-top: 30rpx;
    background-color: white;
    height: 200rpx;
    &-tab {
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      .item {
        font-size: 26rpx;
        margin-left: 20rpx;
        border-radius: 30rpx;
        padding: 10rpx 30rpx;
      }
    }
  }
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
</style>
