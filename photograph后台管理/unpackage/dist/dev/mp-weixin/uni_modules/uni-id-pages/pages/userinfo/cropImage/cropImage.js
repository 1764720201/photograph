"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const limeClipper = () => "./limeClipper/limeClipper.js";
const _sfc_main = {
  components: { limeClipper },
  data() {
    return { path: "", options: { "width": 600, "height": 600 } };
  },
  onLoad({ path, options }) {
    this.path = path;
    console.log("path-path-path-path", path);
    if (options) {
      this.options = JSON.parse(options);
    }
  },
  methods: {
    successFn(e) {
      this.getOpenerEventChannel().emit("success", e.url);
      common_vendor.index.navigateBack();
    },
    cancel() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _component_limeClipper = common_vendor.resolveComponent("limeClipper");
  _component_limeClipper();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.successFn),
    b: common_vendor.o($options.cancel),
    c: common_vendor.p({
      width: $data.options.width,
      ["scale-ratio"]: 2,
      ["is-lock-width"]: false,
      ["is-lock-height"]: false,
      height: $data.options.height,
      ["image-url"]: $data.path
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/userinfo/cropImage/cropImage.vue"]]);
wx.createPage(MiniProgramPage);
