"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../common/login-page.mixin.js");
const uni_modules_uniIdPages_common_password = require("../../common/password.js");
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
      lock: false,
      focusEmail: true,
      focusPassword: false,
      focusPassword2: false,
      formData: {
        "email": "",
        "code": "",
        "password": "",
        "password2": "",
        "captcha": ""
      },
      rules: {
        email: {
          rules: [
            {
              required: true,
              errorMessage: "\u8BF7\u8F93\u5165\u90AE\u7BB1"
            },
            {
              format: "email",
              errorMessage: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E"
            }
          ]
        },
        code: {
          rules: [
            {
              required: true,
              errorMessage: "\u8BF7\u8F93\u5165\u90AE\u7BB1\u9A8C\u8BC1\u7801"
            },
            {
              pattern: /^.{6}$/,
              errorMessage: "\u8BF7\u8F93\u51656\u4F4D\u9A8C\u8BC1\u7801"
            }
          ]
        },
        ...uni_modules_uniIdPages_common_password.passwordMod.getPwdRules()
      },
      logo: "/static/logo.png"
    };
  },
  computed: {
    isEmail() {
      let reg_email = /@/;
      let isEmail = reg_email.test(this.formData.email);
      return isEmail;
    },
    isPwd() {
      let reg_pwd = /^.{6,20}$/;
      let isPwd = reg_pwd.test(this.formData.password);
      return isPwd;
    },
    isCode() {
      let reg_code = /^\d{6}$/;
      let isCode = reg_code.test(this.formData.code);
      return isCode;
    }
  },
  onLoad(event) {
    if (event && event.emailNumber) {
      this.formData.email = event.emailNumber;
      if (event.lock) {
        this.lock = event.lock;
        this.focusEmail = true;
      }
    }
  },
  onReady() {
    if (this.formData.email) {
      this.$refs.shortCode.start();
    }
    this.$refs.form.setRules(this.rules);
  },
  onShow() {
  },
  methods: {
    submit() {
      console.log("formData", this.formData);
      console.log("rules", this.rules);
      this.$refs.form.validate().then((res) => {
        let {
          email,
          password,
          captcha,
          code
        } = this.formData;
        uniIdCo.resetPwdByEmail({
          email,
          code,
          password,
          captcha
        }).then((e) => {
          console.log(e);
          common_vendor.index.navigateTo({
            url: "/uni_modules/uni-id-pages/pages/login/login-withpwd",
            complete: (e2) => {
              console.log(e2);
            }
          });
        }).catch((e) => {
          if (e.errCode == "uni-id-captcha-required") {
            this.$refs.popup.open();
          }
        }).finally((e) => {
          this.formData.captcha = "";
        });
      }).catch((errors) => {
        let key = errors[0].key;
        if (key == "code") {
          console.log(this.$refs.shortCode);
          return this.$refs.shortCode.focusSmsCodeInput = true;
        }
        key = key.replace(key[0], key[0].toUpperCase());
        console.log(key, "focus" + key);
        this["focus" + key] = true;
      });
    },
    retrieveByPhone() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/retrieve/retrieve"
      });
    },
    backLogin() {
      common_vendor.index.redirectTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-withpwd"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_id_pages_email_form2 = common_vendor.resolveComponent("uni-id-pages-email-form");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_popup_captcha2 = common_vendor.resolveComponent("uni-popup-captcha");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_id_pages_email_form2 + _easycom_uni_forms2 + _easycom_uni_popup_captcha2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_id_pages_email_form = () => "../../components/uni-id-pages-email-form/uni-id-pages-email-form.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup_captcha = () => "../../../uni-captcha/components/uni-popup-captcha/uni-popup-captcha.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_id_pages_email_form + _easycom_uni_forms + _easycom_uni_popup_captcha)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.logo,
    b: common_vendor.o(($event) => $data.focusEmail = false),
    c: common_vendor.o(($event) => $data.formData.email = $event),
    d: common_vendor.p({
      focus: $data.focusEmail,
      disabled: $data.lock,
      inputBorder: false,
      placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1",
      modelValue: $data.formData.email
    }),
    e: common_vendor.p({
      name: "email"
    }),
    f: common_vendor.sr("shortCode", "57e486ba-4,57e486ba-3"),
    g: common_vendor.o(($event) => $data.formData.code = $event),
    h: common_vendor.p({
      email: $data.formData.email,
      type: "reset-pwd-by-email",
      modelValue: $data.formData.code
    }),
    i: common_vendor.p({
      name: "code"
    }),
    j: common_vendor.o(($event) => $data.focusPassword = false),
    k: common_vendor.o(($event) => $data.formData.password = $event),
    l: common_vendor.p({
      focus: $data.focusPassword,
      type: "password",
      inputBorder: false,
      placeholder: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801",
      modelValue: $data.formData.password
    }),
    m: common_vendor.p({
      name: "password"
    }),
    n: common_vendor.o(($event) => $data.focusPassword2 = false),
    o: common_vendor.o(($event) => $data.formData.password2 = $event),
    p: common_vendor.p({
      focus: $data.focusPassword2,
      type: "password",
      inputBorder: false,
      placeholder: "\u8BF7\u518D\u6B21\u8F93\u5165\u65B0\u5BC6\u7801",
      modelValue: $data.formData.password2
    }),
    q: common_vendor.p({
      name: "password2"
    }),
    r: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    s: common_vendor.o((...args) => $options.retrieveByPhone && $options.retrieveByPhone(...args)),
    t: common_vendor.o((...args) => $options.backLogin && $options.backLogin(...args)),
    v: common_vendor.sr("form", "57e486ba-0"),
    w: common_vendor.p({
      value: $data.formData,
      ["err-show-type"]: "toast"
    }),
    x: common_vendor.sr("popup", "57e486ba-9"),
    y: common_vendor.o($options.submit),
    z: common_vendor.o(($event) => $data.formData.captcha = $event),
    A: common_vendor.p({
      scene: "reset-pwd-by-sms",
      modelValue: $data.formData.captcha
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/retrieve/retrieve-by-email.vue"]]);
wx.createPage(MiniProgramPage);
