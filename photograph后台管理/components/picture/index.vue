<template>
	<view class="file">
		<view class="title" v-if="props.title">{{ props.title }}</view>
		<view class="input" v-else>
			<input
				type="text"
				:placeholder="props.tips"
				@input="inputContent"
				v-model="typeName"
			/>
		</view>
		<uni-file-picker
			fileMediatype="image"
			:image-styles="imageStyles"
			v-model="imageList"
			@success="select"
			@delete="select"
			:limit="props.limit"
			:delIcon="props.showDel"
		>
			<view class="upload">
				<uni-icons type="plusempty" size="30" color="#ccc"></uni-icons>
			</view>
		</uni-file-picker>
	</view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

// 获取父组件传来的数据
const props = defineProps(['title', 'tips', 'limit', 'showDel']);
const imageList = ref([]);
// 设置上传样式
const imageStyles = reactive({
	width: 80,
	height: 80,
	border: {
		radius: '10'
	}
});
const emit = defineEmits(['file', 'input']);
const select = () => {
	setTimeout(() => {
		emit('file', imageList.value, props.index);
	}, 200);
};
const typeName = ref();
const inputContent = () => {
	emit('input', typeName.value, props.index);
};
</script>

<style lang="scss" scoped>
.file {
	margin-top: 30rpx;
	background-color: white;
	padding: 20rpx;
	border-radius: 20rpx;
	.title {
		margin-bottom: 40rpx;
		font-size: 33rpx;
		font-weight: 900;
	}
	.input {
		margin-bottom: 40rpx;
	}
	.upload {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
