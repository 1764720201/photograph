"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_config = require("../../config.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../common/login-page.mixin.js");
require("../../common/store.js");
const _sfc_main = {
  mixins: [uni_modules_uniIdPages_common_loginPage_mixin.mixin],
  data() {
    return {
      type: "",
      phone: "",
      focusPhone: false,
      logo: "/static/logo.png"
    };
  },
  computed: {
    async loginTypes() {
      return uni_modules_uniIdPages_config.config.loginTypes;
    },
    isPhone() {
      return /^1\d{10}$/.test(this.phone);
    },
    imgSrc() {
      return "/uni_modules/uni-id-pages/static/login/" + this.type + ".png";
    }
  },
  async onLoad(e) {
    console.log(e);
    let type = e.type || uni_modules_uniIdPages_config.config.loginTypes[0];
    this.type = type;
    if (type != "univerify") {
      this.focusPhone = true;
    }
    this.$nextTick(() => {
      if (["weixin", "apple"].includes(type)) {
        this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter((item) => item.id != type);
      }
    });
    common_vendor.index.$on("uni-id-pages-set-login-type", (type2) => {
      this.type = type2;
    });
  },
  onShow() {
  },
  onUnload() {
    common_vendor.index.$off("uni-id-pages-set-login-type");
  },
  onReady() {
  },
  methods: {
    quickLogin() {
      this.$refs.uniFabLogin.login_before(this.type);
    },
    toSmsPage() {
      console.log("toSmsPage", this.agree);
      if (!this.isPhone) {
        this.focusPhone = true;
        return common_vendor.index.showToast({
          title: "\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E",
          icon: "none"
        });
      }
      if (this.needAgreements && !this.agree) {
        return this.$refs.agreements.popup(this.toSmsPage);
      }
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-smscode?phoneNumber=" + this.phone
      });
    },
    toPwdLogin() {
      common_vendor.index.navigateTo({
        url: "../login/password"
      });
    },
    chooseArea() {
      common_vendor.index.showToast({
        title: "\u6682\u4E0D\u652F\u6301\u5176\u4ED6\u56FD\u5BB6",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_id_pages_agreements2 = common_vendor.resolveComponent("uni-id-pages-agreements");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_id_pages_fab_login2 = common_vendor.resolveComponent("uni-id-pages-fab-login");
  (_easycom_uni_id_pages_agreements2 + _easycom_uni_easyinput2 + _easycom_uni_id_pages_fab_login2)();
}
const _easycom_uni_id_pages_agreements = () => "../../components/uni-id-pages-agreements/uni-id-pages-agreements.js";
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_id_pages_fab_login = () => "../../components/uni-id-pages-fab-login/uni-id-pages-fab-login.js";
if (!Math) {
  (_easycom_uni_id_pages_agreements + _easycom_uni_easyinput + _easycom_uni_id_pages_fab_login)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.logo,
    b: ["apple", "weixin"].includes($data.type)
  }, ["apple", "weixin"].includes($data.type) ? {
    c: common_vendor.o((...args) => $options.quickLogin && $options.quickLogin(...args)),
    d: $options.imgSrc,
    e: common_vendor.sr("agreements", "f1f87fcd-0"),
    f: common_vendor.p({
      scope: "register"
    })
  } : {
    g: common_vendor.o((...args) => $options.chooseArea && $options.chooseArea(...args)),
    h: common_vendor.o(($event) => $data.focusPhone = false),
    i: common_vendor.o(($event) => $data.phone = $event),
    j: common_vendor.p({
      focus: $data.focusPhone,
      type: "number",
      inputBorder: false,
      maxlength: "11",
      placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
      modelValue: $data.phone
    }),
    k: common_vendor.sr("agreements", "f1f87fcd-2"),
    l: common_vendor.p({
      scope: "register"
    }),
    m: common_vendor.o((...args) => $options.toSmsPage && $options.toSmsPage(...args))
  }, {
    n: common_vendor.sr("uniFabLogin", "f1f87fcd-3")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f1f87fcd"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/login/login-withoutpwd.vue"]]);
wx.createPage(MiniProgramPage);
