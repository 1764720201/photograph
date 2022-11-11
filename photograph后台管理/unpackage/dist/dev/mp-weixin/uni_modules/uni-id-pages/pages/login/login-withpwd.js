"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../common/login-page.mixin.js");
require("../../common/store.js");
require("../../config.js");
const uniIdCo = common_vendor.ws.importObject("uni-id-co", {
  errorOptions: {
    type: "toast"
  }
});
const _sfc_main = {
  mixins: [uni_modules_uniIdPages_common_loginPage_mixin.mixin],
  data() {
    return {
      "password": "",
      "username": "",
      "captcha": "",
      "needCaptcha": false,
      "focusUsername": false,
      "focusPassword": false,
      "logo": "/static/logo.png"
    };
  },
  onShow() {
  },
  methods: {
    toRetrievePwd() {
      let url = "/uni_modules/uni-id-pages/pages/retrieve/retrieve";
      if (/^1\d{10}$/.test(this.username)) {
        url += `?phoneNumber=${this.username}`;
      }
      common_vendor.index.navigateTo({
        url
      });
    },
    pwdLogin() {
      if (!this.password.length) {
        this.focusPassword = true;
        return common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u5BC6\u7801",
          icon: "none"
        });
      }
      if (!this.username.length) {
        this.focusUsername = true;
        return common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7/\u7528\u6237\u540D/\u90AE\u7BB1",
          icon: "none"
        });
      }
      if (this.needCaptcha && this.captcha.length != 4) {
        this.$refs.captcha.getImageCaptcha();
        return common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
          icon: "none"
        });
      }
      if (this.needAgreements && !this.agree) {
        return this.$refs.agreements.popup(this.pwdLogin);
      }
      let data = {
        "password": this.password,
        "captcha": this.captcha
      };
      if (/^1\d{10}$/.test(this.username)) {
        data.mobile = this.username;
      } else if (/@/.test(this.username)) {
        data.email = this.username;
      } else {
        data.username = this.username;
      }
      uniIdCo.login(data).then((e) => {
        this.loginSuccess(e);
      }).catch((e) => {
        if (e.errCode == "uni-id-captcha-required") {
          this.needCaptcha = true;
        } else if (this.needCaptcha) {
          this.$refs.captcha.getImageCaptcha();
        }
      });
    },
    toRegister() {
      common_vendor.index.navigateTo({
        url: this.config.isAdmin ? "/uni_modules/uni-id-pages/pages/register/register-admin" : "/uni_modules/uni-id-pages/pages/register/register",
        fail(e) {
          console.error(e);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  const _easycom_uni_id_pages_agreements2 = common_vendor.resolveComponent("uni-id-pages-agreements");
  const _easycom_uni_id_pages_fab_login2 = common_vendor.resolveComponent("uni-id-pages-fab-login");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_captcha2 + _easycom_uni_id_pages_agreements2 + _easycom_uni_id_pages_fab_login2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_captcha = () => "../../../uni-captcha/components/uni-captcha/uni-captcha.js";
const _easycom_uni_id_pages_agreements = () => "../../components/uni-id-pages-agreements/uni-id-pages-agreements.js";
const _easycom_uni_id_pages_fab_login = () => "../../components/uni-id-pages-fab-login/uni-id-pages-fab-login.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_captcha + _easycom_uni_id_pages_agreements + _easycom_uni_id_pages_fab_login)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.logo,
    b: common_vendor.o(($event) => $data.focusUsername = false),
    c: common_vendor.o(($event) => $data.username = $event),
    d: common_vendor.p({
      focus: $data.focusUsername,
      inputBorder: false,
      placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7/\u7528\u6237\u540D/\u90AE\u7BB1",
      modelValue: $data.username
    }),
    e: common_vendor.p({
      name: "username"
    }),
    f: common_vendor.o(($event) => $data.focusPassword = false),
    g: common_vendor.o(($event) => $data.password = $event),
    h: common_vendor.p({
      focus: $data.focusPassword,
      clearable: true,
      type: "password",
      inputBorder: false,
      placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
      modelValue: $data.password
    }),
    i: common_vendor.p({
      name: "password"
    }),
    j: $data.needCaptcha
  }, $data.needCaptcha ? {
    k: common_vendor.sr("captcha", "58ed63b0-5"),
    l: common_vendor.o(($event) => $data.captcha = $event),
    m: common_vendor.p({
      focus: true,
      scene: "login-by-pwd",
      modelValue: $data.captcha
    })
  } : {}, {
    n: common_vendor.sr("agreements", "58ed63b0-6"),
    o: common_vendor.p({
      scope: "login"
    }),
    p: common_vendor.o((...args) => $options.pwdLogin && $options.pwdLogin(...args)),
    q: !_ctx.config.isAdmin
  }, !_ctx.config.isAdmin ? {
    r: common_vendor.o((...args) => $options.toRetrievePwd && $options.toRetrievePwd(...args))
  } : {}, {
    s: common_vendor.t(_ctx.config.isAdmin ? "\u6CE8\u518C\u7BA1\u7406\u5458\u8D26\u53F7" : "\u6CE8\u518C\u8D26\u53F7"),
    t: common_vendor.o((...args) => $options.toRegister && $options.toRegister(...args)),
    v: common_vendor.sr("uniFabLogin", "58ed63b0-7")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-58ed63b0"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/login/login-withpwd.vue"]]);
wx.createPage(MiniProgramPage);
