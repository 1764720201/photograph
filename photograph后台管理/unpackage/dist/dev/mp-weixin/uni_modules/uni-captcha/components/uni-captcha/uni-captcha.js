"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  props: {
    modelValue: String,
    value: String,
    scene: {
      type: String,
      default() {
        return "";
      }
    },
    focus: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    val: {
      get() {
        return this.value || this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    }
  },
  data() {
    return {
      focusCaptchaInput: false,
      captchaBase64: "",
      loging: false
    };
  },
  watch: {
    scene: {
      handler(scene) {
        if (scene) {
          this.getImageCaptcha(this.focus);
        } else {
          common_vendor.index.showToast({
            title: "scene\u4E0D\u80FD\u4E3A\u7A7A",
            icon: "none"
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    getImageCaptcha(focus = true) {
      this.loging = true;
      if (focus) {
        this.val = "";
        this.focusCaptchaInput = true;
      }
      const uniIdCo = common_vendor.ws.importObject("uni-captcha-co", {
        customUI: true
      });
      uniIdCo.getImageCaptcha({
        scene: this.scene
      }).then((result) => {
        this.captchaBase64 = result.captchaBase64;
      }).catch((e) => {
        common_vendor.index.showToast({
          title: e.message,
          icon: "none"
        });
      }).finally((e) => {
        this.loging = false;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loging
  }, $data.loging ? {
    b: common_vendor.p({
      size: "20px",
      color: "#BBB",
      type: "spinner-cycle"
    })
  } : {}, {
    c: $data.loging ? 1 : "",
    d: common_vendor.o((...args) => $options.getImageCaptcha && $options.getImageCaptcha(...args)),
    e: $data.captchaBase64,
    f: common_vendor.o(($event) => $data.focusCaptchaInput = false),
    g: $data.focusCaptchaInput,
    h: $options.val,
    i: common_vendor.o(($event) => $options.val = $event.detail.value)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a00179ae"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-captcha/components/uni-captcha/uni-captcha.vue"]]);
wx.createComponent(Component);
