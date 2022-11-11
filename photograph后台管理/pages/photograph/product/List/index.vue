<template>
	<view class="content">
		<view class="list">
			<view
				class="item"
				v-for="(item, index) in currentPhotograph"
				:key="index"
			>
				<unicloud-db
					v-slot:default="{ data, loading, error, options }"
					collection="popularity"
					:where="`_id=='${item}'`"
				>
					<view v-if="error">{{ error.message }}</view>
					<view v-else>
						<image
							class="image"
							:src="data[0]?.image[0]"
							mode="aspectFill"
						></image>
						<view class="title">{{ data[0]?.title }}</view>
						<view
							v-if="ifShowOperate"
							class="cancel"
							@click="openRemoveProduct(data[0]?._id)"
						>
							<uni-icons type="closeempty" size="20"></uni-icons>
						</view>
					</view>
				</unicloud-db>
			</view>
			<view
				class="add-product"
				@click="goAddProduct"
				v-if="ifShowOperate"
			>
				<image
					class="add-product-image"
					src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/35af89f0-dbbb-4c72-81bd-288d37e56287.png"
					mode="aspectFill"
				></image>
			</view>
		</view>
		<view class="right">
			<view class="operate" @click="operate">产品管理</view>
			<uni-data-select
				v-model="currentMold"
				:localdata="range"
				@change="changeMold"
				:clear="false"
			></uni-data-select>
		</view>
	</view>
	<uni-popup ref="removeType" type="dialog">
		<uni-popup-dialog
			type="warning"
			cancelText="取消"
			confirmText="确定"
			title="警告"
			content="你确定要删除该产品吗"
			@confirm="confrimRemoveType"
		></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';
import useStore from '@/pinia/index.js';
import { storeToRefs } from 'pinia';
const store = useStore();
const { currentPhotograph, currentZone, range, currentMold } = storeToRefs(
	store.product
);

// 打开删除产品的弹出层
const removeProduct = ref();

const ifShowOperate = ref(false);

const currentTypeId = ref();
const openRemoveProduct = id => {
	currentTypeId.value = id;
	removeProduct.value.open();
};
const db = uniCloud.database();

// 删除该产品
const confrimRemoveType = async () => {
	await db
		.collection('popularity')
		.where(`_id=='${currentTypeId.value}'`)
		.remove();
	store.product.getPhotograph();
};
// 新增产品
const goAddProduct = () => {
	uni.navigateTo({
		url: '/pages/photograph/addProduct/index'
	});
};
const changeMold = e => {
	db.collection('zone')
		.where(`_id=='${currentZone.value._id}'`)
		.update({
			mold: range.value[e].text
		})
		.then(() => {
			uni.showToast({
				title: '修改成功'
			});
		});
};

// 产品管理
const operate = () => {
	ifShowOperate.value = !ifShowOperate.value;
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	.list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		.item {
			padding: 20rpx;
			position: relative;
			.image {
				border-radius: 20rpx;
				width: 300rpx;
			}
			.cancel {
				position: absolute;
				right: 10rpx;
				top: 10rpx;
			}
		}
		.add-product {
			width: 300rpx;
			height: 500rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			&-image {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
	.right {
		.operate {
			background-color: #000;
			color: #fff;
			width: 200rpx;
			height: 100rpx;
			text-align: center;
			line-height: 100rpx;
		}
	}
}
</style>
