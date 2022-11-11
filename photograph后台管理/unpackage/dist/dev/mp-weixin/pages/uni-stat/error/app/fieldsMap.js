"use strict";
const fieldsMap = [
  {
    title: "\u62A5\u9519\u65F6\u95F4",
    field: "create_time",
    tooltip: "",
    formatter: "",
    filter: "timestamp"
  },
  {
    title: "\u9519\u8BEF\u4FE1\u606F",
    field: "error_msg",
    formatter: "",
    filter: "search"
  },
  {
    title: "\u539F\u751F\u5E94\u7528\u5305\u540D",
    field: "package_name",
    formatter: "",
    filter: "search"
  },
  {
    title: "\u7528\u6237\u7AEF\u4E0A\u62A5\u7684\u5E94\u7528\u7248\u672C\u53F7",
    field: "version",
    formatter: "",
    tooltip: "manifest.json\u4E2D\u7684versionName\u7684\u503C",
    filter: "search"
  },
  {
    title: "\u5E73\u53F0",
    field: "platform",
    formatter: "",
    tooltip: "\u7528\u6237\u7AEF\u4E0A\u62A5\u7684\u5E73\u53F0code",
    filter: "search"
  },
  {
    title: "\u6E20\u9053",
    field: "channel",
    formatter: "",
    tooltip: "\u7528\u6237\u7AEF\u4E0A\u62A5\u7684\u6E20\u9053code\u573A\u666F\u503C",
    filter: "search"
  },
  {
    title: "\u57FA\u7840\u5E93\u7248\u672C\u53F7",
    field: "sdk_version",
    formatter: "",
    tooltip: "",
    filter: "search"
  },
  {
    title: "\u8BBE\u5907\u6807\u8BC6",
    field: "device_id",
    formatter: "",
    tooltip: "\u5BA2\u6237\u7AEF\u643A\u5E26\u7684\u8BBE\u5907\u6807\u8BC6",
    filter: "search"
  },
  {
    title: "\u8BBE\u5907\u7F51\u7EDC\u578B\u53F7",
    field: "device_net",
    formatter: "",
    tooltip: "\u8BBE\u5907\u7F51\u7EDC\u578B\u53F7wifi/3G/4G/",
    filter: "search"
  },
  {
    title: "\u7CFB\u7EDF\u7248\u672C",
    field: "device_os",
    formatter: "",
    tooltip: "iOS\u5E73\u53F0\u4E3A\u7CFB\u7EDF\u7248\u672C\u53F7\uFF0C\u598215.1\uFF1BAndroid\u5E73\u53F0\u4E3AAPI\u7B49\u7EA7\uFF0C\u598230",
    filter: "search"
  },
  {
    title: "\u7CFB\u7EDF\u7248\u672C\u540D\u79F0",
    field: "device_os_version",
    formatter: "",
    tooltip: "iOS\u5E73\u53F0\u4E0Eos\u5B57\u6BB5\u4E00\u81F4\uFF1BAndroid\u5E73\u53F0\u4E3A\u7248\u672C\u540D\u79F0\uFF0C\u59825.1.1",
    filter: "search"
  },
  {
    title: "\u8BBE\u5907\u4F9B\u5E94\u5546",
    field: "device_vendor",
    formatter: "",
    tooltip: "",
    filter: "search"
  },
  {
    title: "\u8BBE\u5907\u578B\u53F7",
    field: "device_model",
    formatter: "",
    tooltip: "",
    filter: "search"
  },
  {
    title: "\u662F\u5426root",
    field: "device_is_root",
    formatter: "",
    tooltip: "1\u8868\u793Aroot\uFF1B0\u8868\u793A\u672Aroot",
    filter: "range"
  },
  {
    title: "\u7CFB\u7EDF\u540D\u79F0",
    field: "device_os_name",
    formatter: "",
    tooltip: "\u7528\u4E8E\u533A\u522BAndroid\u548C\u9E3F\u8499\uFF0C\u4EC5Android\u652F\u6301",
    filter: "search"
  },
  {
    title: "\u8BBE\u5907\u7535\u6C60\u7535\u91CF",
    field: "device_batt_level",
    formatter: "",
    tooltip: "\u53D6\u503C\u8303\u56F40-100\uFF0C\u4EC5Android\u652F\u6301",
    filter: "range"
  },
  {
    title: "\u7535\u6C60\u6E29\u5EA6",
    field: "device_batt_temp",
    formatter: "",
    tooltip: "\u4EC5Android\u652F\u6301",
    filter: "search"
  },
  {
    title: "\u7CFB\u7EDF\u5DF2\u4F7F\u7528\u5185\u5B58",
    field: "device_memory_use_size",
    formatter: "",
    tooltip: "\u5355\u4F4D\u4E3AByte\uFF0C\u4EC5Android\u652F\u6301",
    filter: "range"
  },
  {
    title: "\u7CFB\u7EDF\u603B\u5185\u5B58",
    field: "device_memory_total_size",
    formatter: "",
    tooltip: "\u5355\u4F4D\u4E3AByte\uFF0C\u4EC5Android\u652F\u6301",
    filter: "range"
  },
  {
    title: "\u7CFB\u7EDF\u78C1\u76D8\u5DF2\u4F7F\u7528\u5927\u5C0F",
    field: "device_disk_use_size",
    formatter: "",
    tooltip: "\u5355\u4F4D\u4E3AByte\uFF0C\u4EC5Android\u652F\u6301",
    filter: "range"
  },
  {
    title: "\u7CFB\u7EDF\u78C1\u76D8\u603B\u5927\u5C0F",
    field: "device_disk_total_size",
    formatter: "",
    tooltip: "\u5355\u4F4D\u4E3AByte\uFF0C\u4EC5Android\u652F\u6301",
    filter: "range"
  },
  {
    title: "\u8BBE\u5907\u652F\u6301\u7684CPU\u67B6\u6784",
    field: "device_abis",
    formatter: "",
    tooltip: "\u591A\u4E2A\u4F7F\u7528,\u5206\u5272\uFF0C\u5982arm64-v8a,armeabi-v7a,armeabi\uFF0C\u4EC5Android\u652F\u6301",
    filter: "search"
  },
  {
    title: "\u8FD0\u884C\u7684app\u4E2A\u6570",
    field: "app_count",
    formatter: "",
    tooltip: "\u5305\u62EC\u8FD0\u884C\u7684uni\u5C0F\u7A0B\u5E8F\u6570\u76EE\uFF0C\u72EC\u7ACBApp\u65F6\u503C\u4E3A1",
    filter: "range"
  },
  {
    title: "APP\u4F7F\u7528\u7684\u5185\u5B58\u91CF",
    field: "app_use_memory_size",
    formatter: "",
    tooltip: "\u5355\u4F4D\u4E3AByte",
    filter: "range"
  },
  {
    title: "\u8FD0\u884C\u5E94\u7528\u7684\u4E2A\u6570",
    field: "app_count",
    formatter: "",
    filter: "range"
  },
  {
    title: "\u6253\u5F00 Webview \u7684\u4E2A\u6570",
    field: "app_webview_count",
    formatter: "",
    filter: "range"
  },
  {
    title: "APP\u4F7F\u7528\u65F6\u957F",
    field: "app_use_duration",
    formatter: "",
    tooltip: "\u5355\u4F4D\u4E3As",
    filter: "range"
  },
  {
    title: "\u662F\u5426\u524D\u53F0\u8FD0\u884C",
    field: "app_run_fore",
    formatter: "",
    tooltip: "1\u8868\u793A\u524D\u53F0\u8FD0\u884C\uFF0C0\u8868\u793A\u540E\u53F0\u8FD0\u884C",
    filter: "search"
  },
  {
    title: "\u539F\u751F\u5E94\u7528\u7248\u672C\u540D\u79F0",
    field: "package_version",
    formatter: "",
    tooltip: "Android\u7684apk\u7248\u672C\u540D\u79F0\uFF1BiOS\u7684ipa\u7248\u672C\u540D\u79F0",
    filter: "search"
  },
  {
    title: "\u9875\u9762url",
    field: "page_url",
    formatter: "",
    filter: "search"
  }
];
exports.fieldsMap = fieldsMap;
