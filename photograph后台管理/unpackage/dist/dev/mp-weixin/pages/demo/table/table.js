"use strict";
const pages_demo_table_tableData = require("./tableData.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchVal: "",
      tableData: [],
      pageSize: 10,
      pageCurrent: 1,
      total: 0,
      loading: false
    };
  },
  onLoad() {
    this.selectedIndexs = [];
    this.getData(1);
  },
  methods: {
    selectedItems() {
      return this.selectedIndexs.map((i) => this.tableData[i]);
    },
    selectionChange(e) {
      console.log(e.detail.index);
      this.selectedIndexs = e.detail.index;
    },
    delTable() {
      console.log(this.selectedItems());
    },
    change(e) {
      this.getData(e.current);
    },
    search() {
      this.getData(1, this.searchVal);
    },
    getData(pageCurrent, value = "") {
      this.loading = true;
      this.pageCurrent = pageCurrent;
      this.request({
        pageSize: this.pageSize,
        pageCurrent,
        value,
        success: (res) => {
          this.tableData = res.data;
          this.total = res.total;
          this.loading = false;
        }
      });
    },
    request(options) {
      const {
        pageSize,
        pageCurrent,
        success,
        value
      } = options;
      let total = pages_demo_table_tableData.tableData.length;
      let data = pages_demo_table_tableData.tableData.filter((item, index) => {
        const idx = index - (pageCurrent - 1) * pageSize;
        return idx < pageSize && idx >= 0;
      });
      if (value) {
        data = [];
        pages_demo_table_tableData.tableData.forEach((item) => {
          if (item.name.indexOf(value) !== -1) {
            data.push(item);
          }
        });
        total = data.length;
      }
      setTimeout(() => {
        typeof success === "function" && success({
          data,
          total
        });
      }, 500);
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.$t("demo.table.title")),
    b: common_vendor.o((...args) => $options.search && $options.search(...args)),
    c: _ctx.$t("common.placeholder.query"),
    d: $data.searchVal,
    e: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    f: common_vendor.t(_ctx.$t("common.button.search")),
    g: common_vendor.o((...args) => $options.search && $options.search(...args)),
    h: common_vendor.t(_ctx.$t("common.button.add")),
    i: common_vendor.t(_ctx.$t("common.button.batchDelete")),
    j: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    k: common_vendor.p({
      width: "150",
      align: "center"
    }),
    l: common_vendor.p({
      width: "150",
      align: "center"
    }),
    m: common_vendor.p({
      align: "center"
    }),
    n: common_vendor.p({
      width: "204",
      align: "center"
    }),
    o: common_vendor.f($data.tableData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.date),
        b: "8ca844cc-7-" + i0 + "," + ("8ca844cc-6-" + i0),
        c: common_vendor.t(item.name),
        d: "8ca844cc-8-" + i0 + "," + ("8ca844cc-6-" + i0),
        e: common_vendor.t(item.address),
        f: "8ca844cc-9-" + i0 + "," + ("8ca844cc-6-" + i0),
        g: "8ca844cc-10-" + i0 + "," + ("8ca844cc-6-" + i0),
        h: index,
        i: "8ca844cc-6-" + i0 + ",8ca844cc-0"
      };
    }),
    p: common_vendor.t(_ctx.$t("common.button.edit")),
    q: common_vendor.t(_ctx.$t("common.button.delete")),
    r: common_vendor.o($options.selectionChange),
    s: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      type: "selection",
      emptyText: _ctx.$t("common.empty")
    }),
    t: common_vendor.o($options.change),
    v: common_vendor.p({
      ["show-icon"]: true,
      ["page-size"]: $data.pageSize,
      current: $data.pageCurrent,
      total: $data.total
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/demo/table/table.vue"]]);
wx.createPage(MiniProgramPage);
