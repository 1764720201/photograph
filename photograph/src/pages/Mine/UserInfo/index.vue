<template>
  <view class="userInfo">
    <!-- 未登录时的界面 -->
    <view class="login" v-if="!userInfo._id" @click="login">
      <view class="logo"><view class="t-icon t-icon-logo_QQ"></view></view>
      <view class="title">登录/注册</view>
      <view class="tip">生活需要仪式感</view>
    </view>
    <!-- 登录后的界面 -->
    <view class="logined" v-else>
      <view class="user">
        <view class="logo"><view class="t-icon t-icon-logo_QQ"></view></view>
        <view class="right">
          <view class="call">Hi，{{ userInfo.nickname }}</view>
          <view class="register-time">
            半度摄影已经陪伴你走过了{{ registerTime }}天
          </view>
        </view>
      </view>
      <image
        class="image"
        src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/92f64287-895f-48d2-b277-dc5dad35eecd.jpeg"
        mode="aspectFill"
      ></image>
    </view>
  </view>
</template>

<script lang="ts" setup>
const { userInfo, getUserInfo } = useStore('user');
const registerTime = ref<number>();
onShow(async () => {
  await getUserInfo();
  // 通过当天的时间减去注册时间得出
  registerTime.value = Math.ceil(
    (Date.now() - userInfo.value.register_date) / 86400000
  );
});
const login = () => {
  useStore('user').login();
};
</script>

<style lang="scss" scoped>
.userInfo {
  height: 610rpx;
  background-color: white;
  .login {
    padding-top: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
      height: 200rpx;
      width: 200rpx;
      border-radius: 50%;
      box-shadow: 1rpx 10rpx 10rpx rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      .t-icon {
        width: 100rpx;
        height: 100rpx;
      }
    }
    .title {
      margin-top: 40rpx;
      font-size: 50rpx;
      font-weight: 900;
    }
    .tip {
      margin-top: 25rpx;
      color: #454545;
    }
  }
  .logined {
    position: relative;
    .user {
      right: 50rpx;
      top: 200rpx;
      position: absolute;
      display: flex;
      align-items: center;
      .logo {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        .t-icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
      .right {
        margin-left: 20rpx;
        .call {
          font-weight: 900;
          font-size: 40rpx;
        }
        .register-time {
          color: #666;
          font-size: 23rpx;
        }
      }
    }
    .image {
      width: 100%;
      height: 610rpx;
    }
  }
}
</style>
