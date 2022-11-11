"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../js_sdk/uni-stat/util.js");
const pages_uniStat_channel_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      fieldsMap: pages_uniStat_channel_fieldsMap.fieldsMap,
      query: {
        dimension: "day",
        appid: "",
        uni_platform: "android",
        platform_id: "",
        version_id: "",
        start_time: []
      },
      paginationOptions: {
        pageSize: 20,
        pageCurrent: 1,
        total: 0
      },
      loading: false,
      currentDateTab: 1,
      days: 0,
      tableData: [],
      panelData: pages_uniStat_channel_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value")),
      chartData: {},
      chartTab: "new_device_count",
      queryId: "",
      updateValue: ""
    };
  },
  computed: {
    chartTabs() {
      const tabs = [];
      pages_uniStat_channel_fieldsMap.fieldsMap.forEach((item) => {
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
        uni_platform,
        type: "native_app"
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
        this.paginationOptions.pageCurrent = 1;
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
      console.log(item.code);
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
      this.paginationOptions.pageCurrent = e.current;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.paginationOptions.pageSize = pageSize;
      this.paginationOptions.pageCurrent = 1;
      this.getTableData();
    },
    changeChartTab(id, index, name) {
      this.getChartData(id, name);
    },
    getAllData(query) {
      this.getPanelData();
      this.getChartData();
      this.getTableData();
    },
    getChartData(field2 = this.chartTab) {
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      this.paginationOptions;
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(querystr).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_channel_fieldsMap.fieldsMap, field2)}, start_time, channel_id`).groupBy("channel_id,start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_channel_fieldsMap.fieldsMap, field2)).orderBy("start_time", "asc").get({
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
        console.log("data----", data);
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
            let mapper = pages_uniStat_channel_fieldsMap.fieldsMap.filter((f) => f.field === field2);
            mapper = JSON.parse(JSON.stringify(mapper));
            delete mapper[0].value;
            mapper[0].formatter = "";
            for (const item of data) {
              js_sdk_uniStat_util.mapfields(mapper, item, item);
              let date = item.start_time;
              const x = js_sdk_uniStat_util.formatDate(date, this.dimension);
              let y = item[field2];
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
          console.log(options);
          options.series = options.series.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          this.chartData = options;
        });
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
      });
    },
    getChannels() {
      const db = common_vendor.ws.database();
      console.log(this.query);
      return db.collection("uni-stat-app-channels").where(js_sdk_uniStat_util.stringifyQuery({
        appid: this.query.appid,
        platform_id: this.query.platform_id
      })).get();
    },
    getTableData() {
      const query = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      const {
        pageCurrent
      } = this.paginationOptions;
      this.loading = true;
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_channel_fieldsMap.fieldsMap)},appid, channel_id`).groupBy("appid, channel_id").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_channel_fieldsMap.fieldsMap)).orderBy("new_device_count", "desc").skip((pageCurrent - 1) * this.paginationOptions.pageSize).limit(this.paginationOptions.pageSize).get({
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
            js_sdk_uniStat_util.mapfields(pages_uniStat_channel_fieldsMap.fieldsMap, item, item, "total_");
          }
          this.tableData = [];
          this.paginationOptions.total = count;
          this.tableData = data;
          this.loading = false;
        });
      }).catch((err) => {
        console.error(err);
        this.loading = false;
      });
    },
    createStr(maps, fn, prefix = "total_") {
      const strArr = [];
      maps.forEach((mapper) => {
        if (field.hasOwnProperty("value")) {
          const fieldName = mapper.field;
          strArr.push(`${fn}(${fieldName}) as ${prefix + fieldName}`);
        }
      });
      return strArr.join();
    },
    getPanelData() {
      let query = JSON.parse(JSON.stringify(this.query));
      query.dimension = "day";
      let querystr = js_sdk_uniStat_util.stringifyQuery(query, false, ["uni_platform"]);
      console.log("channel --:", querystr);
      const db = common_vendor.ws.database();
      db.collection("uni-stat-result").where(querystr).field(js_sdk_uniStat_util.stringifyField(pages_uniStat_channel_fieldsMap.fieldsMap)).groupBy("appid").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_channel_fieldsMap.fieldsMap)).orderBy("start_time", "desc").get().then((res) => {
        const item = res.result.data[0];
        item && (item.total_devices = 0);
        js_sdk_uniStat_util.getFieldTotal.call(this, query);
        this.panelData = [];
        this.panelData = js_sdk_uniStat_util.mapfields(pages_uniStat_channel_fieldsMap.fieldsMap, item);
      });
    },
    inputDialogToggle(queryId, updateValue) {
      this.queryId = queryId;
      this.updateValue = updateValue;
      this.$refs.inputDialog.open();
    },
    editName(value) {
      const db = common_vendor.ws.database();
      db.collection("uni-stat-app-channels").where({
        channel_code: this.queryId
      }).update({
        channel_name: value
      }).then((res) => {
        common_vendor.index.showToast({
          title: "\u4FEE\u6539\u6210\u529F"
        });
        this.getTableData();
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_stat_panel2 = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_link2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_qiun_data_charts2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_icons2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../components/uni-stat-panel/uni-stat-panel.js";
const _easycom_qiun_data_charts = () => "../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_link + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_icons + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      href: "https://ask.dcloud.net.cn/article/35974",
      text: "\u652F\u6301Android App\u591A\u6E20\u9053\u7EDF\u8BA1\u3002\u8BBE\u7F6EApp\u6E20\u9053\u5305\u7684\u65B9\u6CD5\uFF0C\u8BF7\u53C2\u8003 https://ask.dcloud.net.cn/article/35974\u3002"
    }),
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
      storage: false,
      where: $options.versionQuery,
      field: "_id as value, version as text",
      orderby: "text asc",
      label: "\u7248\u672C\u9009\u62E9",
      modelValue: $data.query.version_id
    }),
    f: common_vendor.o($options.changePlatform),
    g: common_vendor.o(($event) => $data.query.platform_id = $event),
    h: common_vendor.p({
      label: "\u5E73\u53F0\u9009\u62E9",
      type: "boldLine",
      mode: "platform-channel",
      all: false,
      modelValue: $data.query.platform_id
    }),
    i: common_vendor.o($options.changeTimeRange),
    j: common_vendor.p({
      label: "\u65E5\u671F\u9009\u62E9",
      current: $data.currentDateTab,
      mode: "date"
    }),
    k: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    l: common_vendor.o($options.useDatetimePicker),
    m: common_vendor.o(($event) => $data.query.start_time = $event),
    n: common_vendor.p({
      type: "daterange",
      end: new Date().getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    o: common_vendor.p({
      items: $data.panelData
    }),
    p: common_vendor.o($options.changeChartTab),
    q: common_vendor.o(($event) => $data.chartTab = $event),
    r: common_vendor.p({
      type: "box",
      tabs: $options.chartTabs,
      modelValue: $data.chartTab
    }),
    s: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true,
      tooltipFormat: "tooltipCustom"
    }),
    t: common_vendor.p({
      color: "",
      href: "https://ask.dcloud.net.cn/article/35974",
      text: "\u5982\u4F55\u81EA\u5B9A\u4E49\u6E20\u9053\u5305?"
    }),
    v: common_vendor.f($data.fieldsMap.slice(0, $data.fieldsMap.length - 1), (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "2ce46f72-13-" + i0 + ",2ce46f72-12",
        e: common_vendor.p({
          align: "center"
        })
      } : {});
    }),
    w: common_vendor.f($data.tableData, (item, i, i0) => {
      return {
        a: common_vendor.f($data.fieldsMap.slice(0, $data.fieldsMap.length - 1), (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.title && index === 1
          }, mapper.title && index === 1 ? {
            b: common_vendor.t(item[mapper.field] ? item[mapper.field] : "-"),
            c: common_vendor.o(($event) => $options.inputDialogToggle(item.channel_code, item.channel_name)),
            d: "2ce46f72-16-" + i0 + "-" + i1 + "," + ("2ce46f72-15-" + i0 + "-" + i1),
            e: common_vendor.p({
              type: "compose",
              color: "#2979ff",
              size: "25"
            }),
            f: mapper.field,
            g: "2ce46f72-15-" + i0 + "-" + i1 + "," + ("2ce46f72-14-" + i0)
          } : {
            i: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            j: mapper.field,
            k: "2ce46f72-17-" + i0 + "-" + i1 + "," + ("2ce46f72-14-" + i0),
            l: common_vendor.p({
              align: "center"
            })
          }, {
            h: mapper.title
          });
        }),
        b: i,
        c: "2ce46f72-14-" + i0 + ",2ce46f72-11"
      };
    }),
    x: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: _ctx.$t("common.empty")
    }),
    y: common_vendor.o($options.changePageCurrent),
    z: common_vendor.o($options.changePageSize),
    A: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.paginationOptions.pageSize,
      current: $data.paginationOptions.pageCurrent,
      total: $data.paginationOptions.total
    }),
    B: common_vendor.sr("inputClose", "2ce46f72-20,2ce46f72-19"),
    C: common_vendor.o($options.editName),
    D: common_vendor.o(($event) => $data.updateValue = $event),
    E: common_vendor.p({
      mode: "input",
      title: "\u8BF7\u7F16\u8F91\u540D\u79F0",
      placeholder: "\u8BF7\u8F93\u5165\u5185\u5BB9",
      modelValue: $data.updateValue
    }),
    F: common_vendor.sr("inputDialog", "2ce46f72-19"),
    G: common_vendor.p({
      type: "dialog",
      maskClick: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/channel/channel.vue"]]);
wx.createPage(MiniProgramPage);
