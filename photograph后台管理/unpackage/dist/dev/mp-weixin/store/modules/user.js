"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const user = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    getUserInfo({ commit }) {
      const db = common_vendor.ws.database();
      return db.collection("uni-id-users").where("_id==$cloudEnv_uid").field("username,nickname,mobile,email,role,permission").get().then(({ result }) => {
        const [userInfo] = result.data;
        uni_modules_uniIdPages_common_store.mutations.setUserInfo(userInfo, true);
        return Promise.resolve(userInfo);
      });
    }
  }
};
exports.user = user;
