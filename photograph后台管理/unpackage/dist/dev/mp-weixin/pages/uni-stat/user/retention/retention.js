"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_user_retention_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      query: {
        dimension: "day",
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        channel_id: "",
        start_time: []
      },
      options: {
        pageSize: 20,
        pageCurrent: 1,
        total: 0
      },
      loading: false,
      currentDateTab: 0,
      tableData: [],
      chartData: {},
      field: "new_user",
      fields: [{
        _id: "new_user",
        name: "\u65B0\u589E\u7559\u5B58",
        tooltip: "\u6307\u5B9A\u65F6\u95F4\u65B0\u589E\uFF08\u5373\u9996\u6B21\u8BBF\u95EE\u5E94\u7528\uFF09\u7528\u6237\uFF0C\u5728\u4E4B\u540E\u7684\u7B2CN\u5929\uFF0C\u518D\u6B21\u8BBF\u95EE\u5E94\u7528\u7684\u7528\u6237\u6570\u5360\u6BD4"
      }, {
        _id: "active_user",
        name: "\u6D3B\u8DC3\u7559\u5B58",
        tooltip: "\u6307\u5B9A\u65F6\u95F4\u6D3B\u8DC3\uFF08\u5373\u8BBF\u95EE\u5E94\u7528\uFF09\u7528\u6237\uFF0C\u5728\u4E4B\u540E\u7684\u7B2CN\u5929\uFF0C\u518D\u6B21\u8BBF\u95EE\u5E94\u7528\u7684\u7528\u6237\u6570\u5360\u6BD4"
      }],
      key: 1,
      channelData: []
    };
  },
  computed: {
    fieldsMap() {
      const title = this.field === "active_user" ? "\u6D3B\u8DC3\u7528\u6237" : "\u65B0\u589E\u7528\u6237";
      const maps = [{
        title,
        field: `${this.field}_count`,
        stat: 0
      }];
      return pages_uniStat_user_retention_fieldsMap.fieldsFactory(maps);
    },
    fieldName() {
      let name = "";
      this.fields.forEach((item) => {
        if (item._id === this.field) {
          name = item.name;
        }
      });
      return name;
    },
    keyName() {
      return this.keys.forEach((item) => {
        if (item._id === this.key) {
          return item.name;
        }
      });
    },
    keys() {
      const values = [1, 2, 3, 4, 5, 6, 7, 14, 30];
      return values.map((val) => {
        return {
          _id: val,
          name: `${val}\u5929\u540E`
        };
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
        this.options.pageCurrent = 1;
        this.debounceGet();
      }
    },
    key() {
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
    changePlatform(id, index, name, item) {
      this.getChannelData(null, id);
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id), end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      this.query.start_time = [start, end];
    },
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getTabelData(this.query);
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTabelData(this.query);
    },
    stringifyField(mapping, goal, prop) {
      if (goal) {
        mapping = mapping.filter((f) => f.field === goal);
      }
      if (prop) {
        mapping = mapping.filter((f) => f.field && f.hasOwnProperty(prop));
      }
      const fields = mapping.map((f) => {
        if (f.stat === -1) {
          return f.field;
        } else if (f.stat === 0) {
          return `${f.field} as ${"temp_" + f.field}`;
        } else {
          return `retention.${this.field}.${f.field}.user_count as ${"temp_" + f.field}`;
        }
      }).join();
      return fields;
    },
    createStr(type = "user_count", vals, fields, tail) {
      const value = vals || [1, 2, 3, 4, 5, 6, 7, 14, 30];
      const p = "d";
      const f = this.fields.map((item) => item._id);
      fields = fields || f;
      const strArr = value.map((item) => {
        return fields.map((field) => {
          return `retention.${field}.${p + "_" + item}.${type} as ${p + "_" + item}`;
        });
      });
      if (tail) {
        strArr.push(tail);
      }
      const str = strArr.join();
      return str;
    },
    getAllData(query) {
      this.getChartData(query, this.key, this.keyName);
      this.getTabelData(query);
    },
    getChartData(query, key = this.key, name = "\u8BBF\u95EE\u4EBA\u6570") {
      this.options;
      query = js_sdk_uniStat_util.stringifyQuery(query, null, ["uni_platform"]);
      this.createStr("user_count", [key], [this.field]);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(query).field(`${this.stringifyField(this.fieldsMap, `d_${key}`)}, start_time`).groupBy("start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(this.fieldsMap, `d_${key}`)).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        let {
          count,
          data
        } = res.result;
        const options = {
          categories: [],
          series: [{
            name: `${key}\u5929\u540E${this.fieldName}`,
            data: []
          }]
        };
        for (const item of data) {
          const x = js_sdk_uniStat_util.formatDate(item.start_time, "day");
          const y = item[`d_${key}`];
          options.series[0].data.push(y);
          options.categories.push(x);
        }
        this.chartData = options;
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getTabelData(query) {
      const {
        pageCurrent
      } = this.options;
      query = js_sdk_uniStat_util.stringifyQuery(query, null, ["uni_platform"]);
      const tail = this.field + "_count";
      this.createStr("user_rate", "", [this.field], tail);
      this.loading = true;
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(query).field(this.stringifyField(this.fieldsMap)).groupBy("start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(this.fieldsMap)).orderBy("start_time", "desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        for (const item of data) {
          js_sdk_uniStat_util.mapfields(this.fieldsMap, item, item);
        }
        this.options.total = count;
        this.tableData = [];
        this.tableData = data;
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
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2 + _easycom_uni_icons2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_icons = () => "../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_th = () => "../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_qiun_data_charts + _easycom_uni_icons + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_fix_window)();
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
      mode: "date",
      yesterday: false
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
    r: common_vendor.o(($event) => $data.field = $event),
    s: common_vendor.p({
      type: "boldLine",
      tabs: $data.fields,
      tooltip: true,
      modelValue: $data.field
    }),
    t: common_vendor.o(($event) => $data.key = $event),
    v: common_vendor.p({
      type: "box",
      tabs: $options.keys,
      modelValue: $data.key
    }),
    w: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true
    }),
    x: common_vendor.p({
      type: "info"
    }),
    y: common_vendor.f($options.fieldsMap, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "0724523e-13-" + i0 + ",0724523e-12",
        e: common_vendor.p({
          align: "center"
        })
      } : {});
    }),
    z: common_vendor.f($data.tableData, (item, i, i0) => {
      return {
        a: common_vendor.f($options.fieldsMap, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.title
          }, mapper.title ? {
            b: common_vendor.t(item[mapper.field] ? item[mapper.field] : ""),
            c: index,
            d: common_vendor.n(/[d|w|m]_\d/.test(mapper.field) && [item[mapper.field] ? "uni-stat-table-bg" : ""]),
            e: "0724523e-15-" + i0 + "-" + i1 + "," + ("0724523e-14-" + i0),
            f: common_vendor.p({
              align: "center"
            })
          } : {});
        }),
        b: i,
        c: "0724523e-14-" + i0 + ",0724523e-11"
      };
    }),
    A: common_vendor.p({
      loading: $data.loading,
      stripe: true,
      emptyText: _ctx.$t("common.empty")
    }),
    B: common_vendor.o($options.changePageCurrent),
    C: common_vendor.o($options.changePageSize),
    D: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/user/retention/retention.vue"]]);
wx.createPage(MiniProgramPage);
