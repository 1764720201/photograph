<template>
  <view class="product">
    <unicloud-db
      v-slot:default="{ data, loading, error, options }"
      collection="zone"
      :where="headerTabWhere"
      field="zone,_id,mold,photograph"
    >
      <view v-if="error">{{ error.message }}</view>
      <view v-else>
        <view class="list">
          <view
            class="item"
            v-for="item in data"
            :key="item._id"
            @click="changeLeftTab(item.zone)"
            :class="item.zone == currentLeftTab ? 'active' : ''"
          >
            {{ item.zone }}
          </view>
        </view>
      </view>
    </unicloud-db>
    <Mold></Mold>
  </view>
</template>

<script lang="ts" setup>
import Mold from './Mold/index';
const { headerTabWhere, currentLeftTab, getMold } = useStore('product');

// 改变左侧导航栏
const changeLeftTab = (title: string) => {
  currentLeftTab.value = title;
  getMold();
};
</script>
<style lang="scss" scoped>
.product {
  display: flex;
  .list {
    width: 200rpx;
    background-color: white;
    min-height: calc(100vh - 200rpx);
    .item {
      height: 140rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 140rpx;
      padding: 0 20rpx;
    }
    .active {
      background-color: #4cc057;
      color: white;
    }
  }
}
</style>
