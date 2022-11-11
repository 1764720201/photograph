"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdUsers = require("../../../js_sdk/validator/uni-id-users.js");
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = "uni-id-users";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdUsers.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdUsers.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    return {
      showPassword: false,
      formData: {
        "username": "",
        "nickname": "",
        "password": "",
        "role": [],
        "authorizedApp": [],
        "mobile": "",
        "email": "",
        "status": false
      },
      rules: {
        ...getValidator(["username", "password", "role", "mobile", "email"]),
        "status": {
          "rules": [{
            "format": "bool"
          }]
        }
      },
      roles: []
    };
  },
  onLoad(e) {
    const id = e.id;
    this.formDataId = id;
    this.getDetail(id);
    this.loadroles();
  },
  methods: {
    gotoAppList() {
      common_vendor.index.navigateTo({
        url: "../app/list"
      });
    },
    gotoTagList() {
      common_vendor.index.navigateTo({
        url: "../tag/list"
      });
    },
    gotoTagAdd() {
      common_vendor.index.navigateTo({
        url: "../tag/add",
        events: {
          refreshCheckboxData: () => {
            this.$refs.checkbox.loadData();
          }
        }
      });
    },
    trigger() {
      this.showPassword = !this.showPassword;
    },
    submitForm(form) {
      this.$refs.form.submit();
    },
    submit(event) {
      const {
        value,
        errors
      } = event.detail;
      console.log(event);
      if (errors) {
        return;
      }
      common_vendor.index.showLoading({
        title: "\u4FEE\u6539\u4E2D...",
        mask: true
      });
      if (typeof value.status === "boolean") {
        value.status = Number(!value.status);
      }
      value.uid = this.formDataId;
      this.$request("updateUser", value).then(() => {
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
      }).finally((err) => {
        common_vendor.index.hideLoading();
      });
    },
    resetPWd(resetData) {
      this.$request("system/user/resetPwd", resetData).then().catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally();
    },
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection(dbCollectionName).doc(id).field("username,nickname,role,dcloud_appid as authorizedApp,tags,mobile,email,status").get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          if (data.status === void 0) {
            data.status = true;
          }
          if (data.status === 0) {
            data.status = true;
          }
          if (data.status === 1) {
            data.status = false;
          }
          this.formData = Object.assign(this.formData, data);
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
    loadroles() {
      db.collection("uni-id-roles").limit(500).get().then((res) => {
        const roleIds = [];
        this.roles = res.result.data.map((item) => {
          roleIds.push(item.role_id);
          return {
            value: item.role_id,
            text: item.role_name
          };
        });
        if (roleIds.indexOf("admin") === -1) {
          this.roles.unshift({
            value: "admin",
            text: "\u8D85\u7EA7\u7BA1\u7406\u5458"
          });
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: err.message,
          showCancel: false
        });
      });
    },
    parseUserStatus(status) {
      if (status === 0) {
        return "\u542F\u7528";
      } else if (status === 1) {
        return "\u7981\u7528";
      } else if (status === 2) {
        return "\u5BA1\u6838\u4E2D";
      } else if (status === 3) {
        return "\u5BA1\u6838\u62D2\u7EDD";
      } else {
        return "\u542F\u7528";
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.formData.username = $event),
    b: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
      modelValue: $data.formData.username
    }),
    c: common_vendor.p({
      name: "username",
      label: "\u7528\u6237\u540D",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.nickname = $event),
    e: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u6635\u79F0",
      modelValue: $data.formData.nickname
    }),
    f: common_vendor.p({
      name: "nickname",
      label: "\u7528\u6237\u6635\u79F0",
      required: true
    }),
    g: $data.showPassword
  }, $data.showPassword ? {
    h: common_vendor.o((...args) => $options.trigger && $options.trigger(...args)),
    i: common_vendor.o(($event) => $data.formData.password = $event),
    j: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u91CD\u7F6E\u5BC6\u7801",
      modelValue: $data.formData.password
    }),
    k: common_vendor.p({
      name: "password",
      label: "\u91CD\u7F6E\u5BC6\u7801"
    })
  } : {
    l: common_vendor.o((...args) => $options.trigger && $options.trigger(...args)),
    m: common_vendor.p({
      label: "\u91CD\u7F6E\u5BC6\u7801"
    })
  }, {
    n: common_vendor.o(($event) => $data.formData.role = $event),
    o: common_vendor.p({
      multiple: true,
      localdata: $data.roles,
      modelValue: $data.formData.role
    }),
    p: common_vendor.p({
      name: "role",
      label: "\u89D2\u8272\u5217\u8868"
    }),
    q: common_vendor.o(($event) => $data.formData.tags = $event),
    r: common_vendor.p({
      multiple: true,
      collection: "uni-id-tag",
      field: "tagid as value, name as text",
      modelValue: $data.formData.tags
    }),
    s: common_vendor.o((...args) => $options.gotoTagAdd && $options.gotoTagAdd(...args)),
    t: common_vendor.o((...args) => $options.gotoTagList && $options.gotoTagList(...args)),
    v: common_vendor.p({
      name: "tags",
      label: "\u7528\u6237\u6807\u7B7E",
      labelWidth: "100"
    }),
    w: common_vendor.o(($event) => $data.formData.authorizedApp = $event),
    x: common_vendor.p({
      multiple: true,
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      modelValue: $data.formData.authorizedApp
    }),
    y: common_vendor.o((...args) => $options.gotoAppList && $options.gotoAppList(...args)),
    z: common_vendor.p({
      name: "authorizedApp",
      label: "\u53EF\u767B\u5F55\u5E94\u7528"
    }),
    A: common_vendor.o(($event) => $data.formData.mobile = $event),
    B: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
      modelValue: $data.formData.mobile
    }),
    C: common_vendor.p({
      name: "mobile",
      label: "\u624B\u673A\u53F7"
    }),
    D: common_vendor.o(($event) => $data.formData.email = $event),
    E: common_vendor.p({
      clearable: false,
      placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1",
      modelValue: $data.formData.email
    }),
    F: common_vendor.p({
      name: "email",
      label: "\u90AE\u7BB1"
    }),
    G: Number($data.formData.status) < 2
  }, Number($data.formData.status) < 2 ? {
    H: common_vendor.o(($event) => _ctx.binddata("status", $event.detail.value)),
    I: $data.formData.status
  } : {
    J: common_vendor.t($options.parseUserStatus($data.formData.status))
  }, {
    K: common_vendor.p({
      name: "status",
      label: "\u7528\u6237\u72B6\u6001"
    }),
    L: common_vendor.t(_ctx.$t("common.button.submit")),
    M: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    N: common_vendor.t(_ctx.$t("common.button.back")),
    O: common_vendor.sr("form", "7608e8e7-0"),
    P: common_vendor.o($options.submit),
    Q: common_vendor.o(($event) => $data.formData = $event),
    R: common_vendor.p({
      rules: $data.rules,
      validateTrigger: "bind",
      modelValue: $data.formData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/user/edit.vue"]]);
wx.createPage(MiniProgramPage);
