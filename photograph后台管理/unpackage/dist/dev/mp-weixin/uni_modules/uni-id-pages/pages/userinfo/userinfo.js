"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../common/store.js");
const db = common_vendor.ws.database();
db.collection("uni-id-users");
const uniIdCo = common_vendor.ws.importObject("uni-id-co");
const _sfc_main = {
  computed: {
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo;
    }
  },
  data() {
    return {
      univerifyStyle: {
        authButton: {
          "title": "\u672C\u673A\u53F7\u7801\u4E00\u952E\u7ED1\u5B9A"
        },
        otherLoginButton: {
          "title": "\u5176\u4ED6\u53F7\u7801\u7ED1\u5B9A"
        }
      },
      hasPwd: false,
      showLoginManage: false
    };
  },
  async onShow() {
    this.univerifyStyle.authButton.title = "\u672C\u673A\u53F7\u7801\u4E00\u952E\u7ED1\u5B9A";
    this.univerifyStyle.otherLoginButton.title = "\u5176\u4ED6\u53F7\u7801\u7ED1\u5B9A";
  },
  async onLoad(e) {
    if (e.showLoginManage) {
      this.showLoginManage = true;
    }
    let res = await uniIdCo.getAccountInfo();
    this.hasPwd = res.isPasswordSet;
  },
  methods: {
    login() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd",
        complete: (e) => {
          console.log(e);
        }
      });
    },
    logout() {
      uni_modules_uniIdPages_common_store.mutations.logout();
    },
    bindMobileSuccess() {
      uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
    },
    changePassword() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
        complete: (e) => {
          console.log(e);
        }
      });
    },
    bindMobile() {
      this.$refs["bind-mobile-by-sms"].open();
    },
    univerify() {
      common_vendor.index.login({
        "provider": "univerify",
        "univerifyStyle": this.univerifyStyle,
        success: async (e) => {
          console.log(e.authResult);
          uniIdCo.bindMobileByUniverify(e.authResult).then((res) => {
            console.log(res);
            uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
          }).catch((e2) => {
            console.log(e2);
          }).finally((e2) => {
            console.log(e2);
            common_vendor.index.closeAuthView();
          });
        },
        fail: (err) => {
          console.log(err);
          if (err.code == "30002" || err.code == "30001") {
            this.bindMobileBySmsCode();
          }
        }
      });
    },
    bindMobileBySmsCode() {
      common_vendor.index.navigateTo({
        url: "./bind-mobile/bind-mobile"
      });
    },
    setNickname(nickname) {
      console.log(nickname);
      if (nickname) {
        uni_modules_uniIdPages_common_store.mutations.updateUserInfo({ nickname });
        this.$refs.dialog.close();
      } else {
        this.$refs.dialog.open();
      }
    },
    deactivate() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_id_pages_avatar2 = common_vendor.resolveComponent("uni-id-pages-avatar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_id_pages_bind_mobile2 = common_vendor.resolveComponent("uni-id-pages-bind-mobile");
  (_easycom_uni_id_pages_avatar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_id_pages_bind_mobile2)();
}
const _easycom_uni_id_pages_avatar = () => "../../components/uni-id-pages-avatar/uni-id-pages-avatar.js";
const _easycom_uni_list_item = () => "../../../uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni-list/components/uni-list/uni-list.js";
const _easycom_uni_popup_dialog = () => "../../../uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_id_pages_bind_mobile = () => "../../components/uni-id-pages-bind-mobile/uni-id-pages-bind-mobile.js";
if (!Math) {
  (_easycom_uni_id_pages_avatar + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_id_pages_bind_mobile)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      width: "260rpx",
      height: "260rpx"
    }),
    b: common_vendor.o(($event) => $options.setNickname("")),
    c: common_vendor.p({
      title: "\u6635\u79F0",
      rightText: $options.userInfo.nickname || "\u672A\u8BBE\u7F6E",
      link: true
    }),
    d: common_vendor.o($options.bindMobile),
    e: common_vendor.p({
      title: "\u624B\u673A\u53F7",
      rightText: $options.userInfo.mobile || "\u672A\u7ED1\u5B9A",
      link: true
    }),
    f: $options.userInfo.email
  }, $options.userInfo.email ? {
    g: common_vendor.p({
      title: "\u7535\u5B50\u90AE\u7BB1",
      rightText: $options.userInfo.email
    })
  } : {}, {
    h: $data.hasPwd
  }, $data.hasPwd ? {
    i: common_vendor.o($options.changePassword),
    j: common_vendor.p({
      title: "\u4FEE\u6539\u5BC6\u7801",
      link: true
    })
  } : {}, {
    k: common_vendor.o($options.deactivate),
    l: common_vendor.p({
      title: "\u6CE8\u9500\u8D26\u53F7",
      link: "navigateTo"
    }),
    m: common_vendor.o($options.setNickname),
    n: common_vendor.p({
      mode: "input",
      value: $options.userInfo.nickname,
      title: "\u8BBE\u7F6E\u6635\u79F0",
      placeholder: "\u8BF7\u8F93\u5165\u8981\u8BBE\u7F6E\u7684\u6635\u79F0"
    }),
    o: common_vendor.sr("dialog", "0be2f605-8"),
    p: common_vendor.p({
      type: "dialog"
    }),
    q: common_vendor.sr("bind-mobile-by-sms", "0be2f605-10"),
    r: common_vendor.o($options.bindMobileSuccess),
    s: $data.showLoginManage
  }, $data.showLoginManage ? common_vendor.e({
    t: $options.userInfo._id
  }, $options.userInfo._id ? {
    v: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {
    w: common_vendor.o((...args) => $options.login && $options.login(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0be2f605"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/userinfo/userinfo.vue"]]);
wx.createPage(MiniProgramPage);
