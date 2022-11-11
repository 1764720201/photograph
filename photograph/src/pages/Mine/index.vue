<template>
  <UserInfo></UserInfo>
  <!-- <Body></Body> -->
  <Footer></Footer>
  <LogOut></LogOut>
</template>

<script lang="ts" setup>
// 用户信息
import UserInfo from '@/pages/Mine/UserInfo/index';
// import Body from '@/pages/Mine/Body/index';
import Footer from '@/pages/Mine/Footer/index';
import LogOut from '@/uni_modules/uni-id-pages/pages/userinfo/logout/index';
</script>

<style lang="scss" scoped>
.logout {
  text-align: center;
  color: #666;
}
</style>
