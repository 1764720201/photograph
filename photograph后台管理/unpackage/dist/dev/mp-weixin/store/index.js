"use strict";
const store_modules_app = require("./modules/app.js");
const store_modules_error = require("./modules/error.js");
const store_modules_user = require("./modules/user.js");
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  modules: {
    app: store_modules_app.app,
    error: store_modules_error.error,
    user: store_modules_user.user
  }
});
exports.store = store;
