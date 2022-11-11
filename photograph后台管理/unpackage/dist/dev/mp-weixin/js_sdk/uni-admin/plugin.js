"use strict";
const js_sdk_uniAdmin_util = require("./util.js");
const js_sdk_uniAdmin_error = require("./error.js");
const js_sdk_uniAdmin_request = require("./request.js");
const js_sdk_uniAdmin_fetchMock = require("./fetchMock.js");
const js_sdk_uniAdmin_permission = require("./permission.js");
const js_sdk_uniAdmin_interceptor = require("./interceptor.js");
const js_sdk_uniIdPages_store = require("../uni-id-pages/store.js");
const plugin = {
  install(Vue) {
    js_sdk_uniAdmin_util.initUtil(Vue);
    js_sdk_uniAdmin_error.initError(Vue);
    js_sdk_uniIdPages_store.initUniIdPageStore(Vue);
    js_sdk_uniAdmin_request.initRequest(Vue);
    js_sdk_uniAdmin_fetchMock.initFetch(Vue);
    js_sdk_uniAdmin_permission.initPermission(Vue);
    js_sdk_uniAdmin_interceptor.initInterceptor();
  }
};
exports.plugin = plugin;
