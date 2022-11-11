"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdRoles = require("../../../js_sdk/validator/uni-id-roles.js");
const db = common_vendor.ws.database();
const dbOrderBy = "create_date desc";
const dbSearchFields = ["role_id", "role_name", "permission.permission_name"];
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
        ...js_sdk_validator_uniIdRoles.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "uni-id-roles.xls",
        "type": "xls",
        "fields": {
          "\u552F\u4E00ID": "role_id",
          "\u540D\u79F0": "role_name",
          "\u6743\u9650": "permission",
          "\u5907\u6CE8": "comment",
          "create_date": "create_date"
        }
      },
      exportExcelData: []
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
    this.$refs.udb.loadData();
  },
  methods: {
    onqueryload(data) {
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        item.permission = item.permission.map((pItem) => pItem.permission_name).join("\u3001");
        item.create_date = this.$formatDate(item.create_date);
      }
      this.exportExcelData = data;
    },
    changeSize(pageSize2) {
      this.options.pageSize = pageSize2;
      this.options.pageCurrent = 1;
      this.$nextTick(() => {
        this.loadData();
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
      this.$nextTick(() => {
        this.loadData();
      });
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
      this.$refs.udb.remove(id, {
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
      let newWhere = js_sdk_validator_uniIdRoles.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
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
        a: "26f73d30-4-" + i0 + "," + ("26f73d30-3-" + i0),
        b: "26f73d30-5-" + i0 + "," + ("26f73d30-3-" + i0),
        c: "26f73d30-6-" + i0 + "," + ("26f73d30-3-" + i0),
        d: "26f73d30-7-" + i0 + "," + ("26f73d30-3-" + i0),
        e: "26f73d30-8-" + i0 + "," + ("26f73d30-3-" + i0),
        f: "26f73d30-9-" + i0 + "," + ("26f73d30-3-" + i0),
        g: "26f73d30-3-" + i0 + "," + ("26f73d30-2-" + i0),
        h: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.role_id),
            b: "26f73d30-11-" + i0 + "-" + i1 + "," + ("26f73d30-10-" + i0 + "-" + i1),
            c: common_vendor.t(item.role_name),
            d: "26f73d30-12-" + i0 + "-" + i1 + "," + ("26f73d30-10-" + i0 + "-" + i1),
            e: common_vendor.t(item.permission),
            f: "26f73d30-13-" + i0 + "-" + i1 + "," + ("26f73d30-10-" + i0 + "-" + i1),
            g: common_vendor.t(item.comment),
            h: "26f73d30-14-" + i0 + "-" + i1 + "," + ("26f73d30-10-" + i0 + "-" + i1),
            i: "26f73d30-16-" + i0 + "-" + i1 + "," + ("26f73d30-15-" + i0 + "-" + i1),
            j: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            k: "26f73d30-15-" + i0 + "-" + i1 + "," + ("26f73d30-10-" + i0 + "-" + i1),
            l: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false)),
            m: common_vendor.o(($event) => $options.confirmDelete(item._id)),
            n: "26f73d30-17-" + i0 + "-" + i1 + "," + ("26f73d30-10-" + i0 + "-" + i1),
            o: index,
            p: "26f73d30-10-" + i0 + "-" + i1 + "," + ("26f73d30-2-" + i0)
          };
        }),
        i: common_vendor.sr("table", "26f73d30-2-" + i0 + ",26f73d30-1"),
        j: "26f73d30-2-" + i0 + ",26f73d30-1",
        k: common_vendor.p({
          loading,
          emptyText: error.message || _ctx.$t("common.empty"),
          border: true,
          stripe: true,
          type: "selection"
        }),
        l: "26f73d30-18-" + i0 + ",26f73d30-1",
        m: common_vendor.o(($event) => pagination.current = $event),
        n: common_vendor.p({
          ["show-icon"]: true,
          ["show-page-size"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        o: i0,
        p: s0
      };
    }, {
      name: "d",
      path: "l",
      vueId: "26f73d30-1"
    }),
    m: common_vendor.o(($event) => $options.filterChange($event, "role_id")),
    n: common_vendor.o(($event) => $options.sortChange($event, "role_id")),
    o: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "role_name")),
    q: common_vendor.o(($event) => $options.sortChange($event, "role_name")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    s: common_vendor.p({
      align: "center"
    }),
    t: common_vendor.o(($event) => $options.filterChange($event, "comment")),
    v: common_vendor.o(($event) => $options.sortChange($event, "comment")),
    w: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    x: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    y: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    z: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    A: common_vendor.p({
      align: "center"
    }),
    B: common_vendor.p({
      align: "center"
    }),
    C: common_vendor.p({
      align: "center"
    }),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.p({
      align: "center"
    }),
    F: common_vendor.p({
      align: "center"
    }),
    G: common_vendor.t(_ctx.$t("common.button.edit")),
    H: common_vendor.t(_ctx.$t("common.button.delete")),
    I: common_vendor.p({
      align: "center"
    }),
    J: common_vendor.o($options.selectionChange),
    K: common_vendor.o($options.onPageChanged),
    L: common_vendor.o($options.changeSize),
    M: common_vendor.sr("udb", "26f73d30-1"),
    N: common_vendor.o($options.onqueryload),
    O: common_vendor.p({
      collection: "uni-id-roles,uni-id-permissions",
      field: "role_id,role_name,permission{permission_name},comment,create_date",
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/role/list.vue"]]);
wx.createPage(MiniProgramPage);
