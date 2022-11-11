"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_validator_opendbAppVersions = require("../../../../js_sdk/validator/opendb-app-versions.js");
const platform_iOS = "iOS";
const platform_Android = "Android";
function getValidator(fields2) {
  let reuslt = {};
  for (let key in js_sdk_validator_opendbAppVersions.validator) {
    if (fields2.includes(key)) {
      reuslt[key] = js_sdk_validator_opendbAppVersions.validator[key];
    }
  }
  return reuslt;
}
const fields = "appid,name,title,contents,platform,type,version,min_uni_version,url,stable_publish,is_silently,is_mandatory,create_date,store_list";
const addAndDetail = {
  data() {
    return {
      labelWidth: "80px",
      enableiOSWgt: true,
      silentlyContent: "\u9759\u9ED8\u66F4\u65B0\uFF1AApp\u5347\u7EA7\u65F6\u4F1A\u5728\u540E\u53F0\u4E0B\u8F7Dwgt\u5305\u5E76\u81EA\u884C\u5B89\u88C5\u3002\u65B0\u529F\u80FD\u5728\u4E0B\u6B21\u542F\u52A8App\u65F6\u751F\u6548",
      mandatoryContent: "\u5F3A\u5236\u66F4\u65B0\uFF1AApp\u5347\u7EA7\u5F39\u51FA\u6846\u4E0D\u53EF\u53D6\u6D88",
      stablePublishContent: "\u540C\u65F6\u53EA\u53EF\u6709\u4E00\u4E2A\u7EBF\u4E0A\u53D1\u884C\u7248\uFF0C\u7EBF\u4E0A\u53D1\u884C\u4E0D\u53EF\u66F4\u8BBE\u4E3A\u4E0B\u7EBF\u3002\n\u672A\u4E0A\u7EBF\u53EF\u4EE5\u8BBE\u4E3A\u4E0A\u7EBF\u53D1\u884C\u5E76\u81EA\u52A8\u66FF\u6362\u5F53\u524D\u7EBF\u4E0A\u53D1\u884C\u7248",
      stablePublishContent2: "\u4F7F\u7528\u672C\u5305\u66FF\u6362\u5F53\u524D\u7EBF\u4E0A\u53D1\u884C\u7248",
      uploadFileContent: "\u53EF\u4E0B\u8F7D\u5B89\u88C5\u5305\u5730\u5740\u3002\u4E0A\u4F20\u6587\u4EF6\u5230\u4E91\u5B58\u50A8\u81EA\u52A8\u586B\u5199\uFF0C\u4E5F\u53EF\u4EE5\u624B\u52A8\u586B\u5199",
      minUniVersionContent: "\u4E0A\u6B21\u4F7F\u7528\u65B0Api\u6216\u6253\u5305\u65B0\u6A21\u5757\u7684App\u7248\u672C",
      priorityContent: "\u68C0\u67E5\u66F4\u65B0\u65F6\uFF0C\u6309\u7167\u4F18\u5148\u7EA7\u4ECE\u5927\u5230\u5C0F\u4F9D\u6B21\u5C1D\u8BD5\u8DF3\u8F6C\u5546\u5E97\u3002\u5982\u679C\u90FD\u8DF3\u8F6C\u5931\u8D25\uFF0C\u5219\u4F1A\u6253\u5F00\u6D4F\u89C8\u5668\u4F7F\u7528\u4E0B\u8F7D\u94FE\u63A5\u4E0B\u8F7Dapk\u5B89\u88C5\u5305",
      latestStableData: [],
      appFileList: null,
      type_valuetotext: js_sdk_validator_opendbAppVersions.enumConverter.type_valuetotext,
      preUrl: "",
      formData: {
        "appid": "",
        "name": "",
        "title": "",
        "contents": "",
        "platform": [],
        "store_list": [],
        "type": "",
        "version": "",
        "min_uni_version": "",
        "url": "",
        "stable_publish": false,
        "create_date": null
      },
      formOptions: {
        "platform_localdata": [
          {
            "value": "Android",
            "text": "\u5B89\u5353"
          },
          {
            "value": "iOS",
            "text": "\u82F9\u679C"
          }
        ],
        "type_localdata": [
          {
            "value": "native_app",
            "text": "\u539F\u751FApp\u5B89\u88C5\u5305"
          },
          {
            "value": "wgt",
            "text": "App\u8D44\u6E90\u5305"
          }
        ]
      },
      rules: {
        ...getValidator([
          "appid",
          "contents",
          "platform",
          "type",
          "version",
          "min_uni_version",
          "url",
          "stable_publish",
          "title",
          "name",
          "is_silently",
          "is_mandatory",
          "store_list"
        ])
      }
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  computed: {
    isWGT() {
      return this.formData.type === "wgt";
    },
    isiOS() {
      return !this.isWGT ? this.formData.platform.includes(platform_iOS) : false;
    },
    hasPackage() {
      return this.appFileList && !!Object.keys(this.appFileList).length;
    },
    fileExtname() {
      return this.isWGT ? ["wgt"] : ["apk"];
    },
    platformLocaldata() {
      return !this.isWGT ? this.formOptions.platform_localdata : this.enableiOSWgt ? this.formOptions.platform_localdata : [this.formOptions.platform_localdata[0]];
    },
    uni_platform() {
      return (this.isiOS ? platform_iOS : platform_Android).toLocaleLowerCase();
    }
  },
  methods: {
    packageUploadSuccess(res) {
      common_vendor.index.showToast({
        icon: "success",
        title: "\u4E0A\u4F20\u6210\u529F",
        duration: 800
      });
      this.preUrl = this.formData.url;
      this.formData.url = res.tempFilePaths[0];
    },
    async packageDelete(res) {
      if (!this.hasPackage)
        return;
      let [deleteRes] = await this.$request("deleteFile", {
        fileList: [res.tempFilePath]
      }, {
        functionName: "uni-app-manager"
      });
      if (deleteRes.success) {
        common_vendor.index.showToast({
          icon: "success",
          title: "\u5220\u9664\u6210\u529F",
          duration: 800
        });
        this.formData.url = this.preUrl;
        this.$refs.form.clearValidate("url");
      }
    },
    selectFile() {
      if (this.hasPackage) {
        common_vendor.index.showToast({
          icon: "none",
          title: "\u53EA\u53EF\u4E0A\u4F20\u4E00\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u5220\u9664\u5DF2\u4E0A\u4F20\u540E\u91CD\u8BD5",
          duration: 1e3
        });
      }
    },
    createCenterRecord(value) {
      return {
        ...value,
        uni_platform: this.uni_platform,
        create_env: "upgrade-center"
      };
    },
    createCenterQuery({
      appid
    }) {
      return {
        appid,
        create_env: "upgrade-center"
      };
    },
    createStatQuery({
      appid,
      type,
      version,
      uni_platform
    }) {
      return {
        appid,
        type,
        version,
        uni_platform: uni_platform ? uni_platform : this.uni_platform,
        create_env: "uni-stat",
        stable_publish: false
      };
    }
  }
};
exports.addAndDetail = addAndDetail;
exports.fields = fields;
