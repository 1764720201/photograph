"use strict";
const common_vendor = require("../common/vendor.js");
const admin_config = require("../admin.config.js");
const errorLog = () => "./components/error-log.js";
const _sfc_main = {
  components: {
    errorLog
  },
  props: {
    navigationBarTitleText: {
      type: String
    },
    matchLeftWindow: {
      type: Boolean
    },
    showLeftWindow: {
      type: Boolean
    }
  },
  data() {
    return {
      ...admin_config.config.navBar,
      popupMenuOpened: false,
      mpCapsule: 0
    };
  },
  computed: {
    ...common_vendor.mapState("app", ["appName"]),
    ...common_vendor.mapState("app", ["routes"]),
    ...common_vendor.mapState("error", ["logs"]),
    userInfo() {
      return this.$uniIdPagesStore.store.userInfo;
    }
  },
  mounted() {
    let menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
    this.mpCapsule = menuButtonInfo.width;
  },
  methods: {
    showErrorLogs() {
      if (this.popupMenuOpened) {
        this.popupMenuOpened = false;
      }
      this.$refs.errorLogsPopup.open();
    },
    showPasswordPopup() {
      if (this.popupMenuOpened) {
        this.popupMenuOpened = false;
      }
      this.$refs.passwordPopup.open();
    },
    logout() {
      this.popupMenuOpened = false;
      this.$uniIdPagesStore.mutations.logout();
    },
    toggleSidebar() {
      if (!this.showLeftWindow) {
        common_vendor.index.showLeftWindow();
      } else {
        common_vendor.index.hideLeftWindow();
      }
    },
    togglePopupMenu() {
      this.popupMenuOpened = !this.popupMenuOpened;
    },
    changePassword() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
        complete: () => {
          this.popupMenuOpened = false;
        }
      });
    },
    changeLanguage(e) {
      const index = typeof e === "object" ? e.detail.value : e;
      const lang = this.langs[index].lang || "zh-Hans";
      const platform = common_vendor.index.getSystemInfoSync().platform;
      if (platform === "android") {
        common_vendor.index.showToast({
          icon: "error",
          title: "\u6682\u4E0D\u652F\u6301",
          duration: 2e3
        });
        return;
      }
      this.$i18n.locale = lang;
      common_vendor.index.setLocale(lang);
    },
    linkTo() {
      common_vendor.index.reLaunch({
        url: "/"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_error_log = common_vendor.resolveComponent("error-log");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _component_error_log + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.logo,
    b: common_vendor.t(_ctx.appName),
    c: common_vendor.o((...args) => $options.linkTo && $options.linkTo(...args)),
    d: common_vendor.o($options.toggleSidebar),
    e: common_vendor.p({
      type: "bars",
      size: "30",
      color: "#999"
    }),
    f: common_vendor.t($props.navigationBarTitleText),
    g: _ctx.langs,
    h: common_vendor.o((...args) => $options.changeLanguage && $options.changeLanguage(...args)),
    i: common_vendor.t($options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email),
    j: common_vendor.p({
      type: "arrowdown",
      color: "#666",
      size: "13"
    }),
    k: $options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email,
    l: common_vendor.o((...args) => $options.togglePopupMenu && $options.togglePopupMenu(...args)),
    m: common_vendor.o((...args) => $options.togglePopupMenu && $options.togglePopupMenu(...args)),
    n: $options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email
  }, $options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email ? {
    o: common_vendor.t(_ctx.$t("topwindow.text.changePwd")),
    p: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    q: common_vendor.t(_ctx.$t("topwindow.text.signOut")),
    r: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {}, {
    s: !$props.matchLeftWindow ? 1 : "",
    t: $data.popupMenuOpened ? 1 : "",
    v: common_vendor.sr("errorLogsPopup", "b483090a-2"),
    w: common_vendor.p({
      type: "center"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/windows/topWindow.vue"]]);
wx.createComponent(Component);
