<template>
	<view class="header">
		<uni-icons type="arrow-left" size="30" @click="back"></uni-icons>
		<view class="zone">{{ currentZone.zone }}</view>
	</view>

	<view class="add-product">
		<InputBox
			title="产品名"
			tips="请输入产品名"
			@input="getTitle"
		></InputBox>
		<InputBox title="价格" tips="请输入价格" @input="getPrice"></InputBox>
		<Picture title="封面" limit="3" @file="getImage"></Picture>
		<view class="types" v-for="(item, index) in typeList" :key="index">
			<Picture
				tips="请输入类型名"
				limit="1"
				@file="getType"
				@input="getTypeName"
				:showDel="false"
			></Picture>
			<view
				class="addNewType"
				@click="addNewType"
				v-if="index == typeList.length - 1"
			>
				新增
			</view>
		</view>
	</view>
	<view class="submit" @click="submit">提交</view>
</template>

<script setup>
import { ref } from 'vue';
import useStore from '@/pinia/index.js';
import InputBox from '@/components/input-box/index.vue';
import Picture from '@/components/picture/index.vue';
import { storeToRefs } from 'pinia';
const store = useStore();
const { currentZone } = storeToRefs(store.product);

// 返回
const back = () => {
	uni.navigateBack();
};

const typeList = ref([{ value: 0, url: '', name: '' }]);
const title = ref('');
// 获取产品名
const getTitle = e => {
	title.value = e;
};
const price = ref(0);
// 获取价格
const getPrice = e => {
	price.value = e;
};
const image = ref([]);
// 获取封面
const getImage = e => {
	image.value = e.map(item => {
		return item.url;
	});
};

// 获取类型名
const getTypeName = e => {
	typeList.value[typeList.value.length - 1].name = e;
};
const getType = e => {
	typeList.value[typeList.value.length - 1].url = e[0].url;
};
const addNewType = () => {
	const current = typeList.value[typeList.value.length - 1];
	if (current.name != '' && current.url != '') {
		typeList.value.push({
			value: typeList.value.length,
			url: '',
			name: ''
		});
	} else {
		uni.showToast({
			title: '请先输入完一个类型信息',
			icon: 'none'
		});
	}
};
const db = uniCloud.database();
// 提交
const submit = async () => {
	const photograph = ref([]);
	const count = ref();
	await db
		.collection('popularity')
		.count()
		.then(res => {
			count.value = res.result.total;
		});
	await db
		.collection('popularity')
		.add({
			title: title.value,
			image: image.value,
			types: typeList.value,
			price: parseFloat(price.value),
			order: count.value
		})
		.then(res => {
			photograph.value.push(res.result.id);
		});
	await db
		.collection('zone')
		.where(`_id=='${currentZone.value._id}'`)
		.get()
		.then(res => {
			photograph.value.push(...res.result?.data[0].photograph);
		});
	db.collection('zone')
		.where(`_id=='${currentZone.value._id}'`)
		.update({
			photograph: photograph.value
		})
		.then(() => {
			uni.navigateTo({
				url: '/pages/photograph/product/index'
			});
		});
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f3f3f3;
}
.header {
	display: flex;
	align-items: center;
	.zone {
		margin-left: 30rpx;
		font-weight: 900;
	}
}

.add-product {
	margin-left: 30rpx;
	width: 30%;
	.types {
		display: flex;
		align-items: center;
		.addNewType {
			margin-left: 50rpx;
		}
	}
}
.submit {
	margin-top: 50rpx;
	width: 200rpx;
	height: 100rpx;
	border-radius: 30rpx;
	margin-left: 100rpx;
	background-color: blue;
	line-height: 100rpx;
	text-align: center;
	color: white;
}
</style>
