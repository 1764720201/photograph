"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_error_app_fieldsMap = require("./fieldsMap.js");
const js_sdk_validator_uniStatAppCrashLogs = require("../../../../js_sdk/validator/uni-stat-app-crash-logs.js");
const panelOption = [{
  title: "\u5D29\u6E83\u603B\u6570",
  field: "count",
  value: 0,
  formatter: ",",
  tooltip: "\u6307\u539F\u751F\u5E94\u7528\u5728\u67D0\u4E2A\u65F6\u95F4\u6BB5\u5185\u51FA\u73B0\u5D29\u6E83\u7684\u603B\u6570"
}, {
  title: "\u5D29\u6E83\u7387",
  field: "count/app_launch_count",
  computed: "count/app_launch_count",
  formatter: "%",
  value: 0,
  tooltip: "\u65F6\u95F4\u8303\u56F4\u5185\u7684\u603B\u5D29\u6E83\u6570/\u539F\u751F\u5E94\u7528\u542F\u52A8\u6B21\u6570\uFF0C\u5982\u679C\u5C0F\u4E8E0.01%\uFF0C\u9ED8\u8BA4\u663E\u793A\u4E3A0"
}];
const db = common_vendor.ws.database();
const dbOrderBy = "create_time desc";
const dbSearchFields = [];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      fieldsMap: pages_uniStat_error_app_fieldsMap.fieldsMap,
      query: {
        type: "crash",
        dimension: "day",
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
      popupLoading: false,
      currentDateTab: 0,
      tableData: [],
      popupTableData: [],
      panelData: JSON.parse(JSON.stringify(panelOption)),
      chartData: {},
      chartTab: "errorCount",
      chartTabs: [{
        _id: "errorCount",
        name: "\u5D29\u6E83\u6B21\u6570"
      }, {
        _id: "errorRate",
        name: "\u5D29\u6E83\u7387"
      }],
      collectionList: "uni-stat-app-crash-logs",
      schemaQuery: "",
      where: this.tableData,
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_uniStatAppCrashLogs.enumConverter
      },
      exportExcel: {
        "filename": "uni-stat-app-crash-logs.xls",
        "type": "xls",
        "fields": {
          "appid": "appid",
          "version": "version",
          "platform": "platform",
          "channel": "channel",
          "sdk_version": "sdk_version",
          "device_id": "device_id",
          "device_net": "device_net",
          "device_os": "device_os",
          "device_os_version": "device_os_version",
          "device_vendor": "device_vendor",
          "device_model": "device_model",
          "device_is_root": "device_is_root",
          "device_os_name": "device_os_name",
          "device_batt_level": "device_batt_level",
          "device_batt_temp": "device_batt_temp",
          "device_memory_use_size": "device_memory_use_size",
          "device_memory_total_size": "device_memory_total_size",
          "device_disk_use_size": "device_disk_use_size",
          "device_disk_total_size": "device_disk_total_size",
          "device_abis": "device_abis",
          "app_count": "app_count",
          "app_use_memory_size": "app_use_memory_size",
          "app_webview_count": "app_webview_count",
          "app_use_duration": "app_use_duration",
          "app_run_fore": "app_run_fore",
          "package_name": "package_name",
          "package_version": "package_version",
          "page_url": "page_url",
          "error_msg": "error_msg",
          "create_time": "create_time"
        }
      },
      exportExcelData: []
    };
  },
  computed: {
    queryStr() {
      return js_sdk_uniStat_util.stringifyQuery(this.query);
    },
    tableQuery() {
      const {
        appid,
        platform_id,
        version_id,
        start_time
      } = this.query;
      const platforms = common_vendor.index.getStorageSync("platform_channel_last_data");
      const versions = common_vendor.index.getStorageSync("uni-stat-app-versions_last_data");
      const p = Array.isArray(platforms) && platforms.find((p2) => p2._id === platform_id);
      const v = Array.isArray(versions) && versions.find((v2) => v2._id === version_id);
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        create_time: start_time,
        platform: p && p.code || "",
        version: v && v.text || ""
      });
      return query;
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
    this.debounceGet = js_sdk_uniStat_util.debounce(() => {
      this.getAllData(this.queryStr);
      this.where = this.tableQuery;
      this.$nextTick(() => {
        this.$refs.udb && this.$refs.udb.loadData();
      }, 200);
    });
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.options.pageCurrent = 1;
        this.debounceGet();
      }
    },
    chartTab(val) {
      this.getChartData(this.queryStr);
    }
  },
  onLoad() {
    this._filter = {};
  },
  methods: {
    onqueryload(data) {
      this.exportExcelData = data;
      this.tableData = data;
    },
    getWhere() {
      const query = this.schemaQuery.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.selectedIndexs.length = 0;
      this.$refs.table.clearSelection();
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    sortChange(e, name) {
      this.orderByFieldName = name;
      if (e.order) {
        this.orderby = name + " " + orderByMapping[e.order];
      } else {
        this.orderby = "";
      }
      this.$refs.table.clearSelection();
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    filterChange(e, name) {
      this._filter[name] = {
        type: e.filterType,
        value: e.filter
      };
      let newWhere = js_sdk_validator_uniStatAppCrashLogs.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
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
    getAllData(query) {
      this.getPanelData(query);
      this.getChartData(query);
    },
    getPanelData(query) {
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      const db2 = common_vendor.ws.database();
      console.log("queryStr", querystr);
      db2.collection("uni-stat-error-result").where(querystr).field("count as temp_count, app_launch_count as temp_app_launch_count, appid").groupBy("appid").groupField("sum(temp_count) as count, sum(temp_app_launch_count) as app_launch_count").get({
        getCount: true
      }).then((res) => {
        res.result;
        const item = res.result.data[0];
        let queryTemp = Object.assign({}, this.query);
        delete queryTemp.type;
        console.log("---- query ", queryTemp);
        this.getTotalLaunch(js_sdk_uniStat_util.stringifyQuery(queryTemp, false, ["uni_platform"])).then((res2) => {
          const total = res2.result.data[0];
          console.log("result total---", total);
          if (item) {
            let launch_count = total && total.total_app_launch_count;
            item.app_launch_count = launch_count;
            this.panelData = js_sdk_uniStat_util.mapfields(panelOption, item);
          }
        });
      });
    },
    getTotalLaunch(query) {
      const db2 = common_vendor.ws.database();
      return db2.collection("uni-stat-result").where(query).groupBy("appid").groupField("sum(app_launch_count) as total_app_launch_count").get();
    },
    getChartData(query, field = "day_count") {
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      this.chartData = {};
      this.options;
      const db2 = common_vendor.ws.database();
      const [start_time, end_tiem] = this.query.start_time;
      const timeAll = js_sdk_uniStat_util.getAllDateCN(new Date(start_time), new Date(end_tiem));
      db2.collection("uni-stat-error-result").where(querystr).field("count as temp_count, app_launch_count as temp_app_launch_count, start_time").groupBy("start_time").groupField("sum(temp_count) as count, sum(temp_app_launch_count) as app_launch_count").orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        let dataAll = [];
        timeAll.forEach((v) => {
          let item = data.find((item2) => item2.start_time === v);
          console.log(item);
          if (item) {
            dataAll.push(item);
          } else {
            dataAll.push({
              app_launch_count: 0,
              count: 0,
              start_time: v
            });
          }
        });
        const options = {
          categories: [],
          series: [{
            name: "\u6682\u65E0\u6570\u636E",
            data: []
          }]
        };
        if (this.chartTab === "errorCount") {
          const countLine = options.series[0] = {
            name: "\u5D29\u6E83\u6B21\u6570",
            data: []
          };
          const xAxis = options.categories;
          for (const item of dataAll) {
            let date = item.start_time;
            const x = js_sdk_uniStat_util.formatDate(date, "day");
            const countY = item.count;
            xAxis.push(x);
            countLine.data.push(countY);
          }
          this.chartData = options;
        } else {
          const rateLine = options.series[0] = {
            name: "\u5D29\u6E83\u7387(%)",
            data: [],
            lineStyle: {
              color: "#EE6666",
              width: 1
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: "#EE6666",
              color: "#EE6666"
            },
            areaStyle: {
              color: {
                colorStops: [{
                  offset: 0,
                  color: "#EE6666"
                }, {
                  offset: 1,
                  color: "#FFFFFF"
                }]
              }
            }
          };
          const xAxis = options.categories;
          for (const item of dataAll) {
            const {
              count: count2,
              app_launch_count
            } = item;
            let date = item.start_time;
            const x = js_sdk_uniStat_util.formatDate(date, "day");
            console.log("---", x);
            xAxis.push(x);
            let y = count2 / app_launch_count;
            y = !y ? 0 : y.toFixed(2);
            rateLine.data.push(y);
          }
          this.chartData = options;
        }
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
  const _easycom_uni_stat_panel2 = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_qiun_data_charts2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../../components/uni-stat-panel/uni-stat-panel.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_th = () => "../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window)();
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
    e: common_vendor.o($options.changePlatform),
    f: common_vendor.o(($event) => $data.query.platform_id = $event),
    g: common_vendor.p({
      label: "\u5E73\u53F0\u9009\u62E9",
      type: "boldLine",
      all: false,
      mode: "platform-channel",
      modelValue: $data.query.platform_id
    }),
    h: common_vendor.o($options.changeTimeRange),
    i: common_vendor.p({
      label: "\u65E5\u671F\u9009\u62E9",
      current: $data.currentDateTab,
      yesterday: false,
      mode: "date"
    }),
    j: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    k: common_vendor.o($options.useDatetimePicker),
    l: common_vendor.o(($event) => $data.query.start_time = $event),
    m: common_vendor.p({
      type: "daterange",
      end: new Date().getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    n: common_vendor.p({
      items: $data.panelData
    }),
    o: common_vendor.o(($event) => $data.chartTab = $event),
    p: common_vendor.p({
      type: "box",
      tabs: $data.chartTabs,
      modelValue: $data.chartTab
    }),
    q: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      eopts: {
        notMerge: true
      },
      echartsH5: true,
      echartsApp: true,
      tooltipFormat: "tooltipCustom"
    }),
    r: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: common_vendor.f($data.fieldsMap, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.title
          }, mapper.title ? {
            b: common_vendor.t(mapper.title),
            c: index,
            d: `${mapper.title.length * 15 + 80}px`,
            e: "aaeb3432-12-" + i0 + "-" + i1 + "," + ("aaeb3432-11-" + i0),
            f: common_vendor.p({
              align: "center"
            })
          } : {});
        }),
        b: "aaeb3432-11-" + i0 + "," + ("aaeb3432-10-" + i0),
        c: common_vendor.f($data.tableData, (item, i, i1) => {
          return {
            a: common_vendor.f($data.fieldsMap, (mapper, index, i2) => {
              return common_vendor.e({
                a: mapper.field === "error_msg"
              }, mapper.field === "error_msg" ? {
                b: common_vendor.t(item.error_msg ? item.error_msg.substring(0, 100) + "..." : "-"),
                c: mapper.field,
                d: "aaeb3432-14-" + i0 + "-" + i1 + "-" + i2 + "," + ("aaeb3432-13-" + i0 + "-" + i1),
                e: common_vendor.p({
                  align: "left"
                })
              } : mapper.field === "create_time" ? {
                g: "aaeb3432-16-" + i0 + "-" + i1 + "-" + i2 + "," + ("aaeb3432-15-" + i0 + "-" + i1 + "-" + i2),
                h: common_vendor.p({
                  threshold: [0, 0],
                  date: item.create_time
                }),
                i: mapper.field,
                j: "aaeb3432-15-" + i0 + "-" + i1 + "-" + i2 + "," + ("aaeb3432-13-" + i0 + "-" + i1),
                k: common_vendor.p({
                  align: "center"
                })
              } : {
                l: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
                m: mapper.field,
                n: "aaeb3432-17-" + i0 + "-" + i1 + "-" + i2 + "," + ("aaeb3432-13-" + i0 + "-" + i1),
                o: common_vendor.p({
                  align: "center"
                })
              }, {
                f: mapper.field === "create_time"
              });
            }),
            b: i,
            c: "aaeb3432-13-" + i0 + "-" + i1 + "," + ("aaeb3432-10-" + i0)
          };
        }),
        d: common_vendor.sr("table", "aaeb3432-10-" + i0 + ",aaeb3432-9"),
        e: "aaeb3432-10-" + i0 + ",aaeb3432-9",
        f: common_vendor.p({
          loading,
          border: true,
          stripe: true,
          emptyText: _ctx.$t("common.empty")
        }),
        g: "aaeb3432-18-" + i0 + ",aaeb3432-9",
        h: common_vendor.o(($event) => pagination.current = $event),
        i: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        j: i0,
        k: s0
      };
    }, {
      name: "d",
      path: "r",
      vueId: "aaeb3432-9"
    }),
    s: common_vendor.o($options.onPageChanged),
    t: common_vendor.sr("udb", "aaeb3432-9"),
    v: common_vendor.o($options.onqueryload),
    w: common_vendor.p({
      collection: $data.collectionList,
      field: "appid,version,platform,channel,sdk_version,device_id,device_net,device_os,device_os_version,device_vendor,device_model,device_is_root,device_os_name,device_batt_level,device_batt_temp,device_memory_use_size,device_memory_total_size,device_disk_use_size,device_disk_total_size,device_abis,app_count,app_use_memory_size,app_webview_count,app_use_duration,app_run_fore,package_name,package_version,page_url,error_msg,create_time",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      loadtime: "manual",
      options: $data.options
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/error/app/app.vue"]]);
wx.createPage(MiniProgramPage);
