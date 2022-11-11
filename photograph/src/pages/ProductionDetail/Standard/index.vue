<template>
  <view class="standard">
    <view class="header">
      <view class="title">服务&交付标准</view>
      <uni-icons type="right" size="15"></uni-icons>
    </view>
    <view class="footer">
      <view class="item" v-for="item in standardList" :key="item.value">
        <view :class="`t-icon ${item.icon}`"></view>
        <view class="text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Option } from '@/types/basic';
const standardList = reactive<Option[]>([
  {
    value: 0,
    text: '1组造型',
    icon: 't-icon-zaoxingnvhai'
  },
  {
    value: 1,
    text: '1套衣服',
    icon: 't-icon-qunzi-hunli-lifu-yifu'
  },
  {
    value: 2,
    text: '1种背景',
    icon: 't-icon-huabi'
  },
  {
    value: 3,
    text: '1张精修底片',
    icon: 't-icon-dipian'
  },
  {
    value: 0,
    text: '1种打印尺寸',
    icon: 't-icon-dayinji'
  }
]);
</script>

<style lang="scss" scoped>
.standard {
  margin-top: 300rpx;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-weight: 900;
      font-size: 40rpx;
    }
  }
  .footer {
    margin-top: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .item {
      display: flex;
      align-items: center;
      flex-direction: column;
      .t-icon {
        width: 100rpx;
        height: 100rpx;
      }
      .text {
        margin-top: 20rpx;
        font-size: 23rpx;
      }
      .t-icon-huabi,
      .t-icon-dipian {
        width: 85rpx;
        height: 85rpx;
      }
    }
  }
}
</style>
