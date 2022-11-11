"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  onLoad() {
  },
  methods: {
    cancel() {
      common_vendor.index.navigateBack();
    },
    nextStep() {
      common_vendor.index.showModal({
        content: "\u5DF2\u7ECF\u4ED4\u7EC6\u9605\u8BFB\u6CE8\u9500\u63D0\u793A\uFF0C\u77E5\u6653\u53EF\u80FD\u5E26\u6765\u7684\u540E\u679C\uFF0C\u5E76\u786E\u8BA4\u8981\u6CE8\u9500",
        complete: (e) => {
          if (e.confirm) {
            common_vendor.ws.database();
            const uniIdco = common_vendor.ws.importObject("uni-id-co");
            uniIdco.closeAccount().then((e2) => {
              console.log(e2);
              common_vendor.index.showToast({
                title: "\u6CE8\u9500\u6210\u529F"
              });
              common_vendor.index.removeStorageSync("uni_id_token");
              common_vendor.index.setStorageSync("uni_id_token_expired", 0);
              common_vendor.index.navigateTo({
                url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
              });
            });
          } else {
            common_vendor.index.navigateBack();
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.nextStep && $options.nextStep(...args)),
    b: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate.vue"]]);
wx.createPage(MiniProgramPage);
