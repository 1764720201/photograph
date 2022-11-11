"use strict";
function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}
function deepClone(obj) {
  if ([null, void 0, NaN, false].includes(obj))
    return obj;
  if (typeof obj !== "object" && typeof obj !== "function") {
    return obj;
  }
  var o = isArray(obj) ? [] : {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
    }
  }
  return o;
}
const appListDbName = "opendb-app-list";
const appVersionListDbName = "opendb-app-versions";
const defaultDisplayApp = "";
exports.appListDbName = appListDbName;
exports.appVersionListDbName = appVersionListDbName;
exports.deepClone = deepClone;
exports.defaultDisplayApp = defaultDisplayApp;
