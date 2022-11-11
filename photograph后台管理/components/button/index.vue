<template>
	<view class="button" @click="$emit('click', $event)">
		<view class="next-step">
			<slot></slot>
			<view class="title">{{ props.title }}</view>
		</view>
		<view class="icon" v-if="props.ifShowNext">
			<uni-icons type="arrow-right" size="20" color="white"></uni-icons>
		</view>
	</view>
</template>

<script lang="ts" setup>
const props = defineProps(['ifShowNext', 'title']);
</script>

<style lang="scss" scoped>
.button {
	margin-top: 30rpx;
	border-radius: 30rpx;
	padding: 20rpx;
	height: 80rpx;
	display: flex;
	background-color: #5869ee;
	align-items: center;
	.next-step {
		height: 50rpx;
		display: flex;
		align-content: center;
		color: white;
		margin: 0 auto;
		font-weight: 900;
	}
	.icon {
		position: absolute;
		right: 60rpx;
		text-align: center;
		line-height: 70rpx;
		height: 70rpx;
		width: 70rpx;
		border-radius: 50%;
		background-color: #4459df;
	}
}
</style>
