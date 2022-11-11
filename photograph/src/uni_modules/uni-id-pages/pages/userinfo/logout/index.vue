<template>
  <view class="logout" @click="mutations.logout">退出登录</view>
</template>

<script lang="ts" setup>
import { mutations } from '@/uni_modules/uni-id-pages/common/store.js';
</script>

<style lang="scss" scoped>
.logout {
  text-align: center;
  font-size: 30rpx;
  color: #666;
}
</style>
