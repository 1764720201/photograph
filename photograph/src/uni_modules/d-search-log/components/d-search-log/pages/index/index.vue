
<template>
	<view>
		
		<cu-custom bgColor="my-theme-bg" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">搜索页面</block>
		</cu-custom>
		
		<d-search-log 
		:color_border="color_border"
		:color_text="color_border"
		:search_list_hot="search_list_hot"
		:store_key="store_key"
		:input_text="input_text"
		@onClickDelAllApi="onClickDelAll"
		@onSearchNameApi="onSearchName"
		></d-search-log>
		
		
		
	</view>
</template>

<script>
	import dSearchLog from '@/uni_modules/d-search-log/components/d-search-log/d-search-log.vue'
	import dAlert from '@/uni_modules/d-alert/components/d-alert/d-alert.vue'
	
	export default {
		components: {
			"dSearchLog": dSearchLog,
			"dAlert": dAlert,
		},
		computed:{
			
		},

		data() {
			return {
				color_border:"#ff00ff",
				search_list_hot:[],
				store_key:'search_list',
				input_text:''
			}
		},
		onLoad() {
			var that = this
			if (true) {
				setTimeout(function(){
					that.input_text = 'dev'
				},1000)
			}
			
			
			this.search_list_hot = [
				'手机','电脑','河南老君山','三亚一游','北京环球影城','杭州西湖','保定驴肉火烧','保定狼牙山玻璃栈道'
			]
			
			// this._open_tan()
		},
		methods: {
			onClickDelAll() {
				console.log('[父级接收事件]：删除全部搜索记录')
			},
			onSearchName(e) {
				console.log('[父级接收事件]：点击搜索:'+e)
			},
			
		
			 
			// 
		}
	}
</script>

<style>
	page {
		/* background-color: #f2f2f2; */
	}
	.my-theme-bg {
		background: linear-gradient(117deg,#60DF9D,#31CB7B);
		color:#fff;

	}
</style>