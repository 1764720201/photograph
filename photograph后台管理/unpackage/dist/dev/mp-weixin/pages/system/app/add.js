"use strict";
const common_vendor = require("../../../common/vendor.js");
const pages_system_app_mixin_publish_add_detail_mixin = require("./mixin/publish_add_detail_mixin.js");
require("../../../js_sdk/validator/opendb-app-list.js");
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = "opendb-app-list";
function randomString(len) {
  var array = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  var result = "";
  for (var i = 0; i < len; i++) {
    result += array[Math.floor(Math.random() * 26)];
  }
  return result;
}
const _sfc_main = {
  mixins: [pages_system_app_mixin_publish_add_detail_mixin.mixin],
  data() {
    return {
      mpExtra: " ",
      mpAccordionStatus: 1,
      labelWidth: "80px"
    };
  },
  onLoad(e) {
    if (e.id) {
      this.isEdit = true;
      common_vendor.index.setNavigationBarTitle({
        title: "\u4FEE\u6539\u5E94\u7528"
      });
      this.setFormData("appid", e.id);
      this.getDetail(e.id);
    } else {
      this.$watch("formData.name", (name) => {
        this.platFormKeys.forEach((key) => {
          this.setFormData(`${key}.name`, name);
        });
      });
    }
  },
  onReady() {
    this.mpExtra = "\u6298\u53E0";
  },
  methods: {
    resolvestableVersionStoreList() {
      const modifiedMap = {};
      const modifiedKeys = [];
      this.formData.store_list.forEach((item, index) => {
        modifiedKeys.push(item.id);
        modifiedMap[item.id] = index;
      });
      return this.fetchAppInfo(this.getFormData("appid"), "Android").then((res) => {
        if (!res.success)
          return;
        if (res.store_list) {
          const originalMap = {};
          const originalKeys = [];
          res.store_list.forEach((item, index) => {
            originalKeys.push(item.id);
            originalMap[item.id] = index;
          });
          modifiedKeys.forEach((key, index) => {
            const afterItem = this.formData.store_list[modifiedMap[key]];
            if (originalKeys.indexOf(key) === -1) {
              res.store_list.push(afterItem);
            } else {
              res.store_list[originalMap[key]].name = afterItem.name;
              res.store_list[originalMap[key]].scheme = afterItem.scheme;
            }
          });
          for (let i = 0; i < res.store_list.length; i++) {
            let id = res.store_list[i].id;
            if (this.deletedStore.indexOf(id) !== -1 && modifiedKeys.indexOf(id) === -1) {
              res.store_list.splice(i, 1);
              i--;
            }
          }
        } else {
          res.store_list = this.formData.store_list;
        }
        return this.updateAppVersion(res._id, {
          store_list: res.store_list
        });
      });
    },
    updateAppVersion(id, value) {
      return db.collection("opendb-app-versions").doc(id).update(value);
    },
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.formatFormData();
      this.$refs.form.validate(this.keepItems).then((res) => {
        return this.submitForm(res);
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    submitForm(value) {
      (this.isEdit ? this.requestCloudFunction("setNewAppData", {
        id: this.formDataId,
        value
      }) : db.collection(dbCollectionName).add(value)).then((res) => {
        if (this.isEdit)
          return this.resolvestableVersionStoreList();
      }).then(() => {
        common_vendor.index.showToast({
          title: `${this.isEdit ? "\u66F4\u65B0" : "\u65B0\u589E"}\u6210\u529F`
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      });
    },
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection(dbCollectionName).where({
        appid: id
      }).get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          this.formDataId = data._id;
          this.initFormData(data);
        } else {
          this.autoFill();
          this.autoFillApp();
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
    mpAccordion() {
      if (this.mpAccordionStatus) {
        this.mpExtra = "\u5C55\u5F00";
        this.mpAccordionStatus = 0;
      } else {
        this.mpExtra = "\u6298\u53E0";
        this.mpAccordionStatus = 1;
      }
    },
    addStoreScheme() {
      this.formData.store_list.push({
        enable: false,
        priority: 0,
        id: randomString(5) + "_" + Date.now()
      });
    },
    deleteStore(index, item) {
      if (item.scheme && item.scheme.trim().length && this.isEdit) {
        common_vendor.index.showModal({
          content: "\u662F\u5426\u540C\u6B65\u5220\u9664\u7EBF\u4E0A\u7248\u672C\u6B64\u6761\u5546\u5E97\u8BB0\u5F55\uFF1F",
          success: (res) => {
            const storeItem = this.formData.store_list.splice(index, 1)[0];
            if (storeItem && res.confirm) {
              this.deletedStore.push(storeItem.id);
            }
          }
        });
      } else {
        this.formData.store_list.splice(index, 1)[0];
      }
    },
    schemeDemo() {
      $refs.scheme.open("center");
    }
  }
};
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_show_info2 = common_vendor.resolveComponent("show-info");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_notice_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_card2 + _easycom_uni_file_picker2 + _easycom_show_info2 + _easycom_uni_popup2 + _easycom_uni_forms2)();
}
const _easycom_uni_notice_bar = () => "../../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_file_picker = () => "../../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_show_info = () => "../../../components/show-info/show-info.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_card + _easycom_uni_file_picker + _easycom_show_info + _easycom_uni_popup + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      showIcon: true,
      text: "\u672C\u9875\u9762\u4FE1\u606F\uFF0C\u5728\u5E94\u7528\u53D1\u5E03\u3001app\u5347\u7EA7\u6A21\u5757\u4E2D\uFF0C\u90FD\u4F1A\u5173\u8054\u4F7F\u7528\uFF0C\u8BF7\u8BA4\u771F\u586B\u5199"
    }),
    b: common_vendor.o(($event) => _ctx.formData.appid = $event),
    c: common_vendor.p({
      disabled: _ctx.isEdit,
      placeholder: "\u5E94\u7528\u7684AppID",
      trim: "both",
      modelValue: _ctx.formData.appid
    }),
    d: common_vendor.p({
      name: "appid",
      label: "AppID",
      required: true
    }),
    e: common_vendor.o(($event) => _ctx.formData.name = $event),
    f: common_vendor.p({
      disabled: _ctx.isEdit,
      placeholder: "\u5E94\u7528\u540D\u79F0",
      trim: "both",
      modelValue: _ctx.formData.name
    }),
    g: common_vendor.p({
      name: "name",
      label: "\u5E94\u7528\u540D\u79F0",
      required: true
    }),
    h: common_vendor.o(($event) => _ctx.formData.introduction = $event),
    i: common_vendor.p({
      placeholder: "\u5E94\u7528\u7B80\u4ECB",
      trim: "both",
      modelValue: _ctx.formData.introduction
    }),
    j: common_vendor.p({
      name: "introduction",
      label: "\u5E94\u7528\u7B80\u4ECB"
    }),
    k: -1,
    l: common_vendor.o([($event) => _ctx.formData.description = $event.detail.value, ($event) => _ctx.binddata("description", $event.detail.value)]),
    m: _ctx.formData.description,
    n: common_vendor.p({
      name: "description",
      label: "\u5E94\u7528\u63CF\u8FF0"
    }),
    o: common_vendor.p({
      title: "\u57FA\u7840\u4FE1\u606F"
    }),
    p: common_vendor.o((res) => _ctx.iconUrlSuccess(res, "icon_url")),
    q: common_vendor.o((res) => _ctx.iconUrlDelete(res, "icon_url")),
    r: common_vendor.o(($event) => _ctx.middleware_img.icon_url = $event),
    s: common_vendor.p({
      ["image-styles"]: {
        "width": "200rpx"
      },
      ["return-type"]: "object",
      ["file-mediatype"]: "image",
      limit: "1",
      mode: "grid",
      modelValue: _ctx.middleware_img.icon_url
    }),
    t: common_vendor.p({
      label: "\u5E94\u7528\u56FE\u6807"
    }),
    v: common_vendor.o(_ctx.iconUrlDelete),
    w: common_vendor.o(($event) => _ctx.screenshotList = $event),
    x: common_vendor.p({
      ["file-mediatype"]: "image",
      mode: "grid",
      ["image-styles"]: {
        "height": "500rpx",
        "width": "300rpx"
      },
      modelValue: _ctx.screenshotList
    }),
    y: common_vendor.p({
      label: "\u5E94\u7528\u622A\u56FE"
    }),
    z: common_vendor.p({
      title: "\u56FE\u6807\u7D20\u6750"
    }),
    A: _ctx.isEdit
  }, _ctx.isEdit ? {
    B: common_vendor.o((...args) => _ctx.autoFillApp && _ctx.autoFillApp(...args)),
    C: common_vendor.p({
      left: -10,
      top: -35,
      width: "230",
      content: "\u4ECEApp\u5347\u7EA7\u4E2D\u5FC3\u540C\u6B65\u5E94\u7528\u5B89\u88C5\u5305\u4FE1\u606F"
    })
  } : {}, {
    D: common_vendor.f(_ctx.appPlatformKeys, (item, k0, i0) => {
      return common_vendor.e({
        a: item,
        b: _ctx.middleware_checkbox[item],
        c: common_vendor.t(_ctx.appPlatformValues[item]),
        d: _ctx.getPlatformChcekbox(item) ? 1 : "",
        e: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          _ctx.setPlatformChcekbox(item, !!value.length);
        }),
        f: _ctx.getPlatformChcekbox(item)
      }, _ctx.getPlatformChcekbox(item) ? common_vendor.e({
        g: "ac6d8ee8-18-" + i0 + "," + ("ac6d8ee8-17-" + i0),
        h: common_vendor.o(($event) => _ctx.formData[item].name = $event),
        i: common_vendor.p({
          trim: "both",
          modelValue: _ctx.formData[item].name
        }),
        j: "ac6d8ee8-17-" + i0 + ",ac6d8ee8-15",
        k: common_vendor.p({
          label: "\u540D\u79F0"
        }),
        l: item === "app_android"
      }, item === "app_android" ? common_vendor.e({
        m: common_vendor.o((...args) => _ctx.selectFile && _ctx.selectFile(...args)),
        n: common_vendor.o((res) => _ctx.iconUrlSuccess(res, `${item}.url`)),
        o: common_vendor.o((res) => _ctx.iconUrlDelete(res, `${item}.url`)),
        p: "ac6d8ee8-20-" + i0 + "," + ("ac6d8ee8-19-" + i0),
        q: common_vendor.o(($event) => _ctx.appPackageInfo = $event),
        r: common_vendor.p({
          ["file-extname"]: "apk",
          disabled: _ctx.hasPackage,
          returnType: "object",
          ["file-mediatype"]: "all",
          limit: "1",
          modelValue: _ctx.appPackageInfo
        }),
        s: _ctx.hasPackage
      }, _ctx.hasPackage ? {
        t: common_vendor.t(_ctx.appPackageInfo.size && Number(_ctx.appPackageInfo.size / 1024 / 1024).toFixed(2) + "M")
      } : {}, {
        v: "ac6d8ee8-19-" + i0 + ",ac6d8ee8-15",
        w: common_vendor.p({
          label: "\u4E0A\u4F20apk\u5305"
        })
      }) : {}, {
        x: "ac6d8ee8-22-" + i0 + "," + ("ac6d8ee8-21-" + i0),
        y: common_vendor.o(($event) => _ctx.formData[item].url = $event),
        z: common_vendor.p({
          maxlength: -1,
          trim: "both",
          modelValue: _ctx.formData[item].url
        }),
        A: "ac6d8ee8-21-" + i0 + ",ac6d8ee8-15",
        B: common_vendor.p({
          label: item === "app_ios" ? "AppStore" : "\u4E0B\u8F7D\u94FE\u63A5"
        })
      }) : {}, {
        C: item
      });
    }),
    E: common_vendor.sr("scheme", "ac6d8ee8-23,ac6d8ee8-15"),
    F: common_vendor.p({
      ["background-color"]: "#fff"
    }),
    G: common_vendor.o((...args) => $options.schemeDemo && $options.schemeDemo(...args)),
    H: common_vendor.o((...args) => $options.addStoreScheme && $options.addStoreScheme(...args)),
    I: common_vendor.f(_ctx.formData.store_list, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.deleteStore(index, item)),
        b: "ac6d8ee8-27-" + i0 + "," + ("ac6d8ee8-26-" + i0),
        c: common_vendor.o(($event) => item.name = $event),
        d: common_vendor.p({
          trim: "both",
          modelValue: item.name
        }),
        e: "ac6d8ee8-26-" + i0 + "," + ("ac6d8ee8-25-" + i0),
        f: "ac6d8ee8-29-" + i0 + "," + ("ac6d8ee8-28-" + i0),
        g: common_vendor.o(($event) => item.scheme = $event),
        h: common_vendor.p({
          maxlength: -1,
          trim: "both",
          modelValue: item.scheme
        }),
        i: "ac6d8ee8-28-" + i0 + "," + ("ac6d8ee8-25-" + i0),
        j: "ac6d8ee8-25-" + i0 + ",ac6d8ee8-24",
        k: item.id
      };
    }),
    J: common_vendor.p({
      label: "\u5546\u5E97\u540D\u79F0"
    }),
    K: common_vendor.p({
      label: "Scheme"
    }),
    L: common_vendor.p({
      title: ""
    }),
    M: common_vendor.p({
      name: "store_schemes",
      label: "Android\u5E94\u7528\u5E02\u573A",
      labelWidth: "120"
    }),
    N: common_vendor.p({
      title: "App \u4FE1\u606F"
    }),
    O: common_vendor.f(_ctx.mpPlatformKeys, (item, k0, i0) => {
      return common_vendor.e({
        a: item,
        b: _ctx.middleware_checkbox[item],
        c: common_vendor.t(_ctx.mpPlatform[item]),
        d: _ctx.getPlatformChcekbox(item) ? 1 : "",
        e: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          _ctx.setPlatformChcekbox(item, !!value.length);
        }),
        f: $data.mpAccordionStatus && _ctx.getPlatformChcekbox(item)
      }, $data.mpAccordionStatus && _ctx.getPlatformChcekbox(item) ? {
        g: "ac6d8ee8-32-" + i0 + "," + ("ac6d8ee8-31-" + i0),
        h: common_vendor.o(($event) => _ctx.formData[item].name = $event),
        i: common_vendor.p({
          trim: "both",
          modelValue: _ctx.formData[item].name
        }),
        j: "ac6d8ee8-31-" + i0 + ",ac6d8ee8-30",
        k: common_vendor.p({
          label: "\u540D\u79F0"
        }),
        l: common_vendor.o((res) => _ctx.iconUrlSuccess(res, `${item}.qrcode_url`)),
        m: common_vendor.o((res) => _ctx.iconUrlDelete(res, `${item}.qrcode_url`)),
        n: "ac6d8ee8-34-" + i0 + "," + ("ac6d8ee8-33-" + i0),
        o: common_vendor.o(($event) => _ctx.middleware_img[item] = $event),
        p: common_vendor.p({
          ["image-styles"]: {
            "width": "200rpx"
          },
          ["return-type"]: "object",
          ["file-mediatype"]: "image",
          limit: "1",
          mode: "grid",
          modelValue: _ctx.middleware_img[item]
        }),
        q: "ac6d8ee8-33-" + i0 + ",ac6d8ee8-30",
        r: common_vendor.p({
          label: _ctx.mpPlatform[item].slice(-3) + "\u7801"
        })
      } : {}, {
        s: item
      });
    }),
    P: common_vendor.p({
      title: "\u5C0F\u7A0B\u5E8F/\u5FEB\u5E94\u7528\u4FE1\u606F"
    }),
    Q: common_vendor.o(($event) => _ctx.formData.h5.url = $event),
    R: common_vendor.p({
      maxlength: -1,
      trim: "both",
      modelValue: _ctx.formData.h5.url
    }),
    S: common_vendor.p({
      label: "\u94FE\u63A5\u5730\u5740"
    }),
    T: common_vendor.p({
      title: "web\u4FE1\u606F"
    }),
    U: _ctx.isEdit
  }, _ctx.isEdit ? {
    V: common_vendor.p({
      isShadow: false
    })
  } : {}, {
    W: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    X: common_vendor.sr("form", "ac6d8ee8-1"),
    Y: common_vendor.o(($event) => _ctx.formData = $event),
    Z: common_vendor.p({
      validateTrigger: "bind",
      labelWidth: $data.labelWidth,
      rules: _ctx.rules,
      modelValue: _ctx.formData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/app/add.vue"]]);
wx.createPage(MiniProgramPage);
