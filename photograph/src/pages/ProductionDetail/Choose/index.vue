<template>
  <view class="choose">
    <view class="header">
      <view class="title">{{ detail.title }}</view>
      <view class="right">
        <view class="price">￥{{ price?.toFixed(2) }}</view>
        <image
          class="start-font"
          src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3f22a4dd-0664-4954-b0c5-c4ebbcd74405/6cfc3a7a-2c45-4313-8130-5c3aabed4057.png"
          mode="aspectFill"
        ></image>
      </view>
    </view>
    <view class="footer" @click="openChoose">
      <view class="tip">请选择拍摄产品</view>
      <!-- 取消弹出层 -->
      <uni-icons type="right" size="22" color="#000"></uni-icons>
    </view>
  </view>
  <uni-popup
    ref="choose"
    type="bottom"
    :safeArea="false"
    backgroundColor="#fff"
  >
    <view class="choose-popup">
      <view class="header">
        <view class="title">选择拍摄产品</view>
        <uni-icons type="close" size="20" @click="cancelPopup"></uni-icons>
      </view>
      <view class="types">
        <view class="images">
          <view v-for="item in detail.types" :key="item.value">
            <view class="item" v-if="typeList.indexOf(item.value) >= 0">
              <image class="image" :src="item.url" mode="aspectFill"></image>
              <view class="name">{{ item.name }}</view>
            </view>
          </view>
        </view>
        <view class="select">
          <view class="title">产品类型</view>
          <view class="select-list">
            <view
              @click="selectType(item.value)"
              class="item"
              v-for="item in detail.types"
              :key="item.value"
              :class="typeList.indexOf(item.value) != -1 ? 'active' : ''"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
      <view class="tabbar">
        <view class="left">
          <view class="price">
            <view class="ultimately-price">
              合计 ￥{{ detail?.price?.toFixed(2) }}
            </view>
            <view class="origin-price" v-if="typeList.length > 1">
              ￥{{ originPrice?.toFixed(2) }}
            </view>
          </view>
          <view class="tips">实际支付金额以订单确认页为准</view>
        </view>
        <view class="confirm" @click="confirm">确认</view>
      </view>
    </view>
  </uni-popup>
</template>
<script lang="ts" setup>
const { detail, price,typeList} = useStore('productionDetail');
const { getShopping,currentChangeShopping,currentSubscribe} =useStore('user')
const chooseType=ref<string>()

const choose = ref(null);
// 打开底部弹出层
const openChoose = () => {
  chooseType.value='appointment'
  currentChangeShopping.value={
    _id:'',
    title:'',
    image:'',
    price:0,
    name:'',
  }
  //@ts-ignore
  choose.value.open();
};
// 取消弹出层
const cancelPopup = () => {
  //@ts-ignore
  choose.value.close();
};
// 购物车修改时获取修改的下标值


// 打折前价格
const originPrice = ref<number>();

// 当前选择的产品类型


// 选择类型
const selectType = (index: number) => {
  if(currentChangeShopping.value._id){
    typeList.value[0]=index
  }else{
    originPrice.value = price.value;
    detail.value.price = price.value;
    // 获取选择的类型的下标值
    const currentIndex = typeList.value.indexOf(index);
    // 如果选择的类型不存在，那么就添加该类型
    if (currentIndex == -1) {
      typeList.value.push(index);
      // 如果选择的类型已经存在那么就删除
    } else {
      typeList.value.splice(currentIndex, 1);
    }
    // 如果选择的类型大于1，那么就出现优惠价格
    if (typeList.value.length > 1) {
      originPrice.value = detail.value.price * typeList.value.length;
      detail.value.price = originPrice.value * 0.9;
      // 如果没有选择类型，那么价格为0
    } else if (typeList.value.length == 0) {
      detail.value.price = 0;
    }
  }
  // 每次选择都初始化 初始价格和优惠后的价格

};
const instance=getCurrentInstance()
// 从兄弟组件接受数据
instance?.proxy?.$Bus.on('openChoose',(type)=>{
  //@ts-ignore
  chooseType.value=type
  if(type!='shoppingCart'){
    currentChangeShopping.value={
      _id:'',
      title:'',
      image:'',
      price:0,
      name:''
    }
    typeList.value=[0]
  }
  //@ts-ignore
  choose?.value?.open();
})
const db=uniCloud.database()
const confirm=async()=>{
  if(chooseType.value=='appointment'){
    detail.value.types.forEach(item=>{
      if(typeList.value.indexOf(item.value)!=-1 ){
        currentSubscribe.value.push({
          name:item.name,
          image:item.url,
          price:price.value
        })
      }
    })
    uni.navigateTo({
      url:'/pages/Subscribe/index'
    })
     // 打开的类型是购物车，那么确定键就是加入购物车
  }else if(chooseType.value=='shopping'){
    // 根据选中的下标值，返回新的数组，数组的每一项包括类型名称和类型图片
     const newTypeList=typeList.value.map((item)=>{
          return detail.value.types[item]
    })
   // 根据每一个选中的类型，进行一次数据库的添加
   Promise.all(newTypeList.map(item=>{
    return db.collection('shoppingCart').add({
      title:detail.value.title,
      name:item.name,
      image:item.url,
      price:price.value
     })
   })).then(()=>{
     // 获取购物车的数据
     getShopping()
     uni.showToast({
       title:'添加成功',
       icon:'none'
     })
   })

  }else{
    // 更新购物车
    const type=detail.value.types[typeList.value[0]]
    await db.collection('shoppingCart')
    .where(`_id=='${currentChangeShopping.value._id}'`)
    .update({
      image:type.url,
      name:type.name,
    })
    getShopping().then(()=>{
      // 打开购物车
       instance?.proxy?.$Bus.emit('openShoppingCart')
    })
  }
  // 弹窗关闭
  //@ts-ignore
  choose?.value.close()
}
</script>

<style lang="scss" scoped>
.choose {
  width: 90%;
  top: 720rpx;
  position: absolute;
  padding: 20rpx;
  background-color: #ecebec;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 290rpx;
  border-radius: 20rpx;
  box-shadow: 0 0 10rpx #ccc;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-weight: 900;
      font-size: 38rpx;
    }
    .right {
      display: flex;
      align-items: center;
      .price {
        font-weight: 900;
        font-size: 35rpx;
        margin-right: 10rpx;
      }
      .start-font {
        width: 80rpx;
        height: 80rpx;
      }
    }
  }
  .footer {
    padding: 30rpx 20rpx;
    display: flex;
    align-items: center;
    background-color: #e3e2e3;
    justify-content: space-between;
    border-radius: 20rpx;
    color: #666;
    font-size: 26rpx;
  }
}

.choose-popup {
  height: 1250rpx;
  padding: 30rpx;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 40rpx;
      font-weight: 900;
    }
  }
  .types {
    margin-top: 50rpx;
    .images {
      margin-left: -20rpx;
      display: flex;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #ccc;
      .item {
        margin-left: 20rpx;
        position: relative;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .image {
          width: 160rpx;
          height: 160rpx;
          border-radius: 10rpx;
          box-shadow: 0 0 10rpx #ccc;
        }
        .name {
          position: absolute;
          color: white;
          bottom: 2rpx;
          font-size: 23rpx;
          font-weight: 900;
        }
      }
    }
    .select {
      .title {
        font-size: 30rpx;
        margin-top: 50rpx;
      }
      &-list {
        display: flex;
        margin-left: -20rpx;
        .item {
          margin-top: 20rpx;
          margin-left: 20rpx;
          height: 60rpx;
          width: 150rpx;
          border-radius: 30rpx;
          border: 1rpx solid #ccc;
          text-align: center;
          line-height: 60rpx;
          font-size: 25rpx;
        }
        .active {
          color: green;
          border: 1rpx solid green;
          background-color: #dcffdf;
        }
      }
    }
  }
  .tabbar {
    width: 100%;
    padding: 20rpx;
    position: fixed;
    height: 200rpx;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 5rpx #ccc;
    .left {
      display: flex;
      flex-direction: column;
      .price {
        display: flex;
        align-items: baseline;
        .ultimately-price {
          font-size: 35rpx;
          font-weight: 900;
        }
        .origin-price {
          margin-left: 10rpx;
          text-decoration: line-through;
        }
      }
      .tips {
        font-size: 23rpx;
        color: #666;
      }
    }
    .confirm {
      height: 80rpx;
      width: 250rpx;
      color: white;
      background-color: black;
      border-radius: 30rpx;
      text-align: center;
      line-height: 80rpx;
      font-weight: 900;
    }
  }
}
</style>
