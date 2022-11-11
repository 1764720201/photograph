"use strict";
const fieldsMap = [
  {
    title: "\u53D7\u8BBF\u9875",
    field: "path",
    tooltip: "\u8BBE\u5907\u8FDB\u5165\u5E94\u7528\u8BBF\u95EE\u7684\u6240\u6709\u9875\u9762\uFF0C\u4F8B\u5982\u8BBE\u5907\u4ECE\u9875\u97621\u8FDB\u5165\u5E94\u7528\uFF0C\u8DF3\u8F6C\u5230\u9875\u97622\uFF0C1,2\u5747\u4E3A\u53D7\u8BBF\u9875",
    stat: -1
  },
  {
    title: "\u9875\u9762\u540D\u79F0",
    field: "title",
    stat: -1
  },
  {
    title: "\u8BBF\u95EE\u6B21\u6570",
    field: "visit_times",
    tooltip: "\u8BBF\u95EE\u8FC7\u5E94\u7528\u5185\u4EFB\u610F\u9875\u9762\u603B\u6B21\u6570\uFF0C\u591A\u4E2A\u9875\u9762\u4E4B\u95F4\u8DF3\u8F6C\u3001\u540C\u4E00\u9875\u9762\u7684\u91CD\u590D\u8BBF\u95EE\u8BA1\u4E3A\u591A\u6B21\u8BBF\u95EE\uFF1B",
    value: 0
  },
  {
    title: "\u9000\u51FA\u9875\u6B21\u6570",
    field: "exit_times",
    tooltip: "\u4F5C\u4E3A\u8BBF\u95EE\u4F1A\u8BDD\u6700\u540E\u4E00\u4E2A\u8BBF\u95EE\u9875\u9762(\u5373\u79BB\u5F00\u9875\uFF09\u7684\u6B21\u6570",
    value: 0
  },
  {
    title: "\u9000\u51FA\u7387",
    field: "exitRate",
    computed: "exit_times/visit_times",
    formatter: "%",
    tooltip: "\u5728\u6B64\u9875\u9762\uFF0C\u9009\u62E9\u79BB\u5F00\u5E94\u7528\u5360\u6B64\u9875\u9762\u8BBF\u95EE\u6B21\u6570\u7684\u6BD4\u4F8B",
    stat: -1
  },
  {
    title: "\u8BBF\u95EE\u603B\u65F6\u957F",
    field: "duration",
    disabled: true
  },
  {
    title: "\u6B21\u5747\u505C\u7559\u65F6\u957F",
    field: "avg_device_session_time",
    computed: "duration/visit_times",
    formatter: ":",
    tooltip: "\u5E73\u5747\u6BCF\u6B21\u6253\u5F00\u5E94\u7528\u505C\u7559\u5728\u5E94\u7528\u5185\u7684\u603B\u65F6\u957F\uFF0C\u5373\u5E94\u7528\u505C\u7559\u603B\u65F6\u957F/\u542F\u52A8\u6B21\u6570",
    value: 0
  },
  {
    title: "\u8BBE\u5907\u5E73\u5747\u505C\u7559\u65F6\u957F",
    field: "avg_user_time",
    computed: "duration/visit_devices",
    formatter: ":",
    tooltip: "\u5E73\u5747\u6BCF\u4E2A\u8BBE\u5907\u505C\u7559\u5728\u5E94\u7528\u5185\u7684\u603B\u65F6\u957F\uFF0C\u5373\u5E94\u7528\u505C\u7559\u603B\u65F6\u957F/\u8BBF\u95EE\u8BBE\u5907\u6570",
    value: 0
  },
  {
    title: "\u5206\u4EAB\u6B21\u6570",
    field: "share_count",
    tooltip: "\u9875\u9762\u88AB\u5206\u4EAB\u6210\u529F\u7684\u6B21\u6570",
    value: 0
  }
];
exports.fieldsMap = fieldsMap;
