"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  onLoad({ url, title }) {
    if (url.substring(0, 4) != "http") {
      common_vendor.index.showModal({
        title: "\u9519\u8BEF",
        content: '\u4E0D\u662F\u4E00\u4E2A\u6709\u6548\u7684\u7F51\u7AD9\u94FE\u63A5,"' + url + '"',
        showCancel: false,
        confirmText: "\u77E5\u9053\u4E86",
        complete: () => {
          common_vendor.index.navigateBack();
        }
      });
      title = "\u9875\u9762\u8DEF\u5F84\u9519\u8BEF";
    } else {
      console.log(url, title);
      this.url = url;
    }
    if (title) {
      common_vendor.index.setNavigationBarTitle({ title });
    }
  },
  data() {
    return {
      url: null
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.url
  }, $data.url ? {
    b: $data.url
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/common/webview/webview.vue"]]);
wx.createPage(MiniProgramPage);
