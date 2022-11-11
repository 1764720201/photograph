"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      focus: false
    };
  },
  props: {
    modelValue: String,
    value: String,
    scene: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "";
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
  methods: {
    open() {
      this.focus = true;
      this.val = "";
      this.$refs.popup.open();
    },
    close() {
      this.focus = false;
      this.$refs.popup.close();
    },
    confirm() {
      if (!this.val || this.val.length < 4) {
        return common_vendor.index.showToast({
          title: "\u8BF7\u586B\u5199\u9A8C\u8BC1\u7801",
          icon: "none"
        });
      }
      this.close();
      this.$emit("confirm");
    }
  }
};
if (!Array) {
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_captcha2 + _easycom_uni_popup2)();
}
const _easycom_uni_captcha = () => "../uni-captcha/uni-captcha.js";
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_captcha + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.title),
    b: common_vendor.o(($event) => $options.val = $event),
    c: common_vendor.p({
      focus: $data.focus,
      scene: $props.scene,
      modelValue: $options.val
    }),
    d: common_vendor.o((...args) => $options.close && $options.close(...args)),
    e: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    f: common_vendor.sr("popup", "d021b99b-0"),
    g: common_vendor.p({
      type: "center"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d021b99b"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-captcha/components/uni-popup-captcha/uni-popup-captcha.vue"]]);
wx.createComponent(Component);
