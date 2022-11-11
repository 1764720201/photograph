"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../common/login-page.mixin.js");
require("../../common/store.js");
require("../../config.js");
const _sfc_main = {
  mixins: [uni_modules_uniIdPages_common_loginPage_mixin.mixin],
  data() {
    return {
      "code": "",
      "phone": "",
      "captcha": "",
      "logo": "/static/logo.png"
    };
  },
  computed: {
    tipText() {
      return "\u9A8C\u8BC1\u7801\u5DF2\u901A\u8FC7\u77ED\u4FE1\u53D1\u9001\u81F3" + this.phone;
    }
  },
  onLoad({
    phoneNumber
  }) {
    this.phone = phoneNumber;
  },
  onShow() {
    console.log("onShow");
  },
  methods: {
    submit() {
      const uniIdCo = common_vendor.ws.importObject("uni-id-co", {
        errorOptions: {
          type: "toast"
        }
      });
      if (this.code.length != 6) {
        this.$refs.smsCode.focusSmsCodeInput = true;
        return common_vendor.index.showToast({
          title: "\u9A8C\u8BC1\u7801\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "none"
        });
      }
      uniIdCo.loginBySms({
        "mobile": this.phone,
        "code": this.code,
        "captcha": this.captcha
      }).then((e) => {
        console.log(e);
        this.loginSuccess(e);
      }).catch((e) => {
        if (e.errCode == "uni-id-captcha-required") {
          this.$refs.popup.open();
        } else {
          console.log(e.errMsg);
          console.log(e.errCode);
        }
      }).finally((e) => {
        this.captcha = "";
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_id_pages_sms_form2 = common_vendor.resolveComponent("uni-id-pages-sms-form");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_popup_captcha2 = common_vendor.resolveComponent("uni-popup-captcha");
  (_easycom_uni_id_pages_sms_form2 + _easycom_uni_forms2 + _easycom_uni_popup_captcha2)();
}
const _easycom_uni_id_pages_sms_form = () => "../../components/uni-id-pages-sms-form/uni-id-pages-sms-form.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup_captcha = () => "../../../uni-captcha/components/uni-popup-captcha/uni-popup-captcha.js";
if (!Math) {
  (_easycom_uni_id_pages_sms_form + _easycom_uni_forms + _easycom_uni_popup_captcha)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.logo,
    b: common_vendor.sr("smsCode", "661d78f6-1,661d78f6-0"),
    c: common_vendor.o(($event) => $data.code = $event),
    d: common_vendor.p({
      focusCaptchaInput: true,
      type: "login-by-sms",
      phone: $data.phone,
      modelValue: $data.code
    }),
    e: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    f: common_vendor.sr("popup", "661d78f6-2"),
    g: common_vendor.o($options.submit),
    h: common_vendor.o(($event) => $data.captcha = $event),
    i: common_vendor.p({
      scene: "login-by-sms",
      modelValue: $data.captcha
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-661d78f6"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/login/login-smscode.vue"]]);
wx.createPage(MiniProgramPage);
