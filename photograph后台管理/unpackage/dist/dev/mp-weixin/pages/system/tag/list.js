"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdTag = require("../../../js_sdk/validator/uni-id-tag.js");
const db = common_vendor.ws.database();
const dbOrderBy = "";
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
        ...js_sdk_validator_uniIdTag.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "uni-id-tag.xls",
        "type": "xls",
        "fields": {
          "\u6807\u7B7E\u7684tagid": "tagid",
          "\u6807\u7B7E\u540D\u79F0": "name",
          "\u6807\u7B7E\u63CF\u8FF0": "description"
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
  computed: {
    smsReceiver() {
      if (this.selectedIndexs.length) {
        var dataList = this.$refs.udb.dataList;
        return this.selectedIndexs.map((i) => dataList[i].tagid);
      }
    }
  },
  methods: {
    onqueryload(data) {
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
      let newWhere = js_sdk_validator_uniIdTag.filterToWhere(this._filter, db.command);
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
  const _easycom_download_excel2 = common_vendor.resolveComponent("download-excel");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  const _easycom_batch_sms2 = common_vendor.resolveComponent("batch-sms");
  (_easycom_uni_stat_breadcrumb2 + _easycom_download_excel2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_tag2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_fix_window2 + _easycom_batch_sms2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_download_excel = () => "../../../components/download-excel/download-excel.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_tag = () => "../../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
const _easycom_batch_sms = () => "../../../components/batch-sms/batch-sms.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_download_excel + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_tag + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window + _easycom_batch_sms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: $data.query,
    c: common_vendor.o(($event) => $data.query = $event.detail.value),
    d: common_vendor.o((...args) => $options.search && $options.search(...args)),
    e: common_vendor.o(($event) => $options.navigateTo("./add")),
    f: !$data.selectedIndexs.length,
    g: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    h: common_vendor.p({
      fields: $data.exportExcel.fields,
      data: $data.exportExcelData,
      type: $data.exportExcel.type,
      name: $data.exportExcel.filename
    }),
    i: common_vendor.o(($event) => _ctx.$refs.batchSms.open()),
    j: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "6e102b6a-5-" + i0 + "," + ("6e102b6a-4-" + i0),
        b: "6e102b6a-6-" + i0 + "," + ("6e102b6a-4-" + i0),
        c: "6e102b6a-7-" + i0 + "," + ("6e102b6a-4-" + i0),
        d: "6e102b6a-8-" + i0 + "," + ("6e102b6a-4-" + i0),
        e: "6e102b6a-9-" + i0 + "," + ("6e102b6a-4-" + i0),
        f: "6e102b6a-4-" + i0 + "," + ("6e102b6a-3-" + i0),
        g: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.tagid),
            b: "6e102b6a-11-" + i0 + "-" + i1 + "," + ("6e102b6a-10-" + i0 + "-" + i1),
            c: "6e102b6a-13-" + i0 + "-" + i1 + "," + ("6e102b6a-12-" + i0 + "-" + i1),
            d: common_vendor.p({
              type: "primary",
              inverted: true,
              size: "small",
              text: item.name
            }),
            e: "6e102b6a-12-" + i0 + "-" + i1 + "," + ("6e102b6a-10-" + i0 + "-" + i1),
            f: common_vendor.t(item.description),
            g: "6e102b6a-14-" + i0 + "-" + i1 + "," + ("6e102b6a-10-" + i0 + "-" + i1),
            h: "6e102b6a-16-" + i0 + "-" + i1 + "," + ("6e102b6a-15-" + i0 + "-" + i1),
            i: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            j: "6e102b6a-15-" + i0 + "-" + i1 + "," + ("6e102b6a-10-" + i0 + "-" + i1),
            k: common_vendor.o(($event) => $options.navigateTo("../user/list?tagid=" + item.tagid, false)),
            l: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false)),
            m: common_vendor.o(($event) => $options.confirmDelete(item._id)),
            n: "6e102b6a-17-" + i0 + "-" + i1 + "," + ("6e102b6a-10-" + i0 + "-" + i1),
            o: index,
            p: "6e102b6a-10-" + i0 + "-" + i1 + "," + ("6e102b6a-3-" + i0)
          };
        }),
        h: common_vendor.sr("table", "6e102b6a-3-" + i0 + ",6e102b6a-2"),
        i: "6e102b6a-3-" + i0 + ",6e102b6a-2",
        j: common_vendor.p({
          loading,
          emptyText: error.message || "\u6CA1\u6709\u66F4\u591A\u6570\u636E",
          border: true,
          stripe: true,
          type: "selection"
        }),
        k: "6e102b6a-18-" + i0 + ",6e102b6a-2",
        l: common_vendor.o(($event) => pagination.current = $event),
        m: common_vendor.p({
          ["show-iconn"]: true,
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
      path: "j",
      vueId: "6e102b6a-2"
    }),
    k: common_vendor.o(($event) => $options.filterChange($event, "tagid")),
    l: common_vendor.o(($event) => $options.sortChange($event, "tagid")),
    m: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    n: common_vendor.o(($event) => $options.filterChange($event, "name")),
    o: common_vendor.o(($event) => $options.sortChange($event, "name")),
    p: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    q: common_vendor.o(($event) => $options.filterChange($event, "description")),
    r: common_vendor.o(($event) => $options.sortChange($event, "description")),
    s: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    t: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    v: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    w: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    x: common_vendor.p({
      align: "center"
    }),
    y: common_vendor.p({
      align: "center"
    }),
    z: common_vendor.p({
      align: "center"
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
    D: common_vendor.o($options.selectionChange),
    E: common_vendor.o($options.onPageChanged),
    F: common_vendor.o($options.changeSize),
    G: common_vendor.sr("udb", "6e102b6a-2"),
    H: common_vendor.o($options.onqueryload),
    I: common_vendor.p({
      collection: "uni-id-tag",
      field: "tagid,name,description,create_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    }),
    J: common_vendor.sr("batchSms", "6e102b6a-20"),
    K: common_vendor.p({
      toType: "userTags",
      receiver: $options.smsReceiver
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/tag/list.vue"]]);
wx.createPage(MiniProgramPage);
