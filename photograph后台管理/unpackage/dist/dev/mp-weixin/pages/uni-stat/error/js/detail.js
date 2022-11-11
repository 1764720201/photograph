"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_error_js_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      popupFieldsMap: pages_uniStat_error_js_fieldsMap.popupFieldsMap,
      options: {
        pageSize: 20,
        pageCurrent: 1,
        total: 0
      },
      query: {
        error_hash: "",
        create_time: []
      },
      loading: false,
      tableData: []
    };
  },
  onLoad(option) {
    let {
      error_hash,
      create_time
    } = option;
    if (error_hash) {
      create_time = Number(create_time);
      this.query.error_hash = error_hash;
      this.query.create_time = [create_time, create_time + 24 * 60 * 60 * 1e3];
      this.getTableData(js_sdk_uniStat_util.stringifyQuery(this.query));
    }
  },
  methods: {
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getTableData(js_sdk_uniStat_util.stringifyQuery(this.query));
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTableData(js_sdk_uniStat_util.stringifyQuery(this.query));
    },
    getTableData(query) {
      const {
        pageCurrent
      } = this.options;
      this.loading = true;
      const db = common_vendor.ws.database();
      db.collection("uni-stat-error-logs").where(query).orderBy("create_time", "desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        this.options.total = count;
        for (const item of data) {
          item.create_time = js_sdk_uniStat_util.parseDateTime(item.create_time, "dateTime");
        }
        this.tableData = data;
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_table2 = common_vendor.resolveComponent("uni-stat-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_table = () => "../../../../components/uni-stat-table/uni-stat-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_table + _easycom_uni_pagination + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      data: $data.tableData,
      filedsMap: $data.popupFieldsMap,
      loading: $data.loading
    }),
    b: common_vendor.o($options.changePageCurrent),
    c: common_vendor.o($options.changePageSize),
    d: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/uni-stat/error/js/detail.vue"]]);
wx.createPage(MiniProgramPage);
