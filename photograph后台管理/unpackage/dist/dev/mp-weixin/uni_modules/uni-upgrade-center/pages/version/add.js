"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin = require("../mixin/version_add_detail_mixin.js");
const uni_modules_uniUpgradeCenter_pages_utils = require("../utils.js");
require("../../../../js_sdk/validator/opendb-app-versions.js");
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = uni_modules_uniUpgradeCenter_pages_utils.appVersionListDbName;
const platform_Android = "Android";
function compare(v1 = "0", v2 = "0") {
  v1 = String(v1).split(".");
  v2 = String(v2).split(".");
  const minVersionLens = Math.min(v1.length, v2.length);
  let result = 0;
  for (let i = 0; i < minVersionLens; i++) {
    const curV1 = Number(v1[i]);
    const curV2 = Number(v2[i]);
    if (curV1 > curV2) {
      result = 1;
      break;
    } else if (curV1 < curV2) {
      result = -1;
      break;
    }
  }
  if (result === 0 && v1.length !== v2.length) {
    const v1BiggerThenv2 = v1.length > v2.length;
    const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
    for (let i = minVersionLens; i < maxLensVersion.length; i++) {
      const curVersion = Number(maxLensVersion[i]);
      if (curVersion > 0) {
        v1BiggerThenv2 ? result = 1 : result = -1;
        break;
      }
    }
  }
  return result;
}
const _sfc_main = {
  mixins: [uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.addAndDetail],
  data() {
    return {
      latestVersion: "0.0.0",
      lastVersionId: ""
    };
  },
  async onLoad({
    appid,
    name,
    type
  }) {
    if (appid && type && name) {
      const store_list = await this.getStoreList(appid);
      this.formData = {
        ...this.formData,
        ...{
          appid,
          name,
          type,
          store_list
        }
      };
      this.latestStableData = await this.getDetail(appid, type);
      if (!this.isWGT && this.latestStableData.length) {
        this.setFormData(platform_Android);
      }
      if (this.isWGT) {
        this.rules.min_uni_version.rules.push({
          "required": true
        });
      }
    }
  },
  watch: {
    isiOS(val) {
      if (!val && this.hasPackage) {
        this.formData.url = this.appFileList.url;
        return;
      }
      this.formData.url = "";
    },
    "formData.platform"(val) {
      this.setFormData(val);
    }
  },
  methods: {
    setFormData(os) {
      common_vendor.index.showLoading({
        mask: true
      });
      this.latestVersion = "0.0.0";
      this.lastVersionId = "";
      const data = this.getData(this.latestStableData, os)[0];
      if (data) {
        const {
          _id,
          version,
          name,
          platform,
          min_uni_version,
          url
        } = data;
        this.lastVersionId = _id;
        this.latestVersion = version;
        this.formData.name = name;
        if (!this.isWGT) {
          delete this.formData.min_uni_version;
          this.formData.platform = platform[0];
          if (this.isiOS) {
            this.formData.url = url;
          }
        } else {
          this.formData.min_uni_version = min_uni_version;
        }
      } else if (this.isWGT) {
        this.formData.min_uni_version = "";
      }
      common_vendor.index.hideLoading();
    },
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate(["store_list"]).then((res) => {
        if (compare(this.latestVersion, res.version) >= 0) {
          common_vendor.index.showModal({
            content: `\u7248\u672C\u53F7\u5FC5\u987B\u5927\u4E8E\u5F53\u524D\u5DF2\u4E0A\u7EBF\u7248\u672C\uFF08${this.latestVersion}\uFF09`,
            showCancel: false
          });
          throw new Error("\u7248\u672C\u53F7\u5FC5\u987B\u5927\u4E8E\u5DF2\u4E0A\u7EBF\u7248\u672C\uFF08${this.latestVersion}\uFF09");
        }
        if (!this.isWGT) {
          res.platform = [res.platform];
        }
        if (this.isiOS || this.isWGT)
          delete res.store_list;
        if (res.store_list) {
          res.store_list.forEach((item) => {
            item.priority = parseFloat(item.priority);
          });
        }
        this.submitForm(res);
      }).catch((errors) => {
        common_vendor.index.hideLoading();
      });
    },
    async submitForm(value) {
      value = this.createCenterRecord(value);
      const collectionDB = db.collection(dbCollectionName);
      let recordCreateByUniStat = [];
      if (!this.isWGT) {
        recordCreateByUniStat = await this.getDetail(value.appid, value.type, this.createStatQuery(value));
      }
      let dbOperate;
      if (!recordCreateByUniStat.length) {
        dbOperate = collectionDB.add(value);
      } else {
        value.create_date = Date.now();
        dbOperate = collectionDB.doc(recordCreateByUniStat[0]._id).update(value);
      }
      dbOperate.then(async (res) => {
        if (value.stable_publish && this.lastVersionId) {
          await collectionDB.doc(this.lastVersionId).update({
            stable_publish: false
          });
        }
        common_vendor.index.showToast({
          title: "\u65B0\u589E\u6210\u529F"
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
    getDetail(appid, type, args = {}) {
      common_vendor.index.showLoading({
        mask: true
      });
      return db.collection(dbCollectionName).where(
        Object.assign({
          appid,
          type,
          stable_publish: true
        }, args)
      ).field(uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.fields).get().then((res) => res.result.data).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    getStoreList(appid) {
      return db.collection("opendb-app-list").where({
        appid
      }).get().then((res) => {
        const data = res.result.data[0];
        return data.store_list || [];
      });
    },
    getData(data = [], platform) {
      if (typeof platform === "string") {
        return data.filter((item) => item.platform.includes(platform));
      } else {
        return data.filter((item) => item.platform.toString() === platform.toString());
      }
    },
    back() {
      common_vendor.index.showModal({
        title: "\u53D6\u6D88\u53D1\u5E03",
        content: this.hasPackage ? "\u5C06\u4F1A\u5220\u9664\u5DF2\u4E0A\u4F20\u7684\u5305" : void 0,
        success: (res) => {
          if (res.confirm) {
            if (this.hasPackage) {
              let fileList = [];
              fileList.push(this.appFileList.url);
              this.$request("deleteFile", {
                fileList
              }, {
                functionName: "upgrade-center"
              });
            }
            common_vendor.index.navigateBack();
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_show_info2 = common_vendor.resolveComponent("show-info");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_show_info2 + _easycom_uni_file_picker2 + _easycom_uni_card2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_show_info = () => "../../../../components/show-info/show-info.js";
const _easycom_uni_file_picker = () => "../../../uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_card = () => "../../../uni-card/components/uni-card/uni-card.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_show_info + _easycom_uni_file_picker + _easycom_uni_card + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.type_valuetotext[_ctx.formData.type]),
    b: common_vendor.o(($event) => _ctx.formData.appid = $event),
    c: common_vendor.p({
      disabled: true,
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
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.name
    }),
    g: common_vendor.p({
      name: "name",
      label: "\u5E94\u7528\u540D\u79F0"
    }),
    h: common_vendor.o(($event) => _ctx.formData.title = $event),
    i: common_vendor.p({
      placeholder: "\u66F4\u65B0\u6807\u9898",
      modelValue: _ctx.formData.title
    }),
    j: common_vendor.p({
      name: "title",
      label: "\u66F4\u65B0\u6807\u9898"
    }),
    k: common_vendor.o(($event) => _ctx.binddata("contents", $event.detail.value)),
    l: _ctx.formData.contents,
    m: common_vendor.o((val) => _ctx.formData.contents = val),
    n: common_vendor.p({
      name: "contents",
      label: "\u66F4\u65B0\u5185\u5BB9",
      required: true
    }),
    o: common_vendor.o(($event) => _ctx.formData.platform = $event),
    p: common_vendor.p({
      multiple: _ctx.isWGT,
      localdata: _ctx.platformLocaldata,
      modelValue: _ctx.formData.platform
    }),
    q: common_vendor.p({
      name: "platform",
      label: "\u5E73\u53F0",
      required: true
    }),
    r: common_vendor.o(($event) => _ctx.formData.version = $event),
    s: common_vendor.p({
      placeholder: "\u5F53\u524D\u5305\u7248\u672C\u53F7\uFF0C\u5FC5\u987B\u5927\u4E8E\u5F53\u524D\u7EBF\u4E0A\u53D1\u884C\u7248\u672C\u53F7",
      modelValue: _ctx.formData.version
    }),
    t: common_vendor.p({
      name: "version",
      label: "\u7248\u672C\u53F7",
      required: true
    }),
    v: _ctx.isWGT
  }, _ctx.isWGT ? {
    w: common_vendor.o(($event) => _ctx.formData.min_uni_version = $event),
    x: common_vendor.p({
      placeholder: "\u539F\u751FApp\u6700\u4F4E\u7248\u672C",
      modelValue: _ctx.formData.min_uni_version
    }),
    y: common_vendor.p({
      content: _ctx.minUniVersionContent
    }),
    z: common_vendor.p({
      name: "min_uni_version",
      label: "\u539F\u751FApp\u6700\u4F4E\u7248\u672C",
      required: _ctx.isWGT
    })
  } : {}, {
    A: !_ctx.isiOS
  }, !_ctx.isiOS ? common_vendor.e({
    B: common_vendor.o((...args) => _ctx.selectFile && _ctx.selectFile(...args)),
    C: common_vendor.o(_ctx.packageUploadSuccess),
    D: common_vendor.o(_ctx.packageDelete),
    E: common_vendor.o(($event) => _ctx.appFileList = $event),
    F: common_vendor.p({
      ["file-extname"]: _ctx.fileExtname,
      disabled: _ctx.hasPackage,
      returnType: "object",
      ["file-mediatype"]: "all",
      limit: "1",
      modelValue: _ctx.appFileList
    }),
    G: _ctx.hasPackage
  }, _ctx.hasPackage ? {
    H: common_vendor.t(Number(_ctx.appFileList.size / 1024 / 1024).toFixed(2))
  } : {}, {
    I: common_vendor.p({
      label: "\u4E0A\u4F20apk\u5305"
    })
  }) : {}, {
    J: common_vendor.o(($event) => _ctx.formData.url = $event),
    K: common_vendor.p({
      placeholder: "\u94FE\u63A5",
      maxlength: -1,
      modelValue: _ctx.formData.url
    }),
    L: common_vendor.p({
      name: "url",
      label: _ctx.isiOS ? "AppStore" : "\u4E0B\u8F7D\u94FE\u63A5",
      required: true
    }),
    M: !_ctx.isiOS && !_ctx.isWGT && _ctx.formData.store_list.length
  }, !_ctx.isiOS && !_ctx.isWGT && _ctx.formData.store_list.length ? {
    N: common_vendor.f(_ctx.formData.store_list, (item, k0, i0) => {
      return {
        a: item.enable,
        b: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          item.enable = !!value.length;
        }),
        c: "289f2390-22-" + i0 + "," + ("289f2390-21-" + i0),
        d: common_vendor.o(($event) => item.name = $event),
        e: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.name
        }),
        f: "289f2390-21-" + i0 + "," + ("289f2390-20-" + i0),
        g: "289f2390-24-" + i0 + "," + ("289f2390-23-" + i0),
        h: common_vendor.o(($event) => item.scheme = $event),
        i: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.scheme
        }),
        j: "289f2390-23-" + i0 + "," + ("289f2390-20-" + i0),
        k: "289f2390-26-" + i0 + "," + ("289f2390-25-" + i0),
        l: common_vendor.o(($event) => item.priority = $event),
        m: common_vendor.p({
          type: "number",
          modelValue: item.priority
        }),
        n: "289f2390-27-" + i0 + "," + ("289f2390-25-" + i0),
        o: "289f2390-25-" + i0 + "," + ("289f2390-20-" + i0),
        p: "289f2390-20-" + i0 + ",289f2390-19",
        q: item.id
      };
    }),
    O: common_vendor.p({
      label: "\u5546\u5E97\u540D\u79F0"
    }),
    P: common_vendor.p({
      label: "Scheme"
    }),
    Q: common_vendor.p({
      top: -100,
      left: -180,
      content: _ctx.priorityContent
    }),
    R: common_vendor.p({
      label: "\u4F18\u5148\u7EA7"
    }),
    S: common_vendor.p({
      label: "Android\u5E94\u7528\u5E02\u573A",
      labelWidth: "125px",
      name: "store_list"
    })
  } : {}, {
    T: _ctx.isWGT
  }, _ctx.isWGT ? {
    U: common_vendor.o(($event) => _ctx.binddata("is_silently", $event.detail.value)),
    V: _ctx.formData.is_silently,
    W: common_vendor.p({
      top: -80,
      content: _ctx.silentlyContent
    }),
    X: common_vendor.p({
      name: "is_silently",
      label: "\u9759\u9ED8\u66F4\u65B0"
    })
  } : {}, {
    Y: !_ctx.isiOS
  }, !_ctx.isiOS ? {
    Z: common_vendor.o(($event) => _ctx.binddata("is_mandatory", $event.detail.value)),
    aa: _ctx.formData.is_mandatory,
    ab: common_vendor.p({
      content: _ctx.mandatoryContent
    }),
    ac: common_vendor.p({
      name: "is_mandatory",
      label: "\u5F3A\u5236\u66F4\u65B0"
    })
  } : {}, {
    ad: common_vendor.o(($event) => _ctx.binddata("stable_publish", $event.detail.value)),
    ae: _ctx.formData.stable_publish,
    af: common_vendor.p({
      top: -40,
      content: _ctx.stablePublishContent2
    }),
    ag: common_vendor.p({
      name: "stable_publish",
      label: "\u4E0A\u7EBF\u53D1\u884C"
    }),
    ah: common_vendor.o(($event) => _ctx.formData.type = $event),
    ai: common_vendor.p({
      localdata: _ctx.formOptions.type_localdata,
      modelValue: _ctx.formData.type
    }),
    aj: common_vendor.p({
      name: "type",
      label: "\u5B89\u88C5\u5305\u7C7B\u578B"
    }),
    ak: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    al: common_vendor.o((...args) => $options.back && $options.back(...args)),
    am: common_vendor.sr("form", "289f2390-0"),
    an: common_vendor.p({
      value: _ctx.formData,
      validateTrigger: "bind",
      labelWidth: _ctx.labelWidth
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-upgrade-center/pages/version/add.vue"]]);
wx.createPage(MiniProgramPage);
