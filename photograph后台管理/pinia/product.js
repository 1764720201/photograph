import {
	defineStore
} from 'pinia'
export const useProduct = defineStore({
	id: 'product',
	state: () => ({
		currentZone: {},
		currentPhotograph: [],
		zoneList: [],
		range: [{
				value: 0,
				text: '单人拍摄'
			},
			{
				value: 1,
				text: '双人拍摄'
			},
			{
				value: 2,
				text: '多人拍摄'
			}
		]
	}),
	getters: {
		currentMold: (state) => {
			const item = state.range.map((item) => {
				return item.text
			})
			return item.indexOf(state.currentZone.mold)
		}
	},
	actions: {
		async getZoneList() {
			const db = uniCloud.database()
			await db.collection('zone').get().then((res) => {
				this.zoneList = res.result.data
				this.currentZone = res.result.data[0]

			})
		},
		async getPhotograph() {
			const db = uniCloud.database()
			await db.collection('zone').where(`_id=='${this.currentZone._id}'`).get().then(res => {
				this.currentPhotograph = res.result.data[0].photograph
			})
		}
	}
})
