"use strict";
const store_index = require("../../store/index.js");
const admin_config = require("../../admin.config.js");
function initError(app) {
  const debugOptions = admin_config.config.navBar.debug;
  if (debugOptions && debugOptions.enable === true) {
    const oldErrorHandler = app.config.errorHandler;
    app.config.errorHandler = function errorHandler(err, vm, info) {
      console.error(err);
      const route = vm.$page && vm.$page.route;
      store_index.store.dispatch("error/add", {
        err: err.toString(),
        info,
        route,
        time: new Date().toLocaleTimeString()
      });
      return oldErrorHandler && oldErrorHandler(err, vm, info);
    };
  }
}
exports.initError = initError;
