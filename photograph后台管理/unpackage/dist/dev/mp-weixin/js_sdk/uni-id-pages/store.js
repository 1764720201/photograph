"use strict";
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
function initUniIdPageStore(app) {
  app.config.globalProperties.$uniIdPagesStore = uni_modules_uniIdPages_common_store.uniIdPagesStore;
}
exports.initUniIdPageStore = initUniIdPageStore;
