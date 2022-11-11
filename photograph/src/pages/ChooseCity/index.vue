<template>
  <view>
    <city-select
      @cityClick="cityClick"
      :formatName="formatName"
      :activeCity="activeCity"
      :hotCity="hotCity"
      :obtainCitys="obtainCitys"
      :isSearch="true"
      ref="citys"
    ></city-select>
  </view>
</template>

<script>
import citys from './citys.js';
import citySelect from '@/components/city-select/city-select.vue';
const { currentCity } = useStore('user');
export default {
  data() {
    return {
      //需要构建索引参数的名称（注意：传递的对象里面必须要有这个名称的参数）
      formatName: 'title',
      //当前城市
      activeCity: {
        id: 1,
        title: '南京市'
      },
      //热门城市
      hotCity: [
        {
          id: 0,
          title: '南京市'
        },
        {
          id: 1,
          title: '南京市'
        }
      ],
      //显示的城市数据
      obtainCitys: [
        {
          id: 0,
          title: '南京'
        },
        {
          id: 1,
          title: '北京'
        },
        {
          id: 2,
          title: '天津'
        },
        {
          id: 3,
          title: '东京'
        }
      ]
    };
  },
  components: {
    citySelect
  },
  onLoad() {
    //修改需要构建索引参数的名称
    this.formatName = 'cityName';
    //修改当前城市
    Object.assign(this.activeCity, currentCity.value);
    //修改热门城市
    this.hotCity = [
      {
        cityName: '南京',
        cityCode: 110100
      },
      {
        cityName: '北京',
        cityCode: 110102
      }
    ];
    //修改构建索引数据
    this.obtainCitys = citys;
  },
  methods: {
    cityClick(item) {
      Object.assign(currentCity.value, item);
      uni.navigateBack({
        success() {
          uni.showToast({
            title: '修改定位成功',
            icon: 'none'
          });
        }
      });
      // uni.showToast({
      //   icon: 'none',
      //   title: 'item: ' + JSON.stringify(item),
      //   // #ifdef MP-WEIXIN
      //   duration: 3000,
      //   // #endif
      //   mask: true
      // });
    }
  }
};
</script>

<style></style>
