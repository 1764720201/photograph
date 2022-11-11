"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_user_stickiness_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      fieldsMap: pages_uniStat_user_stickiness_fieldsMap.fieldsMap,
      query: {
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        channel_id: "",
        start_time: []
      },
      loading: false,
      currentDateTab: 1,
      tableData: [],
      panelData: pages_uniStat_user_stickiness_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value")),
      chartData: {},
      type: "visit_depth_data",
      types: [{
        _id: "visit_depth_data",
        name: "\u8BBF\u95EE\u9875\u6570"
      }, {
        _id: "duration_data",
        name: "\u8BBF\u95EE\u65F6\u957F"
      }],
      field: "visit_users",
      fields: [{
        _id: "visit_users",
        name: "\u8BBF\u95EE\u4EBA\u6570"
      }, {
        _id: "visit_times",
        name: "\u8BBF\u95EE\u6B21\u6570"
      }],
      options: {
        visit_depth_data: {
          prefix: "p",
          title: "\u9875",
          value: [1, 2, 3, 4, 5, 10]
        },
        duration_data: {
          prefix: "s",
          title: "\u79D2",
          value: [0, 3, 6, 11, 21, 31, 51, 100]
        }
      },
      channelData: []
    };
  },
  computed: {
    fieldName() {
      return this.fields.forEach((item) => {
        if (item._id === this.field) {
          return item.name;
        }
      });
    },
    channelQuery() {
      const platform_id = this.query.platform_id;
      return js_sdk_uniStat_util.stringifyQuery({
        platform_id
      });
    },
    versionQuery() {
      const {
        appid,
        uni_platform
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        uni_platform
      });
      return query;
    }
  },
  created() {
    this.debounceGet = js_sdk_uniStat_util.debounce(() => this.getAllData(this.query));
    this.getChannelData();
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.debounceGet();
      }
    },
    type() {
      this.debounceGet();
    },
    field() {
      this.debounceGet();
    }
  },
  methods: {
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changeAppid(id) {
      this.getChannelData(id, false);
    },
    changePlatform(id, index, name2, item) {
      this.getChannelData(null, id);
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id), end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      this.query.start_time = [start, end];
    },
    createStr(fields, type = "visit_depth_data") {
      const l = fields.length;
      const p = this.options[type].prefix;
      const value = this.options[type].value;
      const strArr = value.map((item) => {
        return fields.map((field) => {
          return `sum(${type}.${field}.${p + "_" + item}) as ${l > 1 ? field + "_" + p + "_" + item : p + "_" + item}`;
        });
      });
      const str = strArr.join();
      return str;
    },
    parseChars(str) {
      str = str.split("_");
      const option = this.options[this.type];
      let chars = option.title;
      option.value.forEach((val, i) => {
        const next = option.value[i + 1];
        if (val === Number(str[str.length - 1])) {
          if (!next) {
            chars = val + "+" + chars;
          } else if (val + 1 === next) {
            chars = val + chars;
          } else {
            chars = val + "-" + (next - 1) + chars;
          }
        }
      });
      return chars;
    },
    getAllData(query) {
      this.getChartData(query, this.field, this.fieldName);
      this.getTabelData(query);
    },
    getChartData(query, field = this.field, name2 = this.fields.find((f) => f._id === this.field).name) {
      query = js_sdk_uniStat_util.stringifyQuery(query, null, ["uni_platform"]);
      const groupField = this.createStr([field], this.type);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-loyalty-result").where(query).groupBy("appid").groupField(groupField).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        let {
          count,
          data
        } = res.result;
        data = data[0];
        const options = {
          series: [{
            data: []
          }]
        };
        for (const key in data) {
          if (key !== "appid") {
            const x = this.parseChars(key);
            const y = data[key];
            options.series[0].data.push({
              name: x,
              value: y
            });
          }
        }
        this.chartData = options;
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getTabelData(query) {
      query = js_sdk_uniStat_util.stringifyQuery(query, null, ["uni_platform"]);
      const groupField = this.createStr(["visit_users", "visit_times"], this.type);
      this.fieldsMap[0].title = this.types.find((t) => t._id === this.type).name;
      this.loading = true;
      const db = common_vendor.ws.database();
      db.collection("uni-stat-loyalty-result").where(query).groupBy("appid").groupField(groupField).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        const type = this.type;
        const rows = [];
        let splitor = this.options[type].prefix;
        splitor = `_${splitor}_`;
        for (const item of data) {
          for (const key in item) {
            if (key !== "appid") {
              const row = {};
              const keys = key.split(splitor);
              row.name = keys[1];
              row[keys[0]] = item[key];
              rows.push(row);
            }
          }
        }
        const tableData = [];
        const total = {};
        const reducer = (previousValue, currentValue) => previousValue + currentValue;
        let users = rows.filter((row) => row.visit_users).map((row) => row.visit_users);
        users = users.length ? users.reduce(reducer) : 0;
        let times = rows.filter((row) => row.visit_times).map((row) => row.visit_times);
        times = times.length ? times.reduce(reducer) : 0;
        total.visit_times = times;
        total.visit_users = users;
        this.options[type].value.forEach((val) => {
          const item = {};
          item.name = val + "p";
          rows.forEach((row) => {
            if (Number(row.name) === val) {
              for (const key in row) {
                if (key !== name) {
                  item[key] = row[key];
                  item["total_" + key] = total[key];
                }
              }
            }
          });
          item.name = this.parseChars(String(val));
          tableData.push(item);
        });
        for (const item of tableData) {
          js_sdk_uniStat_util.mapfields(pages_uniStat_user_stickiness_fieldsMap.fieldsMap, item, item);
        }
        this.tableData = [];
        this.tableData = tableData;
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getChannelData(appid, platform_id) {
      this.query.channel_id = "";
      const db = common_vendor.ws.database();
      const condition = {};
      appid = appid ? appid : this.query.appid;
      if (appid) {
        condition.appid = appid;
      }
      platform_id = platform_id ? platform_id : this.query.platform_id;
      if (platform_id) {
        condition.platform_id = platform_id;
      }
      let platformTemp = db.collection("uni-stat-app-platforms").field("_id, name").getTemp();
      let channelTemp = db.collection("uni-stat-app-channels").where(condition).field("_id, channel_name, create_time, platform_id").getTemp();
      db.collection(channelTemp, platformTemp).orderBy("platform_id", "asc").get().then((res) => {
        let data = res.result.data;
        let channels = [];
        if (data.length > 0) {
          let channelName;
          for (let i in data) {
            channelName = data[i].channel_name ? data[i].channel_name : "\u9ED8\u8BA4";
            if (data[i].platform_id.length > 0) {
              channelName = data[i].platform_id[0].name + "-" + channelName;
            }
            channels.push({
              value: data[i]._id,
              text: channelName
            });
          }
        }
        this.channelData = channels;
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_stat_table2 = common_vendor.resolveComponent("uni-stat-table");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2 + _easycom_uni_stat_table2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_stat_table = () => "../../../../components/uni-stat-table/uni-stat-table.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_qiun_data_charts + _easycom_uni_stat_table + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeAppid),
    b: common_vendor.o(($event) => $data.query.appid = $event),
    c: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "\u5E94\u7528\u9009\u62E9",
      clear: false,
      modelValue: $data.query.appid
    }),
    d: common_vendor.o(($event) => $data.query.version_id = $event),
    e: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text",
      orderby: "text asc",
      label: "\u7248\u672C\u9009\u62E9",
      modelValue: $data.query.version_id
    }),
    f: common_vendor.o($options.changeTimeRange),
    g: common_vendor.p({
      label: "\u65E5\u671F\u9009\u62E9",
      current: $data.currentDateTab,
      mode: "date"
    }),
    h: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    i: common_vendor.o($options.useDatetimePicker),
    j: common_vendor.o(($event) => $data.query.start_time = $event),
    k: common_vendor.p({
      type: "daterange",
      end: new Date().getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    l: common_vendor.o($options.changePlatform),
    m: common_vendor.o(($event) => $data.query.platform_id = $event),
    n: common_vendor.p({
      label: "\u5E73\u53F0\u9009\u62E9",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    o: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    p: common_vendor.o(($event) => $data.query.channel_id = $event),
    q: common_vendor.p({
      localdata: $data.channelData,
      label: "\u6E20\u9053\u9009\u62E9",
      modelValue: $data.query.channel_id
    })
  } : {}, {
    r: common_vendor.o(($event) => $data.type = $event),
    s: common_vendor.p({
      type: "boldLine",
      tabs: $data.types,
      modelValue: $data.type
    }),
    t: common_vendor.p({
      type: "pie",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true
    }),
    v: common_vendor.p({
      data: $data.tableData,
      filedsMap: $data.fieldsMap,
      loading: $data.loading
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/user/stickiness/stickiness.vue"]]);
wx.createPage(MiniProgramPage);
