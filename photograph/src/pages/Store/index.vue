<template>
  <image
    class="image"
    src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/92f64287-895f-48d2-b277-dc5dad35eecd.jpeg"
    mode="aspectFill"
  ></image>
  <scroll-view scroll-x="true" style="white-space: nowrap;">
    <view class="zone-list">
      <view
        class="item"
        v-for="item in zoneList"
        :key="item._id"
        :class="item.zone == currentZone ? 'active' : ''"
        @click="changeZone(item)"
      >
        {{ item.zone }}
      </view>
    </view>
  </scroll-view>
  <Product :photograph="photograph" :zone="currentZone"></Product>
</template>

<script lang="ts" setup>
import { Zone } from '@/types/productionDetail';
// 引入产品组件
import Product from './Product/index';
const db = uniCloud.database();
const zoneList = ref<Zone[]>([]);
const currentZone = ref<string>('');
const photograph = ref<string[]>();
// 改变分区
const changeZone = (zone: Zone) => {
  currentZone.value = zone.zone;
  photograph.value = zone.photograph;
};
onLoad(() => {
  db.collection('zone')
    .get()
    .then(res => {
      zoneList.value = res.result.data;
      currentZone.value = zoneList.value[0].zone;
      photograph.value = zoneList.value[0].photograph;
    });
});
</script>

<style lang="scss" scoped>
.image {
  width: 100%;
  height: 400rpx;
}
.zone-list {
  padding: 20rpx;
  display: flex;
  align-items: center;
  .item {
    margin-left: 30rpx;
    font-size: 40rpx;
    color: #666;
  }
  .active {
    color: #000;
    font-weight: 900;
  }
}
</style>
