"use strict";
const deviceFeildsMap = [
  {
    value: "\u4ECA\u5929",
    contrast: "\u6628\u5929"
  },
  {
    field: "appid",
    title: "APPID",
    tooltip: ""
  },
  {
    field: "name",
    title: "\u5E94\u7528\u540D",
    tooltip: ""
  },
  {
    field: "total_devices",
    title: "\u603B\u8BBE\u5907\u6570",
    tooltip: "\u4ECE\u6DFB\u52A0\u7EDF\u8BA1\u5230\u5F53\u524D\u9009\u62E9\u65F6\u95F4\u7684\u603B\u8BBE\u5907\u6570\uFF08\u53BB\u91CD\uFF09",
    value: 0,
    contrast: 0
  },
  {
    field: "new_device_count",
    title: "\u65B0\u589E\u8BBE\u5907",
    tooltip: "\u9996\u6B21\u8BBF\u95EE\u5E94\u7528\u7684\u8BBE\u5907\u6570\uFF08\u4EE5\u8BBE\u5907\u4E3A\u5224\u65AD\u6807\u51C6\uFF0C\u53BB\u91CD\uFF09",
    value: 0,
    contrast: 0
  },
  {
    field: "active_device_count",
    title: "\u6D3B\u8DC3\u8BBE\u5907",
    tooltip: "\u8BBF\u95EE\u8FC7\u5E94\u7528\u5185\u4EFB\u610F\u9875\u9762\u7684\u603B\u8BBE\u5907\u6570\uFF08\u53BB\u91CD\uFF09",
    value: 0,
    contrast: 0
  }
];
const userFeildsMap = [
  {
    value: "\u4ECA\u5929",
    contrast: "\u6628\u5929"
  },
  {
    field: "appid",
    title: "APPID",
    tooltip: ""
  },
  {
    field: "name",
    title: "\u5E94\u7528\u540D",
    tooltip: ""
  },
  {
    field: "total_users",
    title: "\u603B\u7528\u6237\u6570",
    tooltip: "\u4ECE\u6DFB\u52A0\u7EDF\u8BA1\u5230\u5F53\u524D\u9009\u62E9\u65F6\u95F4\u7684\u603B\u7528\u6237\u6570\uFF08\u53BB\u91CD\uFF09",
    value: 0,
    contrast: 0
  },
  {
    field: "new_user_count",
    title: "\u65B0\u589E\u7528\u6237",
    tooltip: "\u9996\u6B21\u8BBF\u95EE\u5E94\u7528\u7684\u7528\u6237\u6570\uFF08\u4EE5\u7528\u6237\u4E3A\u5224\u65AD\u6807\u51C6\uFF0C\u53BB\u91CD\uFF09",
    value: 0,
    contrast: 0
  },
  {
    field: "active_user_count",
    title: "\u6D3B\u8DC3\u7528\u6237",
    tooltip: "\u8BBF\u95EE\u8FC7\u5E94\u7528\u5185\u4EFB\u610F\u9875\u9762\u7684\u603B\u7528\u6237\u6570\uFF08\u53BB\u91CD\uFF09",
    value: 0,
    contrast: 0
  }
];
exports.deviceFeildsMap = deviceFeildsMap;
exports.userFeildsMap = userFeildsMap;
