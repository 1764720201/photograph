"use strict";
const common_vendor = require("../../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("./store.js");
const uni_modules_uniIdPages_config = require("../config.js");
let mixin = {
  data() {
    return {
      config: uni_modules_uniIdPages_config.config,
      uniIdRedirectUrl: "",
      isMounted: false
    };
  },
  onUnload() {
  },
  mounted() {
    this.isMounted = true;
  },
  onLoad(e) {
    if (e.is_weixin_redirect) {
      common_vendor.index.showLoading({
        mask: true
      });
      if (window.location.href.includes("#")) {
        let paramsArr = window.location.href.split("?")[1].split("&");
        paramsArr.forEach((item) => {
          let arr = item.split("=");
          if (arr[0] == "code") {
            e.code = arr[1];
          }
        });
      }
      this.$nextTick((n) => {
        console.log(this.$refs.uniFabLogin);
        this.$refs.uniFabLogin.login({
          code: e.code
        }, "weixin");
      });
    }
    if (e.uniIdRedirectUrl) {
      this.uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl);
    }
  },
  computed: {
    needAgreements() {
      if (this.isMounted) {
        if (this.$refs.agreements) {
          return this.$refs.agreements.needAgreements;
        } else {
          return false;
        }
      }
    },
    agree: {
      get() {
        if (this.isMounted) {
          if (this.$refs.agreements) {
            return this.$refs.agreements.isAgree;
          } else {
            return true;
          }
        }
      },
      set(agree) {
        if (this.$refs.agreements) {
          this.$refs.agreements.isAgree = agree;
        } else {
          console.log("\u4E0D\u5B58\u5728 \u9690\u79C1\u653F\u7B56\u534F\u8BAE\u7EC4\u4EF6");
        }
      }
    }
  },
  methods: {
    loginSuccess(e) {
      uni_modules_uniIdPages_common_store.mutations.loginSuccess({
        ...e,
        uniIdRedirectUrl: this.uniIdRedirectUrl
      });
    }
  }
};
exports.mixin = mixin;
