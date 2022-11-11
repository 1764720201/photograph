<template>
  <view class="thread"></view>
  <view class="collapse">
    <view class="header" @click="open">
      <view class="left">
        <uni-transition ref="arrows" custom-class="transition" show>
          <view class="t-icon t-icon-xiangxia1"></view>
        </uni-transition>
        <view class="title">{{ props.title }}</view>
      </view>
      <view
        class="current"
        :style="{ color: props.current == '请选择' ? '#666' : '#000' }"
      >
        {{ props.current }}
      </view>
    </view>
    <uni-transition
      ref="content"
      custom-class="transition"
      :modeClass="['fade']"
      :show="ifShow"
      :duration="50"
    >
      <slot></slot>
    </uni-transition>
  </view>
</template>

<script lang="ts" setup>
const ifShow = ref<boolean>(false);
const arrows = ref(null);
const props = defineProps<{ title: string; current: string }>();
const open = () => {
  if (!ifShow.value) {
    //@ts-ignore
    arrows.value.step({
      rotate: -180
    });
    //@ts-ignore
    arrows.value.run(() => {
      ifShow.value = true;
    });
  } else {
    //@ts-ignore
    arrows.value.step({
      rotate: 0
    });
    //@ts-ignore
    arrows.value.run(() => {
      ifShow.value = false;
    });
  }
};
// 如果选择了一个选项，那么选项消失
watch(
  () => props.current,
  () => {
    ifShow.value = true;
    open();
  }
);
</script>

<style lang="scss" scoped>
.thread {
  width: 100%;
  height: 2rpx;
  background-color: #e8e8e8;
}
.collapse {
  .header {
    padding: 30rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    .left {
      display: flex;
      align-items: center;
      .t-icon {
        width: 25rpx;
        height: 25rpx;
      }
      .title {
        font-size: 40rpx;
        font-weight: 900;
        margin-left: 10rpx;
      }
    }
    .current {
      font-size: 38rpx;
    }
  }
}
</style>
