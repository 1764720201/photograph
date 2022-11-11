"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../../common/login-page.mixin.js");
const uni_modules_uniIdPages_common_password = require("../../../common/password.js");
require("../../../common/store.js");
require("../../../config.js");
const uniIdCo = common_vendor.ws.importObject("uni-id-co", {
  customUI: true
});
const _sfc_main = {
  mixins: [uni_modules_uniIdPages_common_loginPage_mixin.mixin],
  data() {
    return {
      focusOldPassword: false,
      focusNewPassword: false,
      focusNewPassword2: false,
      formData: {
        "oldPassword": "",
        "newPassword": "",
        "newPassword2": ""
      },
      rules: {
        oldPassword: {
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
        ...uni_modules_uniIdPages_common_password.passwordMod.getPwdRules("newPassword", "newPassword2")
      },
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
      console.log("formData", this.formData);
      console.log("rules", this.rules);
      this.$refs.form.validate().then((res) => {
        let {
          oldPassword,
          newPassword
        } = this.formData;
        uniIdCo.updatePwd({
          oldPassword,
          newPassword
        }).then((e) => {
          console.log(e);
          common_vendor.index.removeStorageSync("uni_id_token");
          common_vendor.index.setStorageSync("uni_id_token_expired", 0);
          common_vendor.index.redirectTo({
            url: "/uni_modules/uni-id-pages/pages/login/login-withpwd"
          });
        }).catch((e) => {
          common_vendor.index.showModal({
            content: e.message,
            showCancel: false
          });
        });
      }).catch((errors) => {
        let key = errors[0].key;
        key = key.replace(key[0], key[0].toUpperCase());
        console.log(key, "focus" + key);
        this["focus" + key] = true;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../../uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.logo,
    b: common_vendor.o(($event) => $data.focusOldPassword = false),
    c: common_vendor.o(($event) => $data.formData.oldPassword = $event),
    d: common_vendor.p({
      focus: $data.focusOldPassword,
      type: "password",
      inputBorder: false,
      placeholder: "\u8BF7\u8F93\u5165\u65E7\u5BC6\u7801",
      modelValue: $data.formData.oldPassword
    }),
    e: common_vendor.p({
      name: "oldPassword"
    }),
    f: common_vendor.o(($event) => $data.focusNewPassword = false),
    g: common_vendor.o(($event) => $data.formData.newPassword = $event),
    h: common_vendor.p({
      focus: $data.focusNewPassword,
      type: "password",
      inputBorder: false,
      placeholder: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801",
      modelValue: $data.formData.newPassword
    }),
    i: common_vendor.p({
      name: "newPassword"
    }),
    j: common_vendor.o(($event) => $data.focusNewPassword2 = false),
    k: common_vendor.o(($event) => $data.formData.newPassword2 = $event),
    l: common_vendor.p({
      focus: $data.focusNewPassword2,
      type: "password",
      inputBorder: false,
      placeholder: "\u8BF7\u518D\u6B21\u8F93\u5165\u65B0\u5BC6\u7801",
      modelValue: $data.formData.newPassword2
    }),
    m: common_vendor.p({
      name: "newPassword2"
    }),
    n: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    o: common_vendor.sr("form", "5aff414f-0"),
    p: common_vendor.p({
      value: $data.formData,
      ["err-show-type"]: "toast"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd.vue"]]);
wx.createPage(MiniProgramPage);
