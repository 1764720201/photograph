"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const _sfc_main = {
  data() {
    return {
      query: {
        dimension: "day",
        appid: "",
        version_id: "",
        start_time: js_sdk_uniStat_util.getTimeOfSomeDayAgo(0)
      },
      platforms: [],
      dayChartsData: [],
      monChartsData: []
    };
  },
  created() {
    this.debounceGet = js_sdk_uniStat_util.debounce(() => {
      this.getChartData(this.query);
      this.getRangeCountData(this.query, "month");
    });
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.debounceGet();
      }
    }
  },
  computed: {
    chartsData() {
      return [...this.dayChartsData, ...this.monChartsData];
    },
    versionQuery() {
      const {
        appid
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid
      });
      return query;
    }
  },
  methods: {
    getChartData(query, type = "day") {
      query = JSON.parse(JSON.stringify(query));
      const today = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0);
      if (query.start_time >= today) {
        const now = new Date().getTime();
        query.start_time = [today, now];
        query = js_sdk_uniStat_util.stringifyQuery(query, true);
      } else {
        query = js_sdk_uniStat_util.stringifyQuery(query);
      }
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(query).field(
        `active_user_count,new_user_count,total_users,platform_id`
      ).groupBy(`platform_id`).groupField(
        `sum(active_user_count) as ${type}_active_user_count, sum(new_user_count) as ${type}_new_user_count, max(total_users) as ${type}_total_users`
      ).get().then((res) => {
        const data = res.result.data;
        this.initChartOption(data, "dayChartsData");
      });
    },
    getRangeCountData(query, type) {
      query = js_sdk_uniStat_util.stringifyQuery(query);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(query).field(
        `active_user_count, new_user_count, platform_id, ${type}(add(new Date(0),start_time), "Asia/Shanghai") as ${type},year(add(new Date(0),start_time), "Asia/Shanghai") as year`
      ).groupBy(`year, ${type ? type + "," : ""}platform_id`).groupField(
        `sum(active_user_count) as ${type}_active_user_count, sum(new_user_count) as ${type}_new_user_count`
      ).orderBy(`year asc, ${type} asc`).get().then((res) => {
        const data = res.result.data;
        this.initChartOption(data, "monChartsData", "month");
      });
    },
    initChartOption(data, goal, type = "day") {
      const db = common_vendor.ws.database();
      db.collection("uni-stat-app-platforms").get().then((res) => {
        const options = [{
          field: `${type}_new_user_count`,
          title: `${type === "day" ? "\u65E5" : "\u6708"}\u65B0\u589E\u7528\u6237\u5BF9\u6BD4`,
          series: [{
            data: []
          }]
        }, {
          field: `${type}_active_user_count`,
          title: `${type === "day" ? "\u65E5" : "\u6708"}\u6D3B\u8DC3\u7528\u6237\u5BF9\u6BD4`,
          series: [{
            data: []
          }]
        }];
        if (type === "day") {
          options.unshift({
            field: `day_total_users`,
            title: `\u603B\u7528\u6237\u6570\u5BF9\u6BD4`,
            series: [{
              data: []
            }]
          });
        }
        this[goal] = options;
        const platformsData = res.result.data;
        const platforms = {};
        platformsData.forEach((p) => {
          platforms[p._id] = p.name;
        });
        for (const chart of this[goal]) {
          const pie = chart.series[0].data;
          const p = JSON.parse(JSON.stringify(platforms));
          for (const item of data) {
            for (const key in item) {
              if (chart.field === key) {
                const id = item.platform_id;
                const slice = {
                  name: p[id],
                  value: item[key]
                };
                pie.push(slice);
                delete p[id];
              }
            }
          }
          for (const key in p) {
            const slice = {
              name: p[key],
              value: 0
            };
            pie.push(slice);
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_datetime_picker + _easycom_qiun_data_charts + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.query.appid = $event),
    b: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "\u5E94\u7528\u9009\u62E9",
      clear: false,
      modelValue: $data.query.appid
    }),
    c: common_vendor.o(($event) => $data.query.version_id = $event),
    d: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text",
      orderby: "text asc",
      label: "\u7248\u672C\u9009\u62E9",
      modelValue: $data.query.version_id
    }),
    e: !!$data.query.start_time ? 1 : "",
    f: common_vendor.o(($event) => $data.query.start_time = $event),
    g: common_vendor.p({
      type: "date",
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    h: common_vendor.f($options.chartsData, (item, index, i0) => {
      return {
        a: common_vendor.t($options.chartsData[index].title),
        b: "a2271940-4-" + i0,
        c: common_vendor.p({
          type: "ring",
          chartData: $options.chartsData[index],
          echartsH5: true,
          echartsApp: true
        }),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/user/comparison/comparison.vue"]]);
wx.createPage(MiniProgramPage);
