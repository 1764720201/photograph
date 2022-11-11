"use strict";
const fieldsMap = [{
  title: "\u540D\u79F0",
  field: "name",
  tooltip: "",
  formatter: ""
}, {
  title: "\u8BBF\u95EE\u4EBA\u6570",
  field: "visit_devices",
  tooltip: "\u8BBF\u95EE\u4EBA\u6570\uFF08\u6D3B\u8DC3\u7528\u6237\u6570\uFF09\uFF1A\u8BBF\u95EE\u8FC7\u5E94\u7528\u5185\u4EFB\u610F\u9875\u9762\u7684\u603B\u7528\u6237\u6570\uFF08\u53BB\u91CD\uFF09",
  value: 0
}, {
  title: "\u8BBF\u95EE\u4EBA\u6570\u5360\u6BD4",
  field: "visit_devices/total_visit_devices",
  computed: "visit_devices/total_visit_devices",
  formatter: "%"
}, {
  title: "\u8BBF\u95EE\u6B21\u6570",
  field: "visit_times",
  tooltip: "\u8BBF\u95EE\u8FC7\u5E94\u7528\u5185\u4EFB\u610F\u9875\u9762\u603B\u6B21\u6570\uFF0C\u591A\u4E2A\u9875\u9762\u4E4B\u95F4\u8DF3\u8F6C\u3001\u540C\u4E00\u9875\u9762\u7684\u91CD\u590D\u8BBF\u95EE\u8BA1\u4E3A\u591A\u6B21\u8BBF\u95EE",
  value: 0
}, {
  title: "\u8BBF\u95EE\u6B21\u6570\u5360\u6BD4",
  field: "visit_times/total_visit_times",
  computed: "visit_times/total_visit_times",
  formatter: "%",
  tooltip: ""
}];
exports.fieldsMap = fieldsMap;
