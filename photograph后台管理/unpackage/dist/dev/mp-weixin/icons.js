"use strict";
const common_vendor = require("./common/vendor.js");
const pages_demo_icons_uniIcons = require("./pages/demo/icons/uni-icons.js");
const _sfc_main = {
  data() {
    return {
      icons: pages_demo_icons_uniIcons.icons
    };
  },
  props: {
    tag: {
      type: Boolean,
      default: true
    },
    fixWindow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    setClipboardData(type, icon) {
      let data = "uni-icons-" + icon;
      if (this.tag && type === "tag") {
        data = '<view class="' + data + '"></view>';
      }
      common_vendor.index.setClipboardData({
        data,
        success(res) {
          common_vendor.index.showToast({
            icon: "none",
            title: "\u590D\u5236 " + data + " \u6210\u529F\uFF01"
          });
        },
        fail(res) {
          common_vendor.index.showModal({
            content: "\u590D\u5236 " + data + " \u5931\u8D25\uFF01",
            showCancel: false
          });
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  _easycom_fix_window2();
}
const _easycom_fix_window = () => "./components/fix-window/fix-window.js";
if (!Math) {
  _easycom_fix_window();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.$t("demo.icons.title")),
    b: common_vendor.t(_ctx.$t("demo.icons.describle")),
    c: common_vendor.f($data.icons, (icon, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.setClipboardData("tag", icon)),
        b: common_vendor.n("uni-icons-" + icon),
        c: common_vendor.t(icon),
        d: common_vendor.o(($event) => $options.setClipboardData("class", icon)),
        e: index
      };
    }),
    d: $props.fixWindow
  }, $props.fixWindow ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/demo/icons/icons.vue"]]);
exports.Component = Component;
