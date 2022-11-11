"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../common/store.js");
const _sfc_main = {
  data() {
    return {
      isPC: false
    };
  },
  props: {
    width: {
      type: String,
      default() {
        return "50px";
      }
    },
    height: {
      type: String,
      default() {
        return "50px";
      }
    },
    border: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  async mounted() {
  },
  computed: {
    hasLogin() {
      return uni_modules_uniIdPages_common_store.store.hasLogin;
    },
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo;
    },
    avatar_file() {
      return uni_modules_uniIdPages_common_store.store.userInfo.avatar_file;
    }
  },
  methods: {
    setAvatarFile(avatar_file) {
      uni_modules_uniIdPages_common_store.mutations.updateUserInfo({ avatar_file });
    },
    uploadAvatarImg(res) {
      console.log(this.hasLogin);
      if (!this.hasLogin) {
        return common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
      const crop = {
        quality: 100,
        width: 600,
        height: 600,
        resize: true
      };
      common_vendor.index.chooseImage({
        count: 1,
        crop,
        success: async (res2) => {
          console.log(res2);
          let tempFile = res2.tempFiles[0], avatar_file = {
            extname: tempFile.path.split(".")[tempFile.path.split(".").length - 1]
          }, filePath = res2.tempFilePaths[0];
          if (!this.isPC) {
            filePath = await new Promise((callback) => {
              common_vendor.index.navigateTo({
                url: "/uni_modules/uni-id-pages/pages/userinfo/cropImage/cropImage?path=" + filePath + `&options=${JSON.stringify(crop)}`,
                animationType: "fade-in",
                events: {
                  success: (url) => {
                    callback(url);
                  }
                },
                complete(e) {
                  console.log(e);
                }
              });
            });
          }
          console.log(this.userInfo);
          let cloudPath = this.userInfo._id + "" + Date.now();
          avatar_file.name = cloudPath;
          common_vendor.index.showLoading({
            title: "\u66F4\u65B0\u4E2D",
            mask: true
          });
          let {
            fileID
          } = await common_vendor.ws.uploadFile({
            filePath,
            cloudPath,
            fileType: "image"
          });
          avatar_file.url = fileID;
          console.log({
            avatar_file
          });
          common_vendor.index.hideLoading();
          this.setAvatarFile(avatar_file);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_cloud_image2 = common_vendor.resolveComponent("cloud-image");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_cloud_image2 + _easycom_uni_icons2)();
}
const _easycom_cloud_image = () => "../cloud-image/cloud-image.js";
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_cloud_image + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.avatar_file
  }, $options.avatar_file ? {
    b: common_vendor.p({
      src: $options.avatar_file.url,
      width: $props.width,
      height: $props.height
    })
  } : {
    c: $props.width,
    d: $props.height,
    e: $props.height,
    f: common_vendor.p({
      type: "plusempty",
      size: "30",
      color: "#dddddd"
    })
  }, {
    g: common_vendor.o((...args) => $options.uploadAvatarImg && $options.uploadAvatarImg(...args)),
    h: $props.border ? 1 : "",
    i: $props.width,
    j: $props.height,
    k: $props.height
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/components/uni-id-pages-avatar/uni-id-pages-avatar.vue"]]);
wx.createComponent(Component);
