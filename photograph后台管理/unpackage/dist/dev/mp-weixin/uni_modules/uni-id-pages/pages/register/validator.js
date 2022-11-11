"use strict";
const uni_modules_uniIdPages_common_password = require("../../common/password.js");
const rules = {
  "username": {
    "rules": [
      {
        required: true,
        errorMessage: "\u8BF7\u8F93\u5165\u7528\u6237\u540D"
      },
      {
        minLength: 3,
        maxLength: 32,
        errorMessage: "\u7528\u6237\u540D\u957F\u5EA6\u5728 {minLength} \u5230 {maxLength} \u4E2A\u5B57\u7B26"
      },
      {
        validateFunction: function(rule, value, data, callback) {
          if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
            callback("\u7528\u6237\u540D\u4E0D\u80FD\u662F\uFF1A\u624B\u673A\u53F7\u6216\u90AE\u7BB1");
          }
          if (/^\d+$/.test(value)) {
            callback("\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7EAF\u6570\u5B57");
          }
          if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)) {
            callback("\u7528\u6237\u540D\u4E0D\u80FD\u5305\u542B\u4E2D\u6587");
          }
          return true;
        }
      }
    ],
    "label": "\u7528\u6237\u540D"
  },
  "nickname": {
    "rules": [
      {
        minLength: 3,
        maxLength: 32,
        errorMessage: "\u6635\u79F0\u957F\u5EA6\u5728 {minLength} \u5230 {maxLength} \u4E2A\u5B57\u7B26"
      },
      {
        validateFunction: function(rule, value, data, callback) {
          if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
            callback("\u6635\u79F0\u4E0D\u80FD\u662F\uFF1A\u624B\u673A\u53F7\u6216\u90AE\u7BB1");
          }
          if (/^\d+$/.test(value)) {
            callback("\u6635\u79F0\u4E0D\u80FD\u4E3A\u7EAF\u6570\u5B57");
          }
          if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)) {
            callback("\u6635\u79F0\u4E0D\u80FD\u5305\u542B\u4E2D\u6587");
          }
          return true;
        }
      }
    ],
    "label": "\u6635\u79F0"
  },
  ...uni_modules_uniIdPages_common_password.passwordMod.getPwdRules()
};
exports.rules = rules;
