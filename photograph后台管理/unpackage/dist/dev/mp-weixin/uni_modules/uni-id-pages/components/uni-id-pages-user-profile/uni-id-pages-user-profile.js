"use strict";
const common_vendor = require("../../../../common/vendor.js");
const db = common_vendor.ws.database();
const usersTable = db.collection("uni-id-users");
let userId = "";
const _sfc_main = {
  emits: ["next"],
  data() {
    return {};
  },
  methods: {
    async open(uid) {
      userId = uid;
      this.$refs.popup.open();
    },
    async getUserProfile() {
      common_vendor.index.showLoading();
      let res = await new Promise((callBack) => {
        common_vendor.index.getUserProfile({
          desc: "\u7528\u4E8E\u8BBE\u7F6E\u8D26\u6237\u6635\u79F0\u548C\u5934\u50CF",
          complete: (e) => {
            console.log("getUserProfile:", e);
            callBack(e);
          }
        });
      });
      if (res.errMsg != "getUserProfile:ok") {
        return this.closeMe();
      }
      let { avatarUrl, nickName } = res.userInfo;
      let tempFilePath = await new Promise((callBack) => {
        common_vendor.index.downloadFile({
          url: avatarUrl,
          success: (res2) => {
            if (res2.statusCode === 200) {
              callBack(res2.tempFilePath);
            }
            callBack();
          },
          fail: (err) => {
            console.error(err);
          },
          complete: (e) => {
          }
        });
      });
      const extName = tempFilePath.split(".").pop() || "jpg";
      const cloudPath = "user/avatar/" + userId + "/" + Date.now() + "-avatar." + extName;
      const result = await common_vendor.ws.uploadFile({
        filePath: tempFilePath,
        cloudPath,
        fileType: "image"
      });
      let userInfo = {
        "nickname": nickName,
        "avatar_file": {
          name: cloudPath,
          extname: "jpg",
          url: result.fileID
        }
      };
      this.doUpdate(userInfo, () => {
        this.$refs.popup.close();
      });
    },
    closeMe(e) {
      common_vendor.index.showLoading();
      this.doUpdate({ nickname: "\u533F\u540D\u5FAE\u4FE1\u7528\u6237" }, () => {
        common_vendor.index.hideLoading();
        this.$refs.popup.close();
      });
    },
    doUpdate(data, callback) {
      usersTable.where("_id==$env.uid").update(data).then((res) => {
        callback(res);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
        callback(err);
      }).finally(() => {
        this.$emit("next");
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.closeMe && $options.closeMe(...args)),
    b: common_vendor.o((...args) => $options.getUserProfile && $options.getUserProfile(...args)),
    c: common_vendor.sr("popup", "598128eb-0"),
    d: common_vendor.p({
      type: "bottom"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-598128eb"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/components/uni-id-pages-user-profile/uni-id-pages-user-profile.vue"]]);
wx.createComponent(Component);
