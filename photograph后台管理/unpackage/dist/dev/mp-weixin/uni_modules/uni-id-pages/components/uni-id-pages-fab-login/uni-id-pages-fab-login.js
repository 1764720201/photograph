"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_config = require("../../config.js");
const uni_modules_uniIdPages_common_store = require("../../common/store.js");
const db = common_vendor.ws.database();
db.collection("uni-id-users");
const _sfc_main = {
  computed: {
    agreements() {
      if (!uni_modules_uniIdPages_config.config.agreements) {
        return [];
      }
      let {
        serviceUrl,
        privacyUrl
      } = uni_modules_uniIdPages_config.config.agreements;
      return [
        {
          url: serviceUrl,
          title: "\u7528\u6237\u670D\u52A1\u534F\u8BAE"
        },
        {
          url: privacyUrl,
          title: "\u9690\u79C1\u653F\u7B56\u6761\u6B3E"
        }
      ];
    },
    agree: {
      get() {
        return this.getParentComponent().agree;
      },
      set(agree) {
        console.log("setAgree", agree);
        return this.getParentComponent().agree = agree;
      }
    }
  },
  data() {
    return {
      servicesList: [
        {
          "id": "username",
          "text": "\u8D26\u53F7\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/user.png",
          "path": "/uni_modules/uni-id-pages/pages/login/login-withpwd"
        },
        {
          "id": "smsCode",
          "text": "\u77ED\u4FE1\u9A8C\u8BC1\u7801",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/sms.png",
          "path": "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=smsCode"
        },
        {
          "id": "weixin",
          "text": "\u5FAE\u4FE1\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/weixin.png"
        },
        {
          "id": "apple",
          "text": "\u82F9\u679C\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/apple.png"
        },
        {
          "id": "univerify",
          "text": "\u4E00\u952E\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/univerify.png"
        },
        {
          "id": "taobao",
          "text": "\u6DD8\u5B9D\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/taobao.png"
        },
        {
          "id": "facebook",
          "text": "\u8138\u4E66\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/facebook.png"
        },
        {
          "id": "alipay",
          "text": "\u652F\u4ED8\u5B9D\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/alipay.png"
        },
        {
          "id": "qq",
          "text": "QQ\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/qq.png"
        },
        {
          "id": "google",
          "text": "\u8C37\u6B4C\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/google.png"
        },
        {
          "id": "douyin",
          "text": "\u6296\u97F3\u767B\u5F55",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/douyin.png"
        },
        {
          "id": "sinaweibo",
          "text": "\u65B0\u6D6A\u5FAE\u535A",
          "logo": "/uni_modules/uni-id-pages/static/uni-fab-login/sinaweibo.png"
        }
      ],
      univerifyStyle: {
        "fullScreen": true,
        "backgroundColor": "#ffffff",
        "buttons": {
          "iconWidth": "45px",
          "list": []
        },
        "privacyTerms": {
          "defaultCheckBoxState": false,
          "textColor": "#BBBBBB",
          "termsColor": "#5496E3",
          "prefix": "\u6211\u5DF2\u9605\u8BFB\u5E76\u540C\u610F",
          "suffix": "\u5E76\u4F7F\u7528\u672C\u673A\u53F7\u7801\u767B\u5F55",
          "privacyItems": []
        }
      }
    };
  },
  watch: {
    agree(agree) {
      this.univerifyStyle.privacyTerms.defaultCheckBoxState = agree;
    }
  },
  async created() {
    let servicesList = this.servicesList;
    let loginTypes = uni_modules_uniIdPages_config.config.loginTypes;
    servicesList = servicesList.filter((item) => {
      if (item.id == "apple") {
        return false;
      }
      return loginTypes.includes(item.id);
    });
    if (loginTypes.includes("univerify")) {
      this.univerifyStyle.privacyTerms.privacyItems = this.agreements;
      servicesList.forEach(({
        id,
        logo,
        path
      }) => {
        if (id != "univerify") {
          this.univerifyStyle.buttons.list.push({
            "iconPath": logo,
            "provider": id,
            path
          });
        }
      });
    }
    this.servicesList = servicesList.filter((item) => {
      let path = item.path ? item.path.split("?")[0] : "";
      return path != this.getRoute(1);
    });
  },
  methods: {
    getParentComponent() {
      return this.$parent;
    },
    setUserInfo(e) {
      console.log("setUserInfo", e);
    },
    getRoute(n = 0) {
      let pages = getCurrentPages();
      if (n > pages.length) {
        return "";
      }
      return "/" + pages[pages.length - n].route;
    },
    navigateTo(path) {
      if (this.getRoute(1) == path.split("?")[0] && this.getRoute(1) == "/uni_modules/uni-id-pages/pages/login/login-withoutpwd") {
        let type = path.split("?")[1].split("=")[1];
        common_vendor.index.$emit("uni-id-pages-set-login-type", type);
      } else if (this.getRoute(2) == path) {
        common_vendor.index.navigateBack();
      } else if (this.getRoute(1) != path) {
        common_vendor.index.navigateTo({
          url: path,
          animationType: "slide-in-left",
          complete(e) {
          }
        });
      } else {
        console.log("\u51FA\u4E4E\u610F\u6599\u7684\u60C5\u51B5,path\uFF1A" + path);
      }
    },
    async login_before(type, navigateBack = true) {
      var _a, _b;
      console.log(type);
      if ([
        "qq",
        "xiaomi",
        "sinaweibo",
        "taobao",
        "facebook",
        "google",
        "alipay",
        "douyin"
      ].includes(type)) {
        return common_vendor.index.showToast({
          title: "\u8BE5\u767B\u5F55\u65B9\u5F0F\u6682\u672A\u5B9E\u73B0\uFF0C\u6B22\u8FCE\u63D0\u4EA4pr",
          icon: "none"
        });
      }
      if (["univerify", "apple"].includes(type)) {
        return common_vendor.index.showToast({
          title: "\u5F53\u524D\u8BBE\u5907\u4E0D\u652F\u6301\u6B64\u767B\u5F55\uFF0C\u8BF7\u9009\u62E9\u5176\u4ED6\u767B\u5F55\u65B9\u5F0F",
          icon: "none"
        });
      }
      console.log(type, this.agree);
      let needAgreements = (((_b = (_a = uni_modules_uniIdPages_config.config) == null ? void 0 : _a.agreements) == null ? void 0 : _b.scope) || []).includes("register");
      console.log({
        needAgreements
      });
      if (type != "univerify" && needAgreements && !this.agree) {
        let agreementsRef = this.getParentComponent().$refs.agreements;
        return agreementsRef.popup(() => {
          console.log(type, navigateBack);
          this.login_before(type, navigateBack);
        });
      }
      common_vendor.index.showLoading({
        mask: true
      });
      if (type == "univerify") {
        let closeUniverify = function() {
          common_vendor.index.hideLoading();
          univerifyManager.close();
          univerifyManager.offButtonsClick(onButtonsClickFn);
        };
        let univerifyManager = common_vendor.index.getUniverifyManager();
        let onButtonsClickFn = async (res) => {
          console.log("\u70B9\u51FB\u4E86\u7B2C\u4E09\u65B9\u767B\u5F55\uFF0Cprovider\uFF1A", res, res.provider, this.univerifyStyle.buttons.list);
          let agree = (await common_vendor.index.getCheckBoxState())[1].state;
          this.agree = agree;
          let {
            path
          } = this.univerifyStyle.buttons.list[res.index];
          if (path) {
            this.navigateTo(path);
            closeUniverify();
          } else {
            if (agree) {
              closeUniverify();
              setTimeout(() => {
                this.login_before(res.provider);
              }, 500);
            } else {
              common_vendor.index.showToast({
                title: "\u4F60\u672A\u540C\u610F\u9690\u79C1\u653F\u7B56\u534F\u8BAE",
                icon: "none"
              });
            }
          }
        };
        univerifyManager.onButtonsClick(onButtonsClickFn);
        return univerifyManager.login({
          "univerifyStyle": this.univerifyStyle,
          success: (res) => {
            console.log("login success", res);
            this.login(res.authResult, "univerify");
          },
          fail(err) {
            common_vendor.index.showToast({
              title: JSON.stringify(err),
              icon: "none"
            });
          },
          complete: async (e) => {
            console.log(e);
            common_vendor.index.hideLoading();
            this.agree = (await common_vendor.index.getCheckBoxState())[1].state;
            univerifyManager.offButtonsClick(onButtonsClickFn);
          }
        });
      }
      common_vendor.index.login({
        "provider": type,
        "onlyAuthorize": true,
        success: async (e) => {
          console.log(e);
          if (type == "apple") {
            let res = await this.getUserInfo({
              provider: "apple"
            });
            Object.assign(e.authResult, res.userInfo);
            common_vendor.index.hideLoading();
          }
          this.login(type == "weixin" ? {
            code: e.code
          } : e.authResult, type);
        },
        fail: async (err) => {
          console.log(err);
          common_vendor.index.hideLoading();
        }
      });
    },
    login(params, type) {
      console.log("\u6267\u884C\u767B\u5F55\u5F00\u59CB----");
      console.log({
        params,
        type
      });
      let action = "loginBy" + type.trim().toLowerCase().replace(type[0], type[0].toUpperCase());
      const uniIdCo = common_vendor.ws.importObject("uni-id-co", {
        customUI: true
      });
      uniIdCo[action](params).then((result) => {
        console.log("login-result", result);
        common_vendor.index.showToast({
          title: "\u767B\u5F55\u6210\u529F",
          icon: "none"
        });
        if (type == "weixin" && result.type == "register") {
          uni_modules_uniIdPages_common_store.mutations.loginSuccess({
            ...result,
            showToast: false,
            autoBack: false
          });
          return this.$refs.userProfile.open(result.uid);
        }
        uni_modules_uniIdPages_common_store.mutations.loginSuccess(result);
      }).catch((e) => {
        console.log(e);
        common_vendor.index.showModal({
          content: e.message,
          confirmText: "\u77E5\u9053\u4E86",
          showCancel: false
        });
      }).finally((e) => {
        if (type == "univerify") {
          common_vendor.index.closeAuthView();
        }
        common_vendor.index.hideLoading();
      });
    },
    doUserProfileNext() {
      try {
        uni_modules_uniIdPages_common_store.mutations.loginSuccess();
      } catch (e) {
        console.log(e);
      }
    },
    async getUserInfo(e) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getUserInfo({
          ...e,
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.showModal({
              content: JSON.stringify(err),
              showCancel: false
            });
            reject(err);
          }
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_id_pages_user_profile2 = common_vendor.resolveComponent("uni-id-pages-user-profile");
  _easycom_uni_id_pages_user_profile2();
}
const _easycom_uni_id_pages_user_profile = () => "../uni-id-pages-user-profile/uni-id-pages-user-profile.js";
if (!Math) {
  _easycom_uni_id_pages_user_profile();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.servicesList, (item, index, i0) => {
      return {
        a: item.logo,
        b: common_vendor.t(item.text),
        c: index,
        d: common_vendor.o(($event) => item.path ? $options.navigateTo(item.path) : $options.login_before(item.id, false), index)
      };
    }),
    b: common_vendor.sr("userProfile", "1bee0d21-0"),
    c: common_vendor.o($options.doUserProfileNext)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue"]]);
wx.createComponent(Component);
