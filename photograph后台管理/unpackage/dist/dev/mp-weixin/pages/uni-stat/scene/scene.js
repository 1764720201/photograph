"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../js_sdk/uni-stat/util.js");
const pages_uniStat_scene_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      fieldsMap: pages_uniStat_scene_fieldsMap.fieldsMap,
      query: {
        dimension: "hour",
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        start_time: []
      },
      options: {
        pageSize: 20,
        pageCurrent: 1,
        total: 0
      },
      loading: false,
      currentDateTab: 1,
      tableData: [],
      panelData: pages_uniStat_scene_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value")),
      chartData: {},
      chartTab: "new_device_count"
    };
  },
  computed: {
    chartTabs() {
      const tabs = [];
      pages_uniStat_scene_fieldsMap.fieldsMap.forEach((item) => {
        const {
          field: _id,
          title: name
        } = item;
        const isTab = item.hasOwnProperty("value");
        if (_id && name && isTab) {
          tabs.push({
            _id,
            name
          });
        }
      });
      return tabs;
    },
    queryStr() {
      return js_sdk_uniStat_util.stringifyQuery(this.query, true);
    },
    dimension() {
      if (js_sdk_uniStat_util.maxDeltaDay(this.query.start_time, 1)) {
        return "hour";
      } else {
        return "day";
      }
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
    this.debounceGet = js_sdk_uniStat_util.debounce(() => this.getAllData());
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.options.pageCurrent = 1;
        this.debounceGet();
      }
    }
  },
  methods: {
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changePlatform(id, index, name, item) {
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
      this.getTabelData(this.queryStr);
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTabelData(this.queryStr);
    },
    changeChartTab(id, index, name) {
      this.getChartData(this.queryStr, id, name);
    },
    getAllData(query) {
      this.getPanelData(query);
      this.getChartData(query);
      this.getTabelData(query);
    },
    getChartData(query, field = this.chartTab) {
      this.options;
      query = JSON.parse(JSON.stringify(this.query));
      query.dimension = "day";
      let querystr = js_sdk_uniStat_util.stringifyQuery(query, false, ["uni_platform"]);
      console.log("querystr", querystr);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(querystr).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_scene_fieldsMap.fieldsMap, field)},start_time,channel_id`).groupBy("channel_id,start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_scene_fieldsMap.fieldsMap, field)).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        const options = {
          categories: [],
          series: [{
            name: "\u6682\u65E0\u6570\u636E",
            data: []
          }]
        };
        const xAxis = options.categories;
        if (this.dimension === "hour") {
          for (let i = 0; i < 24; ++i) {
            const hour = i < 10 ? "0" + i : i;
            const x = `${hour}:00 ~ ${hour}:59`;
            xAxis.push(x);
          }
        }
        const hasChannels = [];
        data.forEach((item) => {
          if (hasChannels.indexOf(item.channel_id) < 0) {
            hasChannels.push(item.channel_id);
          }
        });
        let allChannels = [];
        this.getChannels().then((res2) => {
          allChannels = res2.result.data;
        }).finally(() => {
          hasChannels.forEach((channel, index) => {
            const c = allChannels.find((item) => item._id === channel);
            const line = options.series[index] = {
              name: c && c.channel_name || "\u672A\u77E5",
              data: []
            };
            if (this.dimension === "hour") {
              for (let i = 0; i < 24; ++i) {
                line.data[i] = 0;
              }
            }
            let mapper = pages_uniStat_scene_fieldsMap.fieldsMap.filter((f) => f.field === field);
            mapper = JSON.parse(JSON.stringify(mapper));
            delete mapper[0].value;
            mapper[0].formatter = "";
            for (const item of data) {
              js_sdk_uniStat_util.mapfields(mapper, item, item);
              let date = item.start_time;
              const x = js_sdk_uniStat_util.formatDate(date, this.dimension);
              let y = item[field];
              const dateIndex = xAxis.indexOf(x);
              if (channel === item.channel_id) {
                if (dateIndex < 0) {
                  xAxis.push(x);
                  line.data.push(y);
                } else {
                  line.data[dateIndex] = y;
                }
              }
            }
          });
          this.chartData = options;
        });
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getChannels() {
      const db = common_vendor.ws.database();
      return db.collection("uni-stat-app-channels").get();
    },
    getTabelData(query) {
      const {
        pageCurrent
      } = this.options;
      this.loading = true;
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(querystr).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_scene_fieldsMap.fieldsMap)},appid, channel_id`).groupBy("appid, channel_id").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_scene_fieldsMap.fieldsMap)).orderBy("new_device_count", "desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        this.getChannels().then((res2) => {
          const channels = res2.result.data;
          for (const item of data) {
            channels.forEach((channel) => {
              if (item.channel_id === channel._id) {
                item.channel_code = channel.channel_code;
                item.channel_name = channel.channel_name;
              }
            });
          }
        }).finally(() => {
          for (const item of data) {
            js_sdk_uniStat_util.mapfields(pages_uniStat_scene_fieldsMap.fieldsMap, item, item);
          }
          this.tableData = [];
          this.options.total = count;
          this.tableData = data;
        });
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getPanelData() {
      let query = JSON.parse(JSON.stringify(this.query));
      query.dimension = "day";
      let querystr = js_sdk_uniStat_util.stringifyQuery(query, false, ["uni_platform"]);
      console.log("---- getPanelData", querystr);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(querystr).field(js_sdk_uniStat_util.stringifyField(pages_uniStat_scene_fieldsMap.fieldsMap)).groupBy("appid").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_scene_fieldsMap.fieldsMap)).orderBy("start_time", "desc").get().then((res) => {
        const item = res.result.data[0];
        item && (item.total_devices = 0);
        js_sdk_uniStat_util.getFieldTotal.call(this, query);
        this.panelData = [];
        this.panelData = js_sdk_uniStat_util.mapfields(pages_uniStat_scene_fieldsMap.fieldsMap, item);
      });
    },
    navTo(id) {
      const url = `/pages/uni-stat/overview/overview?id=${id}`;
      common_vendor.index.navigateTo({
        url
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_stat_panel2 = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_stat_table2 = common_vendor.resolveComponent("uni-stat-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_qiun_data_charts2 + _easycom_uni_stat_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../components/uni-stat-panel/uni-stat-panel.js";
const _easycom_qiun_data_charts = () => "../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_stat_table = () => "../../../components/uni-stat-table/uni-stat-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_uni_stat_table + _easycom_uni_pagination + _easycom_fix_window)();
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
      storage: false,
      where: $options.versionQuery,
      field: "_id as value, version as text",
      orderby: "text asc",
      label: "\u7248\u672C\u9009\u62E9",
      modelValue: $data.query.version_id
    }),
    e: common_vendor.o($options.changeTimeRange),
    f: common_vendor.p({
      label: "\u65E5\u671F\u9009\u62E9",
      current: $data.currentDateTab,
      mode: "date"
    }),
    g: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    h: common_vendor.o($options.useDatetimePicker),
    i: common_vendor.o(($event) => $data.query.start_time = $event),
    j: common_vendor.p({
      type: "daterange",
      end: new Date().getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    k: common_vendor.o($options.changePlatform),
    l: common_vendor.o(($event) => $data.query.platform_id = $event),
    m: common_vendor.p({
      label: "\u5E73\u53F0\u9009\u62E9",
      type: "boldLine",
      mode: "platform-scene",
      all: false,
      modelValue: $data.query.platform_id
    }),
    n: common_vendor.p({
      items: $data.panelData
    }),
    o: common_vendor.o($options.changeChartTab),
    p: common_vendor.o(($event) => $data.chartTab = $event),
    q: common_vendor.p({
      type: "box",
      tabs: $options.chartTabs,
      modelValue: $data.chartTab
    }),
    r: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true,
      tooltipFormat: "tooltipCustom"
    }),
    s: common_vendor.p({
      data: $data.tableData,
      filedsMap: $data.fieldsMap.slice(0, $data.fieldsMap.length - 1),
      loading: $data.loading
    }),
    t: common_vendor.o($options.changePageCurrent),
    v: common_vendor.o($options.changePageSize),
    w: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/scene/scene.vue"]]);
wx.createPage(MiniProgramPage);
