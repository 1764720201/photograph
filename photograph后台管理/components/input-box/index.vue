<template>
	<view class="input">
		<slot></slot>
		<view class="title">{{ props.title }}</view>
		<input
			class="input-content"
			:placeholder="props.tips"
			v-model="content"
			@input="select"
			:type="props.type"
			placeholder-class="plac"
		/>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps(['title', 'position', 'tips', 'type']);

//根据传来的位置，判断title在上方还是左方
const ifTop = ref(props.position == 'left' ? 'flex' : 'block');
// 初始化输入框内容
const content = ref();
const emit = defineEmits(['input']);
const select = () => {
	emit('input', content.value);
};
</script>

<style lang="scss" scoped>
:deep(.plac) {
	font-size: 27rpx;
}
.input {
	background-color: white;
	border-radius: 20rpx;
	margin-top: 30rpx;
	padding: 30rpx;
	display: v-bind(ifTop);
	align-items: center;
	.title {
		width: 300rpx;
		font-weight: 900;
	}
	&-content {
		width: 100%;
		text-align: right;
	}
}
</style>
