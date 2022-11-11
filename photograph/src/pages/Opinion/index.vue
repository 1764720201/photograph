<template>
  <view class="header">
    <view
      class="item"
      v-for="item in feedback"
      :key="item.value"
      :style="{ fontWeight: item.value == currentFeedback ? 900 : 500 }"
      @click="changeFeedback(item.value)"
    >
      <view class="name">{{ item.text }}</view>
      <view
        class="line"
        :style="{
          backgroundColor: item.value == currentFeedback ? '#25a582' : ''
        }"
      ></view>
    </view>
  </view>
  <view class="opinion" v-if="currentFeedback == 0">
    <view class="tip">请选择问题类型，您的反馈帮助我们做得更好</view>
    <view class="questionType" @click="chooseQuestionType">
      <view class="left">
        <view class="left-header">
          <view :class="currentQuestionType >= 0 ? 'haveChoosed' : ''">
            反馈问题的类型
          </view>
          <view class="required">*</view>
        </view>
        <view class="currentType" v-if="currentQuestionType >= 0">
          {{ questionTypeList[currentQuestionType].text }}
        </view>
      </view>
      <uni-icons type="right"></uni-icons>
    </view>
    <view class="disclose">
      <textarea
        class="textarea"
        placeholder="我要吐槽"
        v-model="disclose"
      ></textarea>
    </view>
    <view class="phone">
      <view class="title">手机号</view>
      <input type="text" class="input" placeholder="请输入" v-model="phone" />
    </view>
    <view class="submit" @click="submit">提交</view>
  </view>
  <view class="history" v-if="currentFeedback == 1">
    <view class="item" v-for="item in opinionList" :key="item._id">
      <view class="time">
        <uni-dateformat
          :date="item.create_time"
          format="yyyy-MM-dd hh:mm:ss"
        ></uni-dateformat>
      </view>

      <view class="footer">
        <view class="content">{{ item.content }}</view>
        <view class="already">已创建</view>
      </view>
    </view>
  </view>
  <uni-popup ref="popup" type="bottom" :safeArea="false" backgroundColor="#fff">
    <view class="questionList">
      <view class="header"><view class="title">反馈问题的类型</view></view>
      <view class="question">
        <view
          class="item"
          v-for="item in questionTypeList"
          :key="item.value"
          @click="chooseType(item.value)"
        >
          <view class="name">{{ item.text }}</view>
          <uni-icons
            type="checkmarkempty"
            v-if="item.value == currentQuestionType"
            size="15"
            color="#25a180"
          ></uni-icons>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
const { userId } = useStore('user');
const phone = ref('');
const disclose = ref('');
const feedback = reactive([
  {
    value: 0,
    text: '我要反馈'
  },
  {
    value: 1,
    text: '历史反馈'
  }
]);
const currentFeedback = ref<number>(0);
const changeFeedback = (index: number) => {
  currentFeedback.value = index;
};

const questionTypeList = reactive<{ value: number; text: string }[]>([
  {
    value: 0,
    text: '门店服务'
  },
  {
    value: 1,
    text: '产品研发'
  },
  {
    value: 2,
    text: '总部修图'
  },
  {
    value: 3,
    text: '线上预约'
  },
  {
    value: 4,
    text: '会员相关'
  },
  {
    value: 5,
    text: '新店拓展'
  },
  {
    value: 6,
    text: '其他问题'
  }
]);
// 当前的问题类型
const currentQuestionType = ref<number>(-1);

const popup = ref();
const chooseQuestionType = () => {
  popup.value.open();
};

// 选择问题类型
const chooseType = (index: number) => {
  currentQuestionType.value = index;
  popup.value.close();
};
const db = uniCloud.database();

const opinionList = ref<
  { create_time: number; content: string; _id: string }[]
>([]);
// 获取提出的意见
const getOpinion = async () => {
  await db
    .collection('opinion')
    .where(`user_id=='${userId.value}'`)
    .orderBy('create_time', 'desc')
    .get()
    .then(res => {
      console.log(res.result.data);
      opinionList.value = res.result.data;
    });
};
onLoad(() => {
  getOpinion();
});
// 提交问题
const submit = () => {
  db.collection('opinion')
    .add({
      type: questionTypeList[currentQuestionType.value].text,
      phone: phone.value,
      content: disclose.value
    })
    .then(async () => {
      await getOpinion();
      uni.showToast({
        title: '提交成功'
      });
      currentFeedback.value = 1;
    });
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  height: 100rpx;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .name {
      color: #666;
    }
    .line {
      margin-top: 10rpx;
      width: 40rpx;
      height: 7rpx;
      border-radius: 5rpx;
    }
  }
}
.opinion {
  .tip {
    padding: 30rpx;
    color: #666;
  }
  .questionType {
    padding: 40rpx 30rpx;
    background-color: white;
    display: flex;
    justify-content: space-between;
    .left {
      height: 70rpx;
      font-weight: 900;
      color: #666;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .haveChoosed {
        font-size: 26rpx;
        color: #adadad;
        font-weight: 900;
      }
      .left-header {
        display: flex;
        .required {
          margin-left: 10rpx;
          color: red;
        }
      }
    }
  }
  .disclose {
    background-color: white;
    margin-top: 20rpx;
    padding: 30rpx;
    .textarea {
      width: 93%;
      background-color: #eaebed;
      padding: 20rpx;
      border-radius: 10rpx;
    }
  }
  .phone {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #fff;
    align-items: center;
    display: flex;
    .title {
      font-weight: 900;
    }
    .input {
      margin-left: 20rpx;
    }
  }
  .submit {
    margin: 40rpx auto;
    font-weight: 900;
    width: 700rpx;
    height: 100rpx;
    background-color: #25a180;
    color: #fff;
    border-radius: 50rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 35rpx;
  }
}
.history {
  border-top: 1rpx solid #f5f5f5;
  background-color: #fff;
  min-height: 100vh;
  .item {
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    .time {
      font-size: 35rpx;
    }
    .footer {
      margin-top: 30rpx;
      align-items: center;
      display: flex;
      justify-content: space-between;
      .already {
        width: 160rpx;
        height: 70rpx;
        color: white;
        background-color: #dae1e7;
        border-radius: 30rpx;
        line-height: 70rpx;
        text-align: center;
      }
    }
  }
}
.questionList {
  height: 900rpx;
  .header {
    .title {
      font-weight: 900;
      font-size: 35rpx;
      color: #666;
    }
  }
  .question {
    .item {
      padding: 30rpx;
      border-top: 1rpx solid #e2e2e2;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
