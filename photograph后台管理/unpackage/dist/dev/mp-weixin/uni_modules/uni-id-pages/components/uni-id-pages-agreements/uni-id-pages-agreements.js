"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_config = require("../../config.js");
let retryFun = () => console.log("\u4E3A\u5B9A\u4E49");
const _sfc_main = {
  name: "uni-agreements",
  computed: {
    agreements() {
      if (!uni_modules_uniIdPages_config.config.agreements) {
        return [];
      }
      let { serviceUrl, privacyUrl } = uni_modules_uniIdPages_config.config.agreements;
      return [
        {
          url: serviceUrl,
          title: "\u7528\u6237\u670D\u52A1\u534F\u8BAE"
        },
        {
          url: privacyUrl,
          title: "\u9690\u79C1\u653F\u7B56\u6761\u6B3E"
        }
      ];
    }
  },
  props: {
    scope: {
      type: String,
      default() {
        return "register";
      }
    }
  },
  methods: {
    popupConfirm() {
      this.isAgree = true;
      retryFun();
    },
    popup(Fun) {
      this.needPopupAgreements = true;
      this.$nextTick(() => {
        if (Fun) {
          retryFun = Fun;
        }
        this.$refs.popupAgreement.open();
      });
    },
    navigateTo({
      url,
      title
    }) {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/common/webview/webview?url=" + url + "&title=" + title,
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    hasAnd(agreements, index) {
      return agreements.length - 1 > index;
    },
    setAgree(e) {
      this.isAgree = !this.isAgree;
      this.$emit("setAgree", this.isAgree);
    }
  },
  created() {
    var _a, _b;
    this.needAgreements = (((_b = (_a = uni_modules_uniIdPages_config.config) == null ? void 0 : _a.agreements) == null ? void 0 : _b.scope) || []).includes(this.scope);
  },
  data() {
    return {
      isAgree: false,
      needAgreements: true,
      needPopupAgreements: false
    };
  }
};
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../../uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.agreements.length
  }, $options.agreements.length ? common_vendor.e({
    b: $data.needAgreements
  }, $data.needAgreements ? {
    c: $data.isAgree,
    d: common_vendor.o((...args) => $options.setAgree && $options.setAgree(...args)),
    e: common_vendor.f($options.agreements, (agreement, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(agreement.title),
        b: common_vendor.o(($event) => $options.navigateTo(agreement)),
        c: $options.hasAnd($options.agreements, index)
      }, $options.hasAnd($options.agreements, index) ? {} : {}, {
        d: index
      });
    })
  } : {}, {
    f: $data.needAgreements || $data.needPopupAgreements
  }, $data.needAgreements || $data.needPopupAgreements ? {
    g: common_vendor.f($options.agreements, (agreement, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(agreement.title),
        b: common_vendor.o(($event) => $options.navigateTo(agreement)),
        c: $options.hasAnd($options.agreements, index)
      }, $options.hasAnd($options.agreements, index) ? {} : {}, {
        d: index
      });
    }),
    h: common_vendor.o($options.popupConfirm),
    i: common_vendor.p({
      confirmText: "\u540C\u610F"
    }),
    j: common_vendor.sr("popupAgreement", "40b82fe9-0"),
    k: common_vendor.p({
      type: "center"
    })
  } : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-40b82fe9"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/components/uni-id-pages-agreements/uni-id-pages-agreements.vue"]]);
wx.createComponent(Component);
