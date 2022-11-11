"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdPermissions = require("../../../js_sdk/validator/uni-id-permissions.js");
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = "uni-id-permissions";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdPermissions.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdPermissions.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "permission_id": "",
      "permission_name": "",
      "comment": ""
    };
    return {
      formData,
      formOptions: {},
      rules: {
        ...getValidator(Object.keys(formData))
      }
    };
  },
  onLoad(e) {
    if (e.id) {
      const id = e.id;
      this.formDataId = id;
      this.getDetail(id);
    }
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
        this.submitForm(res);
      }).catch(() => {
        common_vendor.index.hideLoading();
      });
    },
    submitForm(value) {
      db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
        common_vendor.index.showToast({
          title: "\u4FEE\u6539\u6210\u529F"
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection(dbCollectionName).doc(id).field("permission_id,permission_name,comment").get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          this.formData = data;
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
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
    a: common_vendor.o(($event) => _ctx.binddata("permission_id", $event.detail.value)),
    b: common_vendor.o(($event) => $data.formData.permission_id = $event),
    c: common_vendor.p({
      placeholder: "\u6743\u9650\u552F\u4E00\u6807\u8BC6\uFF0C\u4E0D\u53EF\u4FEE\u6539\uFF0C\u4E0D\u5141\u8BB8\u91CD\u590D",
      trim: "both",
      disabled: true,
      modelValue: $data.formData.permission_id
    }),
    d: common_vendor.p({
      name: "permission_id",
      label: "\u6743\u9650ID",
      required: true
    }),
    e: common_vendor.o([($event) => $data.formData.permission_name = $event.detail.value, ($event) => _ctx.binddata("permission_name", $event.detail.value)]),
    f: $data.formData.permission_name,
    g: common_vendor.p({
      name: "permission_name",
      label: "\u6743\u9650\u540D\u79F0",
      required: true
    }),
    h: common_vendor.o([($event) => $data.formData.comment = $event.detail.value, ($event) => _ctx.binddata("comment", $event.detail.value)]),
    i: $data.formData.comment,
    j: common_vendor.p({
      name: "comment",
      label: "\u5907\u6CE8"
    }),
    k: common_vendor.t(_ctx.$t("common.button.submit")),
    l: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    m: common_vendor.t(_ctx.$t("common.button.back")),
    n: common_vendor.sr("form", "41e2a2ba-0"),
    o: common_vendor.p({
      value: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/permission/edit.vue"]]);
wx.createPage(MiniProgramPage);
