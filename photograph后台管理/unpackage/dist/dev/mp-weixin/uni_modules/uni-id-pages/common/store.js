"use strict";
const common_vendor = require("../../../common/vendor.js");
const uniIdCo = common_vendor.ws.importObject("uni-id-co");
const db = common_vendor.ws.database();
const usersTable = db.collection("uni-id-users");
let hostUserInfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo") || {};
console.log(hostUserInfo);
const data = {
  userInfo: hostUserInfo,
  hasLogin: Object.keys(hostUserInfo).length != 0
};
console.log("data", data);
const mutations = {
  async updateUserInfo(data2 = false) {
    if (data2) {
      usersTable.where("_id==$env.uid").update(data2).then((e) => {
        console.log(e);
        if (e.result.updated) {
          common_vendor.index.showToast({
            title: "\u66F4\u65B0\u6210\u529F",
            icon: "none"
          });
          this.setUserInfo(data2);
        } else {
          common_vendor.index.showToast({
            title: "\u6CA1\u6709\u6539\u53D8",
            icon: "none"
          });
        }
      });
    } else {
      try {
        let res = await usersTable.where("'_id' == $cloudEnv_uid").field("mobile,nickname,username,email,avatar_file").get();
        console.log("fromDbData", res.result.data);
        this.setUserInfo(res.result.data[0]);
      } catch (e) {
        this.setUserInfo({}, { cover: true });
        console.error(e.message, e.errCode);
      }
    }
  },
  async setUserInfo(data2, { cover } = { cover: false }) {
    console.log("set-userInfo", data2);
    let userInfo = cover ? data2 : Object.assign(store.userInfo, data2);
    store.userInfo = Object.assign({}, userInfo);
    store.hasLogin = Object.keys(store.userInfo).length != 0;
    console.log("store.userInfo", store.userInfo);
    common_vendor.index.setStorage({
      key: "uni-id-pages-userInfo",
      data: store.userInfo
    });
    return data2;
  },
  async logout() {
    var _a, _b;
    await uniIdCo.logout();
    common_vendor.index.removeStorageSync("uni_id_token");
    common_vendor.index.setStorageSync("uni_id_token_expired", 0);
    common_vendor.index.redirectTo({
      url: `/${(_b = (_a = common_vendor.pagesJson.uniIdRouter) == null ? void 0 : _a.loginPage) != null ? _b : "uni_modules/uni-id-pages/pages/login/login-withoutpwd"}`
    });
    common_vendor.index.$emit("uni-id-pages-logout");
    this.setUserInfo({}, { cover: true });
  },
  loginSuccess(e) {
    const {
      showToast = true,
      toastText = "\u767B\u5F55\u6210\u529F",
      autoBack = true,
      uniIdRedirectUrl = ""
    } = e;
    console.log({
      toastText,
      autoBack
    });
    if (showToast) {
      common_vendor.index.showToast({
        title: toastText,
        icon: "none"
      });
    }
    this.updateUserInfo();
    common_vendor.index.$emit("uni-id-pages-login-success");
    if (autoBack) {
      let delta = 0;
      let pages = getCurrentPages();
      pages.forEach((page, index) => {
        if (pages[pages.length - index - 1].route.split("/")[3] == "login") {
          delta++;
        }
      });
      console.log("\u5224\u65AD\u9700\u8981\u8FD4\u56DE\u51E0\u5C42:", pages, delta);
      if (uniIdRedirectUrl) {
        return common_vendor.index.reLaunch({
          url: uniIdRedirectUrl
        });
      }
      if (delta) {
        const page = common_vendor.pagesJson.pages[0];
        return common_vendor.index.reLaunch({
          url: `/${page.path}`
        });
      }
      common_vendor.index.navigateBack({
        delta
      });
    }
  }
};
const store = common_vendor.reactive(data);
const uniIdPagesStore = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mutations,
  store
}, Symbol.toStringTag, { value: "Module" }));
exports.mutations = mutations;
exports.store = store;
exports.uniIdPagesStore = uniIdPagesStore;
