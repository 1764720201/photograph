"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  onLoad(query) {
    this.errMsg = query.errMsg || "";
  },
  methods: {}
};
if (!Array) {
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  _easycom_fix_window2();
}
const _easycom_fix_window = () => "../../components/fix-window/fix-window.js";
if (!Math) {
  _easycom_fix_window();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.errMsg)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/error/404.vue"]]);
wx.createPage(MiniProgramPage);
