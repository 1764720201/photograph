<template>
  <scroll-view
    scroll-y="true"
    style="height: 1000rpx;"
    :scroll-into-view="scrollIntoView"
    scroll-with-animation
  >
    <view class="options">
      <view class="product-detail" id="product-detail">
        <view class="item" v-for="item in detail.types" :key="item.value">
          <image class="image" :src="item.url" mode="aspectFill"></image>
          <view class="name">{{ item.name }}</view>
        </view>
      </view>
      <view class="service-explain" id="service-explain">
        <view class="title">服务说明</view>
        <view class="content">
          <view class="content-list">
            <view class="list">
              <view class="label">产品内容</view>
              <view class="item">1组造型，1套服装;</view>
              <view class="item">
                提供1张精修数码底片，10张1寸打印照片或4张2寸打印照片;
              </view>
              <view class="item">不提供原始拍摄文件</view>
            </view>
            <view class="list">
              <view class="label"></view>
              <view class="item">
                加修收费：60元/张单人精修底片，并提供其相应数量打印照
              </view>
              <view class="item">加印收费：20元/张（6寸）,30元/张（8寸)</view>
            </view>
            <view class="list">
              <view class="label">顾客须知</view>
              <view class="item">同一产品，限单人拍摄</view>
              <view class="item">
                本产品更换服装、造型、背景颜色拍摄按照第二套收费
              </view>
              <view class="item">
                门店提供部分尺码的服务可供选择，也建议您自带合身服装前往拍摄，更能凸显自身气质
              </view>
              <view class="item">
                门店不提供特定职业服装(如医护、航空从业者、健身从业者登)，有需者可自备服装前往拍摄
              </view>
              <view class="item">
                周末及节假日取片时间会有延迟，具体取片时间可在拍摄当日咨询门店伙伴
              </view>
              <view class="item">
                您可以在拍摄或看片时提出您对照片的要求，若您确认最终修图效果并提取电子版照片或纸质版照片，即代表您对海马体本次服务满意且验收最终交付照片，我们将不提供重拍或退款选择
              </view>
              <view class="item">
                如有其它需求或疑问可通过预约系统右下方【联系我】咨询在线客服，或拨打客服热线与我们联系
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="buyers-show" id="buyers-show">
        <view class="title">买家秀</view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
const scrollIntoView = ref<string>();
const { currentOption, detail } = useStore('productionDetail');

watch(
  () => currentOption.value,
  newValue => {
    switch (newValue) {
      case 0:
        scrollIntoView.value = 'product-detail';
        break;
      case 1:
        scrollIntoView.value = 'service-explain';
        break;
      case 2:
        scrollIntoView.value = 'buyers-show';
        break;
    }
  }
);
</script>

<style lang="scss" scoped>
.options {
  padding-bottom: 200rpx;
  .product-detail {
    .item {
      position: relative;
      .image {
        width: 100%;
      }
      .name {
        position: absolute;
        left: 20rpx;
        top: 20rpx;
        font-weight: 900;
        font-size: 35rpx;
      }
    }
  }
  .service-explain {
    margin-top: 30rpx;
    width: 90%;
    margin-left: 5%;
    .title {
      text-align: center;
      padding-bottom: 50rpx;
    }
    .content {
      background-color: #e7e6e7;
      margin-top: -30rpx;
      padding: 20rpx;
      .list {
        margin-top: 30rpx;
        .label {
          font-weight: 900;
          font-size: 35rpx;
        }
        .item::before {
          content: '';
          display: block;
          width: 10rpx;
          height: 10rpx;
          border-radius: 50%;
          background-color: #000;
          position: absolute;
          left: -20rpx;
          top: 12rpx;
        }
        .item {
          margin-top: 10rpx;
          position: relative;
          margin-left: 80rpx;
        }
      }
    }
  }
  .buyers-show {
    .title {
      text-align: center;
      padding: 20rpx 0;
    }
  }
}
</style>
