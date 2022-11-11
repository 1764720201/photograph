<template>
  <view class="subscribe">
    <Collapse title="选择门店" :current="currentStoreName">
      <view class="store">
        <view
          class="item"
          v-for="item in storeList"
          :key="item.value"
          @click="chooseStore(item.name)"
        >
          <view class="left">
            <view class="name">{{ item.name }}</view>
            <view class="address">{{ item.address }}</view>
            <view class="lately" v-if="item.value == 0">离你最近</view>
            <view class="busy" v-else>繁忙</view>
          </view>
          <view class="right">
            <view class="call-option" @click="callPhone">
              <view class="t-icon t-icon-dianhua"></view>
            </view>
            <view
              class="store-option"
              @click="goStoreDetail(item.name, item.address)"
            >
              <view class="t-icon t-icon-dianpu1"></view>
            </view>
          </view>
        </view>
      </view>
    </Collapse>
    <Collapse title="选择时间" :current="currentSubscribeDate">
      <view class="header">
        <view class="one-week">
          <uni-icons
            @click="preWeek"
            type="arrow-left"
            size="20"
            :color="
              current - oneWeek < Date.now() - oneDay ? '#a9a9a9' : '#000'
            "
          ></uni-icons>
          <view class="week-range">
            {{ dayjs(current).format('MM/DD') }}-{{
              dayjs(current + oneWeek).format('MM/DD')
            }}
          </view>
          <uni-icons
            type="arrow-right"
            size="20"
            color="#000"
            @click="nextWeek"
          ></uni-icons>
        </view>
        <view class="choose-more">
          <uni-datetime-picker
            type="date"
            :start="Date.now()"
            :end="Date.now() + 7776000000"
            rangeSeparator="至"
            returnType="timestamp"
            @change="getOtherDate"
          >
            查看其它日期
          </uni-datetime-picker>
        </view>
      </view>
      <view class="weeks">
        <view
          class="item"
          v-for="item in newDatelist"
          :key="item?.day"
          :class="item.week == currentDay ? 'active' : ''"
          @click="chooseDay(item)"
        >
          <view class="week">{{ item.week }}</view>
          <uni-dateformat
            class="day"
            format="dd"
            :date="item?.day"
          ></uni-dateformat>
        </view>
      </view>
      <view class="time">
        <view
          class="item"
          v-for="item in timeList"
          :key="item"
          :class="item == currentTime ? 'active' : ''"
          @click="chooseTime(item)"
        >
          {{ item }}
        </view>
      </view>
    </Collapse>
    <view class="hot-sale">
      <view class="title">本店热卖</view>
      <view class="hot-sale-list">
        <view
          class="item"
          v-for="item in detail.types?.slice(0, 3)"
          :key="item.value"
        >
          <image
            class="image"
            :class="item.value == currentHot ? 'active' : ''"
            :src="item.url"
            mode="aspectFill"
          ></image>
          <view class="name">{{ item.name }}</view>
          <view class="footer">
            <view class="price">￥{{ price }}</view>
            <view
              @click="selectHot(item)"
              :class="
                `t-icon ${
                  item.value == currentHot
                    ? 't-icon-duigouxiao'
                    : 't-icon-zengjia'
                }`
              "
            ></view>
          </view>
        </view>
      </view>
    </view>
    <view class="tabbar">
      <view class="confirm" @click="goSubmit">确认</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Collapse from '@/components/Collapse/index';
import { Types } from '@/types/productionDetail';
import dayjs from 'dayjs';
const { currentSubscribe } = useStore('user');
const { detail,price,currentStoreName,currentSubscribeDate} = useStore('productionDetail');

const storeList = reactive([
  {
    value: 0,
    name: '半度摄影',
    address: '杭州市桐庐县浙江工商大学大学杭州商学院创业中心'
  },
  {
    value: 1,
    name: '半度摄影1',
    address: '杭州市桐庐县浙江工商大学大学杭州商学院创业中心'
  },
  {
    value: 2,
    name: '半度摄影2',
    address: '杭州市桐庐县浙江工商大学大学杭州商学院创业中心'
  },
  {
    value: 3,
    name: '半度摄影3',
    address: '杭州市桐庐县浙江工商大学大学杭州商学院创业中心'
  },
  {
    value: 4,
    name: '半度摄影4',
    address: '杭州市桐庐县浙江工商大学大学杭州商学院创业中心'
  },
  {
    value: 5,
    name: '半度摄影5',
    address: '杭州市桐庐县浙江工商大学大学杭州商学院创业中心'
  }
]);


// 选择店铺
const chooseStore = (name: string) => {
  currentStoreName.value = name;
};

// 当前选择的热卖
const currentHot = ref<number>(-1);
// 选择热卖
const selectHot = (item: Types) => {
  if (currentHot.value == -1) {
    currentHot.value = item.value;
  } else if (currentHot.value == item.value) {
    currentHot.value = -1;
  } else {
    uni.showToast({
      title: '最多只能再加一个角色哦!',
      icon: 'none'
    });
  }
};
type Week = {
  week: string;
  day: number;
};
const datelist = reactive<Week[]>([
  { week: '周日', day: 0 },
  { week: '周一', day: 0 },
  { week: '周二', day: 0 },
  { week: '周三', day: 0 },
  { week: '周四', day: 0 },
  { week: '周五', day: 0 },
  { week: '周六', day: 0 }
]);
const newDatelist = reactive<Week[]>([]);
const timeList = reactive<string[]>([
  '10:00',
  '10:20',
  '10:40',
  '11:00',
  '11:20',
  '11:40',
  '12:00',
  '12:20',
  '12:40',
  '13:00',
  '13:20',
  '13:40',
  '14:00',
  '14:20',
  '14:40',
  '15:00',
  '15:20',
  '15:40',
  '16:00',
  '16:20',
  '16:40',
  '17:00',
  '17:20',
  '17:40',
  '18:00',
  '18:20',
  '18:40',
  '19:00',
  '19:20',
  '19:40',
  '20:00',
  '20:20',
  '20:40',
  '21:00',
  '21:20',
  '21:40'
]);

// 当前选中的日期
const currentDay = ref<string>(datelist[new Date().getDay()].week);
const currentDayNum = ref<number>();

// 选择日期
const chooseDay = (week: Week) => {
  currentDay.value = week.week;
  currentDayNum.value = week.day;
};
// 当前选中的时间
const currentTime = ref<string>('');
// 选择时间
const chooseTime = (time: string) => {
  currentTime.value = time;
  currentSubscribeDate.value = `${dayjs(currentDayNum.value).format('YYYY-MM-DD') +
    ' ' +
    currentTime.value}`;
};
// 根据时间戳获取日期是周几
const oneDay = 86400000;
const getTime = (time: number) => {
  newDatelist.length = 0;
  const currentDayIndex = new Date(time).getDay();
  if (currentDayIndex == 0) {
    for (let i = currentDayIndex; i < 7; i++) {
      newDatelist.push(datelist[i]);
    }
  } else {
    for (let i = currentDayIndex; i < 7; i++) {
      newDatelist.push(datelist[i]);
    }
    for (let i = 0; i < currentDayIndex; i++) {
      newDatelist.push(datelist[i]);
    }
  }
  newDatelist[0].day = time;
  for (let j = 0; j < 6; j++) {
    newDatelist[j + 1].day = newDatelist[j]?.day + oneDay;
  }
};
// 当天的时间戳
const current=ref<number>(Date.now())
onLoad(() => {
  getTime(current.value);
  currentStoreName.value=storeList[0].name
});
const oneWeek = 604800000;

// 下一周
const nextWeek=()=>{
  current.value+=oneWeek
  getTime(current.value)
}
//上一周
 const preWeek=()=>{
   if((current.value-oneWeek)<(Date.now()-oneDay)){
     return
   }
   current.value-=oneWeek
   getTime(current.value)
 }


 // 获取其它的时间
 const getOtherDate=(e:number)=>{
    current.value=e
    currentDay.value=datelist[new Date(e).getDay()].week
    getTime(current.value);
 }

 // 拨打电话
 const callPhone=()=>{
   uni.makePhoneCall({
   	phoneNumber: '13700000000'
   });
 }
 // 前往门店信息
 const goStoreDetail=(name:string,address:string)=>{
   uni.navigateTo({
     url:`/pages/StoreDetail/index?name=${name}&&address=${address}`
   })
 }

 // 前往提交订单页面
 const goSubmit=()=>{
   const type=detail.value.types[currentHot.value]
   if(currentHot.value>=0){
     currentSubscribe.value.push({
       name:type.name,
       price:price.value,
       image:type.url
     })
   }
   if(currentSubscribeDate.value=='请选择'){
     uni.showToast({
       title:'请选择时间',
       icon:'none'
     })
   }else{
     uni.navigateTo({
       url:'/pages/Submit/index'
     })
   }
 }
</script>

<style lang="scss" scoped>
.subscribe {
  .store {
    width: 90%;
    margin-left: 5%;
    padding-bottom: 50rpx;
    .item {
      height: 200rpx;
      margin-top: 30rpx;
      background-color: white;
      padding: 20rpx;
      border-radius: 20rpx;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .lately {
          width: 100rpx;
          height: 35rpx;
          border: 1px solid #65a56e;
          color: #65a56e;
          line-height: 35rpx;
          text-align: center;
          font-size: 20rpx;
          border-radius: 5rpx;
        }
        .busy {
          width: 60rpx;
          height: 35rpx;
          color: #fff;
          text-align: center;
          line-height: 35rpx;
          background-color: #ee9491;
          font-size: 20rpx;
          border-radius: 5rpx;
        }
        .name {
          font-weight: 900;
        }
        .address {
          font-size: 20rpx;
          color: #ccc;
        }
      }
      .right {
        display: flex;
        align-items: center;
        flex-direction: column;
        border-left: 1rpx solid #e4e4e4;
        padding-left: 30rpx;
        .call-option,
        .store-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }
        .call-option {
          border-bottom: 1rpx solid #e4e4e4;
        }
      }
    }
  }
  .hot-sale {
    padding-bottom: 500rpx;
    margin-top: 40rpx;
    .title {
      font-weight: 900;
      font-size: 40rpx;
      text-align: center;
    }
    &-list {
      margin-top: 40rpx;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .item {
        display: flex;
        flex-direction: column;
        height: 370rpx;
        .image {
          width: 220rpx;
          height: 220rpx;
          border: 1rpx solid transparent;
          border-radius: 15rpx;
        }
        .active {
          border: 1rpx solid green;
        }
        .name,
        .price {
          margin-top: 10rpx;
          font-weight: 900;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .t-icon {
            width: 100rpx;
            height: 100rpx;
          }
        }
      }
    }
  }
  .header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .one-week {
      display: flex;
      align-items: center;
      .week-range {
        font-weight: 900;
        font-size: 36rpx;
      }
    }
    .choose-more {
      font-size: 30rpx;
      color: #666;
    }
  }
  .weeks {
    display: flex;
    justify-content: space-between;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 180rpx;
      width: 100%;
      .week {
        font-size: 19rpx;
      }
      .day {
        margin-top: 10rpx;
        font-weight: 900;
      }
    }
    .active {
      color: white;
      background-color: #4cc057;
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      margin-top: 10rpx;
      width: 32%;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      background: white;
      font-size: 30rpx;
      font-weight: 900;
    }
    .active {
      color: white;
      background-color: #4cc057;
    }
  }
  .tabbar {
    position: fixed;
    bottom: 0;
    background-color: #f1f1f1;
    height: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10rpx #d2d2d2;
    width: 100%;
    .confirm {
      width: 600rpx;
      height: 100rpx;
      border-radius: 40rpx;
      text-align: center;
      line-height: 100rpx;
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
