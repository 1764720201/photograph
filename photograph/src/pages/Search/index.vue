<template>
  <d-search-log
    :search_list_hot="search_list_hot"
    @onClickDelAllApi="onClickDelAll"
    @onSearchNameApi="onSearchName"
    :is_show_more="ifShowMore"
  ></d-search-log>
  <view class="title" v-if="!ifShowMore">半度摄影</view>
  <view class="search-list">
    <view
      class="item"
      v-for="item in searchList"
      :key="item._id"
      @click="goProductionDetail(item._id)"
    >
      <image class="image" :src="item.image[0]" mode="aspectFill"></image>
      <view class="name">{{ item.title }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dSearchLog from '@/uni_modules/d-search-log/components/d-search-log/d-search-log.vue';
import { ShoppingCart } from '@/types/user';
const search_list_hot = reactive(['证件照', '文艺照']);
const db = uniCloud.database();
const searchList = ref<ShoppingCart[]>([]);
const ifShowMore = ref<boolean>(true);
const onSearchName = async (e: string) => {
  if (e) {
    ifShowMore.value = false;
    await db
      .collection('popularity')
      .where(`${new RegExp(e, 'i')}.test(title)`)
      .get()
      .then(res => {
        searchList.value = res.result.data;
      });
  } else {
    ifShowMore.value = true;
    searchList.value.length = 0;
  }
};
// 前往产品详情页面
const goProductionDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/ProductionDetail/index?id=${id}`
  });
};
</script>

<style lang="scss" scoped>
.title {
  margin-top: 20rpx;
  margin-left: 30rpx;
  font-weight: 900;
  font-size: 40rpx;
}
.search-list {
  padding: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    margin-top: 30rpx;
    display: flex;
    flex-direction: column;
    .image {
      width: 340rpx;
      height: 500rpx;
      border-radius: 20rpx;
    }
    .name {
      margin-top: 30rpx;
    }
  }
}
</style>
