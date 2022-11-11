<template>
  <view class="product">
    <view class="header">原价产品超过两件时 全部打9折 限同人拍摄</view>
    <view class="content">
      <view class="zone">{{ props.zone }}</view>
      <view class="photograph">
        <view v-for="(item, index) in props.photograph" :key="index">
          <unicloud-db
            v-slot:default="{ data, loading, error, options }"
            collection="popularity"
            :where="`_id=='${item}'`"
            field="title,image,_id,price"
          >
            <view v-if="error">{{ error.message }}</view>
            <view v-else class="item">
              <image
                class="image"
                :src="data[0]?.image[0]"
                mode="aspectFill"
              ></image>
              <view class="right">
                <view class="title">{{ data[0]?.title }}</view>
                <view class="price">
                  <text class="price-num">{{ data[0]?.price }}</text>
                  元起
                </view>
                <view
                  class="subscribe"
                  @click="goProductionDetail(data[0]._id)"
                >
                  立即预约
                </view>
              </view>
            </view>
          </unicloud-db>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps<{ photograph: string[]; zone: string }>();
// 前往产品详情
const goProductionDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/ProductionDetail/index?id=${id}`
  });
};
</script>

<style lang="scss" scoped>
.product {
  padding: 30rpx;
  .header {
    color: rgb(215, 73, 86);
    background-color: rgba(215, 73, 86, 0.15);
    text-align: center;
    height: 65rpx;
    line-height: 65rpx;
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
  }
  .content {
    background-color: #fff;
    padding: 20rpx;
    .zone {
      font-size: 35rpx;
      font-weight: 900;
    }
    .photograph {
      .item {
        padding: 30rpx 0;
        border-bottom: 1rpx solid #ccc;
        display: flex;
        justify-content: space-between;
        .image {
          width: 200rpx;
          height: 200rpx;
          box-shadow: 0 0 10rpx #ccc;
        }
        .right {
          width: 65%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .subscribe {
            align-self: flex-end;
            background-color: #000;
            color: #fff;
            width: 180rpx;
            height: 70rpx;
            border-radius: 30rpx;
            line-height: 70rpx;
            text-align: center;
          }
          .title {
            font-size: 35rpx;
          }
          .price {
            display: flex;
            align-items: center;
            &-num {
              font-weight: 900;
              font-size: 45rpx;
              margin-right: 10rpx;
            }
          }
        }
      }
    }
  }
}
</style>
