<template>
	<view class="body">
		<view class="header">
			<view class="item discounts">
				<view class="amout">
					0
					<text class="sheet">张</text>
				</view>

				<view class="name">优惠券</view>
			</view>
			<view class="item commemorate">
				<view class="amout">0</view>
				<view class="name">纪念值</view>
			</view>
			<view class="item medal">
				<view class="amout">0</view>
				<view class="name">勋章</view>
			</view>
			<view class="item present">
				<view class="amout">0</view>
				<view class="name">礼品卡</view>
			</view>
		</view>
		<view class="footer"></view>
	</view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.body {
	margin-top: 30rpx;
	width: 92%;
	margin-left: 4%;
	.header {
		height: 150rpx;
		display: flex;
		align-items: center;
		background-color: white;
		border-radius: 20rpx;
		.item {
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.amout {
				font-weight: 900;
				font-size: 44rpx;
				.sheet {
					font-size: 33rpx;
					font-weight: normal;
				}
			}
			.name {
				margin-top: 5rpx;
				font-size: 25rpx;
				color: #a0a0a0;
			}
		}
		.discounts,
		.medal {
			flex: 2;
		}
		.commemorate,
		.present {
			flex: 3;
		}
		.discounts,
		.commemorate,
		.medal {
			border-right: 1rpx solid #e0e0e0;
		}
	}
}
</style>
