import { Mold } from '@/types/productionDetail';
export default defineStore({
  id: 'product',
  state: () => ({
    headerTabWhere: <string>"mold!='全部'",
    currentLeftTab: <string>'',
    currentMold: <Mold[]>[]
  }),
  actions: {
    async getCurrentLeftTab() {
      const db = uniCloud.database();
      await db
        .collection('zone')
        .where(this.headerTabWhere)
        .field('zone')
        .get({ getOne: true })
        .then(res => {
          this.currentLeftTab = res.result.data.zone;
        });
    },
    async getMold() {
      const db = uniCloud.database();
      await db
        .collection('zone')
        .where(`zone=='${this.currentLeftTab}'`)
        .get()
        .then(res => {
          this.currentMold.length = 0;
          res.result.data[0].photograph.forEach((item: string) => {
            db.collection('popularity')
              .where(`_id=='${item}'`)
              .get({ getOne: true })
              .then(res => {
                const data = res.result.data;
                this.currentMold.push({
                  image: data.image,
                  title: data.title,
                  _id: data._id
                });
              });
          });
        });
    }
  },
  getters: {}
});
