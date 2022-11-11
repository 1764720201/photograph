"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_user_overview_fieldsMap = require("./fieldsMap.js");
const panelOption = pages_uniStat_user_overview_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value"));
const _sfc_main = {
  data() {
    return {
      tableName: "uni-stat-result",
      fieldsMap: pages_uniStat_user_overview_fieldsMap.fieldsMap,
      resFieldsMap: pages_uniStat_user_overview_fieldsMap.resFieldsMap,
      entFieldsMap: pages_uniStat_user_overview_fieldsMap.entFieldsMap,
      query: {
        dimension: "hour",
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        start_time: []
      },
      options: {
        pageCurrent: 1,
        total: 0,
        pageSizeIndex: 0,
        pageSizeRange: [10, 20, 50, 100]
      },
      loading: false,
      currentDateTab: 2,
      chartTab: "new_user_count",
      tableData: [],
      resTableData: [],
      entTableData: [],
      panelData: panelOption,
      chartData: {},
      eopts: {
        seriesTemplate: [{
          itemStyle: {
            borderWidth: 2,
            borderColor: "#1890FF",
            color: "#1890FF"
          },
          areaStyle: {
            color: {
              colorStops: [{
                offset: 0,
                color: "#1890FF"
              }, {
                offset: 1,
                color: "#FFFFFF"
              }]
            }
          }
        }, {
          lineStyle: {
            color: "#ea7ccc",
            width: 2,
            type: "dashed"
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: "#ea7ccc",
            color: "#ea7ccc"
          },
          areaStyle: null
        }]
      },
      tabIndex: 0
    };
  },
  onLoad(option) {
    const {
      appid
    } = option;
    if (appid) {
      this.query.appid = appid;
    }
  },
  computed: {
    pageSize() {
      const {
        pageSizeRange,
        pageSizeIndex
      } = this.options;
      return pageSizeRange[pageSizeIndex];
    },
    chartTabs() {
      const tabs = [];
      pages_uniStat_user_overview_fieldsMap.fieldsMap.forEach((item) => {
        const _id = item.field;
        const name = item.title;
        if (_id && name) {
          tabs.push({
            _id,
            name
          });
        }
      });
      return tabs;
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
      this.currentDateTab = null;
    },
    changePlatform(id, index, name, item) {
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const day = 24 * 60 * 60 * 1e3;
      let start, end;
      start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id);
      if (!id) {
        end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) + day - 1;
      } else {
        end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      }
      this.query.start_time = [start, end];
    },
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getChartData(this.query);
    },
    changePageSize(e) {
      const {
        value
      } = e.detail;
      this.options.pageCurrent = 1;
      this.options.pageSizeIndex = value;
      this.getChartData(this.query);
    },
    changeChartTab(id, index, name) {
      this.tabIndex = index;
      this.getChartData(this.query, id, name);
    },
    getAllData(query) {
      this.getPanelData();
      this.getChartData(query);
    },
    getDays() {
      if (!this.query.start_time.length)
        return true;
      const day = 24 * 60 * 60 * 1e3;
      const [start, end] = this.query.start_time;
      const lessTwoDay = end - start >= day;
      return lessTwoDay;
    },
    getPanelData() {
      const {
        appid,
        platform_id,
        version_id
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        platform_id,
        version_id,
        start_time: [js_sdk_uniStat_util.getTimeOfSomeDayAgo(1), new Date().getTime()]
      });
      const db = common_vendor.ws.database();
      db.collection(this.tableName).where(query).field(
        `${js_sdk_uniStat_util.stringifyField(pages_uniStat_user_overview_fieldsMap.fieldsMap)},dimension,stat_date`
      ).groupBy(`stat_date, dimension`).groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_user_overview_fieldsMap.fieldsMap)).orderBy("stat_date", "desc").get().then((res) => {
        const data = res.result.data;
        const today = data.find((item) => item.stat_date === js_sdk_uniStat_util.parseDateTime(
          js_sdk_uniStat_util.getTimeOfSomeDayAgo(0),
          "",
          ""
        )) || {};
        today.total_users = 0;
        const yesterday = data.find((item) => item.dimension === "day" && item.stat_date === js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(1), "", ""));
        this.panelData = [];
        this.panelData = js_sdk_uniStat_util.mapfields(pages_uniStat_user_overview_fieldsMap.fieldsMap, today);
        this.panelData.map((item) => {
          js_sdk_uniStat_util.mapfields(pages_uniStat_user_overview_fieldsMap.fieldsMap, yesterday, item, "", "contrast");
        });
        js_sdk_uniStat_util.getFieldTotal.call(this, query, "total_users");
      });
    },
    getChartData(query, field = this.chartTabs[this.tabIndex]._id, name = this.chartTabs[this.tabIndex].name) {
      this.options;
      const days = this.currentDateTab;
      const date = js_sdk_uniStat_util.getTimeOfSomeDayAgo(days);
      const day = 24 * 60 * 60 * 1e3;
      let start_time;
      if (!this.getDays()) {
        const start = date - day;
        const end = date + day - 1;
        query = JSON.parse(JSON.stringify(query));
        start_time = query.start_time = [start, end];
      }
      query = js_sdk_uniStat_util.stringifyQuery(query, true, ["uni_platform"]);
      const db = common_vendor.ws.database();
      db.collection(this.tableName).where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_user_overview_fieldsMap.fieldsMap, field)}, start_time`).groupBy(`start_time`).groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_user_overview_fieldsMap.fieldsMap, field)).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        const options = {
          categories: [],
          series: [{
            name,
            data: []
          }]
        };
        let mapper = pages_uniStat_user_overview_fieldsMap.fieldsMap.filter((f) => f.field === field);
        mapper = JSON.parse(JSON.stringify(mapper));
        delete mapper[0].value;
        mapper[0].formatter = "";
        if (!this.getDays()) {
          const [start, end] = start_time;
          const line = options.series[1] = {
            name: js_sdk_uniStat_util.formatDate(start),
            data: []
          };
          const cont = options.series[0] = {
            name: js_sdk_uniStat_util.formatDate(end),
            data: []
          };
          for (let i = 0; i < 24; ++i) {
            const hour = i < 10 ? "0" + i : i;
            const x = `${hour}:00 ~ ${hour}:59`;
            options.categories.push(x);
            line.data[i] = 0;
            cont.data[i] = 0;
            data.forEach((item) => {
              js_sdk_uniStat_util.mapfields(mapper, item, item);
              let val = Number(item[field]);
              const d = new Date(item.start_time);
              if (item.start_time < date) {
                if (d.getHours() === i) {
                  line.data[i] = val;
                }
              } else {
                if (d.getHours() === i) {
                  cont.data[i] = val;
                }
              }
            });
          }
        } else {
          for (const item of data) {
            js_sdk_uniStat_util.mapfields(mapper, item, item);
            const x = js_sdk_uniStat_util.formatDate(item.start_time, "day");
            let y = Number(item[field]);
            options.series[0].data.push(y);
            options.categories.push(x);
          }
        }
        this.chartData = options;
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
      });
    },
    getAppAccessTimes(query) {
      const db = common_vendor.ws.database();
      return db.collection(this.tableName).where(query).groupBy("appid").groupField(`sum(page_visit_count) as total_app_access`).get();
    },
    navTo(url) {
      if (!url)
        return;
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
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_qiun_data_charts2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../../components/uni-stat-panel/uni-stat-panel.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_fix_window)();
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
    e: common_vendor.o($options.changeTimeRange),
    f: common_vendor.p({
      label: "\u65E5\u671F\u9009\u62E9",
      current: $data.currentDateTab,
      mode: "date",
      today: true
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
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    n: common_vendor.p({
      items: $data.panelData,
      contrast: true
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
      eopts: $data.eopts,
      echartsH5: true,
      echartsApp: true,
      tooltipFormat: "tooltipCustom"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/user/overview/overview.vue"]]);
wx.createPage(MiniProgramPage);
