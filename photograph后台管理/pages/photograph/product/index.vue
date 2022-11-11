<template>
	<scroll-view scroll-x style="white-space: nowrap;">
		<view class="product">
			<view class="zone">
				<view
					class="zone-item"
					v-for="item in zoneList"
					:key="item._id"
					:class="item._id == currentZone._id ? 'active' : ''"
					@click="chooseZone(item)"
				>
					<view class="tab">{{ item.zone }}</view>
					<view
						class="cancel"
						v-if="ifShowManagementZone"
						@click="openDeleteZone"
					>
						<uni-icons type="closeempty" size="15"></uni-icons>
					</view>
				</view>
				<view
					class="addZone"
					v-if="ifShowManagementZone"
					@click="openAddZone"
				>
					<uni-icons
						type="plusempty"
						size="25"
						color="white"
					></uni-icons>
				</view>
			</view>
			<view class="management" @click="managementZone">分区管理</view>
		</view>
	</scroll-view>
	<List></List>
	<uni-popup ref="addZonePopup" type="dialog">
		<uni-popup-dialog
			ref="inputClose"
			mode="input"
			title="输入分区名"
			placeholder="请输入分区名"
			@confirm="confirmAddZone"
		></uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="deleteZonePopup" type="dialog">
		<uni-popup-dialog
			type="warning"
			cancelText="取消"
			confirmText="确定"
			title="警告"
			content="你确定要删除该分区吗"
			@confirm="confirmDeleteZone"
		></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import List from './List/index';
import useStore from '@/pinia/index.js';
import { storeToRefs } from 'pinia';
const store = useStore();
const { currentZone, zoneList } = storeToRefs(store.product);

const chooseZone = item => {
	currentZone.value = item;
	store.product.getPhotograph();
};
onShow(async () => {
	await store.product.getZoneList();
	store.product.getPhotograph();
});
const addZonePopup = ref();
const db = uniCloud.database();

const ifShowManagementZone = ref(false);
//分区管理
const managementZone = () => {
	ifShowManagementZone.value = !ifShowManagementZone.value;
};

// 新建分区
const openAddZone = () => {
	addZonePopup.value.open();
};
const confirmAddZone = async e => {
	await db.collection('zone').add({
		zone: e,
		mold: '',
		photograph: []
	});
	await store.product.getZoneList();
	store.product.getPhotograph();
	uni.showToast({
		title: '新增分区成功',
		icon: 'none'
	});
};

// 删除分区
const deleteZonePopup = ref();
const openDeleteZone = () => {
	deleteZonePopup.value.open('center');
};
const confirmDeleteZone = () => {
	uni.showLoading({
		title: '删除中'
	});
	Promise.all(
		currentZone.value.photograph.map(item => {
			return db
				.collection('popularity')
				.where(`_id=='${item}'`)
				.remove();
		})
	).then(() => {
		db.collection('zone')
			.where(`_id=='${currentZone.value._id}'`)
			.remove()
			.then(() => {
				uni.showToast({
					title: '删除分区成功',
					icon: 'success'
				});
				uni.hideLoading();
			});
	});
};
</script>

<style lang="scss" scoped>
.product {
	display: flex;
	justify-content: space-between;
	.zone {
		display: flex;
		align-items: center;
		&-item {
			padding: 30rpx;
			border: 1rpx solid #ccc;
			position: relative;
			.cancel {
				position: absolute;
				top: 0;
				right: 0;
			}
		}
		.active {
			background: skyblue;
			color: white;
		}
		.addZone {
			margin-left: 20rpx;
			width: 100rpx;
			height: 100rpx;
			box-shadow: 0 0 10rpx #ccc;
			display: flex;
			align-items: center;
			justify-content: center;
			background: skyblue;
		}
	}
	.management {
		height: 100rpx;
		background: skyblue;
		color: #fff;
		width: 200rpx;
		line-height: 100rpx;
		text-align: center;
	}
}
</style>
