"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const common_vendor = require("./common/vendor.js");
const admin_config = require("./admin.config.js");
const store_index = require("./store/index.js");
const js_sdk_uniAdmin_plugin = require("./js_sdk/uni-admin/plugin.js");
const i18n_index = require("./i18n/index.js");
require("./store/modules/app.js");
require("./store/modules/error.js");
require("./store/modules/user.js");
require("./uni_modules/uni-id-pages/common/store.js");
require("./js_sdk/uni-admin/util.js");
require("./uni_modules/uni-dateformat/components/uni-dateformat/date-format.js");
require("./js_sdk/uni-admin/error.js");
require("./js_sdk/uni-admin/request.js");
require("./js_sdk/uni-admin/fetchMock.js");
require("./js_sdk/uni-admin/permission.js");
require("./js_sdk/uni-admin/interceptor.js");
require("./js_sdk/uni-id-pages/store.js");
if (!Math) {
  "./pages/index/index.js";
  "./uni_modules/uni-id-pages/pages/login/login-withpwd.js";
  "./pages/error/404.js";
  "./uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd.js";
  "./uni_modules/uni-upgrade-center/pages/version/list.js";
  "./uni_modules/uni-upgrade-center/pages/version/add.js";
  "./uni_modules/uni-upgrade-center/pages/version/detail.js";
  "./uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate.js";
  "./uni_modules/uni-id-pages/pages/userinfo/userinfo.js";
  "./uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile.js";
  "./uni_modules/uni-id-pages/pages/userinfo/cropImage/cropImage.js";
  "./uni_modules/uni-id-pages/pages/login/login-smscode.js";
  "./uni_modules/uni-id-pages/pages/login/login-withoutpwd.js";
  "./uni_modules/uni-id-pages/pages/register/register.js";
  "./uni_modules/uni-id-pages/pages/register/register-admin.js";
  "./uni_modules/uni-id-pages/pages/register/register-by-email.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve-by-email.js";
  "./uni_modules/uni-id-pages/pages/common/webview/webview.js";
  "./pages/system/menu/list.js";
  "./pages/system/menu/add.js";
  "./pages/system/menu/edit.js";
  "./pages/system/permission/list.js";
  "./pages/system/permission/add.js";
  "./pages/system/permission/edit.js";
  "./pages/system/role/add.js";
  "./pages/system/role/edit.js";
  "./pages/system/role/list.js";
  "./pages/system/user/add.js";
  "./pages/system/user/edit.js";
  "./pages/system/user/list.js";
  "./pages/system/app/add.js";
  "./pages/system/app/list.js";
  "./pages/system/app/uni-portal/uni-portal.js";
  "./pages/system/tag/add.js";
  "./pages/system/tag/edit.js";
  "./pages/system/tag/list.js";
  "./pages/system/safety/list.js";
  "./pages/demo/icons/icons.js";
  "./pages/demo/table/table.js";
  "./pages/demo/order/index.js";
  "./pages/uni-stat/page-res/page-res.js";
  "./pages/uni-stat/page-ent/page-ent.js";
  "./pages/uni-stat/scene/scene.js";
  "./pages/uni-stat/channel/channel.js";
  "./pages/uni-stat/error/js/detail.js";
  "./pages/uni-stat/error/app/app.js";
  "./pages/uni-stat/event/event.js";
  "./pages/uni-stat/device/overview/overview.js";
  "./pages/uni-stat/device/activity/activity.js";
  "./pages/uni-stat/device/trend/trend.js";
  "./pages/uni-stat/device/retention/retention.js";
  "./pages/uni-stat/device/comparison/comparison.js";
  "./pages/uni-stat/device/stickiness/stickiness.js";
  "./pages/uni-stat/user/overview/overview.js";
  "./pages/uni-stat/user/activity/activity.js";
  "./pages/uni-stat/user/trend/trend.js";
  "./pages/uni-stat/user/retention/retention.js";
  "./pages/uni-stat/user/comparison/comparison.js";
  "./pages/uni-stat/user/stickiness/stickiness.js";
}
const _sfc_main = {
  created() {
    this.clear = void 0;
  },
  methods: {
    ...common_vendor.mapActions({
      init: "app/init"
    }),
    clearPlatform() {
      const keysOfPlatform = common_vendor.index.getStorageInfoSync().keys.filter((key) => key.indexOf("platform") > -1);
      keysOfPlatform.length && keysOfPlatform.forEach((key) => common_vendor.index.removeStorageSync(key));
    }
  },
  onPageNotFound(msg) {
    common_vendor.index.redirectTo({
      url: admin_config.config.error.url
    });
  },
  onLaunch: function() {
    console.log("App Launch");
    if (this.$uniIdPagesStore.store.hasLogin) {
      this.init();
    }
    common_vendor.index.$on("uni-id-pages-login-success", () => {
      this.init();
    });
  },
  onShow: function() {
    console.log("App Show");
    this.clear = setInterval(() => this.clearPlatform(), 15 * 60 * 1e3);
  },
  onHide: function() {
    console.log("App Hide");
    this.clear && clearInterval(this.clear);
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/App.vue"]]);
const lang = common_vendor.index.getLocale();
function createApp() {
  const app = common_vendor.createSSRApp(App);
  const i18n = common_vendor.createI18n({
    locale: lang,
    messages: i18n_index.messages
  });
  app.use(i18n);
  app.use(js_sdk_uniAdmin_plugin.plugin);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
