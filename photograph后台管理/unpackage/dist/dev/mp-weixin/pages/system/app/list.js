"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_opendbAppList = require("../../../js_sdk/validator/opendb-app-list.js");
const db = common_vendor.ws.database();
const dbOrderBy = "create_date";
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
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_opendbAppList.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "opendb-app-list.xls",
        "type": "xls",
        "fields": {
          "AppID": "appid",
          "\u5E94\u7528\u540D\u79F0": "name",
          "\u5E94\u7528\u63CF\u8FF0": "description",
          "\u521B\u5EFA\u65F6\u95F4": "create_date"
        }
      },
      exportExcelData: [],
      addAppidLoading: true,
      descriptionThWidth: 380,
      buttonThWidth: 400
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
    this.$refs.udb.loadData();
  },
  computed: {
    ...common_vendor.mapState("app", ["appName", "appid"])
  },
  methods: {
    pageSizeChange(pageSize2) {
      this.options.pageSize = pageSize2;
      this.options.pageCurrent = 1;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    onqueryload(data) {
      if (!data.find((item) => item.appid === this.appid)) {
        this.addCurrentAppid({
          appid: this.appid,
          name: this.appName,
          description: "admin \u7BA1\u7406\u540E\u53F0",
          create_date: Date.now()
        });
      } else {
        this.addAppidLoading = false;
      }
      this.exportExcelData = data;
    },
    changeSize(e) {
      this.pageSizeIndex = e.detail.value;
    },
    addCurrentAppid(app) {
      db.collection("opendb-app-list").add(app).then((res) => {
        this.loadData();
        setTimeout(() => {
          common_vendor.index.showModal({
            content: `\u68C0\u6D4B\u5230\u6570\u636E\u5E93\u4E2D\u65E0\u5F53\u524D\u5E94\u7528, \u5DF2\u81EA\u52A8\u6DFB\u52A0\u5E94\u7528: ${this.appName}`,
            showCancel: false
          });
        }, 500);
      }).catch((err) => {
      }).finally(() => {
        this.addAppidLoading = false;
      });
    },
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
    },
    search() {
      const newWhere = this.getWhere();
      this.where = newWhere;
      this.loadData();
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
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData(clear);
          }
        }
      });
    },
    selectedItems() {
      var dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    delTable() {
      console.warn(
        "\u5220\u9664\u5E94\u7528\uFF0C\u53EA\u80FD\u5220\u9664\u5E94\u7528\u8868 opendb-app-list \u4E2D\u7684\u5E94\u7528\u6570\u636E\u8BB0\u5F55\uFF0C\u4E0D\u80FD\u5220\u9664\u4E0E\u5E94\u7528\u5173\u8054\u7684\u5176\u4ED6\u6570\u636E\uFF0C\u4F8B\u5982\uFF1A\u4F7F\u7528\u5347\u7EA7\u4E2D\u5FC3 uni-upgrade-center \u7B49\u63D2\u4EF6\u4EA7\u751F\u7684\u6570\u636E\uFF08\u5E94\u7528\u7248\u672C\u6570\u636E\u7B49\uFF09"
      );
      this.$refs.udb.remove(this.selectedItems(), {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      console.warn(
        "\u5220\u9664\u5E94\u7528\uFF0C\u53EA\u80FD\u5220\u9664\u5E94\u7528\u8868 opendb-app-list \u4E2D\u7684\u5E94\u7528\u6570\u636E\u8BB0\u5F55\uFF0C\u4E0D\u80FD\u5220\u9664\u4E0E\u5E94\u7528\u5173\u8054\u7684\u5176\u4ED6\u6570\u636E\uFF0C\u4F8B\u5982\uFF1A\u4F7F\u7528\u5347\u7EA7\u4E2D\u5FC3 uni-upgrade-center \u7B49\u63D2\u4EF6\u4EA7\u751F\u7684\u6570\u636E\uFF08\u5E94\u7528\u7248\u672C\u6570\u636E\u7B49\uFF09"
      );
      this.$refs.udb.remove(id, {
        confirmContent: "\u662F\u5426\u5220\u9664\u8BE5\u5E94\u7528",
        success: (res) => {
          this.$refs.table.clearSelection();
        }
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
      let newWhere = js_sdk_validator_opendbAppList.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    publish(id) {
      common_vendor.index.navigateTo({
        url: "/pages/system/app/uni-portal/uni-portal?id=" + id
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: _ctx.$t("common.placeholder.query"),
    c: $data.query,
    d: common_vendor.o(($event) => $data.query = $event.detail.value),
    e: common_vendor.t(_ctx.$t("common.button.search")),
    f: common_vendor.o((...args) => $options.search && $options.search(...args)),
    g: common_vendor.t(_ctx.$t("common.button.add")),
    h: common_vendor.o(($event) => $options.navigateTo("./add")),
    i: common_vendor.t(_ctx.$t("common.button.batchDelete")),
    j: !$data.selectedIndexs.length,
    k: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    l: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "2bdc58c3-4-" + i0 + "," + ("2bdc58c3-3-" + i0),
        b: "2bdc58c3-5-" + i0 + "," + ("2bdc58c3-3-" + i0),
        c: "2bdc58c3-6-" + i0 + "," + ("2bdc58c3-3-" + i0),
        d: "2bdc58c3-7-" + i0 + "," + ("2bdc58c3-3-" + i0),
        e: "2bdc58c3-8-" + i0 + "," + ("2bdc58c3-3-" + i0),
        f: "2bdc58c3-3-" + i0 + "," + ("2bdc58c3-2-" + i0),
        g: common_vendor.f(data, (item, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(item.appid),
            b: "2bdc58c3-10-" + i0 + "-" + i1 + "," + ("2bdc58c3-9-" + i0 + "-" + i1),
            c: common_vendor.t(item.name),
            d: "2bdc58c3-11-" + i0 + "-" + i1 + "," + ("2bdc58c3-9-" + i0 + "-" + i1),
            e: common_vendor.t(item.description),
            f: "2bdc58c3-12-" + i0 + "-" + i1 + "," + ("2bdc58c3-9-" + i0 + "-" + i1),
            g: "2bdc58c3-14-" + i0 + "-" + i1 + "," + ("2bdc58c3-13-" + i0 + "-" + i1),
            h: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            i: "2bdc58c3-13-" + i0 + "-" + i1 + "," + ("2bdc58c3-9-" + i0 + "-" + i1),
            j: item.appid === _ctx.appid
          }, item.appid === _ctx.appid ? {} : {
            k: common_vendor.t(_ctx.$t("common.button.publish")),
            l: common_vendor.o(($event) => $options.publish(item._id)),
            m: common_vendor.t(_ctx.$t("common.button.version")),
            n: common_vendor.o(($event) => $options.navigateTo("/uni_modules/uni-upgrade-center/pages/version/list?appid=" + item.appid, false)),
            o: common_vendor.t(_ctx.$t("common.button.edit")),
            p: common_vendor.o(($event) => $options.navigateTo("./add?id=" + item.appid, false)),
            q: common_vendor.t(_ctx.$t("common.button.delete")),
            r: common_vendor.o(($event) => $options.confirmDelete(item._id))
          }, {
            s: "2bdc58c3-15-" + i0 + "-" + i1 + "," + ("2bdc58c3-9-" + i0 + "-" + i1),
            t: index,
            v: "2bdc58c3-9-" + i0 + "-" + i1 + "," + ("2bdc58c3-2-" + i0),
            w: common_vendor.p({
              disabled: item.appid === _ctx.appid
            })
          });
        }),
        h: common_vendor.sr("table", "2bdc58c3-2-" + i0 + ",2bdc58c3-1"),
        i: "2bdc58c3-2-" + i0 + ",2bdc58c3-1",
        j: common_vendor.p({
          loading: loading || $data.addAppidLoading,
          emptyText: error.message || _ctx.$t("common.empty"),
          border: true,
          stripe: true,
          type: "selection"
        }),
        k: "2bdc58c3-16-" + i0 + ",2bdc58c3-1",
        l: common_vendor.o(($event) => pagination.current = $event),
        m: common_vendor.p({
          ["show-icon"]: true,
          ["show-page-size"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        n: i0,
        o: s0
      };
    }, {
      name: "d",
      path: "l",
      vueId: "2bdc58c3-1"
    }),
    m: common_vendor.o(($event) => $options.filterChange($event, "appid")),
    n: common_vendor.o(($event) => $options.sortChange($event, "appid")),
    o: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "name")),
    q: common_vendor.o(($event) => $options.sortChange($event, "name")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    s: common_vendor.o(($event) => $options.filterChange($event, "description")),
    t: common_vendor.o(($event) => $options.sortChange($event, "description")),
    v: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true,
      width: $data.descriptionThWidth
    }),
    w: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    x: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    y: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    z: common_vendor.p({
      align: "center",
      width: $data.buttonThWidth
    }),
    A: common_vendor.p({
      align: "center"
    }),
    B: common_vendor.p({
      align: "center"
    }),
    C: common_vendor.p({
      align: "left"
    }),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.p({
      align: "center"
    }),
    F: common_vendor.o($options.selectionChange),
    G: common_vendor.o($options.onPageChanged),
    H: common_vendor.o($options.pageSizeChange),
    I: common_vendor.sr("udb", "2bdc58c3-1"),
    J: common_vendor.o($options.onqueryload),
    K: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid,name,description,create_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/app/list.vue"]]);
wx.createPage(MiniProgramPage);
