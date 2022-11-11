"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_validator_opendbAppList = require("../../../../js_sdk/validator/opendb-app-list.js");
const formatFilePickerValue = (url) => url ? {
  "name": "",
  "extname": "",
  "url": url
} : {};
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_opendbAppList.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_opendbAppList.validator[key];
    }
  }
  return result;
}
const schemes = ["mimarket", "samsungapps", "appmarket", "oppomarket", "vivomarket"];
const schemeBrand = ["xiaomi", "samsung", "huawei", "oppo", "vivo"];
const mixin = {
  data() {
    let formData = {
      "appid": "",
      "name": "",
      "icon_url": "",
      "introduction": "",
      "alias": "",
      "description": "",
      "screenshot": [],
      "store_list": [],
      "app_android": {},
      "app_ios": {},
      "mp_weixin": {},
      "mp_alipay": {},
      "mp_baidu": {},
      "mp_toutiao": {},
      "mp_qq": {},
      "mp_lark": {},
      "mp_kuaishou": {},
      "mp_dingtalk": {},
      "mp_jd": {},
      "h5": {},
      "quickapp": {}
    };
    const data = {
      formData,
      rules: Object.freeze(getValidator(Object.keys(formData))),
      mpPlatform: Object.freeze(js_sdk_validator_opendbAppList.mpPlatform),
      screenshotList: [],
      middleware_img: {},
      middleware_checkbox: {},
      appPackageInfo: {},
      appPlatformKeys: Object.freeze(["app_ios", "app_android"]),
      appPlatformValues: Object.freeze({
        app_android: "Android",
        app_ios: "iOS"
      }),
      keepItems: Object.freeze([]),
      isEdit: false,
      deletedStore: []
    };
    const mpKeys = Object.keys(js_sdk_validator_opendbAppList.mpPlatform);
    data.mpPlatformKeys = Object.freeze(mpKeys);
    [].concat(mpKeys, ["icon_url", "quickapp"]).forEach((key) => data.middleware_img[key] = {});
    data.platFormKeys = Object.freeze([].concat(mpKeys, data.appPlatformKeys));
    data.platFormKeys.forEach((key) => data.middleware_checkbox[key] = false);
    return data;
  },
  methods: {
    requestCloudFunction(functionName, params = {}) {
      return this.$request(functionName, params, {
        functionName: "uni-upgrade-center"
      });
    },
    hasValue(value) {
      if (typeof value !== "object")
        return !!value;
      if (value instanceof Array)
        return !!value.length;
      return !!(value && Object.keys(value).length);
    },
    initFormData(obj) {
      if (!obj || !Object.keys(obj).length)
        return;
      for (let key in obj) {
        const value = obj[key];
        switch (key) {
          case "icon_url":
            this.middleware_img[key] = formatFilePickerValue(value);
            break;
          case "screenshot":
            this.screenshotList = value.map((item) => formatFilePickerValue(item));
            break;
          default:
            if ((key.indexOf("mp") !== -1 || key.indexOf("app") !== -1) && this.hasValue(value)) {
              this.setPlatformChcekbox(key, true);
              if (value.qrcode_url)
                this.middleware_img[key] = formatFilePickerValue(value.qrcode_url);
            }
            break;
        }
        this.setFormData(key, value);
      }
    },
    setFormData(key, value) {
      const keys = key.indexOf(".") !== -1 ? key.split(".") : [key];
      const lens = keys.length - 1;
      let tempObj = this.formData;
      keys.forEach((key2, index) => {
        const obj = tempObj[key2];
        if (typeof obj === "object" && index < lens) {
          tempObj = obj;
        } else {
          tempObj[key2] = value;
        }
      });
    },
    getFormData(key) {
      const keys = key.indexOf(".") !== -1 ? key.split(".") : [key];
      keys.length - 1;
      let tempObj = this.formData;
      for (let i = 0; i < keys.length; i++) {
        const key2 = keys[i];
        tempObj = tempObj[key2];
        if (tempObj == null) {
          return false;
        }
      }
      return tempObj;
    },
    formatFormData() {
      this.setFormData("screenshot", this.screenshotList.map((item) => item.fileID || item.url));
      for (let i = 0; i < this.formData.store_list.length; i++) {
        const item = this.formData.store_list[i];
        if (item.scheme.trim().length === 0) {
          this.formData.store_list.splice(i, 1);
          i--;
          continue;
        }
        const index = schemes.indexOf((item.scheme.match(/(.*):\/\//) || [])[1]);
        if (index !== -1) {
          if (item.id !== schemeBrand[index]) {
            this.deletedStore.push(item.id);
          }
          item.id = schemeBrand[index];
        }
        item.priority = parseFloat(item.priority);
      }
      this.keepItems = this.platFormKeys.filter(
        (key) => this.getPlatformChcekbox(key) && (this.formData[key].url || this.formData[key].qrcode_url)
      ).concat(["icon_url", "screenshot", "create_date", "store_list"]);
      if (this.formData.h5 && this.formData.h5.url)
        this.keepItems.push("h5");
    },
    autoFill() {
      const appid = this.getFormData("appid");
      if (!appid) {
        return;
      }
      common_vendor.index.showLoading({
        mask: true
      });
      this.requestCloudFunction("getAppInfo", {
        appid
      }).then((res) => {
        if (res.success) {
          this.setFormData("description", res.description);
          this.setFormData("name", res.name);
          return;
        }
      }).catch((e) => {
        console.error(e);
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    autoFillApp() {
      const appid = this.getFormData("appid");
      if (!appid) {
        return;
      }
      this.appPlatformKeys.forEach((key) => {
        this.fetchAppInfo(appid, this.appPlatformValues[key]).then((res) => {
          if (res && res.success) {
            this.setPlatformChcekbox(key, true);
            this.setFormData(key, {
              name: res.name,
              url: res.url
            });
            return;
          }
        });
      });
    },
    fetchAppInfo(appid, platform) {
      common_vendor.index.showLoading({
        mask: true
      });
      return this.requestCloudFunction("getAppVersionInfo", {
        appid,
        platform
      }).then((res) => {
        return res;
      }).catch((e) => {
        console.error(e);
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    iconUrlSuccess(res, key) {
      common_vendor.index.showToast({
        icon: "success",
        title: "\u4E0A\u4F20\u6210\u529F",
        duration: 500
      });
      this.setFormData(key, res.tempFilePaths[0]);
    },
    async iconUrlDelete(res, key) {
      let deleteRes = await this.requestCloudFunction("deleteFile", {
        fileList: [res.tempFile.fileID || res.tempFile.url]
      });
      deleteRes.fileList ? deleteRes = deleteRes.fileList[0] : deleteRes = deleteRes[0];
      if (deleteRes.success || deleteRes.code === "SUCCESS") {
        common_vendor.index.showToast({
          icon: "success",
          title: "\u5220\u9664\u6210\u529F",
          duration: 800
        });
        if (!key)
          return;
        this.setFormData(key, "");
        this.$refs.form.clearValidate(key);
      }
    },
    getPlatformChcekbox(mp_name) {
      return this.middleware_checkbox[mp_name];
    },
    setPlatformChcekbox(mp_name, value = false) {
      this.middleware_checkbox[mp_name] = value;
    },
    selectFile() {
      if (this.hasPackage) {
        common_vendor.index.showToast({
          icon: "none",
          title: "\u53EA\u53EF\u4E0A\u4F20\u4E00\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u5220\u9664\u5DF2\u4E0A\u4F20\u540E\u91CD\u8BD5",
          duration: 1e3
        });
      }
    }
  },
  computed: {
    hasPackage() {
      return this.appPackageInfo && !!Object.keys(this.appPackageInfo).length;
    }
  }
};
exports.mixin = mixin;
