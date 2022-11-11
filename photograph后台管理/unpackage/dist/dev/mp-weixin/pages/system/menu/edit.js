"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_opendbAdminMenus = require("../../../js_sdk/validator/opendb-admin-menus.js");
const Icons = () => "../../demo/icons/icons2.js";
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = "opendb-admin-menus";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_opendbAdminMenus.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_opendbAdminMenus.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  components: {
    Icons
  },
  data() {
    return {
      formData: {
        "menu_id": "",
        "name": "",
        "icon": "",
        "url": "",
        "sort": "",
        "parent_id": "",
        "permission": [],
        "enable": null
      },
      rules: {
        ...getValidator(["menu_id", "name", "icon", "url", "sort", "parent_id", "permission", "enable"])
      }
    };
  },
  onLoad(e) {
    const id = e.id;
    this.formDataId = id;
    this.getDetail(id);
  },
  methods: {
    submitForm(form) {
      this.$refs.form.submit();
    },
    submit(event) {
      const {
        value,
        errors
      } = event.detail;
      if (errors) {
        return;
      }
      common_vendor.index.showLoading({
        title: "\u4FEE\u6539\u4E2D...",
        mask: true
      });
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
      db.collection(dbCollectionName).where({
        _id: id
      }).get().then((res) => {
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
    },
    showIconPopup() {
      this.$refs.iconPopup.open();
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _component_Icons = common_vendor.resolveComponent("Icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_link2 + _easycom_uni_data_checkbox2 + _component_Icons + _easycom_uni_popup2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_link + _easycom_uni_data_checkbox + _easycom_uni_popup + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.menu_id = $event),
    b: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u83DC\u5355\u9879\u7684ID\uFF0C\u4E0D\u53EF\u91CD\u590D",
      modelValue: $data.formData.menu_id
    }),
    c: common_vendor.p({
      name: "menu_id",
      label: "\u6807\u8BC6",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.name = $event),
    e: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u83DC\u5355\u540D\u79F0",
      modelValue: $data.formData.name
    }),
    f: common_vendor.p({
      name: "name",
      label: "\u663E\u793A\u540D\u79F0",
      required: true
    }),
    g: common_vendor.o((...args) => $options.showIconPopup && $options.showIconPopup(...args)),
    h: common_vendor.o(($event) => $data.formData.icon = $event),
    i: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u83DC\u5355\u56FE\u6807css\u6837\u5F0F\u7C7B\u540D",
      modelValue: $data.formData.icon
    }),
    j: common_vendor.p({
      ["font-size"]: "12",
      href: "https://uniapp.dcloud.net.cn/uniCloud/admin?id=icon-%e5%9b%be%e6%a0%87",
      text: "\u5982\u4F55\u4F7F\u7528\u81EA\u5B9A\u4E49\u56FE\u6807\uFF1F"
    }),
    k: common_vendor.p({
      name: "icon",
      label: "\u56FE\u6807 class"
    }),
    l: common_vendor.o(($event) => $data.formData.url = $event),
    m: common_vendor.p({
      clearable: false,
      placeholder: "URL\u4E3A\u7A7A\u4EE3\u8868\u662F\u76EE\u5F55\u800C\u4E0D\u662F\u53F6\u5B50\u8282\u70B9",
      modelValue: $data.formData.url
    }),
    n: common_vendor.p({
      name: "url",
      label: "\u9875\u9762URL"
    }),
    o: common_vendor.o(($event) => $data.formData.sort = $event),
    p: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u83DC\u5355\u5E8F\u53F7\uFF08\u8D8A\u5927\u8D8A\u9760\u540E\uFF09",
      modelValue: $data.formData.sort
    }),
    q: common_vendor.p({
      name: "sort",
      label: "\u5E8F\u53F7"
    }),
    r: common_vendor.o(($event) => $data.formData.parent_id = $event),
    s: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u7236\u7EA7\u83DC\u5355\u6807\u8BC6, \u4E00\u7EA7\u83DC\u5355\u4E0D\u9700\u8981\u586B\u5199",
      modelValue: $data.formData.parent_id
    }),
    t: common_vendor.p({
      name: "parent_id",
      label: "\u7236\u83DC\u5355\u6807\u8BC6"
    }),
    v: common_vendor.o(($event) => $data.formData.permission = $event),
    w: common_vendor.p({
      multiple: true,
      collection: "uni-id-permissions",
      ["page-size"]: 500,
      field: "permission_name as text, permission_id as value",
      modelValue: $data.formData.permission
    }),
    x: common_vendor.p({
      name: "permission",
      label: "\u6743\u9650\u5217\u8868"
    }),
    y: common_vendor.o(($event) => _ctx.binddata("enable", $event.detail.value)),
    z: $data.formData.enable,
    A: common_vendor.p({
      name: "enable",
      label: "\u662F\u5426\u542F\u7528"
    }),
    B: common_vendor.t(_ctx.$t("common.button.submit")),
    C: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    D: common_vendor.t(_ctx.$t("common.button.back")),
    E: common_vendor.p({
      tag: false,
      ["fix-window"]: false
    }),
    F: common_vendor.sr("iconPopup", "acde0025-17,acde0025-0"),
    G: common_vendor.p({
      type: "center"
    }),
    H: common_vendor.sr("form", "acde0025-0"),
    I: common_vendor.o($options.submit),
    J: common_vendor.o(($event) => $data.formData = $event),
    K: common_vendor.p({
      labelWidth: "80",
      rules: $data.rules,
      validateTrigger: "bind",
      modelValue: $data.formData
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-acde0025"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/menu/edit.vue"]]);
wx.createPage(MiniProgramPage);
