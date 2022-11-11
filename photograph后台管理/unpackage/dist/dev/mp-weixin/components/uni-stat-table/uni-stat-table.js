"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "uni-stat-table",
  data() {
    return {};
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    filedsMap: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.filedsMap, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "6b187af8-2-" + i0 + ",6b187af8-1",
        e: common_vendor.p({
          align: "center"
        })
      } : {});
    }),
    b: common_vendor.f($props.data, (item, i, i0) => {
      return {
        a: common_vendor.f($props.filedsMap, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.title
          }, mapper.title ? {
            b: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            c: index,
            d: "6b187af8-4-" + i0 + "-" + i1 + "," + ("6b187af8-3-" + i0),
            e: common_vendor.p({
              align: "center"
            })
          } : {});
        }),
        b: i,
        c: "6b187af8-3-" + i0 + ",6b187af8-0"
      };
    }),
    c: common_vendor.p({
      loading: $props.loading,
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u6570\u636E"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/components/uni-stat-table/uni-stat-table.vue"]]);
wx.createComponent(Component);
