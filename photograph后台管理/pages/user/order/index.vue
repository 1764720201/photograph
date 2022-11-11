<template>
	<uni-data-select
		:localdata="range"
		@change="change"
		placeholder="请选择筛选的条件"
	></uni-data-select>
	<unicloud-db
		ref="udb"
		v-slot:default="{ data, loading, error, options }"
		collection="subscribe"
		field="_id,time,types,total,store,state"
		:where="where"
	>
		<view v-if="error">{{ error.message }}</view>
		<view v-else class="list">
			<view class="item" v-for="item in data" :key="item._id">
				<view class="header">
					<view class="left">
						<view class="order-num">
							订单号:{{ item._id.toUpperCase().slice(0, 15) }}
						</view>
						<view class="state state-0" v-if="item.state == 0">
							待拍摄
						</view>
						<view class="state state-1" v-if="item.state == 1">
							进行中
						</view>
						<view class="state state-2" v-if="item.state == 2">
							已完成
						</view>
						<view class="state state-3" v-if="item.state == 3">
							已取消
						</view>
						<view class="total">￥{{ item.total.toFixed(2) }}</view>
					</view>
					<view class="operate">
						<view
							class="operate-name"
							@click="changeOperate(item._id)"
						>
							操作
						</view>
						<view
							class="operate-content"
							v-if="item._id == currentOperate"
						>
							<view class="item" @click="openOperate('already')">
								已完成
							</view>
							<view class="item" @click="openOperate('start')">
								开始拍摄
							</view>
							<view class="item" @click="openOperate('cancel')">
								取消
							</view>
						</view>
					</view>
				</view>

				<view class="types">
					<view class="type" v-for="ty in item.types" :key="ty.value">
						<image
							class="image"
							:src="ty.image"
							mode="aspectFill"
						></image>
						<view class="name">{{ ty.name }}</view>
					</view>
				</view>
				<view class="footer">
					<view class="time">{{ item.time }}</view>
					<view class="store-name">{{ item.store }}</view>
				</view>
			</view>
		</view>
	</unicloud-db>
	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog
			cancelText="关闭"
			confirmText="同意"
			title="提现"
			:content="content"
			@confirm="dialogConfirm"
		></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
import { reactive, ref } from 'vue';
const where = ref('state!=4');
// 筛选选项
const range = reactive([
	{
		value: 0,
		text: '全部'
	},
	{
		value: 1,
		text: '待拍摄'
	},
	{
		value: 2,
		text: '进行中'
	},
	{
		value: 3,
		text: '已完成'
	},
	{
		value: 4,
		text: '已取消'
	}
]);
const change = e => {
	if (e >= 1) {
		where.value = `state==${e - 1}`;
	} else {
		where.value = 'state!=4';
	}
};
const currentOperate = ref('');
const changeOperate = id => {
	if (currentOperate.value == id) {
		currentOperate.value = '';
	} else {
		currentOperate.value = id;
	}
};
const alertDialog = ref();
const currentType = ref();
const content = ref();
const openOperate = type => {
	currentType.value = type;
	switch (type) {
		case 'already':
			content.value = '你确定已完成了吗';
			break;
		case 'start':
			content.value = '是否开始拍摄';
			break;
		case 'cancel':
			content.value = '是否取消订单';
			break;
	}
	alertDialog.value.open('center');
};
const db = uniCloud.database();
const udb = ref();
const dialogConfirm = async () => {
	const state = ref(0);
	switch (currentType.value) {
		case 'already':
			state.value = 2;
			break;
		case 'start':
			state.value = 1;
			break;
		case 'cancel':
			state.value = 3;
			break;
	}
	await db
		.collection('subscribe')
		.where(`_id=='${currentOperate.value}'`)
		.update({
			state: state.value
		});
	currentOperate.value = '';
	udb.value.refresh();
};
</script>

<style lang="scss" scoped>
.list {
	.item {
		padding: 20rpx;
		margin-top: 30rpx;
		border-bottom: 1rpx solid #666;
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left {
				display: flex;
				align-items: center;
				.order-num {
					font-weight: 900;
					margin-left: 30rpx;
				}
				.total {
					margin-left: 50rpx;
					color: red;
					font-weight: 900;
				}
				.state {
					margin-left: 30rpx;
					padding: 5rpx;
					&-0 {
						color: red;
						border: 1rpx solid red;
					}
					&-1 {
						color: plum;
						border: 1rpx solid plum;
					}
					&-2 {
						color: palegreen;
						border: 1rpx solid palegreen;
					}
					&-3 {
						color: #666;
						border: 1rpx solid #666;
					}
				}
			}
			.operate {
				position: relative;
				&-content {
					border-radius: 20rpx;
					left: -160rpx;
					width: 200rpx;
					position: absolute;
					text-align: center;
					background-color: #000;
					color: #fff;
				}
			}
		}
		.types {
			margin-top: 30rpx;
			align-items: center;
			display: flex;
			.type {
				margin-left: 30rpx;
				width: 200rpx;
				.image {
					border-radius: 30rpx;
					width: 200rpx;
					height: 200rpx;
				}
				.name {
					font-size: 25rpx;
				}
			}
		}
		.footer {
			margin-top: 30rpx;
			margin-left: 30rpx;
			.time {
				font-weight: 900;
			}
			.store-name {
				color: #666;
				font-size: 20rpx;
			}
		}
	}
}
</style>
