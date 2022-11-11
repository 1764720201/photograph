<template>
  <uni-popup ref="shopping" type="bottom" :safeArea="false">
    <!-- 购物车 -->
    <view class="shopping-cart">
      <view class="header">
        <view class="left">
          <view class="title">购物车</view>
          <view class="tip">
            (同时下单多个产品时,
            <text class="emphasize">限同一人拍摄</text>
            )
          </view>
        </view>
        <uni-icons
          type="trash"
          size="25"
          @click="cancelAllShopping"
        ></uni-icons>
      </view>
      <view class="store-name"><view class="name">半度摄影</view></view>
      <view class="without-shopping" v-if="shoppingCart.length == 0">
        <image
          class="without-image"
          src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/15112fcd-050b-4771-b656-b314e431bf2f.png"
          mode="aspectFill"
        ></image>
        <view class="tip">您还没有加购产品哦</view>
      </view>
      <scroll-view scroll-y="true" style="height: 900rpx;" v-else>
        <view class="shopping-cart-list">
          <view class="item" v-for="item in shoppingCart" :key="item._id">
            <view
              @click="checkOne(item)"
              :class="
                currentShoppingName.indexOf(item.name) != -1
                  ? 't-icon t-icon-xuanzhong'
                  : 't-icon t-icon-weixuanzhong'
              "
            ></view>
            <image class="image" :src="item.image" mode="aspectFill"></image>
            <view class="right">
              <view class="header">
                <view class="title">{{ item.title }}</view>
                <uni-icons
                  type="closeempty"
                  size="23"
                  @click="cancelShopping(item._id)"
                ></uni-icons>
              </view>
              <view class="price">￥{{ item.price }}</view>
              <view class="type" @click="changeType(item)">
                <view class="name">{{ item.name }}</view>
                <view class="bottom">
                  <uni-icons type="bottom" size="12"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="shopping-cart-tabbar">
        <view class="left">
          <view
            :class="
              `t-icon ${
                ifAllSelect && shoppingCart.length > 0
                  ? 't-icon-xuanzhong'
                  : 't-icon-weixuanzhong'
              }`
            "
            @click="checkAll"
          ></view>
          <view class="title">全选</view>
          <view class="total-price">
            ￥{{
              currentCart.length > 1
                ? (totalCartPrice * 0.9).toFixed(2)
                : totalCartPrice.toFixed(2)
            }}
          </view>
        </view>
        <view
          class="appointment"
          @click="goSubscribe"
          :class="currentCart.length == 0 ? 'stop' : ''"
        >
          去预约
        </view>
      </view>
    </view>
  </uni-popup>
  <uni-popup ref="cancel" type="dialog">
    <uni-popup-dialog
      type="warning"
      cancelText="取消"
      confirmText="确认"
      title="提示"
      :content="content"
      @confirm="confirmCancel"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import {ShoppingCart} from '@/types/user'
const {shoppingCart,totalCartPrice,currentCart,ifAllSelect,getCurrentChangeShopping,currentChangeShopping,currentShoppingName,currentSubscribe,userId,getShopping}=useStore('user')
const { getProductionDetail,typeList,detail} =useStore('productionDetail')
const db=uniCloud.database()
const shopping = ref(null);
// 更换购物车种的类型
const instance=getCurrentInstance()
onShow(()=>{
  instance?.proxy?.$Bus.on('openShoppingCart',()=>{
    //@ts-ignore
   shopping.value?.open();
  })
})
const changeType=async(shoppingCart:ShoppingCart)=>{
  // 获取点击的shopping
  await getCurrentChangeShopping(shoppingCart)
  await db.collection('popularity')
    .where(`title=='${shoppingCart.title}'`)
    .field('_id')
    .get()
    .then(async(res)=>{
      // @ts-ignore
        if(getCurrentPages()[0].$page.fullPath!='/pages/ProductionDetail/index'){
          uni.navigateTo({
            url:'/pages/ProductionDetail/index'
          })
        }
        await getProductionDetail(res.result.data[0]._id)
        typeList.value.length=0
        for(const item of detail.value.types){
          if(item.name==currentChangeShopping.value.name){
              typeList.value.push(item.value)
          }
        }
        //@ts-ignore
      shopping.value.close()
      instance?.proxy?.$Bus.emit('openChoose','shoppingCart')
    })
}
const currentSelectName=ref<string>()
// 选中一个购物车
const checkOne=(shoppingCart:ShoppingCart) =>{
  currentSelectName.value=shoppingCart.name
  const selected=ref(currentCart.value.filter((item)=>item.name==shoppingCart.name))
  if(selected.value[0]){
    currentCart.value=currentCart.value.filter((item)=>item.name!=shoppingCart.name)
  }else{
    currentCart.value.push({
      image:shoppingCart.image,
      price:shoppingCart.price,
      name:shoppingCart.name
    })
  }
}
// 如果没有全部选中，那么就全选，如果已经全选了，那么就全部取消
const checkAll=()=>{
  if(ifAllSelect.value){
    currentCart.value.length=0
  }else{
    currentCart.value = shoppingCart.value.map(item => {
    return { name: item.name, image: item.image[0], price: item.price };
  });
  }
}

// 去预约界面
const goSubscribe=async()=>{
  //@ts-ignore
   if(getCurrentPages()[0].$page.fullPath!='/pages/ProductionDetail/index'){
    await  db.collection('popularity')
    .where(`title=='${shoppingCart.value[0].title}'`)
    .field('_id').get({getOne:true})
    .then((res)=>{
        getProductionDetail(res.result.data._id)
  })
}
  [...currentSubscribe.value]=currentCart.value
  uni.navigateTo({
    url:'/pages/Subscribe/index'
  })
}

const content=ref<string>('')
const currentCancelId=ref<string>()
const cancel=ref(null)

// 取消的方式  0表示取消单个  1表示全部取消
const cancelType=ref<number>(0)

// 打开取消购物车单个的提示框
const cancelShopping=(id:string)=>{
  content.value='是否确定删除'
  cancelType.value=0
  // @ts-ignore
  cancel.value.open('center')
  currentCancelId.value=id
}


// 打开取消全部购物车的提示框
const cancelAllShopping=()=>{
  content.value='确定移除所有产品吗?'
  cancelType.value=1
   // @ts-ignore
  cancel.value.open('center')
}

// 确认取消
const confirmCancel=async()=>{
  if(cancelType.value){
    await db.collection('shoppingCart').where(`user_id=='${userId.value}'`).remove()
  }else{
    await db.collection('shoppingCart').where(`_id=='${currentCancelId.value}'`)
    .remove()
  }
  uni.showToast({
    title:"取消成功",
    icon:"none"
  })
  getShopping()
}
onHide(()=>{
  instance?.proxy?.$Bus.all.clear()
})
</script>

<style lang="scss" scoped>
.shopping-cart {
  padding: 30rpx;
  background-color: white;
  height: 1250rpx;
  border-top-right-radius: 10rpx;
  border-top-left-radius: 10rpx;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .title {
        font-weight: 900;
        font-size: 35rpx;
      }
      .tip {
        margin-left: 15rpx;
        .emphasize {
          font-weight: 900;
        }
      }
    }
  }
  .store-name {
    margin-top: 50rpx;
    background-color: #f4f4f4;
    font-weight: 900;
    width: 750rpx;
    margin-left: -30rpx;
    .name {
      font-size: 35rpx;
      padding: 10rpx 30rpx;
    }
  }
  .without-shopping {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-top: 20%;
    .without-image {
      width: 320rpx;
      height: 320rpx;
    }
    .tip {
      font-size: 35rpx;
      margin-top: 50rpx;
      color: #666;
    }
  }
  &-list {
    margin-top: -40rpx;
    width: 100%;
    .item {
      margin-top: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .t-icon {
        width: 40rpx;
        height: 40rpx;
      }
      .image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 20rpx;
        margin-left: -20rpx;
      }
      .right {
        height: 200rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .header {
          width: 380rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 33rpx;
          font-weight: 900;
        }
        .price {
          margin-top: -40rpx;
          font-size: 33rpx;
          font-weight: 900;
        }
        .type {
          padding: 8rpx 15rpx;
          display: flex;
          align-items: center;
          width: 350rpx;
          justify-content: space-between;
          border: 1rpx solid #ccc;
          border-radius: 30rpx;
          .bottom {
            padding-left: 10rpx;
            border-left: 1rpx solid #ccc;
          }
        }
      }
    }
  }
  &-tabbar {
    width: 100%;
    padding: 40rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 150rpx;
    box-shadow: 0 0 10rpx #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      width: 300rpx;
      justify-content: space-between;
      font-weight: 900;
      font-size: 35rpx;
      .t-icon {
        width: 50rpx;
        height: 50rpx;
      }
    }
    .appointment {
      width: 250rpx;
      height: 90rpx;
      color: white;
      background-color: #000;
      text-align: center;
      line-height: 90rpx;
      font-size: 31rpx;
      font-weight: 900;
      border-radius: 40rpx;
    }
    .stop {
      background-color: #ccc;
    }
  }
}
</style>
