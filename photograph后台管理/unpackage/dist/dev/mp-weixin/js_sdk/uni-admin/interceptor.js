"use strict";
const common_vendor = require("../../common/vendor.js");
const admin_config = require("../../admin.config.js");
function initInterceptor() {
  common_vendor.index.addInterceptor("navigateTo", {
    fail: ({
      errMsg
    }) => {
      if (errMsg.indexOf("is not found") !== -1) {
        common_vendor.index.navigateTo({
          url: admin_config.config.error.url + "?errMsg=" + errMsg
        });
      }
    }
  });
}
exports.initInterceptor = initInterceptor;
