<template>
  <view class="order">
    <view class="tab">
      <view
        class="item"
        v-for="item in optionsList"
        :key="item.value"
        @click="changeOption(item.value)"
      >
        <image
          class="image"
          :src="item.selectedTitle"
          mode="aspectFill"
          v-if="item.value == currentOption"
        ></image>
        <view class="title" v-else>{{ item.title }}</view>
      </view>
    </view>
    <List :where="where.join('&&')"></List>
  </view>
</template>
<script lang="ts" setup>
// 引入列表组件
import List from './List/index';
const { userId } = useStore('user');

// 列表渲染条件
const where = ref<string[]>([`user_id=='${userId.value}'`, 'state!=3']);
const currentOption = ref<number>(0);
type Option = {
  value: number;
  title: string;
  selectedTitle: string;
};
const optionsList = reactive<Option[]>([
  {
    value: 0,
    title: '全部',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/fc534574-33f3-4635-9dfc-67ad50f07fc1.png'
  },
  {
    value: 1,
    title: '代拍摄',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/a56741d1-e808-45b7-9de9-b59642a262b8.png'
  },
  {
    value: 2,
    title: '进行中',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/e0ec6873-922a-412d-bbf3-1381ff0e5c2e.png'
  },
  {
    value: 3,
    title: '已完成',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/a9dbc6ed-a1c7-495b-957b-3ac332c1e254.png'
  },
  {
    value: 4,
    title: '已关闭',
    selectedTitle:
      'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/29a08d90-bc83-4af8-85fb-e54d2605f19a.png'
  }
]);

// 改变选项
const changeOption = (index: number) => {
  currentOption.value = index;
  if (index > 0) {
    where.value[1] = `state==${index - 1}`;
  } else {
    where.value[1] = 'state!=3';
  }
};
</script>

<style lang="scss" scoped>
.order {
  .tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 10rpx #ccc;
    background-color: #f8f8f8;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25%;
      .image {
        width: 120rpx;
        height: 120rpx;
      }
    }
  }
}
</style>
