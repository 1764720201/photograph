"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdTag = require("../../../js_sdk/validator/uni-id-tag.js");
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = "uni-id-tag";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdTag.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdTag.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "tagid": "",
      "name": "",
      "description": ""
    };
    return {
      formData,
      formOptions: {},
      rules: {
        ...getValidator(Object.keys(formData))
      }
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate().then((res) => {
        return this.submitForm(res);
      }).catch(() => {
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    submitForm(value) {
      return db.collection(dbCollectionName).add(value).then((res) => {
        common_vendor.index.showToast({
          title: "\u65B0\u589E\u6210\u529F"
        });
        this.getOpenerEventChannel().emit("refreshData");
        this.getOpenerEventChannel().emit("refreshCheckboxData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
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
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.tagid = $event),
    b: common_vendor.p({
      placeholder: "\u6807\u7B7E\u7684tagid",
      modelValue: $data.formData.tagid
    }),
    c: common_vendor.p({
      name: "tagid",
      label: "\u6807\u7B7Etagid",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.name = $event),
    e: common_vendor.p({
      placeholder: "\u6807\u7B7E\u540D\u79F0",
      modelValue: $data.formData.name
    }),
    f: common_vendor.p({
      name: "name",
      label: "\u6807\u7B7E\u540D\u79F0",
      required: true
    }),
    g: common_vendor.o([($event) => $data.formData.description = $event.detail.value, ($event) => _ctx.binddata("description", $event.detail.value)]),
    h: $data.formData.description,
    i: common_vendor.p({
      name: "description",
      label: "\u6807\u7B7E\u63CF\u8FF0"
    }),
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    k: common_vendor.sr("form", "300cf505-0"),
    l: common_vendor.p({
      value: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/tag/add.vue"]]);
wx.createPage(MiniProgramPage);
