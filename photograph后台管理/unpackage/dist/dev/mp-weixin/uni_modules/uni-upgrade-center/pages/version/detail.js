"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin = require("../mixin/version_add_detail_mixin.js");
const uni_modules_uniUpgradeCenter_pages_utils = require("../utils.js");
require("../../../../js_sdk/validator/opendb-app-versions.js");
const db = common_vendor.ws.database();
db.command;
const dbCollectionName = uni_modules_uniUpgradeCenter_pages_utils.appVersionListDbName;
const _sfc_main = {
  mixins: [uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.addAndDetail],
  data() {
    return {
      showStableInfo: false,
      isStable: true,
      originalData: {},
      detailsState: true
    };
  },
  async onLoad(e) {
    const id = e.id;
    this.formDataId = id;
    await this.getDetail(id);
    this.isStable = this.formData.stable_publish;
    this.latestStableData = await this.getLatestVersion();
    if (this.isWGT) {
      this.rules.min_uni_version.rules.push({
        "required": true
      });
    }
  },
  methods: {
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate(["store_list"]).then((res) => {
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
      const collectionDB = db.collection(dbCollectionName);
      collectionDB.doc(this.formDataId).update(value).then(async (res) => {
        if (!this.isStable && value.stable_publish === true && this.latestStableData) {
          await collectionDB.doc(this.latestStableData._id).update({
            stable_publish: false
          });
        }
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
      return db.collection(dbCollectionName).doc(id).field(uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.fields).get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          this.formData = data;
          this.originalData = uni_modules_uniUpgradeCenter_pages_utils.deepClone(this.formData);
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
    deletePackage() {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u662F\u5426\u5220\u9664\u8BE5\u7248\u672C",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              mask: true
            });
            db.collection(dbCollectionName).doc(this.formDataId).remove().then(() => {
              common_vendor.index.showToast({
                title: "\u5220\u9664\u6210\u529F"
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
          }
        }
      });
    },
    async getLatestVersion() {
      const where = {
        appid: this.formData.appid,
        type: this.formData.type,
        stable_publish: true
      };
      if (!this.isWGT) {
        where.platform = this.formData.platform[0];
      }
      const latestStableData = await db.collection(dbCollectionName).where(where).get();
      return latestStableData.result.data.find((item) => item.platform.toString() === this.formData.platform.toString());
    },
    cancelEdit() {
      let content = "";
      !this.isiOS && this.hasPackage ? content += "\n\u5C06\u4F1A\u5220\u9664\u5DF2\u4E0A\u4F20\u7684\u5305" : "";
      common_vendor.index.showModal({
        title: "\u53D6\u6D88\u4FEE\u6539",
        content,
        success: (res) => {
          if (res.confirm) {
            this.formData = uni_modules_uniUpgradeCenter_pages_utils.deepClone(this.originalData);
            this.detailsState = true;
            if (this.hasPackage) {
              let fileList = [];
              fileList.push(this.appFileList.url);
              this.$request("deleteFile", {
                fileList
              }, {
                functionName: "upgrade-center"
              });
            }
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
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_show_info2 + _easycom_uni_file_picker2 + _easycom_uni_card2 + _easycom_uni_dateformat2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_show_info = () => "../../../../components/show-info/show-info.js";
const _easycom_uni_file_picker = () => "../../../uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_card = () => "../../../uni-card/components/uni-card/uni-card.js";
const _easycom_uni_dateformat = () => "../../../uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_show_info + _easycom_uni_file_picker + _easycom_uni_card + _easycom_uni_dateformat + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.type_valuetotext[_ctx.formData.type]),
    b: !$data.isStable
  }, !$data.isStable ? {
    c: common_vendor.o((...args) => $options.deletePackage && $options.deletePackage(...args))
  } : {}, {
    d: common_vendor.o(($event) => _ctx.formData.appid = $event),
    e: common_vendor.p({
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.appid
    }),
    f: common_vendor.p({
      name: "appid",
      label: "AppID",
      required: true
    }),
    g: common_vendor.o(($event) => _ctx.formData.name = $event),
    h: common_vendor.p({
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.name
    }),
    i: common_vendor.p({
      name: "name",
      label: "\u5E94\u7528\u540D\u79F0"
    }),
    j: common_vendor.o(($event) => _ctx.formData.title = $event),
    k: common_vendor.p({
      disabled: $data.detailsState,
      placeholder: "\u66F4\u65B0\u6807\u9898",
      modelValue: _ctx.formData.title
    }),
    l: common_vendor.p({
      name: "title",
      label: "\u66F4\u65B0\u6807\u9898"
    }),
    m: $data.detailsState,
    n: common_vendor.o(($event) => _ctx.binddata("contents", $event.detail.value)),
    o: _ctx.formData.contents,
    p: common_vendor.o((val) => _ctx.formData.contents = val),
    q: common_vendor.p({
      name: "contents",
      label: "\u66F4\u65B0\u5185\u5BB9",
      required: true
    }),
    r: common_vendor.o(($event) => _ctx.formData.platform = $event),
    s: common_vendor.p({
      disabled: true,
      multiple: true,
      localdata: _ctx.platformLocaldata,
      modelValue: _ctx.formData.platform
    }),
    t: common_vendor.p({
      name: "platform",
      label: "\u5E73\u53F0",
      required: true
    }),
    v: common_vendor.o(($event) => _ctx.formData.version = $event),
    w: common_vendor.p({
      disabled: true,
      placeholder: "\u5F53\u524D\u5305\u7248\u672C\u53F7\uFF0C\u5FC5\u987B\u5927\u4E8E\u5F53\u524D\u5DF2\u4E0A\u7EBF\u7248\u672C\u53F7",
      modelValue: _ctx.formData.version
    }),
    x: common_vendor.p({
      name: "version",
      label: "\u7248\u672C\u53F7",
      required: true
    }),
    y: _ctx.isWGT
  }, _ctx.isWGT ? {
    z: common_vendor.o(($event) => _ctx.formData.min_uni_version = $event),
    A: common_vendor.p({
      disabled: $data.detailsState,
      placeholder: "\u539F\u751FApp\u6700\u4F4E\u7248\u672C",
      modelValue: _ctx.formData.min_uni_version
    }),
    B: common_vendor.p({
      content: _ctx.minUniVersionContent
    }),
    C: common_vendor.p({
      name: "min_uni_version",
      label: "\u539F\u751FApp\u6700\u4F4E\u7248\u672C",
      required: _ctx.isWGT
    })
  } : {}, {
    D: !_ctx.isiOS && !$data.detailsState
  }, !_ctx.isiOS && !$data.detailsState ? common_vendor.e({
    E: common_vendor.o((...args) => _ctx.selectFile && _ctx.selectFile(...args)),
    F: common_vendor.o(_ctx.packageUploadSuccess),
    G: common_vendor.o(_ctx.packageDelete),
    H: common_vendor.o(($event) => _ctx.appFileList = $event),
    I: common_vendor.p({
      ["file-extname"]: _ctx.fileExtname,
      disabled: _ctx.hasPackage,
      returnType: "object",
      ["file-mediatype"]: "all",
      limit: "1",
      modelValue: _ctx.appFileList
    }),
    J: _ctx.hasPackage
  }, _ctx.hasPackage ? {
    K: common_vendor.t(Number(_ctx.appFileList.size / 1024 / 1024).toFixed(2))
  } : {}, {
    L: common_vendor.p({
      label: "\u4E0A\u4F20apk\u5305"
    })
  }) : {}, {
    M: common_vendor.o(($event) => _ctx.formData.url = $event),
    N: common_vendor.p({
      disabled: $data.detailsState,
      placeholder: "\u4E0B\u8F7D\u94FE\u63A5",
      maxlength: -1,
      modelValue: _ctx.formData.url
    }),
    O: common_vendor.p({
      name: "url",
      label: _ctx.isiOS ? "AppStore" : "\u4E0B\u8F7D\u94FE\u63A5",
      required: true
    }),
    P: !_ctx.isiOS && !_ctx.isWGT && _ctx.formData.store_list.length
  }, !_ctx.isiOS && !_ctx.isWGT && _ctx.formData.store_list.length ? {
    Q: common_vendor.f(_ctx.formData.store_list, (item, index, i0) => {
      return {
        a: item.enable,
        b: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          item.enable = !!value.length;
        }),
        c: "6a92caec-22-" + i0 + "," + ("6a92caec-21-" + i0),
        d: common_vendor.o(($event) => item.name = $event),
        e: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.name
        }),
        f: "6a92caec-21-" + i0 + "," + ("6a92caec-20-" + i0),
        g: "6a92caec-24-" + i0 + "," + ("6a92caec-23-" + i0),
        h: common_vendor.o(($event) => item.scheme = $event),
        i: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.scheme
        }),
        j: "6a92caec-23-" + i0 + "," + ("6a92caec-20-" + i0),
        k: "6a92caec-26-" + i0 + "," + ("6a92caec-25-" + i0),
        l: common_vendor.o(($event) => item.priority = $event),
        m: common_vendor.p({
          disabled: $data.detailsState,
          type: "number",
          modelValue: item.priority
        }),
        n: "6a92caec-27-" + i0 + "," + ("6a92caec-25-" + i0),
        o: "6a92caec-25-" + i0 + "," + ("6a92caec-20-" + i0),
        p: "6a92caec-20-" + i0 + ",6a92caec-19",
        q: item.id
      };
    }),
    R: $data.detailsState,
    S: common_vendor.p({
      label: "\u5546\u5E97\u540D\u79F0"
    }),
    T: common_vendor.p({
      label: "Scheme"
    }),
    U: common_vendor.p({
      top: -100,
      left: -180,
      content: _ctx.priorityContent
    }),
    V: common_vendor.p({
      label: "\u4F18\u5148\u7EA7"
    }),
    W: common_vendor.p({
      label: "Android\u5E94\u7528\u5E02\u573A",
      name: "store_list",
      labelWidth: "120"
    })
  } : {}, {
    X: _ctx.isWGT
  }, _ctx.isWGT ? {
    Y: $data.detailsState,
    Z: common_vendor.o(($event) => (_ctx.binddata("is_silently", $event.detail.value), _ctx.formData.is_silently = $event.detail.value)),
    aa: _ctx.formData.is_silently,
    ab: common_vendor.p({
      top: -80,
      content: _ctx.silentlyContent
    }),
    ac: common_vendor.p({
      name: "is_silently",
      label: "\u9759\u9ED8\u66F4\u65B0"
    })
  } : {}, {
    ad: !_ctx.isiOS
  }, !_ctx.isiOS ? {
    ae: $data.detailsState,
    af: common_vendor.o(($event) => (_ctx.binddata("is_mandatory", $event.detail.value), _ctx.formData.is_mandatory = $event.detail.value)),
    ag: _ctx.formData.is_mandatory,
    ah: common_vendor.p({
      width: "230",
      top: -30,
      content: _ctx.mandatoryContent
    }),
    ai: common_vendor.p({
      name: "is_mandatory",
      label: "\u5F3A\u5236\u66F4\u65B0"
    })
  } : {}, {
    aj: $data.detailsState || $data.isStable,
    ak: common_vendor.o(($event) => (_ctx.binddata("stable_publish", $event.detail.value), _ctx.formData.stable_publish = $event.detail.value)),
    al: _ctx.formData.stable_publish,
    am: $data.isStable
  }, $data.isStable ? {
    an: common_vendor.p({
      top: -50,
      width: "350",
      content: _ctx.stablePublishContent
    })
  } : {
    ao: common_vendor.p({
      top: -40,
      content: _ctx.stablePublishContent2
    })
  }, {
    ap: common_vendor.p({
      name: "stable_publish",
      label: "\u4E0A\u7EBF\u53D1\u884C"
    }),
    aq: common_vendor.p({
      format: "yyyy-MM-dd hh:mm:ss",
      date: _ctx.formData.create_date,
      threshold: [0, 0]
    }),
    ar: common_vendor.p({
      name: "create_date",
      label: "\u4E0A\u4F20\u65F6\u95F4"
    }),
    as: common_vendor.o(($event) => _ctx.formData.type = $event),
    at: common_vendor.p({
      localdata: _ctx.formOptions.type_localdata,
      modelValue: _ctx.formData.type
    }),
    av: common_vendor.p({
      name: "type",
      label: "\u5B89\u88C5\u5305\u7C7B\u578B"
    }),
    aw: $data.detailsState
  }, $data.detailsState ? {
    ax: common_vendor.o(($event) => $data.detailsState = false)
  } : {}, {
    ay: !$data.detailsState
  }, !$data.detailsState ? {
    az: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  } : {}, {
    aA: !$data.detailsState
  }, !$data.detailsState ? {
    aB: common_vendor.o((...args) => $options.cancelEdit && $options.cancelEdit(...args))
  } : {}, {
    aC: common_vendor.sr("form", "6a92caec-0"),
    aD: common_vendor.p({
      value: _ctx.formData,
      validateTrigger: "bind",
      labelWidth: _ctx.labelWidth
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-upgrade-center/pages/version/detail.vue"]]);
wx.createPage(MiniProgramPage);
