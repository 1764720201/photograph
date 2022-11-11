"use strict";
const common_vendor = require("../common/vendor.js");
const admin_config = require("../admin.config.js");
const _sfc_main = {
  data() {
    return {
      ...admin_config.config.sideBar,
      field: "url as value, name as text, menu_id, parent_id, sort, icon, permission",
      currentMenu: "/"
    };
  },
  computed: {
    ...common_vendor.mapState("app", ["inited", "navMenu", "active"]),
    userInfo() {
      return this.$uniIdPagesStore.store.userInfo;
    }
  },
  methods: {
    ...common_vendor.mapActions({
      setRoutes: "app/setRoutes"
    }),
    select(e, routes) {
      let url = e.value;
      if (!url) {
        url = this.active;
      }
      this.clickMenuItem(url);
      this.setRoutes(routes);
    },
    clickMenuItem(url) {
      if (url[0] !== "/" && url.indexOf("http") !== 0) {
        url = "/" + url;
      }
      common_vendor.index.redirectTo({
        url,
        fail: () => {
          common_vendor.index.showModal({
            title: "\u63D0\u793A",
            content: "\u9875\u9762 " + url + " \u8DF3\u8F6C\u5931\u8D25",
            showCancel: false
          });
        }
      });
    },
    splitFullPath(path) {
      if (!path) {
        path = "/";
      }
      return path.split("?")[0];
    }
  }
};
if (!Array) {
  const _easycom_uni_data_menu2 = common_vendor.resolveComponent("uni-data-menu");
  _easycom_uni_data_menu2();
}
const _easycom_uni_data_menu = () => "../components/uni-data-menu/uni-data-menu.js";
if (!Math) {
  _easycom_uni_data_menu();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("menu", "20bf001e-0"),
    b: common_vendor.o($options.select),
    c: common_vendor.p({
      value: $data.currentMenu,
      staticMenu: _ctx.staticMenu,
      collection: "opendb-admin-menus",
      ["page-size"]: 500,
      field: $data.field,
      orderby: "sort asc",
      ["active-text-color"]: "#409eff"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/windows/leftWindow.vue"]]);
wx.createComponent(Component);
