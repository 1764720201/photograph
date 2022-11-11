"use strict";
const fieldsMap = [{
  title: "\u65E5\u671F",
  field: "start_time",
  tooltip: "",
  formatter: "-"
}, {
  title: "\u65E5\u6D3B",
  field: "active_user_count",
  tooltip: "\u9009\u4E2D\u65E5\u671F\u5F53\u5929\u7684\u8BBF\u95EE\u7528\u6237\u6570"
}, {
  title: "\u5468\u6D3B",
  field: "week_active_user_count",
  tooltip: "\u9009\u4E2D\u65E5\u671F\u6240\u5728\u81EA\u7136\u5468\uFF08\u5305\u62EC\u9009\u4E2D\u65E5\u671F\u5728\u5185\uFF09\u7684\u8BBF\u95EE\u7528\u6237\u6570"
}, {
  title: "\u65E5\u6D3B/\u5468\u6D3B",
  field: "active_user_count/week_active_user_count",
  computed: "active_user_count/week_active_user_count",
  tooltip: "\u9009\u4E2D\u65E5\u671F\u7684\u8BBF\u95EE\u7528\u6237\u6570\u5360\u5468\u8BBF\u95EE\u7528\u6237\u6570\u7684\u767E\u5206\u6BD4",
  formatter: "%"
}, {
  title: "\u6708\u6D3B",
  field: "month_active_user_count",
  tooltip: "\u9009\u4E2D\u65E5\u671F\u6240\u5728\u81EA\u7136\u6708\uFF08\u5305\u62EC\u9009\u4E2D\u65E5\u671F\u5728\u5185\uFF09\u7684\u8BBF\u95EE\u7528\u6237\u6570"
}, {
  title: "\u65E5\u6D3B/\u6708\u6D3B",
  field: "active_user_count/month_active_user_count",
  computed: "active_user_count/month_active_user_count",
  tooltip: "\u9009\u4E2D\u65E5\u671F\u7684\u8BBF\u95EE\u7528\u6237\u6570\u5360\u6708\u8BBF\u95EE\u7528\u6237\u6570\u7684\u767E\u5206\u6BD4",
  formatter: "%"
}];
exports.fieldsMap = fieldsMap;
