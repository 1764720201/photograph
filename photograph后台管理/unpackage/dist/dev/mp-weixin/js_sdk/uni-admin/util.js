"use strict";
require("../../common/vendor.js");
const uni_modules_uniDateformat_components_uniDateformat_dateFormat = require("../../uni_modules/uni-dateformat/components/uni-dateformat/date-format.js");
function formatBytes(bytes) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) {
    return "n/a";
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) {
    return bytes + " " + sizes[i];
  }
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
function initUtil(app) {
  app.config.globalProperties.$formatDate = uni_modules_uniDateformat_components_uniDateformat_dateFormat.formatDate;
  app.config.globalProperties.$formatBytes = formatBytes;
}
exports.initUtil = initUtil;
