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
      lock: false,
      focusPhone: true,
      focusPassword: false,
      focusPassword2: false,
      formData: {
        "phone": "",
        "code": "",
        "password": "",
        "password2": "",
        "captcha": ""
      },
      rules: {
        phone: {
          rules: [
            {
              required: true,
              errorMessage: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7"
            },
            {
              pattern: /^1\d{10}$/,
              errorMessage: "\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E"
            }
          ]
        },
        code: {
          rules: [
            {
              required: true,
              errorMessage: "\u8BF7\u8F93\u5165\u77ED\u4FE1\u9A8C\u8BC1\u7801"
            },
            {
              pattern: /^.{6}$/,
              errorMessage: "\u8BF7\u8F93\u51656\u4F4D\u9A8C\u8BC1\u7801"
            }
          ]
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801"
            },
            {
              pattern: /^.{6,20}$/,
              errorMessage: "\u5BC6\u7801\u4E3A6 - 20\u4F4D"
            }
          ]
        },
        password2: {
          rules: [
            {
              required: true,
              errorMessage: "\u8BF7\u786E\u8BA4\u5BC6\u7801"
            },
            {
              pattern: /^.{6,20}$/,
              errorMessage: "\u5BC6\u7801\u4E3A6 - 20\u4F4D"
            },
            {
              validateFunction: function(rule, value, data, callback) {
                if (value != data.password) {
                  callback("\u4E24\u6B21\u8F93\u5165\u5BC6\u7801\u4E0D\u4E00\u81F4");
                }
                return true;
              }
            }
          ]
        }
      },
      logo: "/static/logo.png"
    };
  },
  computed: {
    isPhone() {
      let reg_phone = /^1\d{10}$/;
      let isPhone = reg_phone.test(this.formData.phone);
      return isPhone;
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
    if (event && event.phoneNumber) {
      this.formData.phone = event.phoneNumber;
      if (event.lock) {
        this.lock = event.lock;
        this.focusPhone = true;
      }
    }
  },
  onReady() {
    if (this.formData.phone) {
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
          "phone": mobile,
          "password": password,
          captcha,
          code
        } = this.formData;
        uniIdCo.resetPwdBySms({
          mobile,
          code,
          password,
          captcha
        }).then((e) => {
          console.log(e);
          common_vendor.index.navigateBack();
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
    retrieveByEmail() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/retrieve/retrieve-by-email"
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
  const _easycom_uni_id_pages_sms_form2 = common_vendor.resolveComponent("uni-id-pages-sms-form");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_popup_captcha2 = common_vendor.resolveComponent("uni-popup-captcha");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_id_pages_sms_form2 + _easycom_uni_forms2 + _easycom_uni_popup_captcha2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_id_pages_sms_form = () => "../../components/uni-id-pages-sms-form/uni-id-pages-sms-form.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup_captcha = () => "../../../uni-captcha/components/uni-popup-captcha/uni-popup-captcha.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_id_pages_sms_form + _easycom_uni_forms + _easycom_uni_popup_captcha)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.logo,
    b: common_vendor.o(($event) => $data.focusPhone = false),
    c: common_vendor.o(($event) => $data.formData.phone = $event),
    d: common_vendor.p({
      focus: $data.focusPhone,
      disabled: $data.lock,
      type: "number",
      inputBorder: false,
      maxlength: "11",
      placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
      modelValue: $data.formData.phone
    }),
    e: common_vendor.p({
      name: "phone"
    }),
    f: common_vendor.sr("shortCode", "7d890c2e-4,7d890c2e-3"),
    g: common_vendor.o(($event) => $data.formData.code = $event),
    h: common_vendor.p({
      phone: $data.formData.phone,
      type: "reset-pwd-by-sms",
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
    s: common_vendor.o((...args) => $options.retrieveByEmail && $options.retrieveByEmail(...args)),
    t: common_vendor.o((...args) => $options.backLogin && $options.backLogin(...args)),
    v: common_vendor.sr("form", "7d890c2e-0"),
    w: common_vendor.p({
      value: $data.formData,
      ["err-show-type"]: "toast"
    }),
    x: common_vendor.sr("popup", "7d890c2e-9"),
    y: common_vendor.o($options.submit),
    z: common_vendor.o(($event) => $data.formData.captcha = $event),
    A: common_vendor.p({
      scene: "reset-pwd-by-sms",
      modelValue: $data.formData.captcha
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/retrieve/retrieve.vue"]]);
wx.createPage(MiniProgramPage);
