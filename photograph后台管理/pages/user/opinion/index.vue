<template>
	<uni-data-select
		:localdata="questionTypeList"
		@change="change"
	></uni-data-select>
	<unicloud-db
		ref="udb"
		v-slot:default="{ data, loading, error, options }"
		collection="opinion"
		field="phone,content,type,_id,create_time"
		:where="where"
		orderby="create_time desc"
	>
		<view v-if="error">{{ error.message }}</view>
		<view v-else>
			<view class="item" v-for="item in data" :key="item._id">
				<view class="header">
					<view class="time">
						<uni-dateformat
							:date="item.create_time"
							format="yyyy/MM/dd hh:mm:ss"
						></uni-dateformat>
					</view>
					<view class="type">{{ item.type }}</view>
				</view>
				<view class="content">{{ item.content }}</view>
			</view>
		</view>
	</unicloud-db>
</template>

<script setup>
import { reactive, ref } from 'vue';
const where = ref('type!=4');
const questionTypeList = reactive([
	{
		value: 0,
		text: '全部'
	},
	{
		value: 1,
		text: '门店服务'
	},
	{
		value: 2,
		text: '产品研发'
	},
	{
		value: 3,
		text: '总部修图'
	},
	{
		value: 4,
		text: '线上预约'
	},
	{
		value: 5,
		text: '会员相关'
	},
	{
		value: 6,
		text: '新店拓展'
	},
	{
		value: 7,
		text: '其他问题'
	}
]);
const change = e => {
	if (e > 0) {
		where.value = `type=='${questionTypeList[e]?.text}'`;
	} else {
		where.value = "type!='全部'";
	}
};
</script>

<style lang="scss" scoped>
.item {
	padding: 20rpx;
	border-bottom: 1rpx solid #ccc;
	.header {
		display: flex;
		align-items: center;
		.type {
			margin-left: 15rpx;
			border-radius: 20rpx;
			padding: 5rpx;
			background-color: red;
			color: #fff;
		}
		.time {
			color: #666;
			font-size: 27rpx;
		}
	}
	.content {
		margin-top: 30rpx;
	}
}
</style>
