"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_uniStat_util = require("../../js_sdk/uni-stat/util.js");
const pages_index_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      query: {
        platform_id: "",
        start_time: [js_sdk_uniStat_util.getTimeOfSomeDayAgo(1), new Date().getTime()]
      },
      deviceTableData: [],
      userTableData: [],
      pageSize: 10,
      pageCurrent: 1,
      total: 0,
      loading: false
    };
  },
  onReady() {
    this.getApps(this.queryStr, pages_index_fieldsMap.deviceFeildsMap, "device");
    this.getApps(this.queryStr, pages_index_fieldsMap.userFeildsMap, "user");
  },
  watch: {
    query: {
      deep: true,
      handler(newVal) {
        this.getApps(this.queryStr, pages_index_fieldsMap.deviceFeildsMap, "device");
        this.getApps(this.queryStr, pages_index_fieldsMap.userFeildsMap, "user");
      }
    }
  },
  computed: {
    queryStr() {
      const defQuery = `(dimension == "hour" || dimension == "day")`;
      return js_sdk_uniStat_util.stringifyQuery(this.query) + " && " + defQuery;
    },
    deviceTableFields() {
      return this.tableFieldsMap(pages_index_fieldsMap.deviceFeildsMap);
    },
    userTableFields() {
      return this.tableFieldsMap(pages_index_fieldsMap.userFeildsMap);
    }
  },
  methods: {
    tableFieldsMap(fieldsMap) {
      let tableFields = [];
      const today = [];
      const yesterday = [];
      const other = [];
      for (const mapper of fieldsMap) {
        if (mapper.field) {
          if (mapper.hasOwnProperty("value")) {
            const t = JSON.parse(JSON.stringify(mapper));
            const y = JSON.parse(JSON.stringify(mapper));
            if (mapper.field !== "total_users" && mapper.field !== "total_devices") {
              t.title = "\u4ECA\u65E5" + mapper.title;
              t.field = mapper.field + "_value";
              y.title = "\u6628\u65E5" + mapper.title;
              y.field = mapper.field + "_contrast";
              today.push(t);
              yesterday.push(y);
            } else {
              t.field = mapper.field + "_value";
              other.push(t);
            }
          } else {
            tableFields.push(mapper);
          }
        }
      }
      tableFields = [...tableFields, ...today, ...yesterday, ...other];
      return tableFields;
    },
    getApps(query, fieldsMap, type = "device") {
      this.loading = true;
      const db = common_vendor.ws.database();
      const appList = db.collection("opendb-app-list").getTemp();
      const appDaily = db.collection("uni-stat-result").where(query).getTemp();
      db.collection(appDaily, appList).field(
        `${js_sdk_uniStat_util.stringifyField(fieldsMap, "", "value")},stat_date,appid,dimension`
      ).groupBy(`appid,dimension,stat_date`).groupField(js_sdk_uniStat_util.stringifyGroupField(fieldsMap, "", "value")).orderBy(`appid`, "desc").get().then((res) => {
        let {
          data
        } = res.result;
        this[`${type}TableData`] = [];
        if (!data.length)
          return;
        let appids = [], todays = [], yesterdays = [], isToday = js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), "", ""), isYesterday = js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(1), "", "");
        for (const item of data) {
          const {
            appid,
            name
          } = item.appid && item.appid[0] || {};
          item.appid = appid;
          item.name = name;
          if (appids.indexOf(item.appid) < 0) {
            appids.push(item.appid);
          }
          if (item.dimension === "hour" && item.stat_date === isToday) {
            todays.push(item);
          }
          if (item.dimension === "day" && item.stat_date === isYesterday) {
            yesterdays.push(item);
          }
        }
        const keys = fieldsMap.map((f) => f.field).filter(Boolean);
        for (const appid of appids) {
          const rowData = {};
          const t = todays.find((item) => item.appid === appid);
          const y = yesterdays.find((item) => item.appid === appid);
          for (const key of keys) {
            if (key === "appid" || key === "name") {
              rowData[key] = t && t[key];
            } else {
              const value = t && t[key];
              const contrast = y && y[key];
              rowData[key + "_value"] = js_sdk_uniStat_util.format(value);
              rowData[key + "_contrast"] = js_sdk_uniStat_util.format(contrast);
            }
          }
          this[`${type}TableData`].push(rowData);
          if (appid) {
            t[`total_${type}s`] = 0;
            const query2 = JSON.parse(JSON.stringify(this.query));
            query2.start_time = [js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), new Date().getTime()];
            query2.appid = appid;
            js_sdk_uniStat_util.getFieldTotal.call(this, query2, `total_${type}s`).then((total) => {
              this[`${type}TableData`].find((item) => item.appid === appid)[`total_${type}s_value`] = total;
            });
          }
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    navTo(url, id) {
      if (url.indexOf("http") > -1) {
        window.open(url);
      } else {
        if (id) {
          url = `${url}?appid=${id}`;
        }
        common_vendor.index.navigateTo({
          url
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_notice_bar2 + _easycom_uni_stat_tabs2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_stat_tabs = () => "../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_fix_window = () => "../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_notice_bar + _easycom_uni_stat_tabs + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.deviceTableData.length && !$data.userTableData.length && !$data.query.platform_id
  }, !$data.deviceTableData.length && !$data.userTableData.length && !$data.query.platform_id ? {
    b: common_vendor.o(($event) => $options.navTo("https://uniapp.dcloud.io/uni-stat-v2.html")),
    c: common_vendor.p({
      showGetMore: true,
      showIcon: true,
      text: "\u6682\u65E0\u6570\u636E, \u7EDF\u8BA1\u76F8\u5173\u529F\u80FD\u9700\u5F00\u901A uni \u7EDF\u8BA1\u540E\u624D\u80FD\u4F7F\u7528, \u5982\u672A\u5F00\u901A, \u70B9\u51FB\u67E5\u770B\u5177\u4F53\u6D41\u7A0B"
    })
  } : {}, {
    d: common_vendor.o(($event) => $data.query.platform_id = $event),
    e: common_vendor.p({
      label: "\u5E73\u53F0\u9009\u62E9",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    f: common_vendor.f($options.deviceTableFields, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "4f967d6c-5-" + i0 + ",4f967d6c-4",
        e: common_vendor.p({
          align: "center"
        })
      } : {});
    }),
    g: common_vendor.f($data.deviceTableData, (item, i, i0) => {
      return {
        a: common_vendor.f($options.deviceTableFields, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.field === "appid"
          }, mapper.field === "appid" ? common_vendor.e({
            b: item.appid
          }, item.appid ? {
            c: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            d: common_vendor.o(($event) => $options.navTo("/pages/uni-stat/device/overview/overview", item.appid))
          } : {
            e: common_vendor.o(($event) => $options.navTo("/pages/system/app/add"))
          }, {
            f: "4f967d6c-7-" + i0 + "-" + i1 + "," + ("4f967d6c-6-" + i0),
            g: common_vendor.p({
              align: "center"
            })
          }) : {
            h: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            i: index,
            j: "4f967d6c-8-" + i0 + "-" + i1 + "," + ("4f967d6c-6-" + i0),
            k: common_vendor.p({
              align: "center"
            })
          });
        }),
        b: i,
        c: "4f967d6c-6-" + i0 + ",4f967d6c-3"
      };
    }),
    h: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u6570\u636E"
    }),
    i: common_vendor.f($options.userTableFields, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "4f967d6c-11-" + i0 + ",4f967d6c-10",
        e: common_vendor.p({
          align: "center"
        })
      } : {});
    }),
    j: common_vendor.f($data.userTableData, (item, i, i0) => {
      return {
        a: common_vendor.f($options.userTableFields, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.field === "appid"
          }, mapper.field === "appid" ? common_vendor.e({
            b: item.appid
          }, item.appid ? {
            c: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            d: common_vendor.o(($event) => $options.navTo("/pages/uni-stat/user/overview/overview", item.appid))
          } : {
            e: common_vendor.o(($event) => $options.navTo("/pages/system/app/add"))
          }, {
            f: "4f967d6c-13-" + i0 + "-" + i1 + "," + ("4f967d6c-12-" + i0),
            g: common_vendor.p({
              align: "center"
            })
          }) : {
            h: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            i: index,
            j: "4f967d6c-14-" + i0 + "-" + i1 + "," + ("4f967d6c-12-" + i0),
            k: common_vendor.p({
              align: "center"
            })
          });
        }),
        b: i,
        c: "4f967d6c-12-" + i0 + ",4f967d6c-9"
      };
    }),
    k: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u6570\u636E"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
