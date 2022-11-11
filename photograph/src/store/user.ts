import { UserInfo, ShoppingCart, Subscirbe } from '@/types/user';
export default defineStore({
  id: 'user',
  state: () => {
    return {
      userInfo: <UserInfo>{},
      shoppingCart: <ShoppingCart[]>[],
      currentCart: <Subscirbe[]>[],
      currentChangeShopping: <ShoppingCart>{},
      currentSubscribe: <Subscirbe[]>[],
      currentCity: <{ cityName: string; cityCode: number }>{}
    };
  },
  getters: {
    userId: state => state.userInfo._id,
    shoppingNum: state => state.shoppingCart.length,
    // 是否全选
    ifAllSelect: state => {
      if (state.shoppingCart.length == state.currentCart.length) {
        return true;
      } else {
        return false;
      }
    },
    // 购物车的总价
    totalCartPrice: state => {
      return state.currentCart.reduce((pre, cur) => {
        return pre + cur.price;
      }, 0);
    },
    currentShoppingName: state => {
      return state.currentCart.map(item => {
        return item.name;
      });
    },
    // 预约总价
    totalSubscribe: state => {
      return state.currentSubscribe.reduce((pre, cur) => {
        return pre + cur.price;
      }, 0);
    },
    haveDiscount: state => {
      if (state.currentSubscribe.length <= 1) {
        return 0;
      } else {
        return (
          state.currentSubscribe.reduce((pre, cur) => {
            return pre + cur.price;
          }, 0) * 0.1
        );
      }
    }
  },
  actions: {
    async getUserInfo() {
      const db = uniCloud.database();
      await db
        .collection('uni-id-users')
        .where('_id==$cloudEnv_uid')
        .field('_id,nickname,avatar_file,register_date,birthday,gender')
        .get({ getOne: true })
        .then(res => {
          Object.assign(this.userInfo, res.result.data);
        });
    },
    async login() {
      uni.navigateTo({
        url:
          '/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin'
      });
    },
    async getShopping() {
      const db = uniCloud.database();
      await db
        .collection('shoppingCart')
        .where(`user_id=='${this.userId}'`)
        .get()
        .then(res => {
          this.shoppingCart = res.result.data;
        });
      this.currentCart = this.shoppingCart.map(item => {
        return { name: item.name, image: item.image, price: item.price };
      });
    },
    async getCurrentChangeShopping(shopping: ShoppingCart) {
      this.currentChangeShopping = shopping;
    }
  }
});
