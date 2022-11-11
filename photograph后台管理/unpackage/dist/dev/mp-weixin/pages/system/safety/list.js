"use strict";
const common_vendor = require("../../../common/vendor.js");
common_vendor.ws.database();
const dbCollectionName = "uni-id-log, uni-id-users";
const dbOrderBy = "create_date";
const dbSearchFields = ["user_id.username", "type", "ip"];
const pageSize = 20;
const pageCurrent = 1;
const _sfc_main = {
  data() {
    return {
      query: "",
      where: "",
      orderby: dbOrderBy,
      collectionName: dbCollectionName,
      options: {
        pageSize,
        pageCurrent
      }
    };
  },
  methods: {
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
      const isSameWhere = newWhere === this.where;
      this.where = newWhere;
      if (isSameWhere) {
        this.loadData();
      }
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData();
          }
        }
      });
    },
    selectedItems() {
      var dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    delTable() {
      this.$refs.udb.remove(this.selectedItems());
    },
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      this.$refs.udb.remove(id);
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
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: _ctx.$t("common.placeholder.query"),
    c: $data.query,
    d: common_vendor.o(($event) => $data.query = $event.detail.value),
    e: common_vendor.t(_ctx.$t("common.button.search")),
    f: common_vendor.o((...args) => $options.search && $options.search(...args)),
    g: common_vendor.w(({
      data,
      pagination,
      loading,
      error
    }, s0, i0) => {
      return {
        a: "0dcfabd8-4-" + i0 + "," + ("0dcfabd8-3-" + i0),
        b: "0dcfabd8-5-" + i0 + "," + ("0dcfabd8-3-" + i0),
        c: "0dcfabd8-6-" + i0 + "," + ("0dcfabd8-3-" + i0),
        d: "0dcfabd8-7-" + i0 + "," + ("0dcfabd8-3-" + i0),
        e: "0dcfabd8-8-" + i0 + "," + ("0dcfabd8-3-" + i0),
        f: "0dcfabd8-3-" + i0 + "," + ("0dcfabd8-2-" + i0),
        g: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t((pagination.current - 1) * pagination.size + (index + 1)),
            b: "0dcfabd8-10-" + i0 + "-" + i1 + "," + ("0dcfabd8-9-" + i0 + "-" + i1),
            c: common_vendor.t(item.user_id[0] && item.user_id[0].username || "-"),
            d: "0dcfabd8-11-" + i0 + "-" + i1 + "," + ("0dcfabd8-9-" + i0 + "-" + i1),
            e: common_vendor.t(item.type),
            f: "0dcfabd8-12-" + i0 + "-" + i1 + "," + ("0dcfabd8-9-" + i0 + "-" + i1),
            g: common_vendor.t(item.ip),
            h: "0dcfabd8-13-" + i0 + "-" + i1 + "," + ("0dcfabd8-9-" + i0 + "-" + i1),
            i: "0dcfabd8-15-" + i0 + "-" + i1 + "," + ("0dcfabd8-14-" + i0 + "-" + i1),
            j: common_vendor.p({
              date: item.create_date,
              threshold: [0, 0]
            }),
            k: "0dcfabd8-14-" + i0 + "-" + i1 + "," + ("0dcfabd8-9-" + i0 + "-" + i1),
            l: index,
            m: "0dcfabd8-9-" + i0 + "-" + i1 + "," + ("0dcfabd8-2-" + i0)
          };
        }),
        h: "0dcfabd8-2-" + i0 + ",0dcfabd8-1",
        i: common_vendor.p({
          loading,
          emptyText: error.message || "\u6CA1\u6709\u66F4\u591A\u6570\u636E",
          border: true,
          stripe: true
        }),
        j: "0dcfabd8-16-" + i0 + ",0dcfabd8-1",
        k: common_vendor.o(($event) => pagination.current = $event),
        l: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        m: i0,
        n: s0
      };
    }, {
      name: "d",
      path: "g",
      vueId: "0dcfabd8-1"
    }),
    h: common_vendor.p({
      align: "center"
    }),
    i: common_vendor.p({
      align: "center"
    }),
    j: common_vendor.p({
      align: "center"
    }),
    k: common_vendor.p({
      align: "center"
    }),
    l: common_vendor.p({
      align: "center"
    }),
    m: common_vendor.p({
      align: "center"
    }),
    n: common_vendor.p({
      align: "center"
    }),
    o: common_vendor.p({
      align: "center"
    }),
    p: common_vendor.p({
      align: "center"
    }),
    q: common_vendor.p({
      align: "center"
    }),
    r: common_vendor.o($options.onPageChanged),
    s: common_vendor.sr("udb", "0dcfabd8-1"),
    t: common_vendor.p({
      collection: $data.collectionName,
      orderby: "create_date desc",
      field: "type, ip, create_date, user_id{username}[0].username as username",
      options: $data.options,
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/safety/list.vue"]]);
wx.createPage(MiniProgramPage);
