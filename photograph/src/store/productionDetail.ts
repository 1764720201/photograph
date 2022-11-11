import { Detail } from '@/types/productionDetail';
export default defineStore({
  id: 'productionDetail',
  state: () => {
    return {
      detail: <Detail>{},
      price: <number>0,
      typeList: <number[]>[0],
      currentStoreName: '半度摄影',
      currentSubscribeDate: '请选择',
      currentOption: 0
    };
  },
  actions: {
    async getProductionDetail(id: string) {
      const db = uniCloud.database();
      await db
        .collection('popularity')
        .where(`_id=='${id}'`)
        .get({ getOne: true })
        .then(res => {
          Object.assign(this.detail, res.result.data);
          this.price = res.result.data.price;
        });
    }
  },
  getters: {}
});
