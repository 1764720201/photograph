<template>
  <view class="submit">
    <view class="tips">
      <view class="item">预约成功后可修改六次时间</view>
      <view class="item">
        若拍摄前24小时内申请退款需收取订单金额的15%作为手续费
      </view>
      <view class="item">多个产品下单,若非同一人拍摄,须到店补差价</view>
      <view class="item">
        为保障您的资金安全与自身权益,请杜绝与个人收款账号及二手交易平台交易。如有以为,请咨询半度摄影唯一官方热线:13700000000
      </view>
    </view>
    <view class="userinfo">
      <view class="header">
        <view class="title">拍摄者信息</view>
        <view class="right" @click="notPersonal">
          <view
            :class="
              `t-icon ${
                ifPersonal ? 't-icon-weixuanzhong' : 't-icon-xuanzhong'
              }`
            "
          ></view>
          非本人拍摄
        </view>
      </view>
      <view class="content">
        <view class="name">姓名：{{ userInfo.nickname }}</view>
        <picker
          mode="date"
          :value="userInfo.birthday"
          start="2000-01-01"
          :end="dayjs(Date.now()).format('YYYY-MM-DD')"
          @change="getBirthday"
        >
          <view class="birthday">
            生日：{{ userInfo.birthday }}
            <uni-icons type="right" size="20"></uni-icons>
          </view>
        </picker>
        <picker
          @change="getGender"
          :value="userInfo.gender - 1"
          :range="genderRange"
        >
          <view class="gender">
            性别：{{ genderRange[userInfo.gender - 1] }}
            <uni-icons type="right" size="20"></uni-icons>
          </view>
        </picker>
        <view class="phone" v-if="!ifPersonal">
          手机号：
          <input type="number" v-model="phone" />
        </view>
      </view>
    </view>
    <view class="subscribeInfo">
      <view class="title">预约信息</view>
      <view class="content">
        <view
          class="item"
          v-for="(item, index) in currentSubscribe"
          :key="index"
        >
          <view class="left">
            <image class="image" :src="item.image" mode="aspectFill"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <view class="price">￥{{ item.price }}</view>
        </view>
      </view>
      <view class="subscribe-basic">
        <view class="date">预约时间:{{ currentSubscribeDate }}</view>
        <view class="store">预约门店:{{ currentStoreName }}</view>
      </view>
      <view class="discounts">
        <view class="discount-coupon">
          优惠券
          <view class="have-discount-coupon">无可用优惠券</view>
        </view>
        <view class="multiple">
          加购优惠
          <view class="discount-price">
            {{ haveDiscount ? -haveDiscount : '无' }}
          </view>
        </view>
        <view class="footer">
          <view class="left">
            已优惠：{{ haveDiscount ? '￥' + -haveDiscount : '无' }}
          </view>
          <view class="right">小计:￥{{ totalSubscribe - haveDiscount }}</view>
        </view>
      </view>
    </view>
  </view>
  <view class="tabbar">
    <view class="confirm-reply" @click="reply">
      ￥{{ totalSubscribe - haveDiscount }} 去支付
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
const {
  userInfo,
  getUserInfo,
  currentSubscribe,
  totalSubscribe,
  haveDiscount
} = useStore('user');
const { currentSubscribeDate, currentStoreName } = useStore('productionDetail');
// 性别列表
const genderRange = ['男', '女'];
// 手机号
const phone = ref<string>('');

const db = uniCloud.database();
// 获取生日
const getBirthday = async (e: { detail: { value: string } }) => {
  await db
    .collection('uni-id-users')
    .where('_id==$cloudEnv_uid')
    .update({
      birthday: e.detail.value
    });
  getUserInfo();
};
// 获取性别
const getGender = async (e: { detail: { value: string } }) => {
  await db
    .collection('uni-id-users')
    .where('_id==$cloudEnv_uid')
    .update({
      gender: Number(e.detail.value) + 1
    });
  getUserInfo();
};

// 默认本人拍摄
const ifPersonal = ref<boolean>(true);
// 切换非本人拍摄
const notPersonal = () => {
  ifPersonal.value = !ifPersonal.value;
};

// 去支付
const reply = async () => {
  const promise = ref<Promise<any>>();
  if (!ifPersonal.value && !phone.value) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    });
    return;
  }
  if (!ifPersonal.value) {
    promise.value = db.collection('subscribe').add({
      types: currentSubscribe.value,
      total: totalSubscribe.value - haveDiscount.value,
      store: currentStoreName.value,
      time: currentSubscribeDate.value,
      phone: phone.value
    });
  } else {
    promise.value = await db.collection('subscribe').add({
      types: currentSubscribe.value,
      total: totalSubscribe.value - haveDiscount.value,
      store: currentStoreName.value,
      time: currentSubscribeDate.value
    });
  }
  await promise.value;
  uni.showLoading({
    title: '准备前往订单页面'
  });
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/Order/index'
    });
  }, 500);
};
</script>

<style lang="scss" scoped>
.submit {
  width: 90%;
  margin-left: 5%;
  .tips {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #ccc;
    .item {
      margin-left: 10rpx;
      position: relative;
      &:before {
        left: -20rpx;
        top: 10rpx;
        position: absolute;
        content: ' ';
        display: block;
        width: 8rpx;
        height: 8rpx;
        background-color: green;
        border-radius: 4px;
      }
    }
  }
  .userinfo {
    margin-top: 50rpx;
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-weight: 900;
        font-size: 40rpx;
      }
      .right {
        display: flex;
        align-items: center;
        .t-icon {
          margin-right: 20rpx;
          width: 50rpx;
          height: 50rpx;
        }
      }
    }
    .content {
      margin-top: 30rpx;
      height: 200rpx;
      border-radius: 10rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20rpx;
      font-weight: 900;
      background-color: #dedede;
      .phone {
        display: flex;
        align-items: center;
      }
      .birthday,
      .gender {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  .subscribeInfo {
    background-color: #dedede;
    .title {
      font-weight: 900;
      font-size: 40rpx;
    }
    .content {
      font-weight: 900;
      padding: 20rpx;
      border-bottom: 1rpx solid #ccc;
      .item {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;
        .left {
          display: flex;
          .image {
            width: 100rpx;
            height: 100rpx;
            border-radius: 10rpx;
            box-shadow: 0 0 10rpx #ccc;
          }
          .name {
            margin-left: 20rpx;
          }
        }
      }
    }
    .subscribe-basic {
      padding: 20rpx;
      border-bottom: 1rpx solid #ccc;
      .store {
        margin-top: 20rpx;
      }
    }
    .discounts {
      padding: 20rpx;
      font-weight: 900;
      padding-bottom: 200rpx;
      .discount-coupon {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .have-discount-coupon {
          font-size: 25rpx;
          color: #666;
          font-weight: 400;
        }
      }
      .multiple {
        margin-top: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .discount-price {
          font-size: 25rpx;
          color: red;
          font-weight: 400;
        }
      }
      .footer {
        width: 100%;
        margin-top: 30rpx;
        display: flex;
        justify-content: space-between;
        padding: 30rpx;
        background-color: #94d797;
      }
    }
  }
}
.tabbar {
  position: fixed;
  bottom: 0%;
  left: 0;
  height: 180rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dad9da;
  box-shadow: 0 0 10rpx #ccc;
  .confirm-reply {
    height: 100rpx;
    width: 500rpx;
    background-color: #000;
    color: white;
    text-align: center;
    line-height: 100rpx;
    border-radius: 30rpx;
    font-size: 40rpx;
    font-weight: 900;
  }
}
</style>
