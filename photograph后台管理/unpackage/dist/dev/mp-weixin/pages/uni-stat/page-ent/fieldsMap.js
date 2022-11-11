"use strict";
const fieldsMap = [{
  title: "\u5165\u53E3\u9875",
  field: "path",
  tooltip: "\u8BBE\u5907\u8FDB\u5165\u5E94\u7528\u8BBF\u95EE\u7684\u7B2C\u4E00\u4E2A\u9875\u9762\uFF0C\u4F8B\u5982\u8BBE\u5907\u4ECE\u9875\u97621\u8FDB\u5165\u5E94\u7528\uFF0C\u8DF3\u8F6C\u5230\u9875\u97622\uFF0C1\u4E3A\u5165\u53E3\u9875\uFF0C\u800C2\u4E0D\u662F"
}, {
  title: "\u9875\u9762\u540D\u79F0",
  field: "title"
}, {
  title: "\u8BBF\u95EE\u6B21\u6570",
  field: "visit_times",
  tooltip: "\u8BBF\u95EE\u8FC7\u5E94\u7528\u5185\u4EFB\u610F\u9875\u9762\u603B\u6B21\u6570\uFF0C\u591A\u4E2A\u9875\u9762\u4E4B\u95F4\u8DF3\u8F6C\u3001\u540C\u4E00\u9875\u9762\u7684\u91CD\u590D\u8BBF\u95EE\u8BA1\u4E3A\u591A\u6B21\u8BBF\u95EE",
  value: 0
}, {
  title: "\u5165\u53E3\u9875\u6B21\u6570",
  field: "entry_count",
  tooltip: "\u4F5C\u4E3A\u8BBF\u95EE\u4F1A\u8BDD\u7B2C\u4E00\u4E2A\u8BBF\u95EE\u9875\u9762\uFF08\u5373\u7740\u9646\u9875\uFF09\u7684\u6B21\u6570",
  value: 0
}, {
  title: "\u8DF3\u51FA\u7387",
  field: "bounce_rate",
  formatter: "%%",
  tooltip: "\u53EA\u6D4F\u89C8\u4E00\u4E2A\u9875\u9762\u4FBF\u79BB\u5F00\u5E94\u7528\u7684\u6B21\u6570\u5360\u603B\u542F\u52A8\u6B21\u6570\u7684\u767E\u5206\u6BD4",
  value: 0,
  stat: "avg"
}, {
  title: "\u8BBF\u95EE\u603B\u65F6\u957F",
  field: "duration",
  disabled: true
}, {
  title: "\u6B21\u5747\u505C\u7559\u65F6\u957F",
  field: "avg_device_session_time",
  computed: "duration/visit_times",
  formatter: ":",
  tooltip: "\u5E73\u5747\u6BCF\u6B21\u6253\u5F00\u5E94\u7528\u505C\u7559\u5728\u5E94\u7528\u5185\u7684\u603B\u65F6\u957F\uFF0C\u5373\u5E94\u7528\u505C\u7559\u603B\u65F6\u957F/\u542F\u52A8\u6B21\u6570",
  value: 0
}, {
  title: "\u8BBE\u5907\u5E73\u5747\u505C\u7559\u65F6\u957F ",
  field: "avg_user_time",
  computed: "duration/visit_devices",
  formatter: ":",
  tooltip: "\u5E73\u5747\u6BCF\u4E2A\u8BBE\u5907\u505C\u7559\u5728\u5E94\u7528\u5185\u7684\u603B\u65F6\u957F\uFF0C\u5373\u5E94\u7528\u505C\u7559\u603B\u65F6\u957F/\u8BBF\u95EE\u8BBE\u5907\u6570",
  value: 0
}];
exports.fieldsMap = fieldsMap;
