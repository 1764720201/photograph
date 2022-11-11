"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "qiun-error",
  props: {
    errorMessage: {
      type: String,
      default: null
    }
  },
  data() {
    return {};
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.errorMessage == null ? "\u8BF7\u70B9\u51FB\u91CD\u8BD5" : $props.errorMessage)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/qiun-data-charts/components/qiun-error/qiun-error.vue"]]);
wx.createComponent(Component);
