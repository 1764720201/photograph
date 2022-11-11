export default {
	login: {
		url: '/uni_modules/uni-id-pages/pages/login/login-withpwd' // 登录页面路径
	},
	index: {
		url: '/pages/index/index' // 登录后跳转的第一个页面
	},
	error: {
		url: '/pages/error/404' // 404 Not Found 错误页面路径
	},
	navBar: { // 顶部导航
		logo: '/static/logo.png', // 左侧 Logo
		langs: [{
			text: '中文简体',
			lang: 'zh-Hans'
		}, {
			text: '中文繁體',
			lang: 'zh-Hant'
		}, {
			text: 'English',
			lang: 'en'
		}],
		debug: {
			enable: process.env.NODE_ENV !== 'production', //是否显示错误信息
			engine: [{ // 搜索引擎配置（每条错误信息后，会自动生成搜索链接，点击后跳转至搜索引擎）
				name: '百度',
				url: 'https://www.baidu.com/baidu?wd=ERR_MSG'
			}, {
				name: '谷歌',
				url: 'https://www.google.com/search?q=ERR_MSG'
			}]
		}
	},
	sideBar: {
		staticMenu: [{
			menu_id: "demo",
			text: '用户',
			icon: 'admin-icons-kaifashili',
			url: "",
			children: [{
				menu_id: "icons",
				text: '用户订单',
				icon: 'admin-icons-icon',
				value: '/pages/user/order/index',
			}, {
				menu_id: "icons",
				text: '意见反馈',
				icon: 'admin-icons-icon',
				value: '/pages/user/opinion/index',
			}],
		}, {
			menu_id: "photography",
			text: '用户端',
			icon: 'admin-icons-kaifashili',
			url: "",
			children: [{
				menu_id: "icons",
				text: '全部产品',
				icon: 'admin-icons-icon',
				value: '/pages/photograph/product/index',
			}],
		}]

	},
	uniStat: {
		// 上传 sourceMap 文件至腾讯云服务空间 ID。空值代表不启用 sourceMap 上报错误回溯源码功能
		uploadSourceMapCloudSpaceId: '',
		// 要上传到的腾讯云云存储访问地址
		cloudSourceMapUrl: ''
	}
}
