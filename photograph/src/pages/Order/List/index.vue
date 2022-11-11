<template>
  <scroll-view scroll-y="true" style="height: 1165rpx;">
    <unicloud-db
      v-slot:default="{ data, loading, error, options }"
      collection="subscribe"
      :where="props.where"
      orderby="create_time desc"
      field="_id,types,time,store,total,create_time,state"
      ref="udb"
    >
      <view v-if="error">{{ error.message }}</view>
      <view v-else>
        <view class="list">
          <view class="item" v-for="item in data" :key="item._id">
            <view class="order-number">
              订单号：{{ item._id.toUpperCase().slice(0, 15) }}
            </view>
            <view class="order-info">
              <view class="types">
                <view
                  class="type"
                  v-for="(type, index) in item.types"
                  :key="index"
                >
                  <image
                    class="image"
                    :src="type.image"
                    mode="aspectFill"
                  ></image>
                  <view class="right">
                    <view class="name">{{ type.name }}</view>
                    <view class="total">￥{{ type.price.toFixed(2) }}</view>
                  </view>
                </view>
              </view>
              <view class="subscribe-info">
                <view
                  class="title"
                  @click="changeIfShowDetail(data.indexOf(item))"
                >
                  预约拍摄信息
                  <uni-transition show ref="ani">
                    <uni-icons type="top" size="15"></uni-icons>
                  </uni-transition>
                </view>
                <view v-show="currentShow.indexOf(data.indexOf(item)) != -1">
                  <view class="item">
                    <view class="label">拍摄门店：</view>
                    {{ item.store }}
                  </view>
                  <view class="item">
                    <view class="label">到店时间：</view>
                    {{ item.time }}
                  </view>
                  <view class="item">
                    <view class="label">发票服务：</view>
                    暂未开具发票
                  </view>
                </view>
              </view>
              <view class="price">
                <view class="discount-price">
                  已优惠:
                  <view class="discount-price-num">
                    ￥{{ ((item.total / 0.9) * 0.1).toFixed(2) }}
                  </view>
                </view>
                <view class="truth-price">
                  实付款:
                  <view class="truth-price-num">
                    ￥{{ item.total.toFixed(2) }}
                  </view>
                </view>
              </view>
            </view>
            <view class="order-footer">
              <view class="more">
                <view class="title" @click="openMore(item._id)">更多</view>
                <view class="more-content" v-if="item._id == currentMore">
                  <view class="other">其他问题</view>
                  <view class="line"></view>
                  <view class="remove" @click="openRemoveOrder(item.state)">
                    删除订单
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </unicloud-db>
  </scroll-view>
  <uni-popup ref="removeOrder" type="dialog">
    <uni-popup-dialog
      type="info"
      cancelText="取消"
      confirmText="确定"
      title="提示"
      :content="confirmContent"
      @confirm="confirmRemove"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
// 从父组件接受列表渲染条件
const props = defineProps<{ where: string }>();

// 存储要显示的订单
const currentShow = ref<number[]>([]);
// 存储显示更多的菜单

const udb = ref();
watch(
  () => props.where,
  () => {
    currentShow.value.length = 0;
    udb.value.$children.length = 0;
  }
);
// 动画效果
const changeIfShowDetail = (index: number) => {
  const showIndex = currentShow.value.indexOf(index);
  // 如果存储的订单详情中不包含点击的订单详情，那么就显示订单详情
  if (showIndex == -1) {
    udb.value.$children[index].step({
      rotate: -180
    });
    udb.value.$children[index].run(() => {
      currentShow.value.push(index);
    });
    // 如果存储的订单详情一键包含点击的订单详情，那么就隐藏订单详情
  } else {
    udb.value.$children[index].step({
      rotate: 0
    });
    udb.value.$children[index].run(() => {
      currentShow.value.splice(showIndex, 1);
    });
  }
};
const currentMore = ref<string>('');
// 打开更多菜单
const openMore = (id: string) => {
  if (currentMore.value != id) {
    currentMore.value = id;
  } else {
    currentMore.value = '';
  }
};
const confirmContent = ref<string>(
  '删除订单后,照片将无法恢复,我们将同步为您删除该订单相关的照片、圈圈动态、买家秀,是否确定删除?'
);
const removeOrder = ref();
// 打开删除订单的弹出层
const openRemoveOrder = (state: number) => {
  if (state == 3) {
    udb.value.remove(currentMore.value, {
      confirmContent: confirmContent.value
    });
  } else {
    removeOrder.value.open('center');
  }
};
const db = uniCloud.database();
const confirmRemove = async () => {
  await db
    .collection('subscribe')
    .where(`_id=='${currentMore.value}'`)
    .update({
      state: 3
    });
  currentMore.value = '';
  udb.value.refresh();
};
</script>

<style lang="scss" scoped>
.list {
  margin-top: -20rpx;
  .item {
    margin-top: 20rpx;
    background-color: white;
    .order-number {
      padding: 30rpx;
      font-weight: 900;
      font-size: 35rpx;
      border-bottom: 1rpx solid #ccc;
      display: flex;
      align-items: center;
    }
    .order-info {
      width: 90%;
      margin-left: 5%;
      .types {
        margin-top: -20rpx;
        .type {
          margin-top: 60rpx;
          display: flex;
          align-items: center;
          .image {
            width: 200rpx;
            height: 200rpx;
            border-radius: 20rpx;
            box-shadow: 0 0 10rpx #ccc;
          }
          .right {
            margin-left: 30rpx;
            font-weight: 900;
            display: flex;
            flex-direction: column;
            height: 180rpx;
            justify-content: space-between;
            .name {
              font-size: 35rpx;
            }
          }
        }
      }
      .subscribe-info {
        padding: 20rpx;
        margin-top: 30rpx;
        background-color: #f0f0f0;
        .title {
          font-size: 30rpx;
          font-weight: 900;
          display: flex;
          justify-content: space-between;
        }
        .item {
          margin-top: 30rpx;
          display: flex;
          align-items: center;
          background-color: #f0f0f0;
          color: #666;
          font-size: 26rpx;
          .label {
            font-weight: 900;
            color: #000;
            font-size: 28rpx;
          }
        }
      }
      .price {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 30rpx;
        padding-top: 20rpx;
        .discount-price {
          margin-right: 20rpx;
          display: flex;
          align-items: center;
          font-size: 27rpx;
          &-num {
            font-weight: 900;
          }
        }
        .truth-price {
          display: flex;
          align-items: center;
          font-size: 30rpx;
          &-num {
            font-weight: 900;
            font-size: 35rpx;
            color: red;
          }
        }
      }
    }
    .order-footer {
      border-top: 1rpx solid #ccc;
      padding: 40rpx 30rpx;
      .more {
        font-weight: 900;
        position: relative;
        .title {
          text-decoration: underline;
        }
        .more-content {
          bottom: -160rpx;
          left: 50rpx;
          position: absolute;
          height: 150rpx;
          width: 150rpx;
          border: 5rpx solid #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          background-color: #fff;
          .line {
            width: 100%;
            height: 5rpx;
            background-color: #000;
          }
        }
      }
    }
  }
}
</style>
