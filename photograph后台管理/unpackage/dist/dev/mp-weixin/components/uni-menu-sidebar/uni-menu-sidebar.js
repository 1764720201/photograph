"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "uniMenuSidebar",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
if (!Array) {
  const _easycom_uni_menu_item2 = common_vendor.resolveComponent("uni-menu-item");
  const _easycom_uni_menu_sidebar2 = common_vendor.resolveComponent("uni-menu-sidebar");
  const _easycom_uni_sub_menu2 = common_vendor.resolveComponent("uni-sub-menu");
  (_easycom_uni_menu_item2 + _easycom_uni_menu_sidebar2 + _easycom_uni_sub_menu2)();
}
const _easycom_uni_menu_item = () => "../uni-menu-item/uni-menu-item.js";
const _easycom_uni_menu_sidebar = () => Promise.resolve().then(() => QzovVXNlcnMveXpjL0RvY3VtZW50cy9IQnVpbGRlclByb2plY3RzL3VuaS1hZG1pbiDln7rnoYDmoYbmnrYvY29tcG9uZW50cy91bmktbWVudS1zaWRlYmFyL3VuaS1tZW51LXNpZGViYXIudnVl);
const _easycom_uni_sub_menu = () => "../uni-sub-menu/uni-sub-menu.js";
if (!Math) {
  (_easycom_uni_menu_item + _easycom_uni_menu_sidebar + _easycom_uni_sub_menu)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.data, (item, index, i0) => {
      return common_vendor.e({
        a: !item.children || !item.children.length
      }, !item.children || !item.children.length ? {
        b: common_vendor.n(item.icon),
        c: common_vendor.t(item.text),
        d: item.icon ? 1 : "",
        e: "49d8c438-0-" + i0,
        f: common_vendor.p({
          index: item
        })
      } : {
        g: common_vendor.n(item.icon),
        h: common_vendor.t(item.text),
        i: item.icon ? 1 : "",
        j: item._id,
        k: "49d8c438-2-" + i0 + "," + ("49d8c438-1-" + i0),
        l: common_vendor.p({
          data: item.children
        }),
        m: "49d8c438-1-" + i0,
        n: common_vendor.p({
          index: item
        })
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/components/uni-menu-sidebar/uni-menu-sidebar.vue"]]);
wx.createComponent(Component);
const QzovVXNlcnMveXpjL0RvY3VtZW50cy9IQnVpbGRlclByb2plY3RzL3VuaS1hZG1pbiDln7rnoYDmoYbmnrYvY29tcG9uZW50cy91bmktbWVudS1zaWRlYmFyL3VuaS1tZW51LXNpZGViYXIudnVl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
