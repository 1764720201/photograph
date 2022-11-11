"use strict";
const common_vendor = require("../../common/vendor.js");
const uniSmsCo = common_vendor.ws.importObject("uni-sms-co");
const _sfc_main = {
  name: "batchSms",
  props: {
    toType: String,
    receiver: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      smsdDataFieldSelect: [
        { value: "static", text: "\u9759\u6001\u6570\u636E" },
        { value: "dynamic", text: "\u52A8\u6001\u6570\u636E" }
      ],
      smsTemplateDataErrorMessage: "",
      smsDataModel: {
        name: "",
        templateId: "",
        templateData: []
      },
      smsTemplateContent: "",
      smsPreviewContent: []
    };
  },
  computed: {
    isSelectedReceiver() {
      return !!this.receiver.length;
    },
    sendAll() {
      return !this.isSelectedReceiver || this.toType === "userTags";
    }
  },
  watch: {
    smsDataModel: {
      handler(smsDataModel) {
        if (!smsDataModel.templateId)
          return "";
        const template = this.$refs.template_db.dataList.find((template2) => template2.value === smsDataModel.templateId);
        let content = smsDataModel.templateData.reduce((res, param) => {
          const reg = new RegExp(`\\$\\{${param.field}\\}`);
          return res.replace(reg, ($1) => param.value || $1);
        }, template.content);
        this.smsTemplateContent = `\u3010${template.sign}\u3011${content}`;
      },
      deep: true
    }
  },
  methods: {
    popupChange(e) {
      if (!e.show)
        this.reset();
    },
    open() {
      this.$refs.smsPopup.open();
    },
    close() {
      this.reset();
      this.$refs.smsPopup.close();
    },
    onSmsTemplateSelected(templateId) {
      const current = this.$refs.template_db.dataList.find((template) => template.value === templateId);
      if (!current)
        return;
      const reg = new RegExp(/\$\{(.*?)\}/g);
      let templateVars = [];
      let _execResult;
      while (_execResult = reg.exec(current.content)) {
        const param = _execResult[1];
        if (param) {
          templateVars.push({
            field: param,
            value: ""
          });
        }
      }
      this.smsDataModel.templateData = templateVars;
    },
    async sendSms(isPreview = false) {
      const values = await this.$refs.smsForm.validate();
      const receiver = this.receiver;
      for (const template of this.smsDataModel.templateData) {
        if (!template.value) {
          this.smsTemplateDataErrorMessage = "\u5B57\u6BB5/\u503C\u4E0D\u53EF\u4E3A\u7A7A";
          return;
        }
      }
      this.smsTemplateDataErrorMessage = "";
      if (isPreview) {
        const res = await uniSmsCo.preview(
          {
            all: this.sendAll,
            type: this.toType,
            receiver
          },
          values.templateId,
          this.smsDataModel.templateData
        );
        if (res.errCode === 0) {
          this.smsPreviewContent = res.list;
          this.$refs.previewPopup.open();
          return;
        }
      }
      common_vendor.index.showModal({
        title: "\u53D1\u9001\u786E\u8BA4",
        content: `\u77ED\u4FE1${this.sendAll ? "\u5C06\u53D1\u9001\u7ED9\u6240\u6709\u7528\u6237" : `\u9884\u8BA1\u53D1\u9001${this.receiver.length}\u4EBA`}\uFF0C\u786E\u5B9A\u53D1\u9001\uFF1F`,
        success: async (e) => {
          if (e.cancel)
            return;
          const res = await uniSmsCo.createSmsTask(
            {
              all: this.sendAll,
              type: this.toType,
              receiver
            },
            values.templateId,
            this.smsDataModel.templateData,
            {
              taskName: values.name
            }
          );
          if (res.taskId) {
            common_vendor.index.showModal({
              content: "\u77ED\u4FE1\u4EFB\u52A1\u5DF2\u63D0\u4EA4\uFF0C\u60A8\u53EF\u5728DCloud\u5F00\u53D1\u8005\u540E\u53F0\u67E5\u770B\u77ED\u4FE1\u53D1\u9001\u8BB0\u5F55",
              confirmText: "\u7ACB\u5373\u67E5\u770B",
              cancelText: "\u5173\u95ED",
              success: (e2) => {
                if (e2.cancel) {
                  this.reset();
                  this.$refs.smsPopup.close();
                } else {
                  this.reset();
                  this.$refs.smsPopup.close();
                }
              }
            });
          }
        }
      });
    },
    chooseFile() {
      if (typeof window.FileReader === "undefined") {
        common_vendor.index.showModal({
          content: "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u6587\u4EF6\u4E0A\u4F20\uFF0C\u8BF7\u5347\u7EA7\u6D4F\u89C8\u5668\u91CD\u8BD5",
          showCancel: false
        });
        return;
      }
      common_vendor.index.chooseFile({
        count: 1,
        extension: [".json"],
        success: ({ tempFiles }) => {
          if (tempFiles.length <= 0)
            return;
          const [file] = tempFiles;
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => this.parserFileJson(null, reader.result);
          reader.onerror = () => this.parserFileJson(reader.error);
        },
        fail: () => {
          common_vendor.index.showModal({
            content: "\u6253\u5F00\u9009\u62E9\u6587\u4EF6\u6846\u5931\u8D25",
            showCancel: false
          });
        }
      });
    },
    async parserFileJson(error, fileContent) {
      if (error) {
        console.error(error);
        common_vendor.index.showModal({
          content: "\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20\u6587\u4EF6",
          showCancel: false
        });
        return;
      }
      let templates = [];
      try {
        templates = JSON.parse(fileContent);
      } catch (e) {
        console.error(e);
        common_vendor.index.showModal({
          content: "\u77ED\u4FE1\u6A21\u677F\u89E3\u6790\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6A21\u677F\u683C\u5F0F",
          showCancel: false
        });
        return;
      }
      const res = await uniSmsCo.updateTemplates(templates);
      if (res.errCode === 0) {
        common_vendor.index.showModal({
          content: "\u77ED\u4FE1\u6A21\u677F\u66F4\u65B0\u6210\u529F",
          showCancel: false,
          success: () => {
            this.$refs.template_db.refresh();
          }
        });
      }
    },
    reset() {
      this.smsDataModel.name = "";
      this.smsDataModel.templateId = "";
      this.smsDataModel.templateData = [];
      this.smsPreviewContent = [];
      this.smsTemplateContent = "";
    }
  }
};
if (!Array) {
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_forms_item2 + _easycom_uni_easyinput2 + _easycom_uni_data_select2 + _easycom_unicloud_db2 + _easycom_uni_forms2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_unicloud_db = () => "../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_forms_item + _easycom_uni_easyinput + _easycom_uni_data_select + _easycom_unicloud_db + _easycom_uni_forms + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.toType === "user"
  }, $props.toType === "user" ? common_vendor.e({
    b: $options.isSelectedReceiver
  }, $options.isSelectedReceiver ? {
    c: common_vendor.t($props.receiver.length)
  } : {}, {
    d: common_vendor.p({
      label: "\u76EE\u6807\u5BF9\u8C61"
    })
  }) : {
    e: common_vendor.t($props.receiver.length),
    f: common_vendor.p({
      label: "\u76EE\u6807\u5BF9\u8C61"
    })
  }, {
    g: common_vendor.o(($event) => $data.smsDataModel.name = $event),
    h: common_vendor.p({
      placeholder: "\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0\uFF0C\u4F8B\u5982 \u201C\u653E\u5047\u901A\u77E5\u201D",
      modelValue: $data.smsDataModel.name
    }),
    i: common_vendor.p({
      label: "\u4EFB\u52A1\u540D\u79F0",
      name: "name",
      required: true,
      rules: [{
        required: true,
        errorMessage: "\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0"
      }]
    }),
    j: common_vendor.w(({
      data,
      loading
    }, s0, i0) => {
      return common_vendor.e({
        a: !loading
      }, !loading ? common_vendor.e({
        b: data.length
      }, data.length ? {
        c: common_vendor.o($options.onSmsTemplateSelected),
        d: "1875345c-8-" + i0 + ",1875345c-7",
        e: common_vendor.o(($event) => $data.smsDataModel.templateId = $event),
        f: common_vendor.p({
          placeholder: "\u8BF7\u9009\u62E9\u77ED\u4FE1\u6A21\u677F",
          size: "mini",
          clear: false,
          localdata: data,
          modelValue: $data.smsDataModel.templateId
        }),
        g: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
      } : {
        h: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
      }) : {}, {
        i: i0,
        j: s0
      });
    }, {
      name: "d",
      path: "j",
      vueId: "1875345c-7,1875345c-6"
    }),
    k: common_vendor.sr("template_db", "1875345c-7,1875345c-6"),
    l: common_vendor.p({
      collection: "batch-sms-template",
      field: "_id as value,name as text,sign,content"
    }),
    m: common_vendor.p({
      required: true,
      label: "\u77ED\u4FE1\u6A21\u677F",
      name: "templateId",
      rules: [{
        required: true,
        errorMessage: "\u8BF7\u9009\u62E9\u77ED\u4FE1\u6A21\u677F"
      }]
    }),
    n: $data.smsTemplateContent
  }, $data.smsTemplateContent ? {
    o: common_vendor.t($data.smsTemplateContent),
    p: common_vendor.p({
      label: "\u77ED\u4FE1\u5185\u5BB9"
    })
  } : {}, {
    q: $data.smsDataModel.templateData.length
  }, $data.smsDataModel.templateData.length ? {
    r: common_vendor.f($data.smsDataModel.templateData, (template, index, i0) => {
      return {
        a: "1875345c-11-" + i0 + ",1875345c-10",
        b: common_vendor.o(($event) => template.field = $event),
        c: common_vendor.p({
          placeholder: "\u5B57\u6BB5",
          clearable: false,
          disabled: true,
          modelValue: template.field
        }),
        d: "1875345c-12-" + i0 + ",1875345c-10",
        e: common_vendor.o(($event) => template.value = $event),
        f: common_vendor.p({
          placeholder: "\u4F8B {uni-id-users.username}",
          clearable: false,
          modelValue: template.value
        }),
        g: template.field
      };
    }),
    s: common_vendor.p({
      label: "\u6A21\u677F\u53D8\u91CF\u914D\u7F6E",
      ["error-message"]: $data.smsTemplateDataErrorMessage
    })
  } : {}, {
    t: common_vendor.sr("smsForm", "1875345c-1,1875345c-0"),
    v: common_vendor.p({
      ["label-width"]: 100,
      modelValue: $data.smsDataModel
    }),
    w: common_vendor.o(($event) => $options.sendSms(true)),
    x: common_vendor.o(($event) => $options.sendSms()),
    y: common_vendor.o($options.close),
    z: common_vendor.p({
      type: "closeempty",
      size: "24"
    }),
    A: common_vendor.sr("smsPopup", "1875345c-0"),
    B: common_vendor.o($options.popupChange),
    C: common_vendor.p({
      type: "center",
      ["is-mask-click"]: false
    }),
    D: common_vendor.f($data.smsPreviewContent, (content, k0, i0) => {
      return {
        a: common_vendor.t(content)
      };
    }),
    E: common_vendor.t($data.smsPreviewContent.length ? $data.smsPreviewContent[0].length : 0),
    F: common_vendor.o(($event) => _ctx.$refs.previewPopup.close()),
    G: common_vendor.sr("previewPopup", "1875345c-14"),
    H: common_vendor.p({
      type: "center",
      ["is-mask-click"]: false
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/components/batch-sms/batch-sms.vue"]]);
wx.createComponent(Component);
