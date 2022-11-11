"use strict";
const common_vendor = require("../../../../common/vendor.js");
function debounce(func, wait) {
  let timer;
  wait = wait || 500;
  return function() {
    let context = this;
    let args = arguments;
    if (timer)
      clearTimeout(timer);
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    if (callNow)
      func.apply(context, args);
  };
}
const _sfc_main = {
  name: "uni-sms-form",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    event: ["update:modelValue"],
    count: {
      type: [String, Number],
      default: 60
    },
    phone: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default() {
        return "login";
      }
    },
    focusCaptchaInput: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      captcha: "",
      reverseNumber: 0,
      reverseTimer: null,
      modelValue: "",
      focusSmsCodeInput: false
    };
  },
  watch: {
    captcha(value, oldValue) {
      if (value.length == 4 && oldValue.length != 4) {
        this.start();
      }
    },
    modelValue(value) {
      this.$emit("input", value);
      this.$emit("update:modelValue", value);
    }
  },
  computed: {
    innerText() {
      if (this.reverseNumber == 0)
        return "\u83B7\u53D6\u77ED\u4FE1\u9A8C\u8BC1\u7801";
      return "\u91CD\u65B0\u53D1\u9001(" + this.reverseNumber + "s)";
    }
  },
  created() {
    this.initClick();
  },
  methods: {
    getImageCaptcha(focus) {
      this.$refs.captcha.getImageCaptcha(focus);
    },
    initClick() {
      this.start = debounce(() => {
        if (this.reverseNumber != 0)
          return;
        this.sendMsg();
      });
    },
    sendMsg() {
      if (this.captcha.length != 4) {
        this.$refs.captcha.focusCaptchaInput = true;
        return common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u56FE\u5F62\u9A8C\u8BC1\u7801",
          icon: "none"
        });
      }
      let reg_phone = /^1\d{10}$/;
      if (!reg_phone.test(this.phone))
        return common_vendor.index.showToast({
          title: "\u624B\u673A\u53F7\u683C\u5F0F\u9519\u8BEF",
          icon: "none"
        });
      const uniIdCo = common_vendor.ws.importObject("uni-id-co", {
        customUI: true
      });
      console.log("sendSmsCode", {
        "mobile": this.phone,
        "scene": this.type,
        "captcha": this.captcha
      });
      uniIdCo.sendSmsCode({
        "mobile": this.phone,
        "scene": this.type,
        "captcha": this.captcha
      }).then((result) => {
        console.log(result.code);
        common_vendor.index.showToast({
          title: "\u77ED\u4FE1\u9A8C\u8BC1\u7801\u53D1\u9001\u6210\u529F",
          icon: "none"
        });
        this.reverseNumber = Number(this.count);
        this.getCode();
      }).catch((e) => {
        console.log(JSON.stringify(e));
        if (e.code == "uni-id-invalid-sms-template-id") {
          this.modelValue = "123456";
          common_vendor.index.showToast({
            title: "\u5DF2\u542F\u52A8\u6D4B\u8BD5\u6A21\u5F0F,\u8BE6\u60C5\u3010\u63A7\u5236\u53F0\u4FE1\u606F\u3011",
            icon: "none",
            duration: 3e3
          });
          console.warn(e.message);
        } else {
          this.getImageCaptcha();
          this.captcha = "";
          common_vendor.index.showToast({
            title: e.message,
            icon: "none"
          });
        }
      });
    },
    getCode() {
      if (this.reverseNumber == 0) {
        clearTimeout(this.reverseTimer);
        this.reverseTimer = null;
        return;
      }
      this.reverseNumber--;
      this.reverseTimer = setTimeout(() => {
        this.getCode();
      }, 1e3);
    }
  }
};
if (!Array) {
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_uni_captcha2 + _easycom_uni_easyinput2)();
}
const _easycom_uni_captcha = () => "../../../uni-captcha/components/uni-captcha/uni-captcha.js";
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_captcha + _easycom_uni_easyinput)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("captcha", "4b649130-0"),
    b: common_vendor.o(($event) => $data.captcha = $event),
    c: common_vendor.p({
      focus: $props.focusCaptchaInput,
      scene: "send-sms-code",
      modelValue: $data.captcha
    }),
    d: common_vendor.o(($event) => $data.focusSmsCodeInput = false),
    e: common_vendor.o(($event) => $data.modelValue = $event),
    f: common_vendor.p({
      focus: $data.focusSmsCodeInput,
      type: "number",
      inputBorder: false,
      maxlength: "6",
      placeholder: "\u8BF7\u8F93\u5165\u77ED\u4FE1\u9A8C\u8BC1\u7801",
      modelValue: $data.modelValue
    }),
    g: common_vendor.t($options.innerText),
    h: common_vendor.n($data.reverseNumber == 0 ? "inner-text-active" : ""),
    i: common_vendor.o((...args) => _ctx.start && _ctx.start(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4b649130"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/components/uni-id-pages-sms-form/uni-id-pages-sms-form.vue"]]);
wx.createComponent(Component);
