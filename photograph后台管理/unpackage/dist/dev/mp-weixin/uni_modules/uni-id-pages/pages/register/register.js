"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_pages_register_validator = require("./validator.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../common/login-page.mixin.js");
const uni_modules_uniIdPages_common_store = require("../../common/store.js");
require("../../common/password.js");
require("../../config.js");
const {
  loginSuccess
} = uni_modules_uniIdPages_common_store.mutations;
const uniIdCo = common_vendor.ws.importObject("uni-id-co");
const _sfc_main = {
  mixins: [uni_modules_uniIdPages_common_loginPage_mixin.mixin],
  data() {
    return {
      formData: {
        username: "",
        nickname: "",
        password: "",
        password2: "",
        captcha: ""
      },
      rules: uni_modules_uniIdPages_pages_register_validator.rules,
      focusUsername: false,
      focusNickname: false,
      focusPassword: false,
      focusPassword2: false,
      logo: "/static/logo.png"
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  onShow() {
  },
  methods: {
    submit() {
      this.$refs.form.validate().then((res) => {
        if (this.formData.captcha.length != 4) {
          this.$refs.captcha.focusCaptchaInput = true;
          return common_vendor.index.showToast({
            title: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
            icon: "none"
          });
        }
        if (this.needAgreements && !this.agree) {
          return this.$refs.agreements.popup(() => {
            this.submitForm(res);
          });
        }
        this.submitForm(res);
      }).catch((errors) => {
        let key = errors[0].key;
        key = key.replace(key[0], key[0].toUpperCase());
        console.log(key);
        this["focus" + key] = true;
      });
    },
    submitForm(params) {
      uniIdCo.registerUser(this.formData).then((e) => {
        console.log(e);
        loginSuccess();
      }).catch((e) => {
        console.log(e);
        console.log(e.message);
        this.$refs.captcha.getImageCaptcha();
      });
    },
    navigateBack() {
      common_vendor.index.navigateBack();
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-withpwd"
      });
    },
    registerByEmail() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/register/register-by-email"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  const _easycom_uni_id_pages_agreements2 = common_vendor.resolveComponent("uni-id-pages-agreements");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_captcha2 + _easycom_uni_id_pages_agreements2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_captcha = () => "../../../uni-captcha/components/uni-captcha/uni-captcha.js";
const _easycom_uni_id_pages_agreements = () => "../../components/uni-id-pages-agreements/uni-id-pages-agreements.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_captcha + _easycom_uni_id_pages_agreements + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.logo,
    b: common_vendor.o(($event) => $data.focusUsername = false),
    c: common_vendor.o(($event) => $data.formData.username = $event),
    d: common_vendor.p({
      inputBorder: false,
      focus: $data.focusUsername,
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
      trim: "both",
      modelValue: $data.formData.username
    }),
    e: common_vendor.p({
      name: "username",
      required: true
    }),
    f: common_vendor.o(($event) => $data.focusNickname = false),
    g: common_vendor.o(($event) => $data.formData.nickname = $event),
    h: common_vendor.p({
      inputBorder: false,
      focus: $data.focusNickname,
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u6635\u79F0",
      trim: "both",
      modelValue: $data.formData.nickname
    }),
    i: common_vendor.p({
      name: "nickname"
    }),
    j: common_vendor.o(($event) => $data.focusPassword = false),
    k: common_vendor.o(($event) => $data.formData.password = $event),
    l: common_vendor.p({
      inputBorder: false,
      focus: $data.focusPassword,
      maxlength: "20",
      placeholder: "\u8BF7\u8F93\u5165" + (_ctx.config.passwordStrength == "weak" ? "6" : "8") + "-16\u4F4D\u5BC6\u7801",
      type: "password",
      trim: "both",
      modelValue: $data.formData.password
    }),
    m: common_vendor.o(($event) => $data.formData.password = $event),
    n: common_vendor.p({
      name: "password",
      required: true,
      modelValue: $data.formData.password
    }),
    o: common_vendor.o(($event) => $data.focusPassword2 = false),
    p: common_vendor.o(($event) => $data.formData.password2 = $event),
    q: common_vendor.p({
      inputBorder: false,
      focus: $data.focusPassword2,
      placeholder: "\u518D\u6B21\u8F93\u5165\u5BC6\u7801",
      maxlength: "20",
      type: "password",
      trim: "both",
      modelValue: $data.formData.password2
    }),
    r: common_vendor.o(($event) => $data.formData.password2 = $event),
    s: common_vendor.p({
      name: "password2",
      required: true,
      modelValue: $data.formData.password2
    }),
    t: common_vendor.sr("captcha", "99a2646e-10,99a2646e-9"),
    v: common_vendor.o(($event) => $data.formData.captcha = $event),
    w: common_vendor.p({
      scene: "register",
      modelValue: $data.formData.captcha
    }),
    x: common_vendor.sr("agreements", "99a2646e-11,99a2646e-0"),
    y: common_vendor.p({
      scope: "register"
    }),
    z: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    A: common_vendor.o((...args) => $options.navigateBack && $options.navigateBack(...args)),
    B: common_vendor.o((...args) => $options.registerByEmail && $options.registerByEmail(...args)),
    C: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args)),
    D: common_vendor.sr("form", "99a2646e-0"),
    E: common_vendor.p({
      value: $data.formData,
      rules: $data.rules,
      ["validate-trigger"]: "submit",
      ["err-show-type"]: "toast"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/register/register.vue"]]);
wx.createPage(MiniProgramPage);
